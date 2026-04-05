
-- 1. Fix social_notifications: restrict INSERT to authenticated users acting as themselves
DROP POLICY "Anyone can insert social notifications" ON social_notifications;
CREATE POLICY "Authenticated users can send notifications as themselves"
  ON social_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = actor_id);

-- 2. Fix retailers: restrict to admins only (contains affiliate_id and commission_rate)
DROP POLICY "Retailers are viewable by everyone" ON retailers;
CREATE POLICY "Retailers viewable by admins only"
  ON retailers
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix recipe_shares: require authentication and constrain actor ownership
DROP POLICY "Anyone can insert share tracking" ON recipe_shares;
CREATE POLICY "Authenticated users can track their own shares"
  ON recipe_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND platform IN ('twitter', 'facebook', 'instagram', 'whatsapp', 'link', 'copy')
  );

-- 4. Fix storage: remove over-permissive broad upload policies
DROP POLICY IF EXISTS "Users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
