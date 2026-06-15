import { apiFetch } from './apiClient';
import type { CheckInMeasurement, CheckInMeasurementRange, WaterIntake, WaterContainer, WaterIntakeResponse } from '../../types/measurements';

/**
 * Fetches measurements for a given date.
 */
export const fetchMeasurements = async (date: string): Promise<CheckInMeasurement> => {
  return apiFetch<CheckInMeasurement>({
    endpoint: `/api/measurements/check-in/${date}`,
    serviceName: 'Measurements API',
    operation: 'fetch measurements',
  });
};

/**
 * Fetches water intake for a given date.
 */
export const fetchWaterIntake = async (date: string): Promise<WaterIntake> => {
  return apiFetch<WaterIntake>({
    endpoint: `/api/measurements/water-intake/${date}`,
    serviceName: 'Measurements API',
    operation: 'fetch water intake',
  });
};

/**
 * Fetches available water containers.
 */
export const fetchWaterContainers = async (): Promise<WaterContainer[]> => {
  return apiFetch<WaterContainer[]>({
    endpoint: '/api/water-containers',
    serviceName: 'Measurements API',
    operation: 'fetch water containers',
  });
};

/**
 * Fetches measurements for a date range.
 */
export const fetchMeasurementsRange = async (startDate: string, endDate: string): Promise<CheckInMeasurementRange[]> => {
  return apiFetch<CheckInMeasurementRange[]>({
    endpoint: `/api/measurements/check-in-measurements-range/${startDate}/${endDate}`,
    serviceName: 'Measurements API',
    operation: 'fetch measurements range',
  });
};

/**
 * Upserts a check-in measurement record for a given date.
 *
 * `undefined` fields are stripped by `JSON.stringify` and left unchanged
 * server-side. Pass `null` to explicitly clear a previously-saved value.
 */
export const upsertCheckIn = async (params: {
  entryDate: string;
  weight?: number | null;
  neck?: number | null;
  waist?: number | null;
  hips?: number | null;
  steps?: number | null;
  height?: number | null;
  bodyFatPercentage?: number | null;
}): Promise<CheckInMeasurement> => {
  return apiFetch<CheckInMeasurement>({
    endpoint: '/api/measurements/check-in',
    serviceName: 'Measurements API',
    operation: 'upsert check-in',
    method: 'POST',
    body: {
      entry_date: params.entryDate,
      weight: params.weight,
      neck: params.neck,
      waist: params.waist,
      hips: params.hips,
      steps: params.steps,
      height: params.height,
      body_fat_percentage: params.bodyFatPercentage,
    },
  });
};

/**
 * Fetches the user's most recent value for a single standard measurement type
 * (e.g. `height`, `weight`). Returns `null` when none has ever been recorded —
 * the server replies with an empty object in that case.
 */
export const getMostRecentMeasurement = async (
  measurementType: string,
): Promise<CheckInMeasurement | null> => {
  const response = await apiFetch<CheckInMeasurement | Record<string, never>>({
    endpoint: `/api/measurements/most-recent/${measurementType}`,
    serviceName: 'Measurements API',
    operation: 'fetch most recent measurement',
  });
  if (!response || Object.keys(response).length === 0) {
    return null;
  }
  return response as CheckInMeasurement;
};

/**
 * Updates a single field on an existing check-in measurement row. Passing
 * `null` clears that field (used by the recent-activity delete action).
 */
export const updateCheckInMeasurementField = async (params: {
  id: string;
  field: string;
  value: number | null;
  entryDate: string;
}): Promise<void> => {
  return apiFetch<void>({
    endpoint: `/api/measurements/check-in/${params.id}`,
    serviceName: 'Measurements API',
    operation: 'update check-in field',
    method: 'PUT',
    body: {
      entry_date: params.entryDate,
      [params.field]: params.value,
    },
  });
};

/**
 * Changes water intake by adding or removing a drink.
 */
export const changeWaterIntake = async (params: {
  entryDate: string;
  changeDrinks: number;
  containerId: number;
}): Promise<WaterIntakeResponse> => {
  return apiFetch<WaterIntakeResponse>({
    endpoint: '/api/measurements/water-intake',
    serviceName: 'Measurements API',
    operation: 'change water intake',
    method: 'POST',
    body: {
      entry_date: params.entryDate,
      change_drinks: params.changeDrinks,
      container_id: params.containerId,
    },
  });
};
