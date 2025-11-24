-- Create function to notify followers when a new recipe is published
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new recipes
DROP TRIGGER IF EXISTS notify_followers_on_new_recipe ON recipes;
CREATE TRIGGER notify_followers_on_new_recipe
  AFTER INSERT ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION notify_followers_on_recipe();

-- Create trigger for recipe updates (when making a recipe public)
DROP TRIGGER IF EXISTS notify_followers_on_recipe_update ON recipes;
CREATE TRIGGER notify_followers_on_recipe_update
  AFTER UPDATE OF is_public ON recipes
  FOR EACH ROW
  WHEN (OLD.is_public = false AND NEW.is_public = true)
  EXECUTE FUNCTION notify_followers_on_recipe();