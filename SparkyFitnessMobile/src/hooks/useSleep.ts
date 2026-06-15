import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  deleteSleepEntry,
  fetchSleepEntries,
  saveSleepEntry,
} from '../services/api/sleepApi';
import { sleepQueryKey } from './queryKeys';
import { useRefetchOnFocus } from './useRefetchOnFocus';
import { addLog } from '../services/LogService';
import type { SaveSleepEntryInput } from '../types/sleep';

const SLEEP_QUERY_FAMILY = ['sleep'] as const;

/**
 * Loads sleep entries within an inclusive date range. For the check-in screen
 * `startDate === endDate === selectedDate`.
 */
export function useSleepEntries(
  startDate: string,
  endDate: string,
  enabled: boolean = true,
) {
  const query = useQuery({
    queryKey: sleepQueryKey(startDate, endDate),
    queryFn: () => fetchSleepEntries(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
  });

  useRefetchOnFocus(query.refetch, enabled);

  return {
    sleepEntries: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useSaveSleepMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveSleepEntryInput) => saveSleepEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SLEEP_QUERY_FAMILY });
      Toast.show({ type: 'success', text1: 'Sleep saved' });
    },
    onError: (error) => {
      addLog(`Failed to save sleep entry: ${error}`, 'ERROR');
      Toast.show({
        type: 'error',
        text1: 'Save failed',
        text2: 'Could not save your sleep entry. Please try again.',
      });
    },
  });
}

export function useDeleteSleepMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSleepEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SLEEP_QUERY_FAMILY });
      Toast.show({ type: 'success', text1: 'Sleep entry deleted' });
    },
    onError: (error) => {
      addLog(`Failed to delete sleep entry: ${error}`, 'ERROR');
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: 'Could not delete the sleep entry. Please try again.',
      });
    },
  });
}
