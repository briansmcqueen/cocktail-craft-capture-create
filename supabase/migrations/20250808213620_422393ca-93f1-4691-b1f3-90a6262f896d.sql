-- Performance migration: batch ratings RPC and helpful indexes

-- Create helpful indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON public.recipe_ratings (recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id_rating ON public.recipe_ratings (recipe_id, rating);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id_created_at ON public.recipes (user_id, created_at DESC);

-- Batch ratings RPC to reduce N calls into 1
CREATE OR REPLACE FUNCTION public.get_recipe_rating_stats_batch(p_recipe_ids text[])
RETURNS SETOF json
LANGUAGE sql
STABLE
AS $$
  WITH base AS (
    SELECT rr.recipe_id::text AS recipe_id, rr.rating
    FROM public.recipe_ratings rr
    WHERE rr.recipe_id = ANY(p_recipe_ids)
  ),
  agg AS (
    SELECT recipe_id,
           ROUND(AVG(rating), 1) AS average_rating,
           COUNT(*)::int AS total_ratings
    FROM base
    GROUP BY recipe_id
  ),
  dist AS (
    SELECT recipe_id, json_object_agg(rating, cnt) AS rating_distribution
    FROM (
      SELECT recipe_id, rating, COUNT(*) AS cnt
      FROM base
      GROUP BY recipe_id, rating
    ) d
    GROUP BY recipe_id
  ),
  recipe_keys AS (
    -- Ensure we return entries for all requested IDs, even those with 0 ratings
    SELECT unnest(p_recipe_ids) AS recipe_id
  )
  SELECT json_build_object(
    'recipe_id', rk.recipe_id,
    'averageRating', COALESCE(a.average_rating, 0),
    'totalRatings', COALESCE(a.total_ratings, 0),
    'ratingDistribution', COALESCE(d.rating_distribution, '{}'::json)
  )
  FROM recipe_keys rk
  LEFT JOIN agg a ON a.recipe_id = rk.recipe_id
  LEFT JOIN dist d ON d.recipe_id = rk.recipe_id;
$$;