import { supabase } from "@/integrations/supabase/client";
import { privacyService } from "./privacyService";

export interface PublicProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface PublicRecipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
  rating: number | null;
  difficulty: string | null;
}

export const publicProfileService = {
  async getProfileByUsername(username: string): Promise<PublicProfile | null> {
    const { data, error } = await supabase
      .rpc('get_public_profile_by_username', { p_username: username })
      .maybeSingle();

    if (error) {
      console.error('Error fetching public profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Check privacy settings
    const { data: { user } } = await supabase.auth.getUser();
    const privacyCheck = await privacyService.canViewProfile(data.id, user?.id);
    
    if (!privacyCheck.canView) {
      console.log('Profile not accessible due to privacy settings');
      return null;
    }

    // Fetch additional profile info not returned by the function
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, bio')
      .eq('id', data.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile details:', profileError);
    }

    return {
      id: data.id,
      username: data.username,
      avatar_url: data.avatar_url,
      full_name: profileData?.full_name || null,
      bio: profileData?.bio || null,
    };
  },

  async getUserPublicRecipes(userId: string): Promise<PublicRecipe[]> {
    // Check privacy settings
    const { data: { user } } = await supabase.auth.getUser();
    const privacyCheck = await privacyService.canViewRecipes(userId, user?.id);
    
    if (!privacyCheck.canView) {
      console.log('Recipes not accessible due to privacy settings');
      return [];
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, description, image_url, tags, created_at, rating, difficulty')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user recipes:', error);
      return [];
    }

    return data || [];
  },

  async getUserPublicFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', userId)
      .eq('is_public', true);

    if (error) {
      console.error('Error fetching user favorites:', error);
      return [];
    }

    return data?.map(f => f.recipe_id) || [];
  },

  async toggleFavoriteVisibility(favoriteId: string, isPublic: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('favorites')
      .update({ is_public: isPublic })
      .eq('id', favoriteId);

    if (error) {
      console.error('Error updating favorite visibility:', error);
      return false;
    }

    return true;
  }
};
