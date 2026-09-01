import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ProgressPhotoCompareScreen from '../../src/screens/ProgressPhotoCompareScreen';
import { useCheckInPhotoGallery } from '../../src/hooks/useCheckInPhotos';
import { useCheckInPhotoSource } from '../../src/hooks/useCheckInPhotoSource';
import { usePreferences } from '../../src/hooks/usePreferences';
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

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

const day = (entry_date: string, weight: number | null): ProgressPhotoDay => ({
  entry_date,
  weight,
  photos: {
    front: {
      id: `${entry_date}-front`,
      entry_date,
      photo_type: 'front',
      weight,
    },
  },
});

const setGallery = (days: ProgressPhotoDay[], isLoading = false) => {
  mockUseGallery.mockReturnValue({
    days,
    isLoading,
    isError: false,
    error: null,
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useCheckInPhotoGallery>);
};

const renderScreen = (params: { angle?: 'front' | 'back' | 'side' } = {}) =>
  render(
    <ProgressPhotoCompareScreen
      navigation={
        navigation as unknown as React.ComponentProps<
          typeof ProgressPhotoCompareScreen
        >['navigation']
      }
      route={
        {
          key: 'ProgressPhotoCompare-key',
          name: 'ProgressPhotoCompare',
          params,
        } as unknown as React.ComponentProps<
          typeof ProgressPhotoCompareScreen
        >['route']
      }
    />
  );

describe('ProgressPhotoCompareScreen', () => {
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
    // Gallery order is newest-first, as the server returns it.
    setGallery([
      day('2026-03-20', 78),
      day('2026-03-10', 81),
      day('2026-03-01', 84),
    ]);
  });

  it('defaults to the widest span so it says something before any picking', () => {
    const { getByText } = renderScreen();

    // Oldest against newest: 84 kg -> 78 kg.
    expect(getByText('84 kg')).toBeTruthy();
    expect(getByText('78 kg')).toBeTruthy();
    expect(getByText('-6 kg')).toBeTruthy();
  });

  it('assigns a picked day to the selected side', () => {
    const { getByText, getAllByText, getByRole } = renderScreen();

    // 'Before' is both a pane label and a segment, so target the control by
    // its tab role rather than by text position.
    fireEvent.press(getByRole('tab', { name: 'Before' }));
    fireEvent.press(getAllByText('Mar 10')[0]);

    // Before moved to the middle shoot, so the delta narrows to 81 -> 78.
    expect(getByText('-3 kg')).toBeTruthy();
  });

  it('falls back when the picked day disappears from the gallery', () => {
    // Deleting a day's last photo elsewhere must not leave a pane pointing at
    // a photo that no longer exists.
    const { getByText, getAllByText, getByRole, rerender } = renderScreen();

    fireEvent.press(getByRole('tab', { name: 'Before' }));
    fireEvent.press(getAllByText('Mar 10')[0]);
    expect(getByText('-3 kg')).toBeTruthy();

    setGallery([day('2026-03-20', 78), day('2026-03-01', 84)]);
    rerender(
      <ProgressPhotoCompareScreen
        navigation={
          navigation as unknown as React.ComponentProps<
            typeof ProgressPhotoCompareScreen
          >['navigation']
        }
        route={
          {
            key: 'ProgressPhotoCompare-key',
            name: 'ProgressPhotoCompare',
            params: {},
          } as unknown as React.ComponentProps<
            typeof ProgressPhotoCompareScreen
          >['route']
        }
      />
    );

    expect(getByText('-6 kg')).toBeTruthy();
  });

  it('compares the angle it was opened for', () => {
    setGallery([
      {
        entry_date: '2026-03-20',
        weight: 78,
        photos: {
          back: {
            id: 'b2',
            entry_date: '2026-03-20',
            photo_type: 'back',
            weight: 78,
          },
        },
      },
      {
        entry_date: '2026-03-01',
        weight: 84,
        photos: {
          back: {
            id: 'b1',
            entry_date: '2026-03-01',
            photo_type: 'back',
            weight: 84,
          },
        },
      },
    ]);

    const { getByText } = renderScreen({ angle: 'back' });

    expect(getByText('-6 kg')).toBeTruthy();
  });

  it('omits the weight change when either side has no weight', () => {
    setGallery([day('2026-03-20', 78), day('2026-03-01', null)]);

    const { queryByText } = renderScreen();

    expect(queryByText('Weight change')).toBeNull();
  });
});
