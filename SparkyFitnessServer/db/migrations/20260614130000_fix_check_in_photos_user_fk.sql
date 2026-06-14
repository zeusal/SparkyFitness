BEGIN;

-- The initial check_in_photos migration (20260614000000) pointed user_id at
-- auth.users(id), but application users live in public."user" (Better Auth),
-- the same target check_in_measurements uses. Uploads failed with a foreign
-- key violation for any user not present in the legacy auth.users table.
-- Repoint the FK to public."user".
ALTER TABLE public.check_in_photos
    DROP CONSTRAINT IF EXISTS check_in_photos_user_id_fkey;

ALTER TABLE public.check_in_photos
    ADD CONSTRAINT check_in_photos_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;

COMMIT;
