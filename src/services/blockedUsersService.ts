import { supabase } from "@/integrations/supabase/client";

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_profile?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

/**
 * Block a user
 */
export const blockUser = async (blockedUserId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("blocked_users")
      .insert({
        blocker_id: user.id,
        blocked_id: blockedUserId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error blocking user:", error);
    return false;
  }
};

/**
 * Unblock a user
 */
export const unblockUser = async (blockedUserId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("blocked_users")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", blockedUserId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error unblocking user:", error);
    return false;
  }
};

/**
 * Check if a user is blocked
 */
export const isUserBlocked = async (userId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("blocked_users")
      .select("id")
      .eq("blocker_id", user.id)
      .eq("blocked_id", userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if user is blocked:", error);
    return false;
  }
};

/**
 * Get all blocked users
 */
export const getBlockedUsers = async (): Promise<BlockedUser[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("blocked_users")
      .select("*")
      .eq("blocker_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch profiles for blocked users
    if (data && data.length > 0) {
      const blockedIds = data.map(b => b.blocked_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", blockedIds);

      return data.map(block => ({
        ...block,
        blocked_profile: profiles?.find(p => p.id === block.blocked_id),
      }));
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return [];
  }
};

export const blockedUsersService = {
  blockUser,
  unblockUser,
  isUserBlocked,
  getBlockedUsers,
};
