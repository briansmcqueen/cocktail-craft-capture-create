-- Add foreign key constraint between articles and profiles
ALTER TABLE articles 
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;