-- Add scaling metadata to recipes table
ALTER TABLE recipes ADD COLUMN default_servings INTEGER DEFAULT 1;
ALTER TABLE recipes ADD COLUMN min_servings INTEGER DEFAULT 1;
ALTER TABLE recipes ADD COLUMN max_servings INTEGER DEFAULT 20;
ALTER TABLE recipes ADD COLUMN scaling_notes TEXT;

-- Update existing recipes with default scaling values
UPDATE recipes SET 
  default_servings = 1,
  min_servings = 1,
  max_servings = 20
WHERE default_servings IS NULL;