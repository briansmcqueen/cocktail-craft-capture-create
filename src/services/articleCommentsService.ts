import { supabase } from "@/integrations/supabase/client";

export interface ArticleComment {
  id: string;
  user_id: string;
  article_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const articleCommentsService = {
  async getCommentsByArticleId(articleId: string): Promise<ArticleComment[]> {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addComment(articleId: string, content: string): Promise<ArticleComment> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('article_comments')
      .insert({
        article_id: articleId,
        content,
        user_id: user.user.id
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('article_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }
};