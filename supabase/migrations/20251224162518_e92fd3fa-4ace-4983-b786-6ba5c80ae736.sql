-- Drop the overly permissive public profiles policy that exposes all data to unauthenticated users
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;