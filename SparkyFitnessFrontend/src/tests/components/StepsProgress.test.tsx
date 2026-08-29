import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StepsProgress from '@/pages/Diary/StepsProgress';
import {
  useDailySteps,
  useDailyExerciseStats,
} from '@/hooks/Diary/useDailyProgress';
import { renderWithClient } from '../test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: unknown, options?: Record<string, unknown>) => {
      const opts = (typeof fallback === 'object' ? fallback : options) as
        | Record<string, unknown>
        | undefined;
      if (key === 'diary.steps.remaining')
        return `${opts?.['formattedCount']} to go`;
      if (key === 'diary.steps.fromWorkouts')
        return `${opts?.['formattedCount']} from logged workouts`;
      if (key === 'diary.steps.goalReached') return 'Goal reached';
      if (key === 'diary.steps.title') return 'Steps';
      if (key === 'diary.steps.unit') return 'steps';
      return key;
    },
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('@/hooks/Diary/useDailyProgress', () => ({
  useDailySteps: jest.fn(),
  useDailyExerciseStats: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Footprints: () => <div data-testid="footprints-icon" />,
  Check: () => <div data-testid="check-icon" />,
}));

const mockSteps = (steps: number | undefined, activitySteps = 0) => {
  (useDailySteps as jest.Mock).mockReturnValue(
    steps === undefined ? { data: undefined } : { data: { steps } }
  );
  (useDailyExerciseStats as jest.Mock).mockReturnValue({
    data: { activitySteps },
  });
};

describe('StepsProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the day total against the goal', () => {
    mockSteps(7432);
    renderWithClient(
      <StepsProgress selectedDate="2026-06-22" stepsGoal={10000} />
    );

    expect(screen.getByText('7,432')).toBeInTheDocument();
    expect(screen.getByText('/ 10,000')).toBeInTheDocument();
    expect(screen.getByText('74%')).toBeInTheDocument();
    expect(screen.getByText('2,568 to go')).toBeInTheDocument();
  });

  it('reports the goal as reached rather than showing a negative remainder', () => {
    mockSteps(12000);
    renderWithClient(
      <StepsProgress selectedDate="2026-06-22" stepsGoal={10000} />
    );

    expect(screen.getByText('Goal reached')).toBeInTheDocument();
    expect(screen.queryByText(/to go/)).not.toBeInTheDocument();
    // The bar is capped so an overshoot cannot render past 100%.
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders the count alone when there is no goal to compare against', () => {
    mockSteps(4200);
    renderWithClient(<StepsProgress selectedDate="2026-06-22" stepsGoal={0} />);

    expect(screen.getByText('4,200')).toBeInTheDocument();
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('treats a day with no check-in as zero steps rather than blank', () => {
    mockSteps(undefined);
    renderWithClient(
      <StepsProgress selectedDate="2026-06-22" stepsGoal={10000} />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('breaks out workout steps only when a workout contributed some', () => {
    mockSteps(9000, 2500);
    const { rerender } = renderWithClient(
      <StepsProgress selectedDate="2026-06-22" stepsGoal={10000} />
    );
    expect(screen.getByText('2,500 from logged workouts')).toBeInTheDocument();

    mockSteps(9000, 0);
    rerender(<StepsProgress selectedDate="2026-06-22" stepsGoal={10000} />);
    expect(screen.queryByText(/from logged workouts/)).not.toBeInTheDocument();
  });
});
