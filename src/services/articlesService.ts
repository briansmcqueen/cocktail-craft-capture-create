import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  author_id: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  source_url?: string;
  source_name?: string;
  is_published: boolean;
  slug?: string;
  tags: string[];
  author?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const articlesService = {
  async getPublishedArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'author'>): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteArticle(id: string): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};