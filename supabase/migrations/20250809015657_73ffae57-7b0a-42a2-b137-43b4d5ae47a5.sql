-- Security hardening migration (fix): storage policies, user_roles read access, articles admin visibility

-- 1) Storage policies: public read for avatars/recipes; authenticated users can manage files only in their own folder (<user_id>/...)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read access for avatars and recipes'
  ) THEN
    CREATE POLICY "Public read access for avatars and recipes"
    ON storage.objects
    FOR SELECT
    USING (bucket_id IN ('avatars','recipes'));
  END IF;
END $$;

-- Avatars: INSERT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload to their own folder in avatars'
  ) THEN
    CREATE POLICY "Users can upload to their own folder in avatars"
    ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'avatars'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- Avatars: UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update files in their own folder in avatars'
  ) THEN
    CREATE POLICY "Users can update files in their own folder in avatars"
    ON storage.objects
    FOR UPDATE TO authenticated
    USING (
      bucket_id = 'avatars'
      AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
      bucket_id = 'avatars'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- Avatars: DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete files in their own folder in avatars'
  ) THEN
    CREATE POLICY "Users can delete files in their own folder in avatars"
    ON storage.objects
    FOR DELETE TO authenticated
    USING (
      bucket_id = 'avatars'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- Recipes bucket: INSERT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload to their own folder in recipes'
  ) THEN
    CREATE POLICY "Users can upload to their own folder in recipes"
    ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'recipes'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- Recipes bucket: UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update files in their own folder in recipes'
  ) THEN
    CREATE POLICY "Users can update files in their own folder in recipes"
    ON storage.objects
    FOR UPDATE TO authenticated
    USING (
      bucket_id = 'recipes'
      AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
      bucket_id = 'recipes'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- Recipes bucket: DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete files in their own folder in recipes'
  ) THEN
    CREATE POLICY "Users can delete files in their own folder in recipes"
    ON storage.objects
    FOR DELETE TO authenticated
    USING (
      bucket_id = 'recipes'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
  END IF;
END $$;

-- 2) user_roles: allow users to read their own roles (in addition to admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3) articles: allow admins to view all articles (drafts too)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'articles' AND policyname = 'Admins can view all articles'
  ) THEN
    CREATE POLICY "Admins can view all articles"
    ON public.articles
    FOR SELECT TO authenticated
    USING (has_role(auth.uid(), 'admin'));
  END IF;
END $$;
