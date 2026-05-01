import { supabase } from '@/integrations/supabase/client';

// Allowed file extensions and MIME types for image uploads
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates that a file is an allowed image type
 * @param file - The file to validate
 * @throws Error if file type is not allowed
 */
export function validateImageFile(file: File): void {
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.');
  }
  
  // Validate file extension
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
    throw new Error('Invalid file extension. Only .jpg, .jpeg, .png, .gif, and .webp files are allowed.');
  }
}

/**
 * Compresses an image file to a WebP blob to reduce size before upload.
 * Falls back to JPEG only if the browser cannot encode WebP.
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels (default: 1600)
 * @param maxHeight - Maximum height in pixels (default: 1600)
 * @param quality - Encoder quality 0-1 (default: 0.8)
 * @param mimeType - Output mime type (default: 'image/webp')
 * @returns Compressed image as a Blob (WebP when supported)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1600,
  maxHeight: number = 1600,
  quality: number = 0.8,
  mimeType: string = 'image/webp'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas and draw compressed image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob — try requested mime (WebP by default), fallback to JPEG
        canvas.toBlob(
          (blob) => {
            if (blob && blob.type === mimeType) {
              resolve(blob);
              return;
            }
            // Browser ignored mime (older Safari etc.) — fallback to JPEG
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) resolve(jpegBlob);
                else reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              quality
            );
          },
          mimeType,
          quality
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to Supabase Storage with compression
 * @param file - The image file to upload
 * @param bucket - The storage bucket name (default: 'recipes')
 * @param folder - Optional folder path within the bucket
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'recipes',
  folder: string = 'recipe-images'
): Promise<string> {
  try {
    // Validate file type and extension
    validateImageFile(file);
    
    // Validate file size (10MB limit before compression)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      throw new Error('Image size must be less than 10MB');
    }

    // Get current user for user-scoped storage path
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to upload images');
    }
    
    // Compress the image
    const compressedBlob = await compressImage(file);

    // Use the compressed blob's actual mime to derive the extension (webp or jpeg fallback)
    const outExt = compressedBlob.type === 'image/webp' ? 'webp' : 'jpg';
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${outExt}`;
    const filePath = `${user.id}/${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, compressedBlob, {
        contentType: compressedBlob.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Deletes an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @param bucket - The storage bucket name (default: 'recipes')
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = 'recipes'
): Promise<void> {
  try {
    // Extract file path from public URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === bucket);
    
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL');
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    // Delete from storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    throw error;
  }
}

/**
 * Gets the file size of a compressed version of an image without uploading
 * @param file - The image file to check
 * @returns Size in bytes of the compressed image
 */
export async function getCompressedSize(file: File): Promise<number> {
  const compressedBlob = await compressImage(file);
  return compressedBlob.size;
}
