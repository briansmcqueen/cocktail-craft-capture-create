-- Create recipe shares tracking table
CREATE TABLE IF NOT EXISTS public.recipe_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  platform TEXT NOT NULL CHECK (platform IN ('native', 'copy_link', 'whatsapp', 'x', 'facebook', 'pinterest', 'tiktok', 'instagram')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for performance
CREATE INDEX idx_recipe_shares_recipe_id ON public.recipe_shares(recipe_id);
CREATE INDEX idx_recipe_shares_platform ON public.recipe_shares(platform);
CREATE INDEX idx_recipe_shares_created_at ON public.recipe_shares(created_at DESC);

-- Enable RLS
ALTER TABLE public.recipe_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert share tracking"
  ON public.recipe_shares
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Share counts are publicly viewable"
  ON public.recipe_shares
  FOR SELECT
  USING (true);

-- Create function to get share stats for a recipe
CREATE OR REPLACE FUNCTION get_recipe_share_stats(p_recipe_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_shares INTEGER;
  platform_breakdown JSON;
  recent_shares INTEGER;
BEGIN
  -- Get total shares
  SELECT COUNT(*) INTO total_shares
  FROM recipe_shares
  WHERE recipe_id = p_recipe_id;

  -- Get platform breakdown
  SELECT json_object_agg(platform, count)
  INTO platform_breakdown
  FROM (
    SELECT platform, COUNT(*) as count
    FROM recipe_shares
    WHERE recipe_id = p_recipe_id
    GROUP BY platform
  ) t;

  -- Get recent shares (last 7 days)
  SELECT COUNT(*) INTO recent_shares
  FROM recipe_shares
  WHERE recipe_id = p_recipe_id
    AND created_at > now() - interval '7 days';

  RETURN json_build_object(
    'totalShares', COALESCE(total_shares, 0),
    'platformBreakdown', COALESCE(platform_breakdown, '{}'::json),
    'recentShares', COALESCE(recent_shares, 0)
  );
END;
$$;