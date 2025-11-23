-- Add privacy settings to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'followers', 'private')),
ADD COLUMN IF NOT EXISTS recipe_visibility TEXT DEFAULT 'public' CHECK (recipe_visibility IN ('public', 'followers', 'private')),
ADD COLUMN IF NOT EXISTS allow_follows TEXT DEFAULT 'everyone' CHECK (allow_follows IN ('everyone', 'approval', 'none'));

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.profile_visibility IS 'Controls who can view the user profile: public (anyone), followers (followers only), private (only the user)';
COMMENT ON COLUMN public.profiles.recipe_visibility IS 'Controls who can view user recipes: public (anyone), followers (followers only), private (only the user)';
COMMENT ON COLUMN public.profiles.allow_follows IS 'Controls who can follow the user: everyone (no approval needed), approval (requires approval), none (cannot be followed)';

-- Create index for privacy settings queries
CREATE INDEX IF NOT EXISTS idx_profiles_privacy ON public.profiles(profile_visibility, recipe_visibility, allow_follows);