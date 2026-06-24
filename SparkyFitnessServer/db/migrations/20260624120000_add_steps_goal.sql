BEGIN;

ALTER TABLE public.user_goals
  ADD COLUMN steps_goal INTEGER;

ALTER TABLE public.goal_presets
  ADD COLUMN steps_goal INTEGER;

COMMIT;
