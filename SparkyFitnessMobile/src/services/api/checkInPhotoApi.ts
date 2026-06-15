import { apiFetch, normalizeUrl } from './apiClient';
import { getActiveServerConfig, proxyHeadersToRecord } from '../storage';
import { getAuthHeaders, notifySessionExpired } from './authService';
import { ApiError } from './errors';
import { addLog } from '../LogService';
import type { CheckInPhoto, PhotoType } from '../../types/checkInPhotos';

/**
 * Fetches the progress photos saved for a given check-in date.
 */
export const fetchCheckInPhotos = async (
  date: string,
): Promise<CheckInPhoto[]> => {
  const response = await apiFetch<CheckInPhoto[] | null>({
    endpoint: `/api/measurements/check-in-photos/${date}`,
    serviceName: 'Check-In Photo API',
    operation: 'fetch check-in photos',
  });
  return Array.isArray(response) ? response : [];
};

/**
 * Uploads (or replaces) a progress photo for a date + type.
 *
 * This goes through a raw `fetch` rather than `apiFetch` because the body is
 * `multipart/form-data`: `apiFetch` forces `application/json` and JSON-encodes
 * the body. We still inject proxy + auth headers and the session-expiry handling
 * by hand so behaviour matches the rest of the app. The `Content-Type` (with the
 * multipart boundary) is left for the platform fetch to set automatically.
 */
export const uploadCheckInPhoto = async (
  date: string,
  type: PhotoType,
  asset: { uri: string; mimeType?: string | null; fileName?: string | null },
): Promise<CheckInPhoto> => {
  const config = await getActiveServerConfig();
  if (!config) {
    throw new Error('Server configuration not found.');
  }

  const baseUrl = normalizeUrl(config.url);
  if (!__DEV__ && baseUrl.toLowerCase().startsWith('http://')) {
    throw new Error(
      'HTTPS is required for server connections. Please update your server URL in Settings.',
    );
  }

  const mimeType = asset.mimeType ?? 'image/jpeg';
  const name = asset.fileName ?? `${type}.${mimeType.split('/')[1] ?? 'jpg'}`;

  const formData = new FormData();
  // React Native FormData expects the { uri, type, name } file shape.
  formData.append('photo', {
    uri: asset.uri,
    type: mimeType,
    name,
  } as unknown as Blob);

  const endpoint = `/api/measurements/check-in-photos/${date}/${type}`;
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...proxyHeadersToRecord(config.proxyHeaders),
        ...getAuthHeaders(config),
        // Intentionally NO Content-Type: let fetch set the multipart boundary.
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 && config.authType === 'session') {
        notifySessionExpired(config.id);
      }
      const errorText = await response.text();
      addLog(
        `[Check-In Photo API] Failed to upload photo: ${response.status}`,
        'ERROR',
        [errorText],
      );
      throw new ApiError(
        `Server error: ${response.status} - ${errorText}`,
        response.status,
        errorText,
      );
    }

    return (await response.json()) as CheckInPhoto;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    addLog(`[Check-In Photo API] Failed to upload photo: ${message}`, 'ERROR');
    throw error;
  }
};

/**
 * Deletes a progress photo by id.
 */
export const deleteCheckInPhoto = async (id: string): Promise<void> => {
  return apiFetch<void>({
    endpoint: `/api/measurements/check-in-photos/photo/${id}`,
    serviceName: 'Check-In Photo API',
    operation: 'delete check-in photo',
    method: 'DELETE',
  });
};
