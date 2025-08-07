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
  // Optimized: Use parallel queries and limit results
  const [commentsResult, profilesResult] = await Promise.all([
    supabase
      .from('recipe_comments')
      .select('*')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false })
      .limit(50), // Limit for better performance
    
    // Get all profiles that might be needed in a single query
    supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
  ]);

  if (commentsResult.error) {
    console.error('Error fetching recipe comments:', commentsResult.error);
    return [];
  }

  if (!commentsResult.data || commentsResult.data.length === 0) {
    return [];
  }

  // Create a lookup map for profiles for O(1) access
  const profilesMap = new Map();
  if (profilesResult.data) {
    profilesResult.data.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
  }

  // Map comments with user data using the lookup map
  return commentsResult.data.map(comment => ({
    id: comment.id,
    recipe_id: comment.recipe_id,
    user_id: comment.user_id,
    content: comment.content,
    category: comment.category as 'general' | 'variation' | 'substitution' | 'technique' | 'presentation',
    photo_url: comment.photo_url,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
    user: profilesMap.get(comment.user_id)
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