import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  deleteCheckInPhoto,
  fetchCheckInPhotos,
  uploadCheckInPhoto,
} from '../services/api/checkInPhotoApi';
import { getActiveServerConfig, proxyHeadersToRecord } from '../services/storage';
import { getAuthHeaders } from '../services/api/authService';
import { normalizeUrl } from '../services/api/apiClient';
import { checkInPhotosQueryKey } from './queryKeys';
import { addLog } from '../services/LogService';
import type { ServerConfig } from '../services/storage';
import type { PhotoType } from '../types/checkInPhotos';

export interface PhotoAsset {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
}

/**
 * Manages the progress photos for a single check-in date: the photo list plus
 * upload and delete mutations. Mirrors the web `useCheckInPhotos` hook.
 */
export function useCheckInPhotos(selectedDate: string, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const queryKey = checkInPhotosQueryKey(selectedDate);

  const { data: photos = [] } = useQuery({
    queryKey,
    queryFn: () => fetchCheckInPhotos(selectedDate),
    enabled,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ type, asset }: { type: PhotoType; asset: PhotoAsset }) =>
      uploadCheckInPhoto(selectedDate, type, asset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      Toast.show({ type: 'success', text1: 'Photo saved' });
    },
    onError: (error) => {
      addLog(`Failed to upload check-in photo: ${error}`, 'ERROR');
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: 'Could not upload the photo. Please try again.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCheckInPhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      Toast.show({ type: 'success', text1: 'Photo removed' });
    },
    onError: (error) => {
      addLog(`Failed to delete check-in photo: ${error}`, 'ERROR');
      Toast.show({
        type: 'error',
        text1: 'Delete failed',
        text2: 'Could not remove the photo. Please try again.',
      });
    },
  });

  return {
    photos,
    uploadPhoto: (type: PhotoType, asset: PhotoAsset) =>
      uploadMutation.mutate({ type, asset }),
    deletePhoto: (id: string) => deleteMutation.mutate(id),
    isUploading: uploadMutation.isPending,
    uploadingType: uploadMutation.variables?.type,
    isDeleting: deleteMutation.isPending,
  };
}

/**
 * Builds an authenticated image source for a progress photo. Photos are served
 * from an ownership-checked route (`/api/measurements/check-in-photos/file/:id`),
 * not a static mount, so the request must carry the auth + proxy headers.
 */
export function useCheckInPhotoSource() {
  const [config, setConfig] = useState<ServerConfig | null>(null);

  useFocusEffect(
    useCallback(() => {
      getActiveServerConfig().then(setConfig);
    }, []),
  );

  const getPhotoSource = useCallback(
    (photoId: string): { uri: string; headers: Record<string, string> } | null => {
      if (!config) return null;
      return {
        uri: `${normalizeUrl(config.url)}/api/measurements/check-in-photos/file/${photoId}`,
        headers: {
          ...proxyHeadersToRecord(config.proxyHeaders),
          ...getAuthHeaders(config),
        },
      };
    },
    [config],
  );

  return { getPhotoSource };
}
