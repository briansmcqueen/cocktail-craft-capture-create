-- Security hardening: set explicit search_path for functions
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;
ALTER FUNCTION public.get_recipe_rating_stats(text) SET search_path = public;
ALTER FUNCTION public.get_recipe_rating_stats_batch(text[]) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;