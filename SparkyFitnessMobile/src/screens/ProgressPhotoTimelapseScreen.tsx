import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Image } from 'expo-image';
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
  type WeightDisplayMode,
} from '../utils/unitConversions';
import type { PhotoType, ProgressPhotoDay } from '../types/checkInPhotos';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'ProgressPhotoTimelapse'>;

type Speed = 'slow' | 'normal' | 'fast';

/**
 * How long each frame is held, and how long the cross-fade between two frames
 * takes. The fade is a large share of the hold on purpose: a hard cut between
 * two body shots reads as a jerky slideshow, while an overlapping dissolve
 * turns the same pictures into a continuous transition.
 */
const SPEEDS: Record<Speed, { holdMs: number; fadeMs: number }> = {
  slow: { holdMs: 1400, fadeMs: 700 },
  normal: { holdMs: 900, fadeMs: 450 },
  fast: { holdMs: 500, fadeMs: 260 },
};

/** How many frames ahead to warm the image cache, so a fade never starts on a blank. */
const PREFETCH_AHEAD = 3;

const ProgressPhotoTimelapseScreen: React.FC<Props> = ({ route }) => {
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

  // Oldest → newest: the whole point is watching the change accumulate.
  const frames = useMemo<ProgressPhotoDay[]>(
    () =>
      days
        .filter((day) => day.photos[angle])
        .slice()
        .reverse(),
    [days, angle]
  );

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>('normal');

  const { holdMs, fadeMs } = SPEEDS[speed];

  const header = useScreenHeader({
    title: t('progressPhotos.timelapseTitle', { defaultValue: 'Time-lapse' }),
    left: { kind: 'back' },
  });

  // Reset when the frame set changes (angle switch, or a photo deleted while
  // this screen was backgrounded) so the index can never point past the end.
  // Adjusted during render rather than in an effect, so the first paint after
  // the change already shows frame 0 instead of flashing a stale one.
  const [prevFrameCount, setPrevFrameCount] = useState(frames.length);
  if (prevFrameCount !== frames.length) {
    setPrevFrameCount(frames.length);
    setIndex(0);
    setIsPlaying(false);
  }

  // Warm the next few frames. expo-image dedupes by URL, so re-prefetching an
  // already-cached frame is cheap. Failures are silent by design: a cold frame
  // still loads on display, it just fades in from the placeholder.
  useEffect(() => {
    const upcoming = frames.slice(index + 1, index + 1 + PREFETCH_AHEAD);
    for (const day of upcoming) {
      const photo = day.photos[angle];
      if (!photo) continue;
      const source = getPhotoSource(photo.id);
      if (!source) continue;
      void Image.prefetch(source.uri, { headers: source.headers }).catch(
        () => {}
      );
    }
  }, [frames, index, angle, getPhotoSource]);

  // Playback stops on the last frame rather than looping, so the current shot
  // stays on screen. That end state is derived, not written back into
  // isPlaying: the clock simply stops scheduling, which keeps the effect free
  // of setState and leaves one source of truth for what the button shows.
  const atEnd = frames.length === 0 || index >= frames.length - 1;
  const isRunning = isPlaying && !atEnd;

  // The playback clock: each tick advances exactly one frame.
  useEffect(() => {
    if (!isRunning) return;
    const timer = setTimeout(() => setIndex((i) => i + 1), holdMs);
    return () => clearTimeout(timer);
  }, [isRunning, index, holdMs]);

  const togglePlay = useCallback(() => {
    if (frames.length === 0) return;
    // Pressing play at the end replays from the start rather than doing
    // nothing, so a finished run is one tap from being watched again.
    if (!isRunning) {
      if (atEnd) setIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(false);
  }, [frames.length, isRunning, atEnd]);

  const step = (delta: number) => {
    setIsPlaying(false);
    setIndex((i) => Math.min(Math.max(i + delta, 0), frames.length - 1));
  };

  const speedSegments = useMemo<Segment<Speed>[]>(
    () => [
      {
        key: 'slow',
        label: t('progressPhotos.speedSlow', { defaultValue: 'Slow' }),
      },
      {
        key: 'normal',
        label: t('progressPhotos.speedNormal', { defaultValue: 'Normal' }),
      },
      {
        key: 'fast',
        label: t('progressPhotos.speedFast', { defaultValue: 'Fast' }),
      },
    ],
    [t]
  );

  const current = frames[index];
  const currentPhoto = current?.photos[angle];

  const body = () => {
    if (isLoading) {
      return (
        <View className="py-16 items-center">
          <ActivityIndicator size="small" color={accentPrimary} />
        </View>
      );
    }

    if (frames.length === 0 || !current || !currentPhoto) {
      return (
        <View className="py-16 items-center px-6">
          <Icon name="camera" size={40} color={mutedColor} />
          <Text className="text-text-secondary text-sm mt-3 text-center">
            {t('progressPhotos.timelapseEmpty', {
              defaultValue:
                'Add at least two photos of this angle to play a time-lapse.',
            })}
          </Text>
        </View>
      );
    }

    return (
      <>
        {/* Only the active frame is mounted; the outgoing copy lingers for the
            duration of its exit animation, so the two overlap into a real
            cross-fade rather than a cut. */}
        <View
          className="bg-surface rounded-xl overflow-hidden mx-4"
          style={{ aspectRatio: 3 / 4 }}
        >
          <Animated.View
            key={currentPhoto.id}
            entering={FadeIn.duration(fadeMs)}
            exiting={FadeOut.duration(fadeMs)}
            style={StyleSheet.absoluteFill}
          >
            <SafeImage
              source={getPhotoSource(currentPhoto.id)}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              fallback={<View className="flex-1 bg-raised" />}
            />
          </Animated.View>
        </View>

        <View className="items-center mt-3">
          <Text className="text-text-primary text-base font-semibold">
            {formatShortDate(current.entry_date, dateLocale)}
          </Text>
          <Text className="text-text-secondary text-sm">
            {current.weight != null
              ? formatWeightDisplay(current.weight, weightMode)
              : t('progressPhotos.noWeight', {
                  defaultValue: 'No weight logged',
                })}
          </Text>
          <Text className="text-text-muted text-xs mt-0.5">
            {t('progressPhotos.frameCount', {
              defaultValue: '{{current}} of {{total}}',
              current: index + 1,
              total: frames.length,
            })}
          </Text>
        </View>

        <View className="flex-row items-center justify-center gap-6 mt-4">
          <TouchableOpacity
            onPress={() => step(-1)}
            disabled={index === 0}
            hitSlop={10}
            style={index === 0 ? { opacity: 0.3 } : undefined}
            accessibilityRole="button"
            accessibilityLabel={t('progressPhotos.previousFrame', {
              defaultValue: 'Previous photo',
            })}
          >
            <Icon name="chevron-back" size={24} color={accentPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlay}
            hitSlop={10}
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: accentPrimary }}
            accessibilityRole="button"
            accessibilityLabel={
              isRunning
                ? t('progressPhotos.pause', { defaultValue: 'Pause' })
                : t('progressPhotos.play', { defaultValue: 'Play' })
            }
          >
            <Icon name={isRunning ? 'pause' : 'play'} size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => step(1)}
            disabled={index >= frames.length - 1}
            hitSlop={10}
            style={index >= frames.length - 1 ? { opacity: 0.3 } : undefined}
            accessibilityRole="button"
            accessibilityLabel={t('progressPhotos.nextFrame', {
              defaultValue: 'Next photo',
            })}
          >
            <Icon name="chevron-forward" size={24} color={accentPrimary} />
          </TouchableOpacity>
        </View>

        <View className="px-4 mt-5">
          <SegmentedControl
            segments={speedSegments}
            activeKey={speed}
            onSelect={setSpeed}
          />
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
      <View className="pt-2">{body()}</View>
    </View>
  );
};

export default ProgressPhotoTimelapseScreen;
