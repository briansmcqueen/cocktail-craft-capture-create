import { supabase } from "@/integrations/supabase/client";
import { blockedUsersService } from "./blockedUsersService";

export type VisibilityLevel = 'public' | 'followers' | 'private';

export interface PrivacyCheck {
  canView: boolean;
  reason?: 'blocked' | 'private' | 'followers_only' | 'not_authenticated';
}

/**
 * Check if viewer is following the target user
 */
const isFollowing = async (viewerId: string, targetId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', viewerId)
      .eq('following_id', targetId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

/**
 * Check if viewer is blocked by target user
 */
const isBlockedBy = async (viewerId: string, targetId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('blocked_users')
      .select('id')
      .eq('blocker_id', targetId)
      .eq('blocked_id', viewerId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking block status:', error);
    return false;
  }
};

/**
 * Get user's privacy settings
 */
const getUserPrivacySettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('profile_visibility, recipe_visibility, allow_follows')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    return {
      profile_visibility: (data?.profile_visibility || 'public') as VisibilityLevel,
      recipe_visibility: (data?.recipe_visibility || 'public') as VisibilityLevel,
      allow_follows: data?.allow_follows || 'everyone',
    };
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return {
      profile_visibility: 'public' as VisibilityLevel,
      recipe_visibility: 'public' as VisibilityLevel,
      allow_follows: 'everyone',
    };
  }
};

/**
 * Check if viewer can see target user's profile
 */
export const canViewProfile = async (
  targetUserId: string,
  viewerId?: string
): Promise<PrivacyCheck> => {
  // Owner can always view their own profile
  if (viewerId && viewerId === targetUserId) {
    return { canView: true };
  }

  // Get privacy settings
  const settings = await getUserPrivacySettings(targetUserId);

  // Check if viewer is blocked
  if (viewerId) {
    const blocked = await isBlockedBy(viewerId, targetUserId);
    if (blocked) {
      return { canView: false, reason: 'blocked' };
    }
  }

  // Check profile visibility
  if (settings.profile_visibility === 'public') {
    return { canView: true };
  }

  if (settings.profile_visibility === 'private') {
    return { canView: false, reason: 'private' };
  }

  // Followers only
  if (!viewerId) {
    return { canView: false, reason: 'not_authenticated' };
  }

  const following = await isFollowing(viewerId, targetUserId);
  if (following) {
    return { canView: true };
  }

  return { canView: false, reason: 'followers_only' };
};

/**
 * Check if viewer can see target user's recipes
 */
export const canViewRecipes = async (
  targetUserId: string,
  viewerId?: string
): Promise<PrivacyCheck> => {
  // Owner can always view their own recipes
  if (viewerId && viewerId === targetUserId) {
    return { canView: true };
  }

  // Get privacy settings
  const settings = await getUserPrivacySettings(targetUserId);

  // Check if viewer is blocked
  if (viewerId) {
    const blocked = await isBlockedBy(viewerId, targetUserId);
    if (blocked) {
      return { canView: false, reason: 'blocked' };
    }
  }

  // Check recipe visibility
  if (settings.recipe_visibility === 'public') {
    return { canView: true };
  }

  if (settings.recipe_visibility === 'private') {
    return { canView: false, reason: 'private' };
  }

  // Followers only
  if (!viewerId) {
    return { canView: false, reason: 'not_authenticated' };
  }

  const following = await isFollowing(viewerId, targetUserId);
  if (following) {
    return { canView: true };
  }

  return { canView: false, reason: 'followers_only' };
};

/**
 * Check if viewer can follow target user
 */
export const canFollow = async (
  targetUserId: string,
  viewerId?: string
): Promise<PrivacyCheck> => {
  if (!viewerId) {
    return { canView: false, reason: 'not_authenticated' };
  }

  if (viewerId === targetUserId) {
    return { canView: false };
  }

  // Check if viewer is blocked
  const blocked = await isBlockedBy(viewerId, targetUserId);
  if (blocked) {
    return { canView: false, reason: 'blocked' };
  }

  // Get privacy settings
  const settings = await getUserPrivacySettings(targetUserId);

  if (settings.allow_follows === 'none') {
    return { canView: false, reason: 'private' };
  }

  return { canView: true };
};

/**
 * Filter recipes based on privacy settings
 */
export const filterRecipesByPrivacy = async (
  recipes: any[],
  viewerId?: string
): Promise<any[]> => {
  if (!recipes || recipes.length === 0) return [];

  const filtered = await Promise.all(
    recipes.map(async (recipe) => {
      const check = await canViewRecipes(recipe.user_id, viewerId);
      return check.canView ? recipe : null;
    })
  );

  return filtered.filter(Boolean);
};

export const privacyService = {
  canViewProfile,
  canViewRecipes,
  canFollow,
  filterRecipesByPrivacy,
  isFollowing,
  isBlockedBy,
  getUserPrivacySettings,
};
