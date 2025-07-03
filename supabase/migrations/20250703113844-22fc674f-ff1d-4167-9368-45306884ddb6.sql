-- Drop foreign key constraints that prevent changing recipe_id from uuid to text
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_recipe_id_fkey;

ALTER TABLE public.likes
DROP CONSTRAINT IF EXISTS likes_recipe_id_fkey;

ALTER TABLE public.recipe_ratings
DROP CONSTRAINT IF EXISTS recipe_ratings_recipe_id_fkey;

-- Change recipe_id column from uuid to text in all tables
ALTER TABLE public.favorites 
ALTER COLUMN recipe_id TYPE text;

ALTER TABLE public.likes
ALTER COLUMN recipe_id TYPE text;

ALTER TABLE public.recipe_ratings
ALTER COLUMN recipe_id TYPE text;