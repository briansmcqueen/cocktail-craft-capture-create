-- First, let's fix the foreign key relationship for the recipe_comments table
ALTER TABLE public.recipe_comments 
ADD CONSTRAINT recipe_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the comment structure to support the new categories and photo uploads
ALTER TABLE public.recipe_comments 
ADD COLUMN photo_url TEXT,
ADD COLUMN category TEXT NOT NULL DEFAULT 'general';

-- Update existing records to use the new category system
UPDATE public.recipe_comments 
SET category = CASE 
  WHEN comment_type = 'tip' AND tip_type = 'variation' THEN 'variation'
  WHEN comment_type = 'tip' AND tip_type = 'substitution' THEN 'substitution' 
  WHEN comment_type = 'tip' AND tip_type = 'technique' THEN 'technique'
  ELSE 'general'
END;

-- Remove the old columns
ALTER TABLE public.recipe_comments 
DROP COLUMN comment_type,
DROP COLUMN tip_type;