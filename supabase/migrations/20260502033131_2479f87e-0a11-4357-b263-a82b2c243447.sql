
CREATE OR REPLACE FUNCTION public.reject_base64_recipe_image()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.image_url IS NOT NULL AND NEW.image_url LIKE 'data:image/%' THEN
    RAISE EXCEPTION 'Inline base64 images are not allowed in recipes.image_url. Upload the image to the recipes storage bucket and store the public URL instead.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS recipes_reject_base64_image ON public.recipes;
CREATE TRIGGER recipes_reject_base64_image
BEFORE INSERT OR UPDATE OF image_url ON public.recipes
FOR EACH ROW EXECUTE FUNCTION public.reject_base64_recipe_image();
