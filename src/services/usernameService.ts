import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a username is available
 * @param username - The username to check
 * @returns Object with availability status and message
 */
export async function checkUsernameAvailability(username: string): Promise<{
  available: boolean;
  message: string;
}> {
  // Validate format first
  if (!username || username.length < 3) {
    return { available: false, message: "Username must be at least 3 characters" };
  }

  if (username.length > 30) {
    return { available: false, message: "Username must be less than 30 characters" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { available: false, message: "Only letters, numbers, hyphens, and underscores allowed" };
  }

  // Check if username exists (case-insensitive)
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .ilike('username', username)
    .maybeSingle();

  if (error) {
    console.error('Error checking username:', error);
    return { available: false, message: "Error checking availability" };
  }

  if (data) {
    return { available: false, message: "Username is already taken" };
  }

  return { available: true, message: "Username is available" };
}
