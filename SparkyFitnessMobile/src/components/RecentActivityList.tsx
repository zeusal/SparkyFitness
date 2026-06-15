import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useCSSVariable } from 'uniwind';
import Icon from './Icon';
import {
  fetchMeasurementsRange,
  updateCheckInMeasurementField,
} from '../services/api/measurementsApi';
import { measurementsRangeQueryKey } from '../hooks/queryKeys';
import { refreshHealthSyncCache } from '../hooks/refreshHealthSyncCache';
import { usePreferences } from '../hooks/usePreferences';
import { addDays, getTodayDate } from '../utils/dateUtils';
import {
  weightFromKg,
  lengthFromCm,
  cmToFeetInches,
  kgToStonesLbs,
} from '../utils/unitConversions';
import { addLog } from '../services/LogService';
import type { CheckInMeasurementRange } from '../types/measurements';

interface RecentActivityListProps {
  enabled?: boolean;
}

type StandardField =
  | 'weight'
  | 'neck'
  | 'waist'
  | 'hips'
  | 'height'
  | 'steps'
  | 'body_fat_percentage';

interface ActivityRow {
  key: string;
  id: string;
  field: StandardField;
  label: string;
  value: string;
  entryDate: string;
  timestamp: string;
}

const formatNumber = (value: number): string => String(Math.round(value * 10) / 10);

const formatWeight = (kg: number, mode: 'kg' | 'lbs' | 'st_lbs'): string => {
  if (mode === 'st_lbs') {
    const { stones, lbs } = kgToStonesLbs(kg);
    return `${stones}st ${formatNumber(lbs)}lb`;
  }
  return `${formatNumber(weightFromKg(kg, mode))} ${mode}`;
};

const formatHeight = (cm: number, mode: 'cm' | 'inches' | 'ft_in'): string => {
  if (mode === 'ft_in') {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${formatNumber(inches)}"`;
  }
  return `${formatNumber(lengthFromCm(cm, mode))} ${mode === 'cm' ? 'cm' : 'in'}`;
};

const formatBodyLength = (cm: number, unit: 'cm' | 'inches'): string =>
  `${formatNumber(lengthFromCm(cm, unit))} ${unit === 'cm' ? 'cm' : 'in'}`;

const formatTimestamp = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · ${d.toLocaleDateString(
    [],
    { month: 'short', day: 'numeric' },
  )}`;
};

const RecentActivityList: React.FC<RecentActivityListProps> = ({
  enabled = true,
}) => {
  const queryClient = useQueryClient();
  const [accentPrimary, destructive] = useCSSVariable([
    '--color-accent-primary',
    '--color-icon-danger',
  ]) as [string, string];

  const endDate = getTodayDate();
  const startDate = addDays(endDate, -30);

  const { preferences } = usePreferences({ enabled });
  const weightMode: 'kg' | 'lbs' | 'st_lbs' = preferences?.default_weight_unit ?? 'kg';
  const heightMode: 'cm' | 'inches' | 'ft_in' = preferences?.default_measurement_unit ?? 'cm';
  const bodyUnit: 'cm' | 'inches' =
    preferences?.default_measurement_unit === 'inches' ? 'inches' : 'cm';

  const { data: range = [], isLoading } = useQuery({
    queryKey: measurementsRangeQueryKey(startDate, endDate),
    queryFn: () => fetchMeasurementsRange(startDate, endDate),
    enabled,
  });

  const deleteMutation = useMutation({
    mutationFn: (row: ActivityRow) =>
      updateCheckInMeasurementField({
        id: row.id,
        field: row.field,
        value: null,
        entryDate: row.entryDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurementsRange'] });
      refreshHealthSyncCache(queryClient);
    },
    onError: (error) => {
      addLog(`Failed to delete measurement: ${error}`, 'ERROR');
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: 'Could not remove the entry. Please try again.',
      });
    },
  });

  const rows = useMemo<ActivityRow[]>(() => {
    const out: ActivityRow[] = [];
    const push = (
      m: CheckInMeasurementRange,
      field: StandardField,
      label: string,
      value: string,
    ) => {
      out.push({
        key: `${m.id}-${field}`,
        id: m.id,
        field,
        label,
        value,
        entryDate: m.entry_date,
        timestamp: m.updated_at,
      });
    };

    range.forEach((m) => {
      if (m.weight != null) push(m, 'weight', 'Weight', formatWeight(m.weight, weightMode));
      if (m.body_fat_percentage != null)
        push(m, 'body_fat_percentage', 'Body fat', `${formatNumber(m.body_fat_percentage)}%`);
      if (m.height != null) push(m, 'height', 'Height', formatHeight(m.height, heightMode));
      if (m.neck != null) push(m, 'neck', 'Neck', formatBodyLength(m.neck, bodyUnit));
      if (m.waist != null) push(m, 'waist', 'Waist', formatBodyLength(m.waist, bodyUnit));
      if (m.hips != null) push(m, 'hips', 'Hips', formatBodyLength(m.hips, bodyUnit));
      if (m.steps != null) push(m, 'steps', 'Steps', String(m.steps));
    });

    out.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return out.slice(0, 20);
  }, [range, weightMode, heightMode, bodyUnit]);

  return (
    <View className="bg-surface rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center mb-1">
        <Icon name="chart-bar" size={16} color={accentPrimary} />
        <Text className="text-md font-bold text-text-primary ml-2">
          Recent Activity
        </Text>
      </View>
      <Text className="text-text-secondary text-xs mb-2">
        Your latest measurement logs.
      </Text>

      {isLoading ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color={accentPrimary} />
        </View>
      ) : rows.length === 0 ? (
        <Text className="text-text-muted text-sm text-center py-6">
          No recent activity found.
        </Text>
      ) : (
        rows.map((row) => (
          <View
            key={row.key}
            className="flex-row items-center justify-between border-t border-border-subtle py-3"
          >
            <View className="flex-1">
              <Text className="text-text-primary font-medium">{row.label}</Text>
              <Text className="text-text-secondary text-xs mt-0.5">
                {formatTimestamp(row.timestamp)}
              </Text>
            </View>
            <Text className="text-text-primary font-semibold mr-2">
              {row.value}
            </Text>
            <TouchableOpacity
              onPress={() => deleteMutation.mutate(row)}
              disabled={deleteMutation.isPending}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Delete ${row.label}`}
            >
              <Icon name="trash" size={16} color={destructive || '#EF4444'} />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

export default RecentActivityList;
