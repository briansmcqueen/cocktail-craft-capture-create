-- Restrict profiles visibility and add safe public RPCs

-- 1) Replace overly permissive SELECT policy on profiles
DO $$
BEGIN
  -- Drop the existing public SELECT policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    EXECUTE 'DROP POLICY "Public profiles are viewable by everyone" ON public.profiles';
  END IF;

  -- Create policy: Users can view their own profile (idempotent)
  BEGIN
    EXECUTE 'CREATE POLICY "Users can view their own profile"
      ON public.profiles
      FOR SELECT
      USING (auth.uid() = id)';
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  -- Create policy: Admins can view all profiles (idempotent)
  BEGIN
    EXECUTE 'CREATE POLICY "Admins can view all profiles"
      ON public.profiles
      FOR SELECT
      USING (has_role(auth.uid(), ''admin''::app_role))';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END$$;

-- 2) Safe public helper RPCs that return only non-sensitive fields
-- Get multiple public profiles by IDs
CREATE OR REPLACE FUNCTION public.get_public_profiles(user_ids uuid[])
RETURNS TABLE (
  id uuid,
  username text,
  avatar_url text
) AS $$
  SELECT p.id, p.username, p.avatar_url
  FROM public.profiles p
  WHERE p.id = ANY (user_ids);
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Get a public profile by username
CREATE OR REPLACE FUNCTION public.get_public_profile_by_username(p_username text)
RETURNS TABLE (
  id uuid,
  username text,
  avatar_url text
) AS $$
  SELECT p.id, p.username, p.avatar_url
  FROM public.profiles p
  WHERE p.username = p_username
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
