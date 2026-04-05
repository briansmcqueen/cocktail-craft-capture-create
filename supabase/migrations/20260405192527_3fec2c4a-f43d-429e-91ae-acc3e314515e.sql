-- Add RLS policies for the recipe-images bucket
CREATE POLICY "Recipe images are publicly readable"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload to their own folder in recipe-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'recipe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update files in their own folder in recipe-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete files in their own folder in recipe-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);