import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useCSSVariable } from 'uniwind';
import i18n from '../localization/i18n';
import Icon from '../components/Icon';
import SafeImage from '../components/SafeImage';
import SegmentedControl, { type Segment } from '../components/SegmentedControl';
import ActionSheet, {
  type ActionSheetItem,
  type ActionSheetRef,
} from '../components/ActionSheet';
import CalendarSheet, {
  type CalendarSheetRef,
} from '../components/CalendarSheet';
import { useScreenHeader } from '../hooks/useScreenHeader';
import {
  useCheckInPhotoDates,
  useCheckInPhotosByDate,
  useCheckInPhotoMutations,
} from '../hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../hooks/useCheckInPhotoSource';
import { getApiErrorMessage } from '../services/api/errors';
import { pickImageFromCamera, pickImagesFromLibrary } from '../utils/pickImage';
import { formatDateLabel, getTodayDate } from '../utils/dateUtils';
import { PHOTO_TYPES, type PhotoType } from '../types/checkInPhotos';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ProgressPhotoCapture'>;

/** Locally picked images, not yet sent. Keyed by the slot they will fill. */
type Drafts = Partial<Record<PhotoType, string>>;

function confirmDiscardPhotos(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      i18n.t('progressPhotos.discardTitle', {
        defaultValue: 'Discard unsaved photos?',
      }),
      i18n.t('progressPhotos.discardMessage', {
        defaultValue:
          'You have photos that have not been saved yet. Discard them?',
      }),
      [
        {
          text: i18n.t('common.cancel', { defaultValue: 'Cancel' }),
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: i18n.t('progressPhotos.discard', { defaultValue: 'Discard' }),
          style: 'destructive',
          onPress: () => resolve(true),
        },
      ]
    );
  });
}

/**
 * One day's front/back/side shoot.
 *
 * Picking an image stages it rather than uploading it: a shoot is three photos
 * taken in one go, and uploading each as it was chosen meant three round trips,
 * three toasts, and a half-finished day on the server if the user walked away
 * mid-way. Everything goes in one Save.
 *
 * The angles are tabs rather than a vertical scroll, matching the gallery, so
 * the slot gets the screen instead of a third of it.
 */
const ProgressPhotoCaptureScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dateLocale = i18n.language.startsWith('pl') ? 'pl-PL' : 'en-US';
  const [accentPrimary, dangerColor, mutedColor] = useCSSVariable([
    '--color-accent-primary',
    '--color-icon-danger',
    '--color-icon-decorative',
  ]) as [string, string, string];

  const [selectedDate, setSelectedDate] = useState(
    route.params?.date ?? getTodayDate()
  );
  const [angle, setAngle] = useState<PhotoType>('front');
  const [drafts, setDrafts] = useState<Drafts>({});
  /** Angles whose saved photo should be deleted when Save runs. */
  const [removed, setRemoved] = useState<PhotoType[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const calendarRef = useRef<CalendarSheetRef>(null);
  // The picker is a native modal; without this a double tap opens two.
  const pickerLock = useRef(false);
  // Read by the beforeRemove listener, which must not fire its own navigation
  // away while a save is in flight.
  const isSavingRef = useRef(false);

  const { photos, isLoading } = useCheckInPhotosByDate(selectedDate);
  const { dates: photoDates } = useCheckInPhotoDates();
  const { uploadAsync, uploadingType, deleteAsync } =
    useCheckInPhotoMutations();
  const { getPhotoSource } = useCheckInPhotoSource();

  const byType = useMemo(() => {
    const map = new Map<PhotoType, (typeof photos)[number]>();
    for (const photo of photos) map.set(photo.photo_type, photo);
    return map;
  }, [photos]);

  const hasPendingChanges =
    Object.keys(drafts).length > 0 || removed.length > 0;

  const typeLabel = useCallback(
    (type: PhotoType): string => {
      switch (type) {
        case 'front':
          return t('progressPhotos.angle.front', { defaultValue: 'Front' });
        case 'back':
          return t('progressPhotos.angle.back', { defaultValue: 'Back' });
        case 'side':
          return t('progressPhotos.angle.side', { defaultValue: 'Side' });
      }
    },
    [t]
  );

  const segments = useMemo<Segment<PhotoType>[]>(
    () => PHOTO_TYPES.map((type) => ({ key: type, label: typeLabel(type) })),
    [typeLabel]
  );

  const clearStaged = useCallback(() => {
    setDrafts({});
    setRemoved([]);
  }, []);

  const handleSave = useCallback(async () => {
    if (!hasPendingChanges || isSavingRef.current) return;
    setIsSaving(true);
    isSavingRef.current = true;

    const failed: PhotoType[] = [];
    let lastError: unknown = null;

    // Sequential rather than parallel: three multipart uploads at once on a
    // phone connection is how you get a timeout on all three instead of one.
    for (const type of PHOTO_TYPES) {
      const uri = drafts[type];
      try {
        if (uri) {
          // The server upserts on (user_id, entry_date, photo_type), so an
          // upload over an existing photo replaces it — a queued removal for
          // the same angle is already superseded.
          await uploadAsync({ date: selectedDate, type, uri });
        } else if (removed.includes(type)) {
          const photo = byType.get(type);
          if (photo) await deleteAsync(photo.id);
        }
      } catch (err) {
        failed.push(type);
        lastError = err;
      }
    }

    setIsSaving(false);
    isSavingRef.current = false;

    if (failed.length === 0) {
      clearStaged();
      Toast.show({
        type: 'success',
        text1: t('progressPhotos.saveSuccess', {
          defaultValue: 'Photos saved',
        }),
      });
      return;
    }

    // Keep what failed staged so a retry is one more tap rather than a re-shoot.
    setDrafts((current) => {
      const next: Drafts = {};
      for (const type of failed) if (current[type]) next[type] = current[type];
      return next;
    });
    setRemoved((current) => current.filter((type) => failed.includes(type)));
    Toast.show({
      type: 'error',
      text1: t('progressPhotos.saveError', {
        defaultValue: 'Could not save every photo',
      }),
      text2: getApiErrorMessage(lastError) ?? undefined,
    });
  }, [
    hasPendingChanges,
    drafts,
    removed,
    byType,
    selectedDate,
    uploadAsync,
    deleteAsync,
    clearStaged,
    t,
  ]);

  const header = useScreenHeader({
    title: t('progressPhotos.captureTitle', { defaultValue: 'Add Photos' }),
    left: { kind: 'back' },
    right: {
      kind: 'primary',
      label: t('progressPhotos.save', { defaultValue: 'Save Photos' }),
      busyLabel: t('common.saving', { defaultValue: 'Saving…' }),
      busy: isSaving,
      disabled: !hasPendingChanges,
      onPress: () => void handleSave(),
      identifier: 'progress-photos-save',
    },
  });

  // Leaving with staged photos would drop them silently, which is a worse
  // trade than the auto-upload this replaced.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isSavingRef.current || !hasPendingChanges) return;
      e.preventDefault();
      void confirmDiscardPhotos().then((discard) => {
        if (discard) navigation.dispatch(e.data.action);
      });
    });
    return unsubscribe;
  }, [navigation, hasPendingChanges]);

  const stageFrom = useCallback(
    async (source: 'camera' | 'library', type: PhotoType) => {
      if (pickerLock.current) return;
      pickerLock.current = true;
      try {
        let uri: string | undefined;
        if (source === 'camera') {
          const result = await pickImageFromCamera();
          if (result.status === 'denied') {
            Toast.show({
              type: 'error',
              text1: t('progressPhotos.cameraPermission', {
                defaultValue: 'Camera permission is required',
              }),
              text2: t('progressPhotos.cameraPermissionHint', {
                defaultValue:
                  'Enable camera access for SparkyFitness in Settings.',
              }),
            });
            return;
          }
          if (result.status === 'cancelled') return;
          uri = result.image.uri;
        } else {
          uri = (await pickImagesFromLibrary(1))[0]?.uri;
        }
        if (!uri) return;
        setDrafts((current) => ({ ...current, [type]: uri }));
        // A fresh pick supersedes a queued removal for the same slot.
        setRemoved((current) => current.filter((queued) => queued !== type));
      } finally {
        pickerLock.current = false;
      }
    },
    [t]
  );

  const clearSlot = useCallback(
    (type: PhotoType) => {
      setDrafts((current) => {
        const next = { ...current };
        delete next[type];
        return next;
      });
      // Only a saved photo needs a delete queued; discarding a staged pick is
      // just dropping it.
      if (byType.has(type)) {
        setRemoved((current) =>
          current.includes(type) ? current : [...current, type]
        );
      }
    },
    [byType]
  );

  const openSheetFor = (type: PhotoType) => {
    setAngle(type);
    actionSheetRef.current?.present();
  };

  const draftUri = drafts[angle];
  const savedPhoto = removed.includes(angle) ? undefined : byType.get(angle);
  const hasImage = draftUri != null || savedPhoto != null;

  const sheetItems = useMemo<ActionSheetItem[]>(() => {
    const items: ActionSheetItem[] = [
      {
        key: 'camera',
        label: t('progressPhotos.takePhoto', { defaultValue: 'Take Photo' }),
        onPress: () => void stageFrom('camera', angle),
      },
      {
        key: 'library',
        label: t('progressPhotos.chooseLibrary', {
          defaultValue: 'Choose from Library',
        }),
        onPress: () => void stageFrom('library', angle),
      },
    ];
    if (hasImage) {
      items.push({
        key: 'remove',
        label: t('progressPhotos.remove', { defaultValue: 'Remove Photo' }),
        destructive: true,
        onPress: () => clearSlot(angle),
      });
    }
    return items;
  }, [angle, hasImage, stageFrom, clearSlot, t]);

  const selectDate = useCallback(
    (date: string) => {
      if (!hasPendingChanges) {
        setSelectedDate(date);
        return;
      }
      // The staged photos belong to the day they were taken for, so they can't
      // follow the picker to another date.
      void confirmDiscardPhotos().then((discard) => {
        if (!discard) return;
        clearStaged();
        setSelectedDate(date);
      });
    },
    [hasPendingChanges, clearStaged]
  );

  const busy = isSaving && uploadingType === angle;

  const renderSlot = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={accentPrimary} />
        </View>
      );
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => openSheetFor(angle)}
          disabled={isSaving}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            hasImage
              ? t('progressPhotos.replaceAngle', {
                  defaultValue: 'Replace {{angle}} photo',
                  angle: typeLabel(angle),
                })
              : t('progressPhotos.addAngle', {
                  defaultValue: 'Add {{angle}} photo',
                  angle: typeLabel(angle),
                })
          }
          className="bg-surface rounded-xl overflow-hidden shadow-sm"
          style={{ aspectRatio: 3 / 4 }}
        >
          {busy ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color={accentPrimary} />
            </View>
          ) : draftUri ? (
            // A staged pick is a local file, so it needs no auth headers and
            // none of SafeImage's retry machinery.
            <Image
              source={{ uri: draftUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : savedPhoto ? (
            <SafeImage
              source={getPhotoSource(savedPhoto.id)}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              fallback={
                <View className="flex-1 items-center justify-center bg-raised">
                  <Icon name="camera" size={28} color={mutedColor} />
                </View>
              }
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-raised">
              <Icon name="camera" size={32} color={accentPrimary} />
              <Text className="text-text-secondary text-sm mt-2">
                {t('progressPhotos.addAngle', {
                  defaultValue: 'Add {{angle}} photo',
                  angle: typeLabel(angle),
                })}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mt-2">
          {draftUri ? (
            <Text className="text-text-muted text-xs italic">
              {t('progressPhotos.pendingSave', {
                defaultValue: 'Not saved yet',
              })}
            </Text>
          ) : (
            <View />
          )}
          {hasImage && (
            <TouchableOpacity
              onPress={() => clearSlot(angle)}
              disabled={isSaving}
              hitSlop={8}
              activeOpacity={0.7}
              className="flex-row items-center gap-1"
              accessibilityRole="button"
              accessibilityLabel={t('progressPhotos.removeAngle', {
                defaultValue: 'Remove {{angle}} photo',
                angle: typeLabel(angle),
              })}
            >
              <Icon name="trash" size={14} color={dangerColor} />
              <Text className="text-xs" style={{ color: dangerColor }}>
                {t('progressPhotos.remove', { defaultValue: 'Remove Photo' })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  return (
    <View
      className="flex-1 bg-background"
      style={Platform.OS === 'android' ? { paddingTop: insets.top } : undefined}
    >
      {header}

      <View className="flex-1 px-4 py-4">
        <TouchableOpacity
          onPress={() => calendarRef.current?.present()}
          activeOpacity={0.7}
          className="flex-row items-center mb-3"
          accessibilityRole="button"
          accessibilityLabel={t('progressPhotos.changeDate', {
            defaultValue: 'Change date',
          })}
        >
          <Text className="text-text-primary text-base">
            {t('measurements.date', { defaultValue: 'Date' })}
          </Text>
          <Text className="text-accent-primary text-base font-medium mx-1.5">
            {formatDateLabel(selectedDate, t, dateLocale)}
          </Text>
          <Icon name="chevron-down" size={12} color={accentPrimary} />
        </TouchableOpacity>

        <SegmentedControl
          segments={segments}
          activeKey={angle}
          onSelect={setAngle}
        />

        <Text className="text-text-secondary text-xs my-3">
          {t('progressPhotos.captureHint', {
            defaultValue:
              'Same spot, same light, same pose each time — it makes the comparison and time-lapse far clearer.',
          })}
        </Text>

        {renderSlot()}
      </View>

      <ActionSheet
        ref={actionSheetRef}
        title={typeLabel(angle)}
        items={sheetItems}
      />

      <CalendarSheet
        ref={calendarRef}
        markedDates={photoDates}
        selectedDate={selectedDate}
        onSelectDate={selectDate}
      />
    </View>
  );
};

export default ProgressPhotoCaptureScreen;
