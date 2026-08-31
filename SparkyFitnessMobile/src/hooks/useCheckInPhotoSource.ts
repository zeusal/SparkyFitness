import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  getActiveServerConfig,
  proxyHeadersToRecord,
} from '../services/storage';
import { getAuthHeaders } from '../services/api/authService';
import { normalizeUrl } from '../services/api/apiClient';
import type { ServerConfig } from '../services/storage';

export type CheckInPhotoSource = {
  uri: string;
  headers: Record<string, string>;
};

/**
 * Builds `<SafeImage>` sources for progress photos.
 *
 * Unlike exercise images, these are not public uploads: the bytes come from
 * `GET /api/measurements/check-in-photos/file/:id`, which is behind
 * `authenticate` + the `checkin` permission, so every request needs the auth
 * header (and any reverse-proxy headers) attached — a bare URI renders as a
 * broken image.
 *
 * Sources are memoized per photo id so repeated renders hand `<Image>` the same
 * object identity; a fresh `{uri, headers}` literal each render would make
 * expo-image treat it as a new source and reload the picture, which is very
 * visible in a scrolling gallery and would restart the time-lapse.
 */
export function useCheckInPhotoSource() {
  const [config, setConfig] = useState<ServerConfig | null>(null);

  useFocusEffect(
    useCallback(() => {
      getActiveServerConfig().then(setConfig);
    }, [])
  );

  const cacheRef = useRef<Map<string, CheckInPhotoSource>>(new Map());

  // Base URL and proxy/auth headers belong to the active server, so drop the
  // memo when the user switches servers.
  useEffect(() => {
    cacheRef.current.clear();
  }, [config]);

  const getPhotoSource = useCallback(
    (photoId: string): CheckInPhotoSource | null => {
      if (!photoId || !config) return null;

      const cached = cacheRef.current.get(photoId);
      if (cached) return cached;

      const source: CheckInPhotoSource = {
        uri: `${normalizeUrl(config.url)}/api/measurements/check-in-photos/file/${encodeURIComponent(photoId)}`,
        headers: {
          ...proxyHeadersToRecord(config.proxyHeaders),
          ...getAuthHeaders(config),
        },
      };
      cacheRef.current.set(photoId, source);
      return source;
    },
    [config]
  );

  return { getPhotoSource, isReady: config !== null };
}
