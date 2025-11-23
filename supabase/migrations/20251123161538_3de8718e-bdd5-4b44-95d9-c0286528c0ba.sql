-- Storage policies for avatar uploads

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  OR name = auth.uid()::text || '.jpg'
  OR name = auth.uid()::text || '.png'
  OR name = auth.uid()::text || '.jpeg'
  OR name = auth.uid()::text || '.webp'
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR name = auth.uid()::text || '.jpg'
    OR name = auth.uid()::text || '.png'
    OR name = auth.uid()::text || '.jpeg'
    OR name = auth.uid()::text || '.webp'
  )
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR name = auth.uid()::text || '.jpg'
    OR name = auth.uid()::text || '.png'
    OR name = auth.uid()::text || '.jpeg'
    OR name = auth.uid()::text || '.webp'
  )
);

-- Allow public read access to avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');