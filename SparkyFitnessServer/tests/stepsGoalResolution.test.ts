import { vi, beforeEach, describe, expect, it } from 'vitest';
import goalService from '../services/goalService.js';
import goalRepository from '../models/goalRepository.js';
import weeklyGoalPlanRepository from '../models/weeklyGoalPlanRepository.js';
import userRepository from '../models/userRepository.js';
import measurementRepository from '../models/measurementRepository.js';
import { getWearableStepGoalsForDateRange } from '../models/genericHealthRepository.js';
import { DEFAULT_GOALS } from '../constants/goals.js';
import { loadUserTimezone } from '../utils/timezoneLoader.js';
import customNutrientService from '../services/customNutrientService.js';

vi.mock('../models/goalRepository');
vi.mock('../models/weeklyGoalPlanRepository');
vi.mock('../models/goalPresetRepository');
vi.mock('../models/genericHealthRepository');
vi.mock('../models/userRepository');
vi.mock('../models/preferenceRepository');
vi.mock('../models/measurementRepository');
vi.mock('../models/exerciseEntry');
vi.mock('../services/bmrService');
vi.mock('../services/AdaptiveTdeeService');
vi.mock('../utils/timezoneLoader');
vi.mock('../services/customNutrientService');

const userId = 'user-123';
const testDate = '2026-06-22';

// The stored goal row for the day. steps_goal is what varies per test.
const storedGoal = (steps_goal: number | null) => ({
  calories: 2000,
  water_goal_ml: 2000,
  protein_percentage: null,
  carbs_percentage: null,
  fat_percentage: null,
  steps_goal,
});

interface ResolvedGoals {
  steps_goal: number | null;
}

const resolveFor = async (date = testDate): Promise<ResolvedGoals> => {
  const result = await goalService.getUserGoalsForRange(
    userId,
    date,
    date,
    false
  );
  return result[date] as ResolvedGoals;
};

describe('step goal resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(
      weeklyGoalPlanRepository.getActiveWeeklyGoalPlan
    ).mockResolvedValue(null);
    vi.mocked(goalRepository.getGoalsInRange).mockResolvedValue([]);
    vi.mocked(getWearableStepGoalsForDateRange).mockResolvedValue({});
    vi.mocked(userRepository.getUserProfile).mockResolvedValue(null);
    vi.mocked(
      measurementRepository.getLatestCheckInMeasurementsOnOrBeforeDate
    ).mockResolvedValue(null);
    vi.mocked(
      measurementRepository.getCheckInMeasurementsByDateRange
    ).mockResolvedValue([]);
  });

  it("uses the user's own goal ahead of the one their watch reports", async () => {
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(8000)
    );
    vi.mocked(getWearableStepGoalsForDateRange).mockResolvedValue({
      [testDate]: 12000,
    });

    expect((await resolveFor()).steps_goal).toBe(8000);
  });

  it('falls back to the wearable goal when the user never set one', async () => {
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(null)
    );
    vi.mocked(getWearableStepGoalsForDateRange).mockResolvedValue({
      [testDate]: 12000,
    });

    expect((await resolveFor()).steps_goal).toBe(12000);
  });

  it('falls back to the default when neither the user nor a device supplies one', async () => {
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(null)
    );

    expect((await resolveFor()).steps_goal).toBe(DEFAULT_GOALS.steps_goal);
  });

  // A goal of zero is meaningless, and rows written before the column existed
  // can hold one; both should behave as "never set".
  it('treats a stored zero as unset', async () => {
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(0)
    );
    vi.mocked(getWearableStepGoalsForDateRange).mockResolvedValue({
      [testDate]: 12000,
    });

    expect((await resolveFor()).steps_goal).toBe(12000);
  });

  // Pins the lazy load in getUserGoalsForRange: the Diary reads goals on every
  // render, and a user with their own goal should not pay for a wearable lookup.
  it('does not query the wearable goal when the user already has one', async () => {
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(8000)
    );

    await resolveFor();

    expect(getWearableStepGoalsForDateRange).not.toHaveBeenCalled();
  });

  it('queries the wearable goal at most once for a whole range', async () => {
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(null)
    );

    await goalService.getUserGoalsForRange(
      userId,
      '2026-06-22',
      '2026-06-30',
      false
    );

    expect(getWearableStepGoalsForDateRange).toHaveBeenCalledTimes(1);
  });

  it('resolves per day, so a device goal on one date does not leak into another', async () => {
    const start = '2026-06-22';
    const end = '2026-06-23';
    vi.mocked(goalRepository.getMostRecentGoalBeforeDate).mockResolvedValue(
      storedGoal(null)
    );
    vi.mocked(getWearableStepGoalsForDateRange).mockResolvedValue({
      [start]: 12000,
    });

    const result = (await goalService.getUserGoalsForRange(
      userId,
      start,
      end,
      false
    )) as Record<string, ResolvedGoals>;

    expect(result[start].steps_goal).toBe(12000);
    expect(result[end].steps_goal).toBe(DEFAULT_GOALS.steps_goal);
  });
});

describe('step goal persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadUserTimezone).mockResolvedValue('UTC');
    vi.mocked(customNutrientService.getCustomNutrients).mockResolvedValue([]);
    vi.mocked(goalRepository.upsertGoal).mockResolvedValue({});
  });

  const saveWith = async (p_steps_goal: unknown) => {
    await goalService.manageGoalTimeline(userId, {
      p_start_date: '2020-01-01', // past date: single upsert, no 6-month cascade
      p_cascade: false,
      p_calories: 2000,
      p_steps_goal,
    });
    return vi.mocked(goalRepository.upsertGoal).mock.calls[0][0];
  };

  it('stores the goal the user typed', async () => {
    expect((await saveWith(8500)).steps_goal).toBe(8500);
  });

  // The column is INTEGER, so a fractional value would be rejected by Postgres.
  it('rounds a fractional value rather than letting the insert fail', async () => {
    expect((await saveWith(8500.6)).steps_goal).toBe(8501);
  });

  // NULL, not 0: the read path needs to tell "no preference" from a real choice
  // so it can fall back to the wearable goal.
  it('stores null when no goal is supplied', async () => {
    expect((await saveWith(undefined)).steps_goal).toBeNull();
  });
});
