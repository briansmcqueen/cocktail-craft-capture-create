
-- Revoke EXECUTE from anon for SECURITY DEFINER functions that require an authenticated context
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_user_liked_recipe(uuid, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_user_blocked(uuid, uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.verify_admin_access(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_affiliate_url(text) FROM anon, PUBLIC;

-- Ensure authenticated and service_role retain access
GRANT EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, integer, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_user_liked_recipe(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_user_blocked(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_admin_access(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_affiliate_url(text) TO authenticated, service_role;
