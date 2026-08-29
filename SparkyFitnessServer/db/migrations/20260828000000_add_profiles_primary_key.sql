-- profiles only ever had a NOT NULL and a foreign key on id: no primary key and
-- no unique index. ensureUserInitialization creates the row with
-- "SELECT ... WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = $1)", a
-- read-then-write that two concurrent signups/logins can both pass before
-- either commits, so both insert and the user ends up with two profiles rows
-- sharing one id. getUserProfile returns rows[0] with no ORDER BY, so it then
-- hands back whichever row it happens to hit (the one with a NULL full_name
-- shows the account as unnamed), and the admin user list joins profiles
-- without deduplicating, so the account appears twice.
--
-- Deduplicate first, keeping the most complete and most recently updated row
-- per id, then add the primary key so the race can no longer duplicate.
-- Both steps are no-ops on installs that were never affected.

DELETE FROM public.profiles p
WHERE p.ctid NOT IN (
    SELECT DISTINCT ON (id) ctid
    FROM public.profiles
    ORDER BY id,
             (full_name IS NOT NULL AND btrim(full_name) <> '') DESC,
             updated_at DESC NULLS LAST,
             created_at ASC NULLS LAST,
             ctid
);

-- Guarded because the primary key may already have been added by hand on an
-- environment that hit the duplicate before this migration shipped.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.profiles'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE public.profiles
            ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
    END IF;
END $$;
