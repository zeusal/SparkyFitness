import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useCSSVariable } from 'uniwind';
import i18n from '../localization/i18n';
import Icon from '../components/Icon';
import SafeImage from '../components/SafeImage';
import ActionSheet, {
  type ActionSheetItem,
  type ActionSheetRef,
} from '../components/ActionSheet';
import CalendarSheet, {
  type CalendarSheetRef,
} from '../components/CalendarSheet';
import { useScreenHeader } from '../hooks/useScreenHeader';
import {
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

const ProgressPhotoCaptureScreen: React.FC<Props> = ({ route }) => {
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
  // Which slot the action sheet is acting on. Set before present(), which
  // ActionSheet requires of its owner.
  const [activeType, setActiveType] = useState<PhotoType | null>(null);

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const calendarRef = useRef<CalendarSheetRef>(null);
  // The picker is a native modal; without this a double tap opens two.
  const pickerLock = useRef(false);

  const { photos, isLoading } = useCheckInPhotosByDate(selectedDate);
  const { uploadAsync, isUploading, uploadingType, deleteAsync } =
    useCheckInPhotoMutations();
  const { getPhotoSource } = useCheckInPhotoSource();

  const byType = useMemo(() => {
    const map = new Map<PhotoType, (typeof photos)[number]>();
    for (const photo of photos) map.set(photo.photo_type, photo);
    return map;
  }, [photos]);

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

  const header = useScreenHeader({
    title: t('progressPhotos.captureTitle', { defaultValue: 'Add Photos' }),
    left: { kind: 'back' },
  });

  const upload = useCallback(
    async (type: PhotoType, uri: string) => {
      try {
        await uploadAsync({ date: selectedDate, type, uri });
        Toast.show({
          type: 'success',
          text1: t('progressPhotos.uploadSuccess', {
            defaultValue: 'Photo saved',
          }),
        });
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: t('progressPhotos.uploadError', {
            defaultValue: 'Could not save photo',
          }),
          text2: getApiErrorMessage(err) ?? undefined,
        });
      }
    },
    [selectedDate, uploadAsync, t]
  );

  const captureFrom = useCallback(
    async (source: 'camera' | 'library', type: PhotoType) => {
      if (pickerLock.current) return;
      pickerLock.current = true;
      try {
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
          await upload(type, result.image.uri);
          return;
        }
        const picked = await pickImagesFromLibrary(1);
        const uri = picked[0]?.uri;
        if (!uri) return;
        await upload(type, uri);
      } finally {
        pickerLock.current = false;
      }
    },
    [upload, t]
  );

  const removePhoto = useCallback(
    async (id: string) => {
      try {
        await deleteAsync(id);
        Toast.show({
          type: 'success',
          text1: t('progressPhotos.deleteSuccess', {
            defaultValue: 'Photo removed',
          }),
        });
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: t('progressPhotos.deleteError', {
            defaultValue: 'Could not remove photo',
          }),
          text2: getApiErrorMessage(err) ?? undefined,
        });
      }
    },
    [deleteAsync, t]
  );

  const openSheetFor = (type: PhotoType) => {
    setActiveType(type);
    actionSheetRef.current?.present();
  };

  const existing = activeType ? byType.get(activeType) : undefined;

  const sheetItems = useMemo<ActionSheetItem[]>(() => {
    if (!activeType) return [];
    const items: ActionSheetItem[] = [
      {
        key: 'camera',
        label: t('progressPhotos.takePhoto', { defaultValue: 'Take Photo' }),
        onPress: () => void captureFrom('camera', activeType),
      },
      {
        key: 'library',
        label: t('progressPhotos.chooseLibrary', {
          defaultValue: 'Choose from Library',
        }),
        onPress: () => void captureFrom('library', activeType),
      },
    ];
    if (existing) {
      items.push({
        key: 'delete',
        label: t('progressPhotos.remove', { defaultValue: 'Remove Photo' }),
        destructive: true,
        onPress: () => void removePhoto(existing.id),
      });
    }
    return items;
  }, [activeType, existing, captureFrom, removePhoto, t]);

  const renderSlot = (type: PhotoType) => {
    const photo = byType.get(type);
    const source = photo ? getPhotoSource(photo.id) : null;
    const busy = isUploading && uploadingType === type;

    return (
      <View key={type} className="mb-4">
        <Text className="text-text-secondary text-sm mb-2">
          {typeLabel(type)}
        </Text>
        <TouchableOpacity
          onPress={() => openSheetFor(type)}
          disabled={busy}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            photo
              ? t('progressPhotos.replaceAngle', {
                  defaultValue: 'Replace {{angle}} photo',
                  angle: typeLabel(type),
                })
              : t('progressPhotos.addAngle', {
                  defaultValue: 'Add {{angle}} photo',
                  angle: typeLabel(type),
                })
          }
          className="bg-surface rounded-xl overflow-hidden shadow-sm"
          style={{ aspectRatio: 3 / 4 }}
        >
          {busy ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color={accentPrimary} />
            </View>
          ) : source ? (
            <SafeImage
              source={source}
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
                  angle: typeLabel(type),
                })}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {photo && (
          <TouchableOpacity
            onPress={() => void removePhoto(photo.id)}
            hitSlop={8}
            className="flex-row items-center gap-1 mt-2 self-start"
            accessibilityRole="button"
            accessibilityLabel={t('progressPhotos.removeAngle', {
              defaultValue: 'Remove {{angle}} photo',
              angle: typeLabel(type),
            })}
          >
            <Icon name="trash" size={14} color={dangerColor} />
            <Text className="text-xs" style={{ color: dangerColor }}>
              {t('progressPhotos.remove', { defaultValue: 'Remove Photo' })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View
      className="flex-1 bg-background"
      style={Platform.OS === 'android' ? { paddingTop: insets.top } : undefined}
    >
      {header}

      <ScrollView contentContainerClassName="px-4 py-4">
        <TouchableOpacity
          onPress={() => calendarRef.current?.present()}
          activeOpacity={0.7}
          className="flex-row items-center mb-4"
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

        <Text className="text-text-secondary text-xs mb-4">
          {t('progressPhotos.captureHint', {
            defaultValue:
              'Same spot, same light, same pose each time — it makes the comparison and time-lapse far clearer.',
          })}
        </Text>

        {isLoading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="small" color={accentPrimary} />
          </View>
        ) : (
          PHOTO_TYPES.map(renderSlot)
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <ActionSheet
        ref={actionSheetRef}
        title={
          activeType
            ? typeLabel(activeType)
            : t('progressPhotos.captureTitle', { defaultValue: 'Add Photos' })
        }
        items={sheetItems}
      />

      <CalendarSheet
        ref={calendarRef}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </View>
  );
};

export default ProgressPhotoCaptureScreen;
