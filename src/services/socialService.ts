import { supabase } from '@/integrations/supabase/client';

export interface SuggestedUser {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  recipe_count: number;
  follower_count: number;
}

export interface TrendingUser {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  recent_follower_count: number;
  total_follower_count: number;
  recipe_count: number;
}

export const socialService = {
  async getSuggestedUsers(limit: number = 10): Promise<SuggestedUser[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    try {
      const { data, error } = await supabase.rpc('get_suggested_users', {
        p_current_user_id: user.id,
        p_limit: limit,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      return [];
    }
  },

  async getTrendingUsers(limit: number = 10): Promise<TrendingUser[]> {
    try {
      const { data, error } = await supabase.rpc('get_trending_users', {
        p_limit: limit,
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trending users:', error);
      return [];
    }
  },

  async getRecipeLikeCount(recipeId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_recipe_like_count', {
        p_recipe_id: recipeId,
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error fetching like count:', error);
      return 0;
    }
  },

  async hasUserLikedRecipe(userId: string, recipeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_user_liked_recipe', {
        p_user_id: userId,
        p_recipe_id: recipeId,
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },
};
