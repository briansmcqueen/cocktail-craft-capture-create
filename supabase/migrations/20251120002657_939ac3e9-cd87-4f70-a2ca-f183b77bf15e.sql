-- Add function to get like count for a recipe
CREATE OR REPLACE FUNCTION public.get_recipe_like_count(p_recipe_id text)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::integer
  FROM public.likes
  WHERE recipe_id = p_recipe_id;
$$;

-- Add function to check if user has liked a recipe
CREATE OR REPLACE FUNCTION public.has_user_liked_recipe(p_user_id uuid, p_recipe_id text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.likes
    WHERE user_id = p_user_id AND recipe_id = p_recipe_id
  );
$$;

-- Add function to get suggested users (users with most recipes)
CREATE OR REPLACE FUNCTION public.get_suggested_users(p_current_user_id uuid, p_limit integer DEFAULT 10)
RETURNS TABLE(
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  recipe_count bigint,
  follower_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    COUNT(DISTINCT r.id) as recipe_count,
    COUNT(DISTINCT f.follower_id) as follower_count
  FROM profiles p
  LEFT JOIN recipes r ON r.user_id = p.id AND r.is_public = true
  LEFT JOIN follows f ON f.following_id = p.id
  WHERE p.id != p_current_user_id
    AND p.username IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM follows 
      WHERE follower_id = p_current_user_id 
      AND following_id = p.id
    )
  GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.bio
  HAVING COUNT(DISTINCT r.id) > 0
  ORDER BY recipe_count DESC, follower_count DESC
  LIMIT p_limit;
END;
$$;

-- Add function to get trending users (most followers gained in last 30 days)
CREATE OR REPLACE FUNCTION public.get_trending_users(p_limit integer DEFAULT 10)
RETURNS TABLE(
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  recent_follower_count bigint,
  total_follower_count bigint,
  recipe_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    COUNT(DISTINCT CASE WHEN f.created_at > now() - interval '30 days' THEN f.follower_id END) as recent_follower_count,
    COUNT(DISTINCT f.follower_id) as total_follower_count,
    COUNT(DISTINCT r.id) as recipe_count
  FROM profiles p
  LEFT JOIN follows f ON f.following_id = p.id
  LEFT JOIN recipes r ON r.user_id = p.id AND r.is_public = true
  WHERE p.username IS NOT NULL
  GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.bio
  HAVING COUNT(DISTINCT f.follower_id) > 0
  ORDER BY recent_follower_count DESC, total_follower_count DESC
  LIMIT p_limit;
END;
$$;

-- Add notification types for more social interactions
-- Extend recipe_notifications or create new notification system
CREATE TABLE IF NOT EXISTS public.social_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  notification_type text NOT NULL,
  recipe_id text,
  comment_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  is_read boolean DEFAULT false,
  CONSTRAINT valid_notification_type CHECK (notification_type IN ('follow', 'like', 'comment', 'rating', 'reply'))
);

ALTER TABLE public.social_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social notifications"
  ON public.social_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own social notifications"
  ON public.social_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social notifications"
  ON public.social_notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow system to insert notifications
CREATE POLICY "Anyone can insert social notifications"
  ON public.social_notifications
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_social_notifications_user_id ON public.social_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_social_notifications_created_at ON public.social_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_notifications_is_read ON public.social_notifications(is_read) WHERE is_read = false;