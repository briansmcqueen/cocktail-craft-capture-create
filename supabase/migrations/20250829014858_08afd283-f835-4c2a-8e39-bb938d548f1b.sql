-- Fix Function Search Path Security Issues
-- Update all existing functions to have proper search_path set

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create URL validation function for affiliate system
CREATE OR REPLACE FUNCTION public.validate_affiliate_url(url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_domains text[] := ARRAY['totalwine.com', 'wine.com', 'drizly.com', 'instacart.com'];
  url_domain text;
BEGIN
  -- Extract domain from URL
  url_domain := substring(url from 'https?://(?:www\.)?([^/]+)');
  
  -- Check if domain is in allowed list
  RETURN url_domain = ANY(allowed_domains);
END;
$$;

-- Add URL validation constraint to product_mappings
ALTER TABLE product_mappings 
ADD CONSTRAINT valid_affiliate_url 
CHECK (validate_affiliate_url(affiliate_url));

-- Add commission integrity checks
CREATE OR REPLACE FUNCTION public.validate_commission_integrity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure commission is reasonable (0-30% of actual total)
  IF NEW.commission_cents > (NEW.actual_total_cents * 0.3) THEN
    RAISE EXCEPTION 'Commission exceeds 30%% of order total';
  END IF;
  
  -- Ensure commission is positive
  IF NEW.commission_cents < 0 THEN
    RAISE EXCEPTION 'Commission cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply commission validation trigger
CREATE TRIGGER validate_commission_integrity_trigger
  BEFORE INSERT OR UPDATE ON affiliate_conversions
  FOR EACH ROW EXECUTE FUNCTION validate_commission_integrity();

-- Create rate limiting function for user content
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_action text,
  p_limit integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  action_count integer;
BEGIN
  -- Count actions in the time window
  SELECT COUNT(*)
  INTO action_count
  FROM security_audit_log
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > (now() - interval '1 minute' * p_window_minutes);
  
  -- Return false if limit exceeded
  IF action_count >= p_limit THEN
    -- Log the rate limit violation
    INSERT INTO security_audit_log (user_id, action, resource_type, metadata)
    VALUES (p_user_id, 'rate_limit_exceeded', 'user_action', 
            json_build_object('attempted_action', p_action, 'count', action_count, 'limit', p_limit));
    
    RETURN false;
  END IF;
  
  -- Log the action
  INSERT INTO security_audit_log (user_id, action, resource_type, metadata)
  VALUES (p_user_id, p_action, 'user_action', json_build_object('timestamp', now()));
  
  RETURN true;
END;
$$;