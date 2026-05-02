
DROP POLICY IF EXISTS "Article comments are viewable by everyone" ON public.article_comments;

CREATE POLICY "Authenticated users can view article comments"
ON public.article_comments
FOR SELECT
TO authenticated
USING (true);
