-- Update function with proper search_path
CREATE OR REPLACE FUNCTION notify_followers_on_recipe()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notifications for public recipes
  IF NEW.is_public = true THEN
    -- Insert notifications for all followers of the recipe author
    INSERT INTO recipe_notifications (user_id, recipe_id, recipe_author_id, recipe_name)
    SELECT 
      f.follower_id,
      NEW.id,
      NEW.user_id,
      NEW.name
    FROM follows f
    WHERE f.following_id = NEW.user_id
    AND f.follower_id != NEW.user_id; -- Don't notify the author
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;