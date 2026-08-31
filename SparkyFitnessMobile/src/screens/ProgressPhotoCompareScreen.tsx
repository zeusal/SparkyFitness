import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useCSSVariable } from 'uniwind';
import i18n from '../localization/i18n';
import Icon from '../components/Icon';
import SafeImage from '../components/SafeImage';
import SegmentedControl, { type Segment } from '../components/SegmentedControl';
import { useScreenHeader } from '../hooks/useScreenHeader';
import { useCheckInPhotoGallery } from '../hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../hooks/useCheckInPhotoSource';
import { usePreferences } from '../hooks/usePreferences';
import { formatShortDate } from '../utils/dateUtils';
import {
  formatWeightDisplay,
  weightFromKg,
  type WeightDisplayMode,
} from '../utils/unitConversions';
import type { PhotoType, ProgressPhotoDay } from '../types/checkInPhotos';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ProgressPhotoCompare'>;

/** Which of the two panes the thumbnail strip is currently assigning to. */
type Side = 'before' | 'after';

const ProgressPhotoCompareScreen: React.FC<Props> = ({ route }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dateLocale = i18n.language.startsWith('pl') ? 'pl-PL' : 'en-US';
  const [accentPrimary, mutedColor] = useCSSVariable([
    '--color-accent-primary',
    '--color-icon-decorative',
  ]) as [string, string];

  const angle: PhotoType = route.params?.angle ?? 'front';

  const { days, isLoading } = useCheckInPhotoGallery();
  const { getPhotoSource } = useCheckInPhotoSource();
  const { preferences } = usePreferences();
  const weightMode: WeightDisplayMode =
    preferences?.default_weight_unit ?? 'kg';

  // Oldest first reads left-to-right as progression, which is how the two
  // panes are laid out.
  const timeline = useMemo<ProgressPhotoDay[]>(
    () =>
      days
        .filter((day) => day.photos[angle])
        .slice()
        .reverse(),
    [days, angle]
  );

  const [side, setSide] = useState<Side>('after');
  const [beforeDate, setBeforeDate] = useState<string | null>(null);
  const [afterDate, setAfterDate] = useState<string | null>(null);

  // Default to the widest span available: first shoot vs latest one. Runs once
  // the gallery arrives, and again if the set changes underneath (a delete).
  useEffect(() => {
    if (timeline.length === 0) return;
    const first = timeline[0].entry_date;
    const last = timeline[timeline.length - 1].entry_date;
    setBeforeDate((current) =>
      current && timeline.some((d) => d.entry_date === current)
        ? current
        : first
    );
    setAfterDate((current) =>
      current && timeline.some((d) => d.entry_date === current) ? current : last
    );
  }, [timeline]);

  const header = useScreenHeader({
    title: t('progressPhotos.compareTitle', { defaultValue: 'Compare' }),
    left: { kind: 'back' },
  });

  const dayFor = useCallback(
    (date: string | null) =>
      date ? timeline.find((d) => d.entry_date === date) : undefined,
    [timeline]
  );

  const beforeDay = dayFor(beforeDate);
  const afterDay = dayFor(afterDate);

  const sideSegments = useMemo<Segment<Side>[]>(
    () => [
      {
        key: 'before',
        label: t('progressPhotos.before', { defaultValue: 'Before' }),
      },
      {
        key: 'after',
        label: t('progressPhotos.after', { defaultValue: 'After' }),
      },
    ],
    [t]
  );

  const selectDay = (date: string) => {
    if (side === 'before') setBeforeDate(date);
    else setAfterDate(date);
  };

  const deltaKg =
    beforeDay?.weight != null && afterDay?.weight != null
      ? afterDay.weight - beforeDay.weight
      : null;

  const formatDelta = (kg: number): string => {
    const converted =
      weightMode === 'st_lbs'
        ? weightFromKg(kg, 'lbs')
        : weightFromKg(kg, weightMode);
    const unit = weightMode === 'st_lbs' ? 'lb' : weightMode;
    const rounded = Math.round(converted * 10) / 10;
    return `${rounded > 0 ? '+' : ''}${rounded} ${unit}`;
  };

  const renderPane = (day: ProgressPhotoDay | undefined, label: string) => {
    const photo = day?.photos[angle];
    const source = photo ? getPhotoSource(photo.id) : null;
    return (
      <View className="flex-1">
        <Text className="text-text-secondary text-xs mb-1 text-center">
          {label}
        </Text>
        <View
          className="bg-surface rounded-xl overflow-hidden"
          style={{ aspectRatio: 3 / 4 }}
        >
          <SafeImage
            source={source}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            fallback={
              <View className="flex-1 items-center justify-center bg-raised">
                <Icon name="camera" size={22} color={mutedColor} />
              </View>
            }
          />
        </View>
        <Text className="text-text-primary text-sm font-semibold mt-1.5 text-center">
          {day ? formatShortDate(day.entry_date, dateLocale) : '—'}
        </Text>
        <Text className="text-text-secondary text-xs text-center">
          {day?.weight != null
            ? formatWeightDisplay(day.weight, weightMode)
            : t('progressPhotos.noWeight', {
                defaultValue: 'No weight logged',
              })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        className="flex-1 bg-background"
        style={
          Platform.OS === 'android' ? { paddingTop: insets.top } : undefined
        }
      >
        {header}
        <View className="py-16 items-center">
          <ActivityIndicator size="small" color={accentPrimary} />
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background"
      style={Platform.OS === 'android' ? { paddingTop: insets.top } : undefined}
    >
      {header}

      <ScrollView contentContainerClassName="px-4 py-3">
        <View className="flex-row gap-3">
          {renderPane(
            beforeDay,
            t('progressPhotos.before', { defaultValue: 'Before' })
          )}
          {renderPane(
            afterDay,
            t('progressPhotos.after', { defaultValue: 'After' })
          )}
        </View>

        {deltaKg != null && (
          <View className="bg-surface rounded-xl p-3 mt-3 items-center shadow-sm">
            <Text className="text-text-secondary text-xs">
              {t('progressPhotos.weightChange', {
                defaultValue: 'Weight change',
              })}
            </Text>
            <Text className="text-text-primary text-xl font-bold mt-0.5">
              {formatDelta(deltaKg)}
            </Text>
          </View>
        )}

        <Text className="text-text-secondary text-sm mt-5 mb-2">
          {t('progressPhotos.pickWhich', {
            defaultValue: 'Tap a date to set the selected side',
          })}
        </Text>
        <SegmentedControl
          segments={sideSegments}
          activeKey={side}
          onSelect={setSide}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          <View className="flex-row gap-2">
            {timeline.map((day) => {
              const photo = day.photos[angle];
              if (!photo) return null;
              const isSelected =
                (side === 'before' ? beforeDate : afterDate) === day.entry_date;
              return (
                <TouchableOpacity
                  key={day.entry_date}
                  onPress={() => selectDay(day.entry_date)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={formatShortDate(
                    day.entry_date,
                    dateLocale
                  )}
                  className="items-center"
                >
                  <View
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: 56,
                      height: 74,
                      borderWidth: 2,
                      borderColor: isSelected ? accentPrimary : 'transparent',
                    }}
                  >
                    <SafeImage
                      source={getPhotoSource(photo.id)}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                      fallback={<View className="flex-1 bg-raised" />}
                    />
                  </View>
                  <Text className="text-text-secondary text-[10px] mt-1">
                    {formatShortDate(day.entry_date, dateLocale)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default ProgressPhotoCompareScreen;
