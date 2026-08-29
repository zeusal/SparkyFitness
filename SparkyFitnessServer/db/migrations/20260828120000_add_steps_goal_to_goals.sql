-- A daily step target the user sets themselves.
--
-- The only step goal in the schema so far was daily_health_metrics.step_goal,
-- which is whatever the wearable reports. It is written by genericHealthRepository
-- and never read by anything, so users with a device had a goal nobody displayed
-- and users without one had no goal at all. steps_goal makes it a first-class goal
-- next to water_goal_ml and the exercise targets, which means it inherits the goal
-- timeline, the 6-month cascade, presets and weekly plans without extra work.
--
-- Deliberately nullable with no default: NULL means "the user never set one",
-- which is what lets goalService fall back to the wearable's step_goal and only
-- then to the built-in default. A DB default would make every pre-existing row
-- indistinguishable from a deliberate choice.
--
-- The upper bound is a sanity guard, not a fitness opinion: 200000 steps is well
-- past any real target and still leaves room for outliers.

ALTER TABLE public.user_goals
  ADD COLUMN IF NOT EXISTS steps_goal INTEGER;

ALTER TABLE public.user_goals
  DROP CONSTRAINT IF EXISTS user_goals_steps_goal_check,
  ADD CONSTRAINT user_goals_steps_goal_check
    CHECK (steps_goal IS NULL OR (steps_goal >= 0 AND steps_goal <= 200000));

ALTER TABLE public.goal_presets
  ADD COLUMN IF NOT EXISTS steps_goal INTEGER;

ALTER TABLE public.goal_presets
  DROP CONSTRAINT IF EXISTS goal_presets_steps_goal_check,
  ADD CONSTRAINT goal_presets_steps_goal_check
    CHECK (steps_goal IS NULL OR (steps_goal >= 0 AND steps_goal <= 200000));

COMMENT ON COLUMN public.user_goals.steps_goal IS
  'User-set daily step target. NULL means unset, in which case the wearable goal (daily_health_metrics.step_goal) applies, and failing that the built-in default.';
COMMENT ON COLUMN public.goal_presets.steps_goal IS
  'Daily step target applied while this preset is active. NULL means unset.';
