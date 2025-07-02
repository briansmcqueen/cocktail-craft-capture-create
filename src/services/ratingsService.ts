import { supabase } from "@/integrations/supabase/client";

export interface RecipeRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface AggregatedRating {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
}

export async function rateRecipe(recipeId: string, rating: number, review?: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('recipe_ratings')
    .upsert({
      user_id: user.id,
      recipe_id: recipeId,
      rating,
      review
    });

  if (error) {
    console.error('Error rating recipe:', error);
    return false;
  }

  return true;
}

export async function getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipe ratings:', error);
    return [];
  }

  return data || [];
}

export async function getAggregatedRating(recipeId: string): Promise<AggregatedRating> {
  const ratings = await getRecipeRatings(recipeId);
  
  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {}
    };
  }

  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const averageRating = sum / ratings.length;
  
  const ratingDistribution: { [key: number]: number } = {};
  ratings.forEach(rating => {
    ratingDistribution[rating.rating] = (ratingDistribution[rating.rating] || 0) + 1;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalRatings: ratings.length,
    ratingDistribution
  };
}

export async function getUserRating(recipeId: string): Promise<RecipeRating | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('recipe_id', recipeId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user rating:', error);
    return null;
  }

  return data;
}