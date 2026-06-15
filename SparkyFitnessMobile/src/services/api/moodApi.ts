import { apiFetch } from './apiClient';
import { ApiError } from './errors';
import type { MoodEntry } from '../../types/mood';

/**
 * Fetches the mood entry for a given date, or `null` when none exists.
 *
 * The server returns `200 {}` (an empty object) rather than 404 when there is
 * no entry for the date, so we normalise the empty object to `null`.
 */
export const getMoodEntryByDate = async (
  date: string,
): Promise<MoodEntry | null> => {
  try {
    const response = await apiFetch<MoodEntry | Record<string, never>>({
      endpoint: `/api/mood/date/${date}`,
      serviceName: 'Mood API',
      operation: 'fetch mood by date',
    });
    if (!response || Object.keys(response).length === 0) {
      return null;
    }
    return response as MoodEntry;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a mood entry for a date. The server upserts on (user, entry_date).
 */
export const saveMoodEntry = async (params: {
  moodValue: number;
  notes: string;
  entryDate: string;
}): Promise<MoodEntry> => {
  return apiFetch<MoodEntry>({
    endpoint: '/api/mood',
    serviceName: 'Mood API',
    operation: 'save mood entry',
    method: 'POST',
    body: {
      mood_value: params.moodValue,
      notes: params.notes,
      entry_date: params.entryDate,
    },
  });
};

/**
 * Updates an existing mood entry by id.
 */
export const updateMoodEntry = async (params: {
  id: string;
  moodValue: number | null;
  notes: string;
  entryDate: string;
}): Promise<MoodEntry> => {
  return apiFetch<MoodEntry>({
    endpoint: `/api/mood/${params.id}`,
    serviceName: 'Mood API',
    operation: 'update mood entry',
    method: 'PUT',
    body: {
      mood_value: params.moodValue,
      notes: params.notes,
      entry_date: params.entryDate,
    },
  });
};

/**
 * Deletes a mood entry by id.
 */
export const deleteMoodEntry = async (id: string): Promise<void> => {
  return apiFetch<void>({
    endpoint: `/api/mood/${id}`,
    serviceName: 'Mood API',
    operation: 'delete mood entry',
    method: 'DELETE',
  });
};
