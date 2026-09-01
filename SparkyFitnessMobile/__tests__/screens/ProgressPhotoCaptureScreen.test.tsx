import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import ProgressPhotoCaptureScreen from '../../src/screens/ProgressPhotoCaptureScreen';
import {
  useCheckInPhotoDates,
  useCheckInPhotoMutations,
  useCheckInPhotosByDate,
} from '../../src/hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../../src/hooks/useCheckInPhotoSource';
import {
  pickImageFromCamera,
  pickImagesFromLibrary,
} from '../../src/utils/pickImage';
import type { CheckInPhoto } from '../../src/types/checkInPhotos';

jest.mock('../../src/hooks/useCheckInPhotos', () => ({
  useCheckInPhotoDates: jest.fn(),
  useCheckInPhotoMutations: jest.fn(),
  useCheckInPhotosByDate: jest.fn(),
}));
jest.mock('../../src/hooks/useCheckInPhotoSource', () => ({
  useCheckInPhotoSource: jest.fn(),
}));
jest.mock('../../src/utils/pickImage', () => ({
  pickImageFromCamera: jest.fn(),
  pickImagesFromLibrary: jest.fn(),
}));
// CalendarSheet's locale presentation reads preferences, which needs a
// QueryClient this render tree does not have.
jest.mock('../../src/hooks/usePreferences', () => ({
  usePreferences: jest.fn(() => ({
    preferences: { default_weight_unit: 'kg' },
  })),
}));
jest.mock('../../src/hooks/useScreenHeader', () => ({
  useScreenHeader: jest.fn(() => null),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockUseByDate = useCheckInPhotosByDate as jest.MockedFunction<
  typeof useCheckInPhotosByDate
>;
const mockUseDates = useCheckInPhotoDates as jest.MockedFunction<
  typeof useCheckInPhotoDates
>;
const mockUseMutations = useCheckInPhotoMutations as jest.MockedFunction<
  typeof useCheckInPhotoMutations
>;
const mockUseSource = useCheckInPhotoSource as jest.MockedFunction<
  typeof useCheckInPhotoSource
>;
const mockCamera = pickImageFromCamera as jest.MockedFunction<
  typeof pickImageFromCamera
>;
const mockLibrary = pickImagesFromLibrary as jest.MockedFunction<
  typeof pickImagesFromLibrary
>;

const uploadAsync = jest.fn();
const deleteAsync = jest.fn();
const navigation = { navigate: jest.fn(), goBack: jest.fn() };

const frontPhoto: CheckInPhoto = {
  id: 'photo-front',
  user_id: 'user-1',
  check_in_measurement_id: null,
  entry_date: '2026-03-15',
  photo_type: 'front',
  file_path: 'uploads/check-in/user-1/2026-03-15/front.jpg',
  created_at: '2026-03-15T10:00:00.000Z',
};

const setPhotos = (photos: CheckInPhoto[]) => {
  mockUseByDate.mockReturnValue({
    photos,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useCheckInPhotosByDate>);
};

const renderScreen = () =>
  render(
    <ProgressPhotoCaptureScreen
      navigation={
        navigation as unknown as React.ComponentProps<
          typeof ProgressPhotoCaptureScreen
        >['navigation']
      }
      route={
        {
          key: 'ProgressPhotoCapture-key',
          name: 'ProgressPhotoCapture',
          params: { date: '2026-03-15' },
        } as unknown as React.ComponentProps<
          typeof ProgressPhotoCaptureScreen
        >['route']
      }
    />
  );

describe('ProgressPhotoCaptureScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    uploadAsync.mockResolvedValue(undefined);
    deleteAsync.mockResolvedValue(undefined);
    mockUseMutations.mockReturnValue({
      uploadAsync,
      isUploading: false,
      uploadingType: undefined,
      deleteAsync,
      isDeleting: false,
    } as unknown as ReturnType<typeof useCheckInPhotoMutations>);
    mockUseDates.mockReturnValue({ dates: [], isLoading: false });
    mockUseSource.mockReturnValue({
      getPhotoSource: jest.fn((id: string) => ({
        uri: `https://x/${id}`,
        headers: {},
      })),
      isReady: true,
    } as unknown as ReturnType<typeof useCheckInPhotoSource>);
    setPhotos([]);
  });

  it('uploads a camera photo against the slot it was opened from', async () => {
    mockCamera.mockResolvedValue({
      status: 'ok',
      image: { uri: 'file:///front.jpg' },
    } as unknown as Awaited<ReturnType<typeof pickImageFromCamera>>);

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Side photo'));
    fireEvent.press(getByText('Take Photo'));

    await waitFor(() =>
      expect(uploadAsync).toHaveBeenCalledWith({
        date: '2026-03-15',
        type: 'side',
        uri: 'file:///front.jpg',
      })
    );
  });

  it('uploads a library pick', async () => {
    mockLibrary.mockResolvedValue([
      { uri: 'file:///lib.jpg' },
    ] as unknown as Awaited<ReturnType<typeof pickImagesFromLibrary>>);

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Choose from Library'));

    await waitFor(() =>
      expect(uploadAsync).toHaveBeenCalledWith({
        date: '2026-03-15',
        type: 'front',
        uri: 'file:///lib.jpg',
      })
    );
  });

  it('offers replace and remove once the slot has a photo', async () => {
    setPhotos([frontPhoto]);

    const { getByLabelText, getAllByText } = renderScreen();

    fireEvent.press(getByLabelText('Replace Front photo'));
    fireEvent.press(getAllByText('Remove Photo')[0]);

    await waitFor(() =>
      expect(deleteAsync).toHaveBeenCalledWith('photo-front')
    );
  });

  it('does not offer remove on an empty slot', () => {
    const { getByLabelText, queryByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));

    expect(queryByText('Remove Photo')).toBeNull();
  });

  it('explains a denied camera permission instead of failing silently', async () => {
    mockCamera.mockResolvedValue({ status: 'denied' } as unknown as Awaited<
      ReturnType<typeof pickImageFromCamera>
    >);

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text1: 'Camera permission is required',
        })
      )
    );
    expect(uploadAsync).not.toHaveBeenCalled();
  });

  it('uploads nothing when the picker is cancelled', async () => {
    mockCamera.mockResolvedValue({ status: 'cancelled' } as unknown as Awaited<
      ReturnType<typeof pickImageFromCamera>
    >);

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));

    await waitFor(() => expect(mockCamera).toHaveBeenCalled());
    expect(uploadAsync).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('opens only one picker when the slot is double-tapped', async () => {
    // The picker is a native modal, so a second concurrent open leaves a
    // stranded sheet the user has to dismiss twice.
    let release: (value: unknown) => void = () => {};
    mockCamera.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }) as unknown as ReturnType<typeof pickImageFromCamera>
    );

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));
    fireEvent.press(getByText('Take Photo'));

    expect(mockCamera).toHaveBeenCalledTimes(1);

    release({ status: 'cancelled' });
    await waitFor(() => expect(mockCamera).toHaveBeenCalledTimes(1));
  });
});
