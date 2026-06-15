import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  getMoodEntryByDate,
  saveMoodEntry,
} from '../services/api/moodApi';
import { moodQueryKey } from './queryKeys';
import { useRefetchOnFocus } from './useRefetchOnFocus';
import { addLog } from '../services/LogService';
import type { MoodEntry } from '../types/mood';

/**
 * Loads the mood entry for a date (or `null` when none exists yet).
 */
export function useMoodEntryByDate(date: string, enabled: boolean = true) {
  const query = useQuery({
    queryKey: moodQueryKey(date),
    queryFn: () => getMoodEntryByDate(date),
    enabled,
  });

  useRefetchOnFocus(query.refetch, enabled);

  return {
    mood: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

interface SaveMoodVars {
  moodValue: number;
  notes: string;
  entryDate: string;
}

/**
 * Saves the mood for a date. The server upserts on (user, entry_date), so a
 * single POST covers both create and update.
 */
export function useSaveMoodMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: SaveMoodVars) => saveMoodEntry(vars),
    onSuccess: (data, vars) => {
      queryClient.setQueryData<MoodEntry | null>(
        moodQueryKey(vars.entryDate),
        data,
      );
      Toast.show({ type: 'success', text1: 'Mood saved' });
    },
    onError: (error) => {
      addLog(`Failed to save mood: ${error}`, 'ERROR');
      Toast.show({
        type: 'error',
        text1: 'Save failed',
        text2: 'Could not save your mood. Please try again.',
      });
    },
  });
}
