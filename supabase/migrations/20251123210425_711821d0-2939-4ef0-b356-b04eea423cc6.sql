-- Create blocked_users table
CREATE TABLE public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Users can view their own blocks
CREATE POLICY "Users can view who they blocked"
ON public.blocked_users
FOR SELECT
USING (auth.uid() = blocker_id);

-- Users can block other users
CREATE POLICY "Users can block other users"
ON public.blocked_users
FOR INSERT
WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock other users
CREATE POLICY "Users can unblock other users"
ON public.blocked_users
FOR DELETE
USING (auth.uid() = blocker_id);

-- Create index for performance
CREATE INDEX idx_blocked_users_blocker ON public.blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON public.blocked_users(blocked_id);

-- Create function to check if a user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(p_blocker_id uuid, p_blocked_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.blocked_users
    WHERE blocker_id = p_blocker_id
      AND blocked_id = p_blocked_id
  );
$$;