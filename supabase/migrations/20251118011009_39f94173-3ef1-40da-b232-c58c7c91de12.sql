-- Add RLS policy to allow public viewing of profile information
-- This enables social discovery while keeping sensitive data private
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Add a column to track if favorites should be public (default to private)
ALTER TABLE public.favorites 
ADD COLUMN is_public BOOLEAN DEFAULT false;

-- Add RLS policy to allow viewing public favorites
CREATE POLICY "Public favorites are viewable by everyone"
ON public.favorites
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);