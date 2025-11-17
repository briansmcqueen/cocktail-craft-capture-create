-- Add onboarding_completed column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON public.profiles(onboarding_completed);

-- Update existing users to have onboarding_completed = true (they're already using the app)
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE onboarding_completed IS NULL OR onboarding_completed = false;