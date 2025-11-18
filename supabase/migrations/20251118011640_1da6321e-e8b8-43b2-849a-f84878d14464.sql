-- Create a notifications table for recipe posts from followed users
CREATE TABLE IF NOT EXISTS public.recipe_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  recipe_author_id UUID NOT NULL,
  recipe_name TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipe_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.recipe_notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.recipe_notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.recipe_notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recipe_notifications_user_id ON public.recipe_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_notifications_is_read ON public.recipe_notifications(user_id, is_read);

-- Add trigger for updated_at
CREATE TRIGGER update_recipe_notifications_updated_at
BEFORE UPDATE ON public.recipe_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get follower count
CREATE OR REPLACE FUNCTION public.get_follower_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.follows
  WHERE following_id = p_user_id;
$$;

-- Create function to get following count
CREATE OR REPLACE FUNCTION public.get_following_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.follows
  WHERE follower_id = p_user_id;
$$;