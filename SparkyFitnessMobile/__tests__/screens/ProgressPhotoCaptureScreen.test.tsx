import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import ProgressPhotoCaptureScreen from '../../src/screens/ProgressPhotoCaptureScreen';
import {
  useCheckInPhotoDates,
  useCheckInPhotoMutations,
  useCheckInPhotosByDate,
} from '../../src/hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../../src/hooks/useCheckInPhotoSource';
import { useScreenHeader } from '../../src/hooks/useScreenHeader';
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
const mockUseScreenHeader = useScreenHeader as jest.MockedFunction<
  typeof useScreenHeader
>;
const mockCamera = pickImageFromCamera as jest.MockedFunction<
  typeof pickImageFromCamera
>;
const mockLibrary = pickImagesFromLibrary as jest.MockedFunction<
  typeof pickImagesFromLibrary
>;

const uploadAsync = jest.fn();
const deleteAsync = jest.fn();
const dispatch = jest.fn();
let beforeRemoveHandler: ((event: unknown) => void) | null = null;
const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch,
  addListener: jest.fn((event: string, handler: (e: unknown) => void) => {
    if (event === 'beforeRemove') beforeRemoveHandler = handler;
    return () => {
      beforeRemoveHandler = null;
    };
  }),
};

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

/** The header is mocked away, so Save is reached through its descriptor. */
const headerRight = () =>
  (
    mockUseScreenHeader.mock.calls[
      mockUseScreenHeader.mock.calls.length - 1
    ][0] as unknown as {
      right?: { onPress?: () => void; disabled?: boolean };
    }
  ).right;

const save = () => headerRight()?.onPress?.();

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

const stageFromCamera = (uri: string) => {
  mockCamera.mockResolvedValue({
    status: 'ok',
    image: { uri },
  } as unknown as Awaited<ReturnType<typeof pickImageFromCamera>>);
};

describe('ProgressPhotoCaptureScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    beforeRemoveHandler = null;
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

  it('stages a pick instead of uploading it', async () => {
    // The whole point of the manual save: a shoot is three photos, and each
    // one uploading as it is chosen means three round trips and a half-written
    // day if the user walks away.
    stageFromCamera('file:///front.jpg');

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));

    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());
    expect(uploadAsync).not.toHaveBeenCalled();
  });

  it('sends the staged photo only once Save is pressed', async () => {
    stageFromCamera('file:///front.jpg');

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    save();

    await waitFor(() =>
      expect(uploadAsync).toHaveBeenCalledWith({
        date: '2026-03-15',
        type: 'front',
        uri: 'file:///front.jpg',
      })
    );
  });

  it('keeps Save inert until something is staged', async () => {
    stageFromCamera('file:///front.jpg');

    const { getByLabelText, getByText } = renderScreen();

    expect(headerRight()?.disabled).toBe(true);

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));

    await waitFor(() => expect(headerRight()?.disabled).toBe(false));
  });

  it('stages against the angle whose tab is open', async () => {
    stageFromCamera('file:///side.jpg');

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByText('Side'));
    fireEvent.press(getByLabelText('Add Side photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    save();

    await waitFor(() =>
      expect(uploadAsync).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'side' })
      )
    );
  });

  it('shows one angle at a time rather than a scrolling stack', () => {
    const { queryByLabelText } = renderScreen();

    expect(queryByLabelText('Add Front photo')).toBeTruthy();
    expect(queryByLabelText('Add Back photo')).toBeNull();
    expect(queryByLabelText('Add Side photo')).toBeNull();
  });

  it('overwrites a saved photo without needing it removed first', async () => {
    // Replacing used to mean delete, then pick. The upload upserts, so the
    // pick alone is enough and no delete is issued.
    setPhotos([frontPhoto]);
    stageFromCamera('file:///new-front.jpg');

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Replace Front photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    save();

    await waitFor(() =>
      expect(uploadAsync).toHaveBeenCalledWith({
        date: '2026-03-15',
        type: 'front',
        uri: 'file:///new-front.jpg',
      })
    );
    expect(deleteAsync).not.toHaveBeenCalled();
  });

  it('queues the delete of a saved photo until Save', async () => {
    setPhotos([frontPhoto]);

    const { getByLabelText, getAllByText } = renderScreen();

    fireEvent.press(getAllByText('Remove Photo')[0]);

    // The slot empties immediately even though the server still holds the
    // photo; nothing is deleted until Save runs.
    expect(getByLabelText('Add Front photo')).toBeTruthy();
    expect(deleteAsync).not.toHaveBeenCalled();

    save();

    await waitFor(() =>
      expect(deleteAsync).toHaveBeenCalledWith('photo-front')
    );
  });

  it('drops a staged pick without touching the server', async () => {
    stageFromCamera('file:///front.jpg');

    const { getByLabelText, getByText, getAllByText, queryByText } =
      renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    fireEvent.press(getAllByText('Remove Photo')[0]);

    await waitFor(() => expect(queryByText('Not saved yet')).toBeNull());
    expect(deleteAsync).not.toHaveBeenCalled();
    expect(headerRight()?.disabled).toBe(true);
  });

  it('does not offer remove on an empty slot', () => {
    const { getByLabelText, queryByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));

    expect(queryByText('Remove Photo')).toBeNull();
  });

  it('saves every staged angle in one pass', async () => {
    const { getByLabelText, getByText } = renderScreen();

    stageFromCamera('file:///front.jpg');
    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    stageFromCamera('file:///back.jpg');
    fireEvent.press(getByText('Back'));
    fireEvent.press(getByLabelText('Add Back photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    save();

    await waitFor(() => expect(uploadAsync).toHaveBeenCalledTimes(2));
    expect(uploadAsync).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'front', uri: 'file:///front.jpg' })
    );
    expect(uploadAsync).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'back', uri: 'file:///back.jpg' })
    );
  });

  it('keeps a failed photo staged so a retry is not a re-shoot', async () => {
    stageFromCamera('file:///front.jpg');
    uploadAsync.mockRejectedValue(new Error('offline'));

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    save();

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text1: 'Could not save every photo',
        })
      )
    );
    expect(getByText('Not saved yet')).toBeTruthy();
    expect(headerRight()?.disabled).toBe(false);
  });

  it('explains a denied camera permission instead of failing silently', async () => {
    mockCamera.mockResolvedValue({ status: 'denied' } as unknown as Awaited<
      ReturnType<typeof pickImageFromCamera>
    >);

    const { getByLabelText, getByText, queryByText } = renderScreen();

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
    expect(queryByText('Not saved yet')).toBeNull();
  });

  it('stages nothing when the picker is cancelled', async () => {
    mockCamera.mockResolvedValue({ status: 'cancelled' } as unknown as Awaited<
      ReturnType<typeof pickImageFromCamera>
    >);

    const { getByLabelText, getByText, queryByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));

    await waitFor(() => expect(mockCamera).toHaveBeenCalled());
    expect(queryByText('Not saved yet')).toBeNull();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('stages a library pick', async () => {
    mockLibrary.mockResolvedValue([
      { uri: 'file:///lib.jpg' },
    ] as unknown as Awaited<ReturnType<typeof pickImagesFromLibrary>>);

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Choose from Library'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    save();

    await waitFor(() =>
      expect(uploadAsync).toHaveBeenCalledWith(
        expect.objectContaining({ uri: 'file:///lib.jpg' })
      )
    );
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

  it('asks before leaving with photos that were never saved', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    stageFromCamera('file:///front.jpg');

    const { getByLabelText, getByText } = renderScreen();

    fireEvent.press(getByLabelText('Add Front photo'));
    fireEvent.press(getByText('Take Photo'));
    await waitFor(() => expect(getByText('Not saved yet')).toBeTruthy());

    const preventDefault = jest.fn();
    beforeRemoveHandler?.({
      preventDefault,
      data: { action: { type: 'POP' } },
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('lets a clean screen close without a prompt', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    renderScreen();

    const preventDefault = jest.fn();
    beforeRemoveHandler?.({
      preventDefault,
      data: { action: { type: 'POP' } },
    });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
