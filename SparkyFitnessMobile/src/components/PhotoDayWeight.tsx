import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

import {
  formatWeightDisplay,
  type WeightDisplayMode,
} from '../utils/unitConversions';

interface PhotoDayWeightProps {
  /** Stored weight in kg for the photo's day, or null when none was logged. */
  weight: number | null;
  mode: WeightDisplayMode;
  /** Opens weight entry for this day. */
  onLogWeight: () => void;
  /** Typography for the resolved weight; the prompt follows its size. */
  className?: string;
}

/**
 * The weight under a progress photo, and the way to add it when it is missing.
 *
 * A photo taken before the day's weigh-in reads "No weight logged" forever
 * unless the user remembers to go back through Measurements, which is far
 * enough away that the pairing the whole feature is built on quietly rots. The
 * prompt turns that dead end into the one tap it should have been.
 *
 * Nested inside the gallery row's own touchable: React Native's responder
 * system hands the touch to the innermost target, so tapping the prompt logs
 * weight rather than also opening the photo.
 */
const PhotoDayWeight: React.FC<PhotoDayWeightProps> = ({
  weight,
  mode,
  onLogWeight,
  className = 'text-text-secondary text-sm',
}) => {
  const { t } = useTranslation();

  if (weight != null) {
    return (
      <Text className={className}>{formatWeightDisplay(weight, mode)}</Text>
    );
  }

  return (
    <TouchableOpacity
      onPress={onLogWeight}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t('progressPhotos.logWeightA11y', {
        defaultValue: 'Log your weight for this day',
      })}
      hitSlop={8}
    >
      <Text className={`${className} text-accent-primary font-medium`}>
        {t('progressPhotos.logWeight', { defaultValue: 'Log weight' })}
      </Text>
    </TouchableOpacity>
  );
};

export default PhotoDayWeight;
