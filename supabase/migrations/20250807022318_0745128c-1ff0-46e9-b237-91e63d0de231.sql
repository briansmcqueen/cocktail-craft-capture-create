-- Fix the ambiguous column reference by renaming the parameter
DROP FUNCTION IF EXISTS get_recipe_rating_stats(TEXT);

CREATE OR REPLACE FUNCTION get_recipe_rating_stats(p_recipe_id TEXT)
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
$$ LANGUAGE plpgsql;