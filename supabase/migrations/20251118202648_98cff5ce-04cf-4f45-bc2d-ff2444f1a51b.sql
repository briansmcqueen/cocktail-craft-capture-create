-- Delete duplicate recipes, keeping only the most recent one for each user/name combination
DELETE FROM recipes
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY user_id, name ORDER BY created_at DESC) as rn
    FROM recipes
  ) t
  WHERE rn > 1
);

-- Add a unique constraint to prevent duplicate recipe names per user
-- This will prevent the same user from creating multiple recipes with identical names
CREATE UNIQUE INDEX IF NOT EXISTS recipes_user_name_unique 
ON recipes(user_id, LOWER(name));