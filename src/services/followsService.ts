import { supabase } from "@/integrations/supabase/client";

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
}

export async function followUser(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
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

  if (followersError || followingError || recipesError) {
    console.error('Error fetching user stats:', { followersError, followingError, recipesError });
  }

  return {
    followers_count: followersCount || 0,
    following_count: followingCount || 0,
    recipes_count: recipesCount || 0
  };
}

export async function getFollowers(userId: string): Promise<Follow[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      *,
      follower:profiles!follows_follower_id_fkey(*)
    `)
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
    .select(`
      *,
      following:profiles!follows_following_id_fkey(*)
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching following:', error);
    return [];
  }

  return data || [];
}