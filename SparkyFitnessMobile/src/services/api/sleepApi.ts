import { apiFetch } from './apiClient';
import type { SleepEntry, SaveSleepEntryInput } from '../../types/sleep';

/**
 * Fetches sleep entries within an inclusive date range (`YYYY-MM-DD`).
 */
export const fetchSleepEntries = async (
  startDate: string,
  endDate: string,
): Promise<SleepEntry[]> => {
  const params = new URLSearchParams({ startDate, endDate }).toString();
  return apiFetch<SleepEntry[]>({
    endpoint: `/api/sleep/details?${params}`,
    serviceName: 'Sleep API',
    operation: 'fetch sleep entries',
  });
};

/**
 * Creates a manual sleep entry.
 */
export const saveSleepEntry = async (
  data: SaveSleepEntryInput,
): Promise<SleepEntry> => {
  return apiFetch<SleepEntry>({
    endpoint: '/api/sleep/manual_entry',
    serviceName: 'Sleep API',
    operation: 'save sleep entry',
    method: 'POST',
    body: data,
  });
};

/**
 * Updates an existing sleep entry by id.
 */
export const updateSleepEntry = async (
  id: string,
  data: Partial<SaveSleepEntryInput>,
): Promise<SleepEntry> => {
  return apiFetch<SleepEntry>({
    endpoint: `/api/sleep/${id}`,
    serviceName: 'Sleep API',
    operation: 'update sleep entry',
    method: 'PUT',
    body: data,
  });
};

/**
 * Deletes a sleep entry by id.
 */
export const deleteSleepEntry = async (id: string): Promise<void> => {
  return apiFetch<void>({
    endpoint: `/api/sleep/${id}`,
    serviceName: 'Sleep API',
    operation: 'delete sleep entry',
    method: 'DELETE',
  });
};
