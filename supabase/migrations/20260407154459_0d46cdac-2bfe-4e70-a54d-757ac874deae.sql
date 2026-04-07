DROP POLICY "Authenticated users can view profiles" ON profiles;

CREATE POLICY "Authenticated users can view public profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (profile_visibility = 'public' OR auth.uid() = id);