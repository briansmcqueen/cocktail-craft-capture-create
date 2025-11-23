import { supabase } from '@/integrations/supabase/client';

/**
 * Converts a storage path to a full public URL with cache-busting
 * @param path - Storage path like "avatars/user-id/file.jpg" or full URL
 * @returns Full public URL with timestamp or null if path is invalid
 */
export function getAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  
  // If it's already a full URL, add cache-busting parameter
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}t=${Date.now()}`;
  }
  
  // If it's a storage path, construct the full URL with cache-busting
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);
  
  return `${data.publicUrl}?t=${Date.now()}`;
}
