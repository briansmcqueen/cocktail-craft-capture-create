import { supabase } from "@/integrations/supabase/client";

interface CommentData {
  id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  photo_url?: string;
  category: string;
  user_display_name: string;
  user_avatar_url?: string;
}

// Input sanitization utility
const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters  
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*['"]/gi, '') // Remove event handlers
    .slice(0, maxLength)
    .trim();
};

const validateComment = (content: string): boolean => {
  return content.length >= 1 && content.length <= 1000;
};

export const secureCommentService = {
  async getComments(recipeId: string): Promise<CommentData[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_safe_comment_data', { p_recipe_id: recipeId });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async createComment(recipeId: string, content: string, photoUrl?: string): Promise<void> {
    // Rate limiting check
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', { 
        p_user_id: user.user.id, 
        p_action: 'create_comment',
        p_limit: 5, // 5 comments per hour
        p_window_minutes: 60
      });

    if (rateLimitError) throw rateLimitError;
    if (!rateLimitCheck) throw new Error('Rate limit exceeded. Please wait before posting another comment.');

    // Sanitize and validate input
    const sanitizedContent = sanitizeInput(content, 1000);
    if (!validateComment(sanitizedContent)) {
      throw new Error('Comment must be between 1 and 1000 characters');
    }

    const sanitizedPhotoUrl = photoUrl ? sanitizeInput(photoUrl, 500) : null;

    try {
      const { error } = await supabase
        .from('recipe_comments')
        .insert({
          recipe_id: recipeId,
          content: sanitizedContent,
          photo_url: sanitizedPhotoUrl,
          user_id: user.user.id
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  async updateComment(commentId: string, content: string): Promise<void> {
    // Rate limiting check
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', { 
        p_user_id: user.user.id, 
        p_action: 'update_comment',
        p_limit: 10, // 10 updates per hour
        p_window_minutes: 60
      });

    if (rateLimitError) throw rateLimitError;
    if (!rateLimitCheck) throw new Error('Rate limit exceeded. Please wait before making more updates.');

    // Sanitize and validate input
    const sanitizedContent = sanitizeInput(content, 1000);
    if (!validateComment(sanitizedContent)) {
      throw new Error('Comment must be between 1 and 1000 characters');
    }

    try {
      const { error } = await supabase
        .from('recipe_comments')
        .update({ 
          content: sanitizedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user.user.id); // Ensure user can only update their own comments
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('recipe_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.user.id); // Ensure user can only delete their own comments
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};