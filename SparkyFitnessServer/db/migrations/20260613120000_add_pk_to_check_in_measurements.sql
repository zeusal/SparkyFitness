-- Add the missing PRIMARY KEY to check_in_measurements.id.
-- The table was created in InitialDB without a primary key, and (unlike other
-- tables such as exercise_entries) never received a follow-up PK migration.
-- The subsequent 20260614000000_add_checkin_photos migration references
-- check_in_measurements(id) as a foreign key target, which requires a unique
-- (or primary key) constraint on that column.
--
-- Guarded so the script is re-runnable: only add the PK if none exists yet.

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.check_in_measurements'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE public.check_in_measurements ADD PRIMARY KEY (id);
    END IF;
END;
$$;

COMMIT;
