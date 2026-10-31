import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DiaryScreen from '../../src/screens/DiaryScreen';
import { useDailySummary } from '../../src/hooks';
import { EMPTY_SUPPLEMENT_TOTALS } from '@workspace/shared';
import {
  createTestQueryClient,
  createQueryWrapper,
} from '../hooks/queryTestUtils';
import type { CheckInPhoto } from '../../src/types/checkInPhotos';

jest.mock('../../src/hooks', () => ({
  useServerConnection: () => ({ isConnected: true }),
  useDailySummary: jest.fn(),
  useCustomNutrients: () => ({ customNutrients: [] }),
  useNutrientDisplayPreferences: () => ({ preferences: [] }),
  useMealTypes: () => ({ mealTypes: [], isLoading: false, isError: false }),
  useFamilyUsers: () => ({ data: [] }),
}));

jest.mock('../../src/hooks/useMeasurements', () => ({
  useMeasurements: () => ({ measurements: null, customMeasurements: [] }),
}));
// Settled and empty, like sleep below: the screen keeps a day with nothing on it behind
// its loading state until every query has answered, and the real ones would stay
// pending against the test client.
jest.mock('../../src/hooks/useCustomMeasurements', () => ({
  useCustomMeasurementsByDate: () => ({
    data: [],
    isLoading: false,
    isFetched: true,
    refetch: jest.fn(),
  }),
}));
jest.mock('../../src/hooks/useActiveWorkoutPlan', () => ({
  useActiveWorkoutPlans: () => ({
    plan: null,
    plans: [],
    isLoading: false,
    isFetched: true,
  }),
}));

// Sleep is settled and empty throughout: this suite is about the photo arm of the
// predicate, and an unmocked query would stay pending and hide the day behind the
// screen's loading gate.
jest.mock('../../src/hooks/useSleepDay', () => ({
  useSleepDay: () => ({
    wakeUp: null,
    naps: [],
    bedTime: null,
    isLoading: false,
    isError: false,
    isForbidden: false,
    refetch: jest.fn(),
  }),
}));

const mockPhotosByDate = jest.fn(() => ({
  photos: [] as CheckInPhoto[],
  isLoading: false,
}));
jest.mock('../../src/hooks/useCheckInPhotos', () => ({
  useCheckInPhotoDates: () => ({ dates: [], isLoading: false }),
  useCheckInPhotosByDate: () => mockPhotosByDate(),
}));

jest.mock('../../src/hooks/useCheckInPhotoSource', () => ({
  useCheckInPhotoSource: () => ({
    getPhotoSource: (id: string) => ({ uri: `https://x/${id}`, headers: {} }),
    isReady: true,
  }),
}));

jest.mock('../../src/hooks/usePreferences', () => ({
  usePreferences: () => ({ preferences: null }),
}));

jest.mock('../../src/hooks/useExerciseImageSource', () => ({
  useExerciseImageSource: () => ({ getImageSource: () => undefined }),
}));

jest.mock('../../src/hooks/useHeaderActionColors', () => ({
  useHeaderActionColors: () => ({}),
}));

jest.mock('../../src/services/nativeTabBarPreference', () => ({
  useNativeIOSTabsActive: () => false,
}));

jest.mock('../../src/stores/activeWorkoutStore', () => ({
  useActiveWorkoutStore: () => null,
}));

jest.mock('../../src/stores/diaryDateStore', () => ({
  useDiaryDateStore: (selector: (state: unknown) => unknown) =>
    selector({ selectedDate: '2026-08-12', setSelectedDate: jest.fn() }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: () => undefined,
  useNavigation: () => mockNavigation,
}));

jest.mock('../../src/components/ActiveWorkoutBar', () => ({
  useActiveWorkoutBarPadding: () => 0,
}));

jest.mock('../../src/components/Icon', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ name }: { name: string }) => <View testID={`icon-${name}`} />,
  };
});

