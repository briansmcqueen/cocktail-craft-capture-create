import { supabase } from "@/integrations/supabase/client";

export async function getUserLikes(): Promise<string[]> {
  const { data, error } = await supabase
    .from('likes')
    .select('recipe_id')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching likes:', error);
    return [];
  }

  return data?.map(item => item.recipe_id) || [];
}

export async function addLike(recipeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('likes')
    .insert({
      user_id: user.id,
      recipe_id: recipeId
    });

  if (error) {
    console.error('Error adding like:', error);
    return false;
  }

  return true;
}

export async function removeLike(recipeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('Error removing like:', error);
    return false;
  }

  return true;
}

export async function toggleLikeInDB(recipeId: string): Promise<boolean> {
  const likes = await getUserLikes();
  const isLiked = likes.includes(recipeId);
  
  if (isLiked) {
    return await removeLike(recipeId);
  } else {
    return await addLike(recipeId);
  }
}

export async function syncLikesFromLocalStorage(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  // Get existing localStorage data - this would be complex to parse from the existing format
  // For now, we'll just clear it and start fresh with Supabase
  const localLikesKey = "barbook_likes";
  localStorage.removeItem(localLikesKey);
}

export async function getRecipeLikeCount(recipeId: string): Promise<number> {
  const { data } = await supabase.rpc('get_recipe_like_count', { 
    p_recipe_id: recipeId 
  });
  
  return data || 0;
}

export async function getRecipesLikeCounts(recipeIds: string[]): Promise<Record<string, number>> {
  if (recipeIds.length === 0) return {};
  
  const { data, error } = await supabase
    .from('likes')
    .select('recipe_id')
    .in('recipe_id', recipeIds);
  
  if (error) {
    console.error('Error fetching like counts:', error);
    return {};
  }
  
  // Count likes per recipe
  const counts: Record<string, number> = {};
  data?.forEach(like => {
    counts[like.recipe_id] = (counts[like.recipe_id] || 0) + 1;
  });
  
  return counts;
}