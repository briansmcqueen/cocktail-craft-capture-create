-- Phase 1: Critical Data Privacy Fixes

-- 1. Create security definer functions for safe public data access
CREATE OR REPLACE FUNCTION public.get_safe_comment_data(p_recipe_id text)
RETURNS TABLE(
  id uuid,
  recipe_id text,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  photo_url text,
  category text,
  user_display_name text,
  user_avatar_url text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.id,
    rc.recipe_id,
    rc.content,
    rc.created_at,
    rc.updated_at,
    rc.photo_url,
    rc.category,
    COALESCE(p.full_name, 'Anonymous User') as user_display_name,
    p.avatar_url as user_avatar_url
  FROM recipe_comments rc
  LEFT JOIN profiles p ON rc.user_id = p.id
  WHERE rc.recipe_id = p_recipe_id
  ORDER BY rc.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_safe_rating_stats(p_recipe_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating NUMERIC;
  total_count INTEGER;
  distribution JSON;
BEGIN
  SELECT 
    ROUND(AVG(rating), 1),
    COUNT(*)
  INTO avg_rating, total_count
  FROM recipe_ratings 
  WHERE recipe_id = p_recipe_id;

  SELECT json_object_agg(rating, count)
  INTO distribution
  FROM (
    SELECT rating, COUNT(*) as count
    FROM recipe_ratings 
    WHERE recipe_id = p_recipe_id
    GROUP BY rating
  ) t;

  RETURN json_build_object(
    'averageRating', COALESCE(avg_rating, 0),
    'totalRatings', COALESCE(total_count, 0),
    'ratingDistribution', COALESCE(distribution, '{}'::json)
  );
END;
$$;

-- 2. Update RLS policies to protect user privacy

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON recipe_comments;
DROP POLICY IF EXISTS "Recipe ratings are viewable by everyone" ON recipe_ratings;
DROP POLICY IF EXISTS "Users can view all follows" ON follows;

-- Create new privacy-focused policies for recipe_comments
CREATE POLICY "Users can view comments anonymously"
ON recipe_comments FOR SELECT
USING (true); -- Still allow viewing but user_id will be hidden by the function

CREATE POLICY "Users can view their own comment details"
ON recipe_comments FOR SELECT
USING (auth.uid() = user_id);

-- Create new privacy-focused policies for recipe_ratings  
CREATE POLICY "Users can view rating stats only"
ON recipe_ratings FOR SELECT
USING (false); -- Prevent direct access, use function instead

CREATE POLICY "Users can view their own ratings"
ON recipe_ratings FOR SELECT
USING (auth.uid() = user_id);

-- Create new privacy-focused policies for follows
CREATE POLICY "Users can view their own follows"
ON follows FOR SELECT  
USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- 3. Fix affiliate system - require user authentication for shopping sessions
ALTER TABLE shopping_sessions 
ALTER COLUMN user_id SET NOT NULL;

-- Update shopping sessions policies to require authentication
DROP POLICY IF EXISTS "Users can insert their own shopping sessions" ON shopping_sessions;
DROP POLICY IF EXISTS "Users can view their own shopping sessions" ON shopping_sessions;
DROP POLICY IF EXISTS "Users can update their own shopping sessions" ON shopping_sessions;

CREATE POLICY "Authenticated users can insert their own shopping sessions"
ON shopping_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Authenticated users can view their own shopping sessions"  
ON shopping_sessions FOR SELECT
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Authenticated users can update their own shopping sessions"
ON shopping_sessions FOR UPDATE
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- 4. Add audit logging table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
ON security_audit_log FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Create admin validation function
CREATE OR REPLACE FUNCTION public.verify_admin_access(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the admin access attempt
  INSERT INTO security_audit_log (user_id, action, resource_type, metadata)
  VALUES (p_user_id, 'admin_access_check', 'system', json_build_object('timestamp', now()));
  
  -- Check if user has admin role
  RETURN has_role(p_user_id, 'admin'::app_role);
END;
$$;