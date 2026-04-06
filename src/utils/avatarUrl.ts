import { supabase } from '@/integrations/supabase/client';

/**
 * Converts a storage path to a full public URL
 * @param path - Storage path like "avatars/user-id/file.jpg" or full URL
 * @returns Full public URL or null if path is invalid
 */
export function getAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a storage path, construct the full URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);
  
  return data.publicUrl;
}
