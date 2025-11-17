-- First, clean up existing usernames that don't match the pattern
-- Replace spaces and invalid characters with underscores
UPDATE public.profiles
SET username = regexp_replace(LOWER(username), '[^a-z0-9_-]', '_', 'g')
WHERE username IS NOT NULL 
  AND username !~ '^[a-zA-Z0-9_-]+$';

-- Ensure usernames meet length requirements after cleanup
UPDATE public.profiles
SET username = SUBSTRING(username FROM 1 FOR 30)
WHERE username IS NOT NULL 
  AND char_length(username) > 30;

-- Now add the constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT username_length_check 
CHECK (username IS NULL OR (char_length(username) >= 3 AND char_length(username) <= 30));

ALTER TABLE public.profiles
ADD CONSTRAINT username_pattern_check
CHECK (username IS NULL OR username ~ '^[a-zA-Z0-9_-]+$');

-- Create a trigger to prevent username changes after initial set
CREATE OR REPLACE FUNCTION public.prevent_username_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow setting username if it's currently NULL
  IF OLD.username IS NOT NULL AND NEW.username IS DISTINCT FROM OLD.username THEN
    RAISE EXCEPTION 'Username cannot be changed once set';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce username immutability
DROP TRIGGER IF EXISTS prevent_username_change_trigger ON public.profiles;
CREATE TRIGGER prevent_username_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_username_change();

-- Add unique constraint on username (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_idx 
ON public.profiles (LOWER(username));

COMMENT ON CONSTRAINT username_length_check ON public.profiles IS 'Username must be 3-30 characters';
COMMENT ON CONSTRAINT username_pattern_check ON public.profiles IS 'Username can only contain letters, numbers, hyphens, and underscores';