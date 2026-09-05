import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalPlan from '@/components/Onboarding/PersonalPlan';
import type { OnboardingData } from '@/types/onboarding';

const saveAllPreferencesMock = jest.fn().mockResolvedValue(undefined);
const saveGoalsMock = jest.fn().mockResolvedValue(undefined);
const submitOnboardingMock = jest.fn().mockResolvedValue(undefined);

jest.mock('@/contexts/PreferencesContext', () => ({
  usePreferences: () => ({
    convertEnergy: (value: number) => value,
    getEnergyUnitString: () => 'kcal',
    saveAllPreferences: saveAllPreferencesMock,
    fatBreakdownAlgorithm: 'standard',
    mineralCalculationAlgorithm: 'standard',
    vitaminCalculationAlgorithm: 'standard',
    sugarCalculationAlgorithm: 'standard',
    energyUnit: 'kcal',
    calorieSafetyFloorMode: 'standard',
    calorieSafetyFloorValue: 1500,
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { activeUserId: 'u1' } }),
}));

jest.mock('@/hooks/Goals/useGoals', () => ({
  useSaveGoalsMutation: () => ({ mutateAsync: saveGoalsMock }),
  // Reached through the "save as preset" dialog this screen mounts.
  useCreatePresetMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
}));

jest.mock('@/hooks/Onboarding/useOnboarding', () => ({
  useSubmitOnboarding: () => ({
    mutateAsync: submitOnboardingMock,
    isPending: false,
  }),
}));

jest.mock('@/hooks/CheckIn/useCheckIn', () => ({
  useSaveCheckInMeasurementsMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('@/hooks/Settings/useProfile', () => ({
  useUpdateProfileMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('@/hooks/Foods/useCustomNutrients', () => ({
  useCustomNutrients: () => ({ data: [] }),
}));

const formData: OnboardingData = {
  sex: 'male',
  primaryGoal: 'lose_weight',
  currentWeight: 80,
  height: 178,
  birthDate: '1991-01-15',
  targetWeight: 72,
  activityLevel: 'light',
  addBurnedCalories: false,
};

const NOTICE = /it will be used exactly as entered/i;

function renderPlan() {
  return render(
    <PersonalPlan
      formData={formData}
      weightUnit="kg"
      heightUnit="cm"
      localDateFormat="yyyy-MM-dd"
      onOnboardingComplete={jest.fn()}
    />
  );
}

/** The big green number at the top of the plan. */
function calorieField() {
  return screen.getByRole('spinbutton', {
    name: /Daily Calorie Budget/i,
  }) as HTMLInputElement;
}

function finishOnboarding() {
  fireEvent.click(
    screen.getByRole('button', { name: /Start 6-Month Cascading Plan/i })
  );
}

describe('PersonalPlan explicit calorie target (issue #2373)', () => {
  beforeEach(() => {
    saveAllPreferencesMock.mockClear();
    saveGoalsMock.mockClear();
    submitOnboardingMock.mockClear();
  });

  it('keeps the adaptive method when the suggested budget is accepted', async () => {
    renderPlan();
    expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();

    finishOnboarding();

    await waitFor(() => expect(saveAllPreferencesMock).toHaveBeenCalled());
    expect(saveAllPreferencesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        goalMode: 'cut',
        goalModeCalculationMethod: 'adaptive',
      })
    );
  });

  it('pins a budget the user typed over, so the dashboard does not rebuild it', async () => {
    renderPlan();

    const suggested = Number(calorieField().value);
    expect(suggested).toBeGreaterThan(0);

    fireEvent.change(calorieField(), { target: { value: '1600' } });
    expect(screen.getByText(NOTICE)).toBeInTheDocument();

    finishOnboarding();

    await waitFor(() => expect(saveAllPreferencesMock).toHaveBeenCalled());
    expect(saveAllPreferencesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        goalMode: 'manual',
        goalModeCalculationMethod: 'manual',
        goalModeCustomPercentage: 0,
      })
    );
    await waitFor(() =>
      expect(saveGoalsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          goals: expect.objectContaining({ calories: 1600 }),
        })
      )
    );
  });

  it('drops the notice again when the suggested figure is typed back', () => {
    renderPlan();
    const suggested = calorieField().value;

    fireEvent.change(calorieField(), { target: { value: '1600' } });
    expect(screen.getByText(NOTICE)).toBeInTheDocument();

    fireEvent.change(calorieField(), { target: { value: suggested } });
    expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();
  });
});
