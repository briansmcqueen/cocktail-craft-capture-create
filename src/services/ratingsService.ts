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

// OPTIMIZED: Use database aggregation instead of client-side processing
export async function getAggregatedRating(recipeId: string): Promise<AggregatedRating> {
  const { data, error } = await supabase
    .rpc('get_recipe_rating_stats', { p_recipe_id: recipeId });

  if (error) {
    console.error('Error fetching aggregated rating:', error);
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {}
    };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {}
    };
  }

  // Type guard for the expected structure
  const result = data as Record<string, any>;
  return {
    averageRating: typeof result.averageRating === 'number' ? result.averageRating : 0,
    totalRatings: typeof result.totalRatings === 'number' ? result.totalRatings : 0,
    ratingDistribution: typeof result.ratingDistribution === 'object' ? result.ratingDistribution : {}
  };
}

export async function getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false })
    .limit(50); // Add limit to prevent large data fetches

  if (error) {
    console.error('Error fetching recipe ratings:', error);
    return [];
  }

  return data || [];
}

export async function getUserRating(recipeId: string): Promise<RecipeRating | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('recipe_id', recipeId)
    .eq('user_id', user.id)
    .maybeSingle(); // Use maybeSingle instead of single

  if (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }

  return data;
}