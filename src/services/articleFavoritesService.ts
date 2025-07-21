import { supabase } from "@/integrations/supabase/client";

export const articleFavoritesService = {
  async getFavoriteArticles(): Promise<string[]> {
    const { data, error } = await supabase
      .from('article_favorites')
      .select('article_id');

    if (error) throw error;
    return data?.map(fav => fav.article_id) || [];
  },

  async toggleFavorite(articleId: string): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: existing } = await supabase
      .from('article_favorites')
      .select('id')
      .eq('article_id', articleId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('article_favorites')
        .delete()
        .eq('article_id', articleId);
      
      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('article_favorites')
        .insert({
          article_id: articleId,
          user_id: user.user.id
        });
      
      if (error) throw error;
      return true;
    }
  },

  async isFavorite(articleId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('article_favorites')
      .select('id')
      .eq('article_id', articleId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};