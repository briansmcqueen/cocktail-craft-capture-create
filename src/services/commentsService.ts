import { supabase } from "@/integrations/supabase/client";

export interface RecipeComment {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  comment_type: 'comment' | 'tip';
  tip_type?: 'variation' | 'substitution' | 'technique';
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
  const { data, error } = await supabase
    .from('recipe_comments')
    .select(`
      *,
      profiles!recipe_comments_user_id_fkey(
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipe comments:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    recipe_id: item.recipe_id,
    user_id: item.user_id,
    content: item.content,
    comment_type: item.comment_type as 'comment' | 'tip',
    tip_type: item.tip_type as 'variation' | 'substitution' | 'technique' | undefined,
    created_at: item.created_at,
    updated_at: item.updated_at,
    user: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
  }));
}

export async function addComment(
  recipeId: string, 
  content: string, 
  commentType: 'comment' | 'tip' = 'comment',
  tipType?: 'variation' | 'substitution' | 'technique'
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('recipe_comments')
    .insert({
      recipe_id: recipeId,
      user_id: user.id,
      content,
      comment_type: commentType,
      tip_type: tipType
    });

  if (error) {
    console.error('Error adding comment:', error);
    return false;
  }

  return true;
}

export async function updateComment(
  commentId: string,
  content: string,
  tipType?: 'variation' | 'substitution' | 'technique'
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
      tip_type: tipType,
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