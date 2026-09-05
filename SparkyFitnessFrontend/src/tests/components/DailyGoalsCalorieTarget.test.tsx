import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useState } from 'react';
import { DailyGoals } from '@/pages/Goals/DailyGoals';
import { DEFAULT_GOALS } from '@/constants/goals';
import type { ExpandedGoals } from '@/types/goals';

// The stored goal the server hands back for today. The user's own figure --
// what this page edits -- starts equal to it, so an edit is detectable.
const STORED_CALORIES = 2338;

const saveGoalsMock = jest.fn().mockResolvedValue(undefined);
const saveAllPreferencesMock = jest.fn().mockResolvedValue(undefined);
const preferencesMock = jest.fn();

jest.mock('@/hooks/Goals/useGoals', () => ({
  useDailyGoals: () => ({
    data: {
      ...jest.requireActual('@/constants/goals').DEFAULT_GOALS,
      calories: 2338,
    },
  }),
  useSaveGoalsMutation: () => ({
    mutateAsync: saveGoalsMock,
    isPending: false,
  }),
}));

jest.mock('@/contexts/PreferencesContext', () => ({
  usePreferences: () => preferencesMock(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { activeUserId: 'u1' } }),
}));

jest.mock('@/hooks/Foods/useCustomNutrients', () => ({
  useCustomNutrients: () => ({ data: [] }),
}));

// The Save button is gated on the meal split adding up to 100%, so the four
// default meals have to be present for the form to be submittable at all.
jest.mock('@/hooks/Diary/useMealTypes', () => ({
  useMealTypes: () => ({
    data: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((name, i) => ({
      id: String(i),
      name,
      is_visible: true,
    })),
  }),
}));

jest.mock('@/hooks/Goals/useNutrientAutoCalculate', () => ({
  useNutrientAutoCalculate: () => ({
    algorithms: {},
    autoCalculateUserData: null,
    goalTypePreferences: {},
    eligibleIds: [],
    selected: [],
    toggleSelected: jest.fn(),
    selectAll: jest.fn(),
    selectNone: jest.fn(),
    applySelected: jest.fn(),
  }),
}));

function Harness() {
  const [goals, setGoals] = useState<ExpandedGoals>({
    ...DEFAULT_GOALS,
    calories: STORED_CALORIES,
  });
  return (
    <DailyGoals
      goals={goals}
      setGoals={setGoals}
      visibleNutrients={['calories', 'protein', 'carbs', 'fat']}
      today="2026-01-15"
    />
  );
}

const PIN_NOTICE = /switch your goal mode to Manual/i;

function setPreferences(overrides: Record<string, unknown> = {}) {
  preferencesMock.mockReturnValue({
    energyUnit: 'kcal',
    convertEnergy: (value: number) => value,
    getEnergyUnitString: () => 'kcal',
    goalMode: 'cut',
    goalModeCalculationMethod: 'adaptive',
    goalModeCustomPercentage: 0,
    saveAllPreferences: saveAllPreferencesMock,
    ...overrides,
  });
}

function typeCalories(value: string) {
  fireEvent.change(screen.getByLabelText(/Calories/i), {
    target: { value },
  });
}

function saveGoals() {
  fireEvent.click(screen.getByRole('button', { name: /Save Goals/i }));
}

describe('DailyGoals explicit calorie target (issue #2283)', () => {
  beforeEach(() => {
    saveGoalsMock.mockClear();
    saveAllPreferencesMock.mockClear();
    setPreferences();
  });

  it('pins the goal when the typed figure would be overridden by the engine', async () => {
    render(<Harness />);
    expect(screen.queryByText(PIN_NOTICE)).not.toBeInTheDocument();

    typeCalories('1600');
    expect(screen.getByText(PIN_NOTICE)).toBeInTheDocument();

    saveGoals();

    await waitFor(() => {
      expect(saveGoalsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          goals: expect.objectContaining({ calories: 1600 }),
        })
      );
    });
    expect(saveAllPreferencesMock).toHaveBeenCalledWith({
      goalMode: 'manual',
      goalModeCalculationMethod: 'manual',
      goalModeCustomPercentage: 0,
    });
  });

  it('leaves the settings alone when the calorie figure is untouched', async () => {
    render(<Harness />);

    // Saving this page is not on its own a claim about the calorie target;
    // someone on an adaptive goal may just be adjusting their macros.
    saveGoals();

    await waitFor(() => expect(saveGoalsMock).toHaveBeenCalled());
    expect(saveAllPreferencesMock).not.toHaveBeenCalled();
    expect(screen.queryByText(PIN_NOTICE)).not.toBeInTheDocument();
  });

  it('stays quiet for settings that already serve the stored goal as-is', async () => {
    setPreferences({
      goalMode: 'maintain',
      goalModeCalculationMethod: 'manual',
    });
    render(<Harness />);

    typeCalories('1600');
    expect(screen.queryByText(PIN_NOTICE)).not.toBeInTheDocument();

    saveGoals();

    await waitFor(() => expect(saveGoalsMock).toHaveBeenCalled());
    expect(saveAllPreferencesMock).not.toHaveBeenCalled();
  });
});
