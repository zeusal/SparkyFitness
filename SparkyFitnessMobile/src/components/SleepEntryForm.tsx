import React, { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useCSSVariable } from 'uniwind';
import Icon from './Icon';
import Button from './ui/Button';
import FormInput from './FormInput';
import {
  useSleepEntries,
  useSaveSleepMutation,
  useDeleteSleepMutation,
} from '../hooks/useSleep';
import type { SleepEntry } from '../types/sleep';

interface SleepEntryFormProps {
  selectedDate: string;
  enabled?: boolean;
}

/** Formats raw keypad digits into an `HH:MM` mask. */
const maskTime = (raw: string): string => {
  const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

/** Validates an `HH:MM` string and returns minutes-since-midnight, or null. */
const parseTimeToMinutes = (value: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
};

const formatDuration = (seconds: number): string => {
  const totalMinutes = Math.max(0, Math.round(seconds / 60));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const formatClock = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const SleepEntryForm: React.FC<SleepEntryFormProps> = ({
  selectedDate,
  enabled = true,
}) => {
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  const [textSecondary, destructive] = useCSSVariable([
    '--color-text-secondary',
    '--color-icon-danger',
  ]) as [string, string];

  const { sleepEntries, isLoading } = useSleepEntries(
    selectedDate,
    selectedDate,
    enabled,
  );
  const saveMutation = useSaveSleepMutation();
  const deleteMutation = useDeleteSleepMutation();

  const bedMinutes = parseTimeToMinutes(bedtime);
  const wakeMinutes = parseTimeToMinutes(wakeTime);

  const previewDuration = useMemo(() => {
    if (bedMinutes == null || wakeMinutes == null) return null;
    // Bedtime later than wake time → the user went to bed the previous night.
    const diff =
      wakeMinutes >= bedMinutes
        ? wakeMinutes - bedMinutes
        : 24 * 60 - bedMinutes + wakeMinutes;
    return formatDuration(diff * 60);
  }, [bedMinutes, wakeMinutes]);

  const handleSave = () => {
    if (bedMinutes == null || wakeMinutes == null) {
      Toast.show({
        type: 'error',
        text1: 'Invalid time',
        text2: 'Enter bedtime and wake time as HH:MM (24-hour).',
      });
      return;
    }

    const bed = new Date(`${selectedDate}T${bedtime.padStart(5, '0')}:00`);
    const wake = new Date(`${selectedDate}T${wakeTime.padStart(5, '0')}:00`);
    if (bed.getTime() > wake.getTime()) {
      bed.setDate(bed.getDate() - 1);
    }
    const durationInSeconds = Math.round((wake.getTime() - bed.getTime()) / 1000);

    saveMutation.mutate(
      {
        entry_date: selectedDate,
        bedtime: bed.toISOString(),
        wake_time: wake.toISOString(),
        duration_in_seconds: durationInSeconds,
        source: 'manual',
      },
      {
        onSuccess: () => {
          setBedtime('');
          setWakeTime('');
        },
      },
    );
  };

  const isSaving = saveMutation.isPending;

  return (
    <View className="bg-surface rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center mb-3">
        <Icon name="moon" size={18} color={textSecondary} />
        <Text className="text-md font-bold text-text-primary ml-2">
          Sleep Tracking
        </Text>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-text-secondary text-sm mb-1">Bedtime</Text>
          <FormInput
            value={bedtime}
            onChangeText={(v) => setBedtime(maskTime(v))}
            keyboardType="number-pad"
            placeholder="HH:MM"
            maxLength={5}
            returnKeyType="done"
          />
        </View>
        <View className="flex-1">
          <Text className="text-text-secondary text-sm mb-1">Wake time</Text>
          <FormInput
            value={wakeTime}
            onChangeText={(v) => setWakeTime(maskTime(v))}
            keyboardType="number-pad"
            placeholder="HH:MM"
            maxLength={5}
            returnKeyType="done"
          />
        </View>
      </View>

      {previewDuration && (
        <Text className="text-text-secondary text-sm mt-2">
          Duration: {previewDuration}
        </Text>
      )}

      <Button
        variant="primary"
        onPress={handleSave}
        disabled={isSaving}
        className="py-3 mt-3"
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-sm font-semibold text-white">Save sleep</Text>
        )}
      </Button>

      {isLoading ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color={textSecondary} />
        </View>
      ) : (
        sleepEntries.length > 0 && (
          <View className="mt-4">
            {sleepEntries.map((entry: SleepEntry) => (
              <View
                key={entry.id}
                className="flex-row items-center justify-between border-t border-border-subtle pt-3 mt-3"
              >
                <View className="flex-1">
                  <Text className="text-text-primary font-medium">
                    {formatClock(entry.bedtime)} – {formatClock(entry.wake_time)}
                  </Text>
                  <Text className="text-text-secondary text-xs mt-0.5">
                    {formatDuration(entry.duration_in_seconds)}
                    {entry.source ? ` · ${entry.source}` : ''}
                  </Text>
                </View>
                <Button
                  variant="ghost"
                  className="p-2"
                  onPress={() => deleteMutation.mutate(entry.id)}
                  disabled={deleteMutation.isPending}
                  accessibilityLabel="Delete sleep entry"
                >
                  <Icon name="trash" size={18} color={destructive || '#EF4444'} />
                </Button>
              </View>
            ))}
          </View>
        )
      )}
    </View>
  );
};

export default SleepEntryForm;
