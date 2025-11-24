import { supabase } from "@/integrations/supabase/client";
import { privacyService } from "./privacyService";

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserStats {
  followers_count: number;
  following_count: number;
  recipes_count: number;
  favorites_count: number;
}

export interface FollowStats {
  followerCount: number;
  followingCount: number;
}

export async function followUser(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  // Check if follow is allowed
  const privacyCheck = await privacyService.canFollow(userId, user.id);
  if (!privacyCheck.canView) {
    console.log('Cannot follow user due to privacy settings or block');
    return false;
  }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: userId
    });

  if (error) {
    console.error('Error following user:', error);
    return false;
  }

  return true;
}

export async function unfollowUser(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', userId);

  if (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }

  return true;
}

export async function isFollowing(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking follow status:', error);
    return false;
  }

  return !!data;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  // Get followers count
  const { count: followersCount, error: followersError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  // Get following count
  const { count: followingCount, error: followingError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  // Get recipes count
  const { count: recipesCount, error: recipesError } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Get favorites count
  const { count: favoritesCount, error: favoritesError } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (followersError || followingError || recipesError || favoritesError) {
    console.error('Error fetching user stats:', { followersError, followingError, recipesError, favoritesError });
  }

  return {
    followers_count: followersCount || 0,
    following_count: followingCount || 0,
    recipes_count: recipesCount || 0,
    favorites_count: favoritesCount || 0
  };
}

export async function getFollowers(userId: string): Promise<Follow[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('following_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching followers:', error);
    return [];
  }

  return data || [];
}

export async function getFollowing(userId: string): Promise<Follow[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching following:', error);
    return [];
  }

  return data || [];
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
  try {
    const [followerResult, followingResult] = await Promise.all([
      supabase.rpc('get_follower_count', { p_user_id: userId }),
      supabase.rpc('get_following_count', { p_user_id: userId })
    ]);

    return {
      followerCount: followerResult.data || 0,
      followingCount: followingResult.data || 0
    };
  } catch (error) {
    console.error('Error fetching follow stats:', error);
    return { followerCount: 0, followingCount: 0 };
  }
}

export async function getFollowingUserIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  if (error) {
    console.error('Error fetching following users:', error);
    return [];
  }

  return data?.map(f => f.following_id) || [];
}

export async function getFollowedUsersRecipes(limit: number = 20) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  // Get list of users the current user follows
  const followingIds = await getFollowingUserIds();
  
  if (followingIds.length === 0) return [];

  // Fetch recent public recipes from followed users
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      id,
      name,
      description,
      image_url,
      tags,
      created_at,
      rating,
      difficulty,
      user_id,
      ingredients,
      instructions
    `)
    .in('user_id', followingIds)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching followed users recipes:', error);
    return [];
  }

  // Filter recipes based on privacy settings and blocks
  const filteredRecipes: any[] = [];
  for (const recipe of data || []) {
    // Check if user is blocked
    const blocked = await privacyService.isBlockedBy(user.id, recipe.user_id);
    if (blocked) continue;

    // Check recipe visibility
    const canView = await privacyService.canViewRecipes(recipe.user_id, user.id);
    if (canView.canView) {
      filteredRecipes.push(recipe);
    }
  }

  return filteredRecipes;
}

// Export as a service object for consistency with new components
export const followsService = {
  isFollowing,
  followUser,
  unfollowUser,
  getFollowStats,
  getFollowingUserIds,
  getFollowedUsersRecipes,
  getUserStats,
  getFollowers,
  getFollowing
};