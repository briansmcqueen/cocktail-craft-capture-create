-- Add unit preference to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN preferred_unit TEXT DEFAULT 'oz' CHECK (preferred_unit IN ('oz', 'ml'));