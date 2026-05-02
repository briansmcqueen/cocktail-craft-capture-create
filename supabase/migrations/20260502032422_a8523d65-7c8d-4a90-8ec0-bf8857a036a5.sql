
DROP POLICY IF EXISTS "Users can view comments anonymously" ON public.recipe_comments;

CREATE POLICY "Authenticated users can view comments"
ON public.recipe_comments
FOR SELECT
TO authenticated
USING (true);

DROP FUNCTION IF EXISTS public.get_safe_comment_data(text);

CREATE FUNCTION public.get_safe_comment_data(p_recipe_id text)
RETURNS TABLE(
  id uuid,
  recipe_id text,
  user_id uuid,
  content text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  photo_url text,
  category text,
  user_display_name text,
  user_avatar_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    rc.id,
    rc.recipe_id,
    rc.user_id,
    rc.content,
    rc.created_at,
    rc.updated_at,
    rc.photo_url,
    rc.category,
    COALESCE(p.username, p.full_name, 'Anonymous User') as user_display_name,
    p.avatar_url as user_avatar_url
  FROM recipe_comments rc
  LEFT JOIN profiles p ON rc.user_id = p.id
  WHERE rc.recipe_id = p_recipe_id
  ORDER BY rc.created_at DESC;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_safe_comment_data(text) TO anon, authenticated, service_role;
