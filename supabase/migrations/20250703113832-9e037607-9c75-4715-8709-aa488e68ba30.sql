-- Change recipe_id column from uuid to text in favorites table to support classic cocktail IDs
ALTER TABLE public.favorites 
ALTER COLUMN recipe_id TYPE text;

-- Change recipe_id column from uuid to text in likes table to support classic cocktail IDs  
ALTER TABLE public.likes
ALTER COLUMN recipe_id TYPE text;

-- Change recipe_id column from uuid to text in recipe_ratings table to support classic cocktail IDs
ALTER TABLE public.recipe_ratings
ALTER COLUMN recipe_id TYPE text;