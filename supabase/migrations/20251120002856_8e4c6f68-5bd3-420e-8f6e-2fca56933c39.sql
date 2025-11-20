-- Drop and recreate get_public_profile_by_username with additional fields
DROP FUNCTION IF EXISTS public.get_public_profile_by_username(text);

CREATE FUNCTION public.get_public_profile_by_username(p_username text)
RETURNS TABLE(id uuid, username text, avatar_url text, full_name text, bio text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.id, p.username, p.avatar_url, p.full_name, p.bio
  FROM public.profiles p
  WHERE p.username = p_username
  LIMIT 1;
$$;