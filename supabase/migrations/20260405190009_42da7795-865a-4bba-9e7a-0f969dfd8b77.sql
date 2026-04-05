
-- Update recipe_shares policy to match all platform values used in the codebase
DROP POLICY "Authenticated users can track their own shares" ON recipe_shares;
CREATE POLICY "Authenticated users can track their own shares"
  ON recipe_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND platform IN ('native', 'copy_link', 'whatsapp', 'x', 'facebook', 'pinterest', 'tiktok', 'instagram', 'twitter', 'link', 'copy')
  );
