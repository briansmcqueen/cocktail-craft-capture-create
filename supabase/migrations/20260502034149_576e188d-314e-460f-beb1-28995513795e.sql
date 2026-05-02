
-- Soft-delete tracking on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deletion_requested_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS deletion_scheduled_for timestamptz NULL;

-- =========================================================
-- request_account_deletion: called by the signed-in user
-- =========================================================
CREATE OR REPLACE FUNCTION public.request_account_deletion()
RETURNS TABLE(deletion_requested_at timestamptz, deletion_scheduled_for timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_scheduled timestamptz := now() + interval '7 days';
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  UPDATE public.profiles
     SET deletion_requested_at = v_now,
         deletion_scheduled_for = v_scheduled
   WHERE id = v_uid;

  INSERT INTO public.security_audit_log (user_id, action, resource_type, metadata)
  VALUES (
    v_uid,
    'account_deletion_requested',
    'account',
    jsonb_build_object('scheduled_for', v_scheduled)
  );

  RETURN QUERY SELECT v_now, v_scheduled;
END;
$$;

REVOKE ALL ON FUNCTION public.request_account_deletion() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_account_deletion() TO authenticated;

-- =========================================================
-- cancel_account_deletion: called by the signed-in user
-- =========================================================
CREATE OR REPLACE FUNCTION public.cancel_account_deletion()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  UPDATE public.profiles
     SET deletion_requested_at = NULL,
         deletion_scheduled_for = NULL
   WHERE id = v_uid
     AND deletion_requested_at IS NOT NULL;

  INSERT INTO public.security_audit_log (user_id, action, resource_type, metadata)
  VALUES (v_uid, 'account_deletion_cancelled', 'account', '{}'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_account_deletion() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_account_deletion() TO authenticated;

-- =========================================================
-- purge_user_account: SERVICE ROLE ONLY
-- Wipes all rows tied to the user. Storage objects must be
-- deleted by the caller (edge function) before invoking this.
-- =========================================================
CREATE OR REPLACE FUNCTION public.purge_user_account(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id required';
  END IF;

  -- Notifications (both as recipient and as actor)
  DELETE FROM public.social_notifications
   WHERE user_id = p_user_id OR actor_id = p_user_id;
  DELETE FROM public.recipe_notifications
   WHERE user_id = p_user_id OR recipe_author_id = p_user_id;

  -- Social graph
  DELETE FROM public.follows
   WHERE follower_id = p_user_id OR following_id = p_user_id;
  DELETE FROM public.blocked_users
   WHERE blocker_id = p_user_id OR blocked_id = p_user_id;

  -- UGC the user authored
  DELETE FROM public.recipe_comments WHERE user_id = p_user_id;
  DELETE FROM public.recipe_ratings  WHERE user_id = p_user_id;
  DELETE FROM public.recipe_shares   WHERE user_id = p_user_id;
  DELETE FROM public.favorites       WHERE user_id = p_user_id;
  DELETE FROM public.likes           WHERE user_id = p_user_id;
  DELETE FROM public.content_reports WHERE reporter_id = p_user_id;

  -- Legacy article tables (forbidden feature, but rows may exist)
  DELETE FROM public.article_comments  WHERE user_id = p_user_id;
  DELETE FROM public.article_favorites WHERE user_id = p_user_id;

  -- Bar inventory & preferences
  DELETE FROM public.user_ingredients    WHERE user_id = p_user_id;
  DELETE FROM public.custom_ingredients  WHERE user_id = p_user_id;
  DELETE FROM public.user_bar_presets    WHERE user_id = p_user_id;
  DELETE FROM public.shopping_list_items WHERE user_id = p_user_id;
  DELETE FROM public.shopping_sessions   WHERE user_id = p_user_id;
  DELETE FROM public.user_preferences    WHERE user_id = p_user_id;

  -- Roles
  DELETE FROM public.user_roles WHERE user_id = p_user_id;

  -- Authored recipes (publicly visible content the user owns)
  DELETE FROM public.recipes WHERE user_id = p_user_id;

  -- Anonymise admin-only history (keep aggregate data, drop link)
  UPDATE public.affiliate_conversions ac
     SET shopping_session_id = ac.shopping_session_id  -- no-op, kept for symmetry
   WHERE FALSE;
  UPDATE public.security_audit_log SET user_id = NULL WHERE user_id = p_user_id;

  -- Finally the profile row itself
  DELETE FROM public.profiles WHERE id = p_user_id;

  -- Compliance audit row (no user_id, only a hash of the deleted id)
  INSERT INTO public.security_audit_log (user_id, action, resource_type, metadata)
  VALUES (
    NULL,
    'account_deletion_completed',
    'account',
    jsonb_build_object('user_hash', encode(digest(p_user_id::text, 'sha256'), 'hex'))
  );
END;
$$;

-- Purge must NEVER be callable from the client
REVOKE ALL ON FUNCTION public.purge_user_account(uuid) FROM PUBLIC, anon, authenticated;
