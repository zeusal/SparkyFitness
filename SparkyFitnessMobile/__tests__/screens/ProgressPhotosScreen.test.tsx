import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ProgressPhotosScreen from '../../src/screens/ProgressPhotosScreen';
import { useCheckInPhotoGallery } from '../../src/hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../../src/hooks/useCheckInPhotoSource';
import { usePreferences } from '../../src/hooks/usePreferences';
import { useScreenHeader } from '../../src/hooks/useScreenHeader';
import type { ProgressPhotoDay } from '../../src/types/checkInPhotos';

jest.mock('../../src/hooks/useCheckInPhotos', () => ({
  useCheckInPhotoGallery: jest.fn(),
}));
jest.mock('../../src/hooks/useCheckInPhotoSource', () => ({
  useCheckInPhotoSource: jest.fn(),
}));
jest.mock('../../src/hooks/usePreferences', () => ({
  usePreferences: jest.fn(),
}));
jest.mock('../../src/hooks/useScreenHeader', () => ({
  useScreenHeader: jest.fn(() => null),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockUseGallery = useCheckInPhotoGallery as jest.MockedFunction<
  typeof useCheckInPhotoGallery
>;
const mockUseSource = useCheckInPhotoSource as jest.MockedFunction<
  typeof useCheckInPhotoSource
>;
const mockUsePreferences = usePreferences as jest.MockedFunction<
  typeof usePreferences
>;
const mockUseScreenHeader = useScreenHeader as jest.MockedFunction<
  typeof useScreenHeader
>;

const navigation = { navigate: jest.fn(), goBack: jest.fn() };
const route = { key: 'ProgressPhotos-key', name: 'ProgressPhotos' as const };

const dayWith = (
  entry_date: string,
  weight: number | null,
  angles: ('front' | 'back' | 'side')[] = ['front']
): ProgressPhotoDay => ({
  entry_date,
  weight,
  photos: Object.fromEntries(
    angles.map((angle) => [
      angle,
      { id: `${entry_date}-${angle}`, entry_date, photo_type: angle, weight },
    ])
  ),
});

const setGallery = (
  days: ProgressPhotoDay[],
  extra: { isLoading?: boolean; isError?: boolean } = {}
) => {
  mockUseGallery.mockReturnValue({
    days,
    isLoading: extra.isLoading ?? false,
    isError: extra.isError ?? false,
    error: null,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useCheckInPhotoGallery>);
};

const renderScreen = () =>
  render(
    <ProgressPhotosScreen
      navigation={
        navigation as unknown as React.ComponentProps<
          typeof ProgressPhotosScreen
        >['navigation']
      }
      route={
        route as unknown as React.ComponentProps<
          typeof ProgressPhotosScreen
        >['route']
      }
    />
  );

describe('ProgressPhotosScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSource.mockReturnValue({
      getPhotoSource: jest.fn((id: string) => ({
        uri: `https://x/${id}`,
        headers: {},
      })),
      isReady: true,
    } as unknown as ReturnType<typeof useCheckInPhotoSource>);
    mockUsePreferences.mockReturnValue({
      preferences: { default_weight_unit: 'kg' },
    } as unknown as ReturnType<typeof usePreferences>);
    setGallery([dayWith('2026-03-20', 80), dayWith('2026-03-01', 84)]);
  });

  it('lists a row per day with that day’s weight', () => {
    const { getByText } = renderScreen();

    expect(getByText('80 kg')).toBeTruthy();
    expect(getByText('84 kg')).toBeTruthy();
  });

  it('shows the change against the previous shoot, not against the first', () => {
    // A pile of dated pictures is not progression; the delta is what makes the
    // list read as one.
    const { getByText } = renderScreen();

    expect(getByText('-4 kg since previous')).toBeTruthy();
  });

  it('shows only the selected angle and switches with the control', () => {
    setGallery([
      dayWith('2026-03-20', 80, ['front']),
      dayWith('2026-03-01', 84, ['back']),
    ]);

    const { getByText, queryByText } = renderScreen();

    // Front is the default, so only the front day has a row.
    expect(getByText('80 kg')).toBeTruthy();
    expect(queryByText('84 kg')).toBeNull();

    fireEvent.press(getByText('Back'));

    expect(getByText('84 kg')).toBeTruthy();
    expect(queryByText('80 kg')).toBeNull();
  });

  it('opens the comparison for the angle being viewed', () => {
    const { getByText } = renderScreen();

    fireEvent.press(getByText('Compare'));

    expect(navigation.navigate).toHaveBeenCalledWith('ProgressPhotoCompare', {
      angle: 'front',
    });
  });

  it('opens the time-lapse for the angle being viewed', () => {
    const { getByText } = renderScreen();

    fireEvent.press(getByText('Time-lapse'));

    expect(navigation.navigate).toHaveBeenCalledWith('ProgressPhotoTimelapse', {
      angle: 'front',
    });
  });

  it('leaves compare and time-lapse inert with a single shoot', () => {
    // Both need two photos of the angle to say anything.
    setGallery([dayWith('2026-03-20', 80)]);

    const { getByText } = renderScreen();

    fireEvent.press(getByText('Compare'));
    fireEvent.press(getByText('Time-lapse'));

    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('offers capture from the header', () => {
    renderScreen();

    const config = mockUseScreenHeader.mock.calls[0][0] as unknown as {
      right?: { onPress?: () => void };
    };
    config.right?.onPress?.();

    expect(navigation.navigate).toHaveBeenCalledWith(
      'ProgressPhotoCapture',
      {}
    );
  });

  it('prompts to add photos when the angle has none', () => {
    setGallery([]);

    const { getByText } = renderScreen();

    expect(getByText('No front photos yet')).toBeTruthy();
  });

  it('surfaces a load failure instead of an empty timeline', () => {
    setGallery([], { isError: true });

    const { getByText } = renderScreen();

    expect(getByText("Couldn't load your progress photos.")).toBeTruthy();
  });

  it('says when a day has no weight rather than showing a blank', () => {
    setGallery([dayWith('2026-03-20', null)]);

    const { getByText } = renderScreen();

    expect(getByText('No weight logged')).toBeTruthy();
  });
});
