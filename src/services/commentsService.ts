import { supabase } from "@/integrations/supabase/client";

export interface RecipeComment {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  category: 'general' | 'variation' | 'substitution' | 'technique' | 'presentation';
  photo_url?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function getRecipeComments(recipeId: string): Promise<RecipeComment[]> {
  // Use SECURITY DEFINER RPC so we never expose recipe_comments.user_id to anonymous visitors.
  const { data, error } = await supabase.rpc('get_safe_comment_data', { p_recipe_id: recipeId });

  if (error) {
    console.error('Error fetching recipe comments:', error);
    return [];
  }

  if (!data || data.length === 0) return [];

  return (data as any[]).slice(0, 50).map((row) => ({
    id: row.id,
    recipe_id: row.recipe_id,
    user_id: row.user_id,
    content: row.content,
    category: row.category as 'general' | 'variation' | 'substitution' | 'technique' | 'presentation',
    photo_url: row.photo_url ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: {
      id: row.user_id,
      username: row.user_display_name ?? null,
      full_name: row.user_display_name ?? null,
      avatar_url: row.user_avatar_url ?? null,
    },
  }));
}

export async function addComment(
  recipeId: string, 
  content: string, 
  category: 'general' | 'variation' | 'substitution' | 'technique' | 'presentation' = 'general',
  photoUrl?: string
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  // Get the recipe to find the author
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('user_id, name')
    .eq('id', recipeId)
    .single();

  if (recipeError) {
    console.error('Error fetching recipe:', recipeError);
    return false;
  }

  const { data: comment, error } = await supabase
    .from('recipe_comments')
    .insert({
      recipe_id: recipeId,
      user_id: user.id,
      content,
      category,
      photo_url: photoUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return false;
  }

  // Create notification for the recipe author via SECURITY DEFINER RPC.
  // The RPC validates that the caller is the comment author and resolves
  // the recipient (recipe author) server-side, preventing forged inboxes.
  if (recipe && recipe.user_id !== user.id) {
    const { error: notificationError } = await supabase.rpc(
      'create_comment_notification',
      { p_comment_id: comment.id }
    );

    if (notificationError) {
      console.error('Error creating comment notification:', notificationError);
    }
  }

  return true;
}

export async function updateComment(
  commentId: string,
  content: string,
  category?: 'general' | 'variation' | 'substitution' | 'technique' | 'presentation',
  photoUrl?: string
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('recipe_comments')
    .update({
      content,
      category,
      photo_url: photoUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating comment:', error);
    return false;
  }

  return true;
}

export async function deleteComment(commentId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('recipe_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}

export async function getRecipesCommentCounts(recipeIds: string[]): Promise<Record<string, number>> {
  if (recipeIds.length === 0) return {};
  
  const { data, error } = await supabase
    .from('recipe_comments')
    .select('recipe_id')
    .in('recipe_id', recipeIds);
  
  if (error) {
    console.error('Error fetching comment counts:', error);
    return {};
  }
  
  // Count comments per recipe
  const counts: Record<string, number> = {};
  data?.forEach(comment => {
    counts[comment.recipe_id] = (counts[comment.recipe_id] || 0) + 1;
  });
  
  return counts;
}