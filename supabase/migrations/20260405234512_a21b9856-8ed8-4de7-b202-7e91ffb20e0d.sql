-- Fix 1: Restrict recipe_shares SELECT to owner-only (aggregate counts use SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS "Share counts are publicly viewable" ON recipe_shares;

CREATE POLICY "Users can view their own shares"
  ON recipe_shares
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a batch share count RPC for public use (no user_id exposed)
CREATE OR REPLACE FUNCTION public.get_batch_recipe_share_counts(p_recipe_ids text[])
RETURNS TABLE(recipe_id text, share_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT rs.recipe_id, COUNT(*) as share_count
  FROM recipe_shares rs
  WHERE rs.recipe_id = ANY(p_recipe_ids)
  GROUP BY rs.recipe_id;
$$;

-- Fix 2: Add caller identity guard to has_role() to prevent cross-user enumeration
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT (
    -- Allow internal RLS evaluation (auth.uid() is NULL during policy checks from service role)
    -- or self-checks only
    auth.uid() IS NULL OR auth.uid() = _user_id
  ) AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;