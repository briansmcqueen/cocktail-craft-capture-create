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
  // Optimized: Fetch comments first, then fetch only needed public profile fields via RPC
  const commentsResult = await supabase
    .from('recipe_comments')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false })
    .limit(50); // Limit for better performance

  if (commentsResult.error) {
    console.error('Error fetching recipe comments:', commentsResult.error);
    return [];
  }

  if (!commentsResult.data || commentsResult.data.length === 0) {
    return [];
  }

  // Collect unique user_ids for the comments
  const userIds = Array.from(new Set(commentsResult.data.map((c) => c.user_id)));

  // Fetch only safe public fields for those users via SECURITY DEFINER RPC (bypasses RLS safely)
  type PublicProfile = { id: string; username: string | null; avatar_url: string | null };
  const { data: publicProfiles, error: profilesError } = await supabase
    .rpc('get_public_profiles', { user_ids: userIds as any });

  if (profilesError) {
    console.warn('Warning fetching public profiles (fallback to anonymous):', profilesError);
  }

  // Create a lookup map for profiles for O(1) access
  const profilesMap = new Map<string, PublicProfile>();
  (publicProfiles as PublicProfile[] | null)?.forEach((p) => {
    profilesMap.set(p.id, p);
  });

  // Map comments with user data using the lookup map
  return commentsResult.data.map((comment) => ({
    id: comment.id,
    recipe_id: comment.recipe_id,
    user_id: comment.user_id,
    content: comment.content,
    category: comment.category as 'general' | 'variation' | 'substitution' | 'technique' | 'presentation',
    photo_url: comment.photo_url,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    user: profilesMap.get(comment.user_id) as any,
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

  const { error } = await supabase
    .from('recipe_comments')
    .insert({
      recipe_id: recipeId,
      user_id: user.id,
      content,
      category,
      photo_url: photoUrl
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