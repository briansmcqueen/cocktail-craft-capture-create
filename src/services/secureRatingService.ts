import { supabase } from "@/integrations/supabase/client";

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<string, number>;
}

// Input validation
const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

const sanitizeReview = (review: string): string => {
  return review
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters  
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, 1000)
    .trim();
};

export const secureRatingService = {
  async getRatingStats(recipeId: string): Promise<RatingStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_safe_rating_stats', { p_recipe_id: recipeId });
      
      if (error) throw error;
      
      // Safely handle the database response type
      if (data && typeof data === 'object') {
        const stats = data as unknown as RatingStats;
        return stats;
      }
      
      return { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      return { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
    }
  },

  async getUserRating(recipeId: string): Promise<{ rating: number; review?: string } | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    try {
      const { data, error } = await supabase
        .from('recipe_ratings')
        .select('rating, review')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      throw error;
    }
  },

  async submitRating(recipeId: string, rating: number, review?: string): Promise<void> {
    // Rate limiting check
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', { 
        p_user_id: user.user.id, 
        p_action: 'submit_rating',
        p_limit: 20, // 20 ratings per hour
        p_window_minutes: 60
      });

    if (rateLimitError) throw rateLimitError;
    if (!rateLimitCheck) throw new Error('Rate limit exceeded. Please wait before submitting more ratings.');

    // Validate input
    if (!validateRating(rating)) {
      throw new Error('Rating must be an integer between 1 and 5');
    }

    const sanitizedReview = review ? sanitizeReview(review) : null;

    try {
      const { error } = await supabase
        .from('recipe_ratings')
        .upsert({
          recipe_id: recipeId,
          user_id: user.user.id,
          rating,
          review: sanitizedReview,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,recipe_id'
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  },

  async deleteRating(recipeId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('recipe_ratings')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', user.user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting rating:', error);
      throw error;
    }
  }
};