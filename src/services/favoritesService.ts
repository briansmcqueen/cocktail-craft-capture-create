import { supabase } from "@/integrations/supabase/client";

export interface FavoriteWithVisibility {
  id: string;
  recipe_id: string;
  is_public: boolean;
  created_at: string;
}

export async function getUserFavorites(): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('recipe_id')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data?.map(item => item.recipe_id) || [];
}

export async function getUserFavoritesWithVisibility(): Promise<FavoriteWithVisibility[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id, recipe_id, is_public, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites with visibility:', error);
    return [];
  }

  return data || [];
}

export async function toggleFavoriteVisibility(favoriteId: string, isPublic: boolean): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('favorites')
    .update({ is_public: isPublic })
    .eq('id', favoriteId)
    .eq('user_id', user.id); // Ensure user can only update their own favorites

  if (error) {
    console.error('Error toggling favorite visibility:', error);
    return false;
  }

  return true;
}

export async function addFavorite(recipeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  // Generate a proper UUID for the record ID since recipe_id might not be a valid UUID
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      recipe_id: recipeId
    });

  if (error) {
    console.error('Error adding favorite:', error);
    return false;
  }

  return true;
}

export async function removeFavorite(recipeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
}

export async function toggleFavoriteInDB(recipeId: string): Promise<boolean> {
  const favorites = await getUserFavorites();
  const isFavorite = favorites.includes(recipeId);
  
  if (isFavorite) {
    return await removeFavorite(recipeId);
  } else {
    return await addFavorite(recipeId);
  }
}

export async function syncFavoritesFromLocalStorage(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  // Get existing localStorage data
  const localFavoritesKey = "barbook_favorites";
  const localFavorites = localStorage.getItem(localFavoritesKey);
  
  if (!localFavorites) return;

  try {
    const favoriteIds: string[] = JSON.parse(localFavorites);
    
    // Add all favorites to Supabase
    for (const recipeId of favoriteIds) {
      await addFavorite(recipeId);
    }
    
    // Clear localStorage after successful sync
    localStorage.removeItem(localFavoritesKey);
  } catch (error) {
    console.error('Error syncing favorites from localStorage:', error);
  }
}