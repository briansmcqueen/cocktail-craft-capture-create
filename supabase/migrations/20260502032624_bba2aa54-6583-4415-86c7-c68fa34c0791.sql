
-- 1) Server-side function that creates a comment notification for the recipe author.
--    The caller can only trigger this as a side effect of having authored the comment.
CREATE OR REPLACE FUNCTION public.create_comment_notification(p_comment_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_actor_id uuid := auth.uid();
  v_comment_author uuid;
  v_recipe_id text;
  v_recipe_author uuid;
BEGIN
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT rc.user_id, rc.recipe_id
    INTO v_comment_author, v_recipe_id
  FROM public.recipe_comments rc
  WHERE rc.id = p_comment_id;

  IF v_comment_author IS NULL THEN
    RAISE EXCEPTION 'Comment not found';
  END IF;

  -- Only the comment's own author can trigger this
  IF v_comment_author <> v_actor_id THEN
    RAISE EXCEPTION 'Only the comment author can trigger this notification';
  END IF;

  -- Resolve the recipe author from public.recipes (UUID id) when applicable.
  -- Recipe ids for built-in classics are non-UUID strings; in that case skip notification.
  BEGIN
    SELECT r.user_id INTO v_recipe_author
    FROM public.recipes r
    WHERE r.id = v_recipe_id::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    v_recipe_author := NULL;
  END;

  -- No author to notify (built-in recipe, missing recipe, or self-comment) -> no-op
  IF v_recipe_author IS NULL OR v_recipe_author = v_actor_id THEN
    RETURN;
  END IF;

  INSERT INTO public.social_notifications
    (user_id, actor_id, notification_type, recipe_id, comment_id)
  VALUES
    (v_recipe_author, v_actor_id, 'comment', v_recipe_id, p_comment_id);
END;
$function$;

-- 2) Restrict who can call this function: only signed-in users.
REVOKE EXECUTE ON FUNCTION public.create_comment_notification(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_comment_notification(uuid) TO authenticated, service_role;

-- 3) Remove the broad INSERT policy. Notifications can now only be created via the SECURITY DEFINER function above.
DROP POLICY IF EXISTS "Authenticated users can send notifications as themselves" ON public.social_notifications;
