import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import i18n from '../localization/i18n';
import Icon from '../components/Icon';
import SafeImage from '../components/SafeImage';
import SegmentedControl, { type Segment } from '../components/SegmentedControl';
import StatusView from '../components/StatusView';
import { useScreenHeader } from '../hooks/useScreenHeader';
import { useCheckInPhotoGallery } from '../hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../hooks/useCheckInPhotoSource';
import { usePreferences } from '../hooks/usePreferences';
import { formatDateLabel } from '../utils/dateUtils';
import {
  formatWeightDisplay,
  weightFromKg,
  type WeightDisplayMode,
} from '../utils/unitConversions';
import { PHOTO_TYPES, type PhotoType } from '../types/checkInPhotos';
import type { ProgressPhotoDay } from '../types/checkInPhotos';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ProgressPhotos'>;

/**
 * A day paired with how its weight moved against the previous (older) day that
 * also has a photo for this angle. The delta is what makes the timeline read as
 * progression rather than a pile of dated pictures.
 */
interface TimelineRow {
  day: ProgressPhotoDay;
  photoId: string;
  /** kg difference vs the next-older row; null when there is nothing to compare. */
  deltaKg: number | null;
}

const ProgressPhotosScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dateLocale = i18n.language.startsWith('pl') ? 'pl-PL' : 'en-US';
  const [accentPrimary, mutedColor] = useCSSVariable([
    '--color-accent-primary',
    '--color-icon-decorative',
  ]) as [string, string];

  const [angle, setAngle] = useState<PhotoType>('front');

  const { days, isLoading, isError, refetch } = useCheckInPhotoGallery();
  const { getPhotoSource } = useCheckInPhotoSource();
  const { preferences } = usePreferences();
  const weightMode: WeightDisplayMode =
    preferences?.default_weight_unit ?? 'kg';

  const angleLabel = useCallback(
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
    () => PHOTO_TYPES.map((type) => ({ key: type, label: angleLabel(type) })),
    [angleLabel]
  );

  // Only days that actually have this angle. `days` arrives newest-first, and
  // the delta compares against the next entry, which is the previous shoot.
  const rows = useMemo<TimelineRow[]>(() => {
    const withAngle = days.filter((day) => day.photos[angle]);
    return withAngle.map((day, index) => {
      const older = withAngle[index + 1];
      const deltaKg =
        day.weight != null && older?.weight != null
          ? day.weight - older.weight
          : null;
      return { day, photoId: day.photos[angle]!.id, deltaKg };
    });
  }, [days, angle]);

  const canCompare = rows.length >= 2;

  const header = useScreenHeader({
    title: t('progressPhotos.title', { defaultValue: 'Progress Photos' }),
    left: { kind: 'back' },
    right: {
      kind: 'icon',
      sfSymbol: 'plus',
      ionicon: 'add',
      accessibilityLabel: t('progressPhotos.add', {
        defaultValue: 'Add photos',
      }),
      onPress: () => navigation.navigate('ProgressPhotoCapture', {}),
    },
  });

  const formatDelta = (deltaKg: number): string => {
    // Convert the difference itself, not each end, so rounding happens once.
    const converted =
      weightMode === 'st_lbs'
        ? weightFromKg(deltaKg, 'lbs')
        : weightFromKg(deltaKg, weightMode);
    const unit = weightMode === 'st_lbs' ? 'lb' : weightMode;
    const rounded = Math.round(converted * 10) / 10;
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded} ${unit}`;
  };

  const renderRow = ({ item }: { item: TimelineRow }) => {
    const source = getPhotoSource(item.photoId);
    return (
      <View className="flex-row items-center bg-surface rounded-xl p-3 mb-3 shadow-sm">
        <SafeImage
          source={source}
          style={{ width: 72, height: 96, borderRadius: 12 }}
          contentFit="cover"
          fallback={
            <View className="flex-1 items-center justify-center bg-raised">
              <Icon name="camera" size={20} color={mutedColor} />
            </View>
          }
        />
        <View className="flex-1 ml-3">
          <Text className="text-text-primary text-base font-semibold">
            {formatDateLabel(item.day.entry_date, t, dateLocale)}
          </Text>
          {item.day.weight != null ? (
            <Text className="text-text-secondary text-sm mt-0.5">
              {formatWeightDisplay(item.day.weight, weightMode)}
            </Text>
          ) : (
            <Text className="text-text-muted text-sm mt-0.5 italic">
              {t('progressPhotos.noWeight', {
                defaultValue: 'No weight logged',
              })}
            </Text>
          )}
          {item.deltaKg != null && item.deltaKg !== 0 && (
            <Text className="text-text-muted text-xs mt-0.5">
              {t('progressPhotos.sincePrevious', {
                defaultValue: '{{delta}} since previous',
                delta: formatDelta(item.deltaKg),
              })}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View className="py-16 items-center">
          <ActivityIndicator size="small" color={accentPrimary} />
        </View>
      );
    }

    if (isError) {
      return (
        <StatusView
          icon="warning"
          iconTone="danger"
          title={t('progressPhotos.loadError', {
            defaultValue: "Couldn't load your progress photos.",
          })}
          action={{
            label: t('common.tryAgain', { defaultValue: 'Please try again.' }),
            onPress: () => void refetch(),
          }}
        />
      );
    }

    if (rows.length === 0) {
      return (
        <View className="py-12 items-center px-6">
          <Icon name="camera" size={40} color={mutedColor} />
          <Text className="text-text-primary text-base font-semibold mt-3 text-center">
            {t('progressPhotos.emptyTitle', {
              defaultValue: 'No {{angle}} photos yet',
              angle: angleLabel(angle).toLowerCase(),
            })}
          </Text>
          <Text className="text-text-secondary text-sm mt-1 text-center">
            {t('progressPhotos.emptyBody', {
              defaultValue:
                'Add a photo on a check-in day and it will show up here with that day’s weight.',
            })}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProgressPhotoCapture', {})}
            className="mt-4 px-5 py-2.5 rounded-lg"
            style={{ backgroundColor: accentPrimary }}
            accessibilityRole="button"
          >
            <Text className="text-white font-semibold text-sm">
              {t('progressPhotos.add', { defaultValue: 'Add photos' })}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={rows}
        keyExtractor={(row) => row.photoId}
        renderItem={renderRow}
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View
      className="flex-1 bg-background"
      style={Platform.OS === 'android' ? { paddingTop: insets.top } : undefined}
    >
      {header}

      <View className="px-4 pt-2 pb-3">
        <SegmentedControl
          segments={segments}
          activeKey={angle}
          onSelect={setAngle}
        />

        <View className="flex-row gap-3 mt-3">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProgressPhotoCompare', { angle })
            }
            disabled={!canCompare}
            className="flex-1 flex-row items-center justify-center bg-surface rounded-lg py-2.5 shadow-sm"
            style={!canCompare ? { opacity: 0.4 } : undefined}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canCompare }}
          >
            <Icon name="copy" size={16} color={accentPrimary} />
            <Text
              className="text-sm font-semibold ml-1.5"
              style={{ color: accentPrimary }}
            >
              {t('progressPhotos.compare', { defaultValue: 'Compare' })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProgressPhotoTimelapse', { angle })
            }
            disabled={!canCompare}
            className="flex-1 flex-row items-center justify-center bg-surface rounded-lg py-2.5 shadow-sm"
            style={!canCompare ? { opacity: 0.4 } : undefined}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canCompare }}
          >
            <Icon name="play" size={16} color={accentPrimary} />
            <Text
              className="text-sm font-semibold ml-1.5"
              style={{ color: accentPrimary }}
            >
              {t('progressPhotos.timelapse', { defaultValue: 'Time-lapse' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderBody()}
    </View>
  );
};

export default ProgressPhotosScreen;
