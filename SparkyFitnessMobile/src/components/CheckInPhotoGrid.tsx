import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useCSSVariable } from 'uniwind';
import Icon from './Icon';
import SafeImage from './SafeImage';
import {
  useCheckInPhotos,
  useCheckInPhotoSource,
  type PhotoAsset,
} from '../hooks/useCheckInPhotos';
import type { PhotoType } from '../types/checkInPhotos';

interface CheckInPhotoGridProps {
  selectedDate: string;
  enabled?: boolean;
}

const PHOTO_TYPES: { type: PhotoType; label: string }[] = [
  { type: 'front', label: 'Front' },
  { type: 'back', label: 'Back' },
  { type: 'side', label: 'Side' },
];

// Mirror the server's multer limit so oversized files fail fast.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const CheckInPhotoGrid: React.FC<CheckInPhotoGridProps> = ({
  selectedDate,
  enabled = true,
}) => {
  const [textMuted, borderSubtle, destructive] = useCSSVariable([
    '--color-text-muted',
    '--color-border-subtle',
    '--color-icon-danger',
  ]) as [string, string, string];

  const {
    photos,
    uploadPhoto,
    deletePhoto,
    isUploading,
    uploadingType,
    isDeleting,
  } = useCheckInPhotos(selectedDate, enabled);
  const { getPhotoSource } = useCheckInPhotoSource();

  const photoMap = useMemo(
    () => new Map(photos.map((p) => [p.photo_type, p])),
    [photos],
  );

  const disabled = isUploading || isDeleting;

  const handleAsset = (type: PhotoType, result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets?.[0]) return;
    const a = result.assets[0];
    if (a.fileSize != null && a.fileSize > MAX_UPLOAD_BYTES) {
      Toast.show({
        type: 'error',
        text1: 'Image too large',
        text2: 'Please choose an image under 10 MB.',
      });
      return;
    }
    const asset: PhotoAsset = {
      uri: a.uri,
      mimeType: a.mimeType,
      fileName: a.fileName,
      fileSize: a.fileSize,
    };
    uploadPhoto(type, asset);
  };

  const pickFromLibrary = async (type: PhotoType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    handleAsset(type, result);
  };

  const takePhoto = async (type: PhotoType) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Camera unavailable',
        text2: 'Grant camera access in Settings to take a photo.',
      });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    handleAsset(type, result);
  };

  const promptForPhoto = (type: PhotoType) => {
    if (disabled) return;
    Alert.alert('Add photo', undefined, [
      { text: 'Take Photo', onPress: () => void takePhoto(type) },
      { text: 'Choose from Library', onPress: () => void pickFromLibrary(type) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="bg-surface rounded-xl p-4 mb-3 shadow-sm">
      <Text className="text-md font-bold text-text-primary mb-1">
        Progress Photos
      </Text>
      <Text className="text-text-secondary text-xs mb-3">
        Track your physique over time with front, back, and side photos.
      </Text>

      <View className="flex-row gap-2">
        {PHOTO_TYPES.map(({ type, label }) => {
          const photo = photoMap.get(type);
          const source = photo ? getPhotoSource(photo.id) : null;
          const slotUploading = isUploading && uploadingType === type;

          return (
            <View key={type} className="flex-1">
              <Text className="text-text-secondary text-xs text-center mb-1">
                {label}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={disabled}
                onPress={() => promptForPhoto(type)}
                style={{
                  aspectRatio: 3 / 4,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: borderSubtle,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {source ? (
                  <SafeImage
                    source={source}
                    style={{ width: '100%', height: '100%' }}
                    fallback={
                      <Icon name="photo-library" size={28} color={textMuted} />
                    }
                  />
                ) : (
                  <Icon name="camera" size={28} color={textMuted} />
                )}

                {slotUploading && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.35)',
                    }}
                  >
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </TouchableOpacity>

              {photo && (
                <TouchableOpacity
                  className="flex-row items-center justify-center mt-1.5 py-1"
                  disabled={disabled}
                  onPress={() => deletePhoto(photo.id)}
                  accessibilityLabel={`Delete ${label} photo`}
                >
                  <Icon name="trash" size={14} color={destructive || '#EF4444'} />
                  <Text
                    className="text-xs ml-1"
                    style={{ color: destructive || '#EF4444' }}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CheckInPhotoGrid;
