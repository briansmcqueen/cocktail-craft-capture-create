
DROP POLICY IF EXISTS "Users can view their own follows" ON public.follows;

CREATE POLICY "Users can view their own follows"
ON public.follows
FOR SELECT
TO authenticated
USING (auth.uid() = follower_id OR auth.uid() = following_id);
