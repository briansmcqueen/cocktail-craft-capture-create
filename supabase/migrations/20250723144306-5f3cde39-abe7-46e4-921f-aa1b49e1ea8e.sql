-- Add foreign key constraint between articles and profiles
ALTER TABLE public.articles 
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;