-- Migration: Optimize rating aggregation and add performance indexes
CREATE OR REPLACE FUNCTION get_recipe_rating_stats(recipe_id TEXT)
RETURNS JSON AS $$
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
  WHERE recipe_id = $1;

  SELECT json_object_agg(rating, count)
  INTO distribution
  FROM (
    SELECT rating, COUNT(*) as count
    FROM recipe_ratings 
    WHERE recipe_id = $1
    GROUP BY rating
  ) t;

  RETURN json_build_object(
    'averageRating', COALESCE(avg_rating, 0),
    'totalRatings', COALESCE(total_count, 0),
    'ratingDistribution', COALESCE(distribution, '{}'::json)
  );
END;
$$ LANGUAGE plpgsql;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_search ON recipes USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_comments_recipe_id ON recipe_comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_following ON follows(follower_id, following_id);