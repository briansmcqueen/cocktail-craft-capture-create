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

// Input validation
const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

// Basic sanitization — React escapes output by default.
// TODO: Use DOMPurify if raw HTML rendering is ever needed.
const sanitizeReview = (review: string): string => {
  return review.slice(0, 1000).trim();
};

// --- Read functions ---

export async function getAggregatedRating(recipeId: string): Promise<AggregatedRating> {
  const { data, error } = await supabase
    .rpc('get_recipe_rating_stats', { p_recipe_id: recipeId });

  if (error) {
    console.error('Error fetching aggregated rating:', error);
    return { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
  }

  const result = data as Record<string, any>;
  return {
    averageRating: typeof result.averageRating === 'number' ? result.averageRating : 0,
    totalRatings: typeof result.totalRatings === 'number' ? result.totalRatings : 0,
    ratingDistribution: typeof result.ratingDistribution === 'object' ? result.ratingDistribution : {}
  };
}

export async function getAggregatedRatingsBatch(recipeIds: string[]): Promise<Record<string, AggregatedRating>> {
  if (recipeIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .rpc('get_recipe_rating_stats_batch', { p_recipe_ids: recipeIds });

    if (error) {
      console.error('Error fetching batch aggregated ratings:', error);
      const entries = await Promise.all(
        recipeIds.map(async (id) => {
          const single = await getAggregatedRating(id);
          return [id, single] as const;
        })
      );
      return Object.fromEntries(entries);
    }

    const result: Record<string, AggregatedRating> = {};
    (data as any[] | null)?.forEach((row: any) => {
      if (!row) return;
      const rid = String(row.recipe_id);
      result[rid] = {
        averageRating: typeof row.averageRating === 'number' ? row.averageRating : 0,
        totalRatings: typeof row.totalRatings === 'number' ? row.totalRatings : 0,
        ratingDistribution: typeof row.ratingDistribution === 'object' && row.ratingDistribution !== null ? row.ratingDistribution : {}
      };
    });

    for (const id of recipeIds) {
      if (!result[id]) {
        result[id] = { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
      }
    }

    return result;
  } catch (err) {
    console.error('Unexpected batch rating error:', err);
    const entries = await Promise.all(
      recipeIds.map(async (id) => {
        const single = await getAggregatedRating(id);
        return [id, single] as const;
      })
    );
    return Object.fromEntries(entries);
  }
}

export async function getRatingStats(recipeId: string): Promise<AggregatedRating> {
  try {
    const { data, error } = await supabase
      .rpc('get_safe_rating_stats', { p_recipe_id: recipeId });
    
    if (error) throw error;
    
    if (data && typeof data === 'object') {
      const stats = data as unknown as AggregatedRating;
      return stats;
    }
    
    return { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    return { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
  }
}

export async function getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
  const { data, error } = await supabase
    .from('recipe_ratings')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false })
    .limit(50);

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
    .maybeSingle();

  if (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }

  return data;
}

// --- Write functions (with validation + rate limiting) ---

export async function rateRecipe(recipeId: string, rating: number, review?: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  // Rate limiting
  const { data: rateLimitCheck, error: rateLimitError } = await supabase
    .rpc('check_rate_limit', { 
      p_user_id: user.id, 
      p_action: 'submit_rating',
      p_limit: 20,
      p_window_minutes: 60
    });

  if (rateLimitError) {
    console.error('Rate limit check error:', rateLimitError);
    return false;
  }
  if (!rateLimitCheck) {
    console.error('Rate limit exceeded');
    return false;
  }

  if (!validateRating(rating)) {
    console.error('Rating must be an integer between 1 and 5');
    return false;
  }

  const sanitizedReview = review ? sanitizeReview(review) : null;

  const { error } = await supabase
    .from('recipe_ratings')
    .upsert({
      user_id: user.id,
      recipe_id: recipeId,
      rating,
      review: sanitizedReview,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,recipe_id'
    });

  if (error) {
    console.error('Error rating recipe:', error);
    return false;
  }

  return true;
}

export async function deleteRating(recipeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('recipe_ratings')
    .delete()
    .eq('recipe_id', recipeId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting rating:', error);
    return false;
  }

  return true;
}

// Legacy export for components still using the object-style API
export const secureRatingService = {
  getRatingStats,
  getUserRating: async (recipeId: string) => {
    const rating = await getUserRating(recipeId);
    return rating ? { rating: rating.rating, review: rating.review } : null;
  },
  submitRating: async (recipeId: string, rating: number, review?: string) => {
    const success = await rateRecipe(recipeId, rating, review);
    if (!success) throw new Error('Failed to submit rating');
  },
  deleteRating: async (recipeId: string) => {
    const success = await deleteRating(recipeId);
    if (!success) throw new Error('Failed to delete rating');
  }
};
