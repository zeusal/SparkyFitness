import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Footprints, Check } from 'lucide-react';
import {
  useDailySteps,
  useDailyExerciseStats,
} from '@/hooks/Diary/useDailyProgress';

interface StepsProgressProps {
  selectedDate: string;
  /**
   * Already resolved by the server: the user's own goal, else the goal their
   * wearable reports, else the built-in default. Passed down rather than fetched
   * here because the Diary has loaded the day's goals by the time this renders.
   */
  stepsGoal: number;
}

const StepsProgress = ({ selectedDate, stepsGoal }: StepsProgressProps) => {
  const { t } = useTranslation();
  const { data: stepsData } = useDailySteps(selectedDate);
  const { data: exerciseData } = useDailyExerciseStats(selectedDate);

  const steps = stepsData?.steps ?? 0;
  // Steps a logged workout already accounts for. The check-in total includes
  // them, so this is a breakdown of `steps`, not an addition to it.
  const activitySteps = exerciseData?.activitySteps ?? 0;
  const goal = stepsGoal > 0 ? stepsGoal : 0;
  const percentage = goal > 0 ? Math.min((steps / goal) * 100, 100) : 0;
  const remaining = Math.max(0, goal - steps);
  const goalReached = goal > 0 && steps >= goal;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base dark:text-slate-300">
          <Footprints className="w-4 h-4 mr-2" />
          {t('diary.steps.title', 'Steps')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center p-3 dark:text-slate-300">
        <div className="text-center mb-3">
          <div className="text-2xl font-bold tabular-nums">
            {steps.toLocaleString()}
            {goal > 0 && (
              <span className="text-gray-400 dark:text-slate-500 font-medium">
                {' / '}
                {goal.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-gray-500 text-xs">
            {t('diary.steps.unit', 'steps')}
          </div>
        </div>

        {goal > 0 && (
          <>
            <Progress
              value={percentage}
              className="h-2.5"
              aria-label={t('diary.steps.title', 'Steps')}
            />

            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="font-medium text-gray-600 dark:text-gray-300 tabular-nums">
                {Math.round(percentage)}%
              </span>
              {goalReached ? (
                <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  {t('diary.steps.goalReached', 'Goal reached')}
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 tabular-nums">
                  {t('diary.steps.remaining', '{{formattedCount}} to go', {
                    count: remaining,
                    formattedCount: remaining.toLocaleString(),
                  })}
                </span>
              )}
            </div>
          </>
        )}

        {/* Only worth saying when a workout actually contributed: it explains why
            the number is higher than a sedentary day, and it is free to compute. */}
        {activitySteps > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-gray-400">
            {t(
              'diary.steps.fromWorkouts',
              '{{formattedCount}} from logged workouts',
              {
                count: activitySteps,
                formattedCount: activitySteps.toLocaleString(),
              }
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepsProgress;