const mockNavigation = {
  setOptions: jest.fn(),
  goBack: jest.fn(),
  navigate: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  setParams: jest.fn(),
  getParent: jest.fn(() => undefined),
  isFocused: jest.fn(() => true),
} as never;

const mockUseDailySummary = useDailySummary as jest.MockedFunction<
  typeof useDailySummary
>;

const DATE = '2026-08-12';

const photo = (): CheckInPhoto => ({
  id: `${DATE}-front`,
  user_id: 'u1',
  check_in_measurement_id: null,
  entry_date: DATE,
  photo_type: 'front',
  file_path: 'uploads/front.jpg',
  created_at: `${DATE}T00:00:00Z`,
});

function emptySummary() {
  return {
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
    summary: {
      date: DATE,
      calorieGoal: 0,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      activeCalories: 0,
      otherExerciseCalories: 0,
      stepCalories: 0,
      exerciseMinutes: 0,
      exerciseMinutesGoal: 0,
      exerciseCaloriesGoal: 0,
      netCalories: 0,
      remainingCalories: 0,
      protein: { consumed: 0, goal: 0 },
      carbs: { consumed: 0, goal: 0 },
      fat: { consumed: 0, goal: 0 },
      fiber: { consumed: 0, goal: 0 },
      waterConsumed: 0,
      waterGoal: 2500,
      foodEntries: [],
      supplementTotals: EMPTY_SUPPLEMENT_TOTALS,
      exerciseEntries: [],
      calorieBalance: { eaten: 0, burned: 0, remaining: 0, goal: 0 },
      goals: {},
      customNutrientTotals: {},
      customNutrientGoals: {},
    },
  } as unknown as ReturnType<typeof useDailySummary>;
}

const renderDiary = () => {
  const Wrapper = createQueryWrapper(createTestQueryClient());
  return render(
    <Wrapper>
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <DiaryScreen navigation={mockNavigation} route={{} as never} />
      </SafeAreaProvider>
    </Wrapper>
  );
};

/**
 * A progress photo is something the user recorded for the day, so it defeats the empty
 * state exactly as a logged supplement does. The photo summary shows on every day, so a
 * predicate that ignored photos would put "No entries recorded for this day" above the
 * very photos taken that day.
 */
describe('DiaryScreen on a photo-only day', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDailySummary.mockReturnValue(emptySummary());
    mockPhotosByDate.mockReturnValue({ photos: [], isLoading: false });
  });

  it('does not call the day empty when only a photo was recorded', () => {
    mockPhotosByDate.mockReturnValue({ photos: [photo()], isLoading: false });
    renderDiary();

    expect(screen.queryByText('No entries recorded for this day')).toBeNull();
  });

  it('shows that day its photos without the empty message above them', () => {
    mockPhotosByDate.mockReturnValue({ photos: [photo()], isLoading: false });
    renderDiary();

    expect(screen.getByText('Progress photos')).toBeTruthy();
    expect(screen.queryByText('No entries recorded for this day')).toBeNull();
  });

  it('still shows the empty day when nothing at all was recorded', () => {
    // The other half of the rule: no photos must not defeat the empty state.
    renderDiary();

    expect(screen.getByText('No entries recorded for this day')).toBeTruthy();
  });

  it('keeps the photo prompt under the empty message, so a photo can still be added', () => {
    renderDiary();

    expect(screen.getByText('No entries recorded for this day')).toBeTruthy();
    expect(screen.getByText('Tap to add photos')).toBeTruthy();
  });

  it('holds the day behind the loading state while the photos are still loading', () => {
    // Ungated, a day with photos flashes the empty message until they land; and showing
    // the add prompts meanwhile flashes them before the empty message joins them.
    mockPhotosByDate.mockReturnValue({ photos: [], isLoading: true });
    renderDiary();

    expect(screen.getByText('Loading diary...')).toBeTruthy();
    expect(screen.queryByText('No entries recorded for this day')).toBeNull();
    expect(screen.queryByText('Tap to add photos')).toBeNull();
  });
});
