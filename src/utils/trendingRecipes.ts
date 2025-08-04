import { Cocktail } from "@/data/classicCocktails";
import { getAggregatedRating } from "@/services/ratingsService";

export interface RecipeWithPopularityScore extends Cocktail {
  popularityScore: number;
  averageRating: number;
  totalRatings: number;
}

/**
 * Calculate a popularity score that balances rating quality with review count
 * Uses a Bayesian average approach to prevent skewing from recipes with few reviews
 */
function calculatePopularityScore(averageRating: number, totalRatings: number): number {
  // Minimum number of ratings to be considered "established"
  const minimumRatings = 3;
  
  // Global average rating (assuming 3.5 as a reasonable baseline)
  const globalAverage = 3.5;
  
  // Bayesian average formula: (v/(v+m)) * R + (m/(v+m)) * C
  // where:
  // v = number of ratings for this recipe
  // m = minimum number of ratings required
  // R = average rating for this recipe
  // C = global average rating
  
  const bayesianAverage = (totalRatings / (totalRatings + minimumRatings)) * averageRating + 
                         (minimumRatings / (totalRatings + minimumRatings)) * globalAverage;
  
  // Apply a logarithmic boost for review count to reward popular recipes
  // but prevent pure volume from dominating quality
  const reviewCountMultiplier = Math.log(totalRatings + 1) / Math.log(10);
  
  // Final score combines quality (Bayesian average) with popularity (review count)
  return bayesianAverage * (1 + reviewCountMultiplier * 0.2);
}

/**
 * Get the top trending recipes based on a combination of rating quality and review count
 */
export async function getTrendingRecipesByRating(
  allRecipes: Cocktail[], 
  limit: number = 10
): Promise<RecipeWithPopularityScore[]> {
  try {
    // Fetch rating data for all recipes in parallel
    const recipesWithRatings = await Promise.all(
      allRecipes.map(async (recipe) => {
        const ratingData = await getAggregatedRating(recipe.id);
        
        const popularityScore = calculatePopularityScore(
          ratingData.averageRating, 
          ratingData.totalRatings
        );
        
        return {
          ...recipe,
          popularityScore,
          averageRating: ratingData.averageRating,
          totalRatings: ratingData.totalRatings
        } as RecipeWithPopularityScore;
      })
    );
    
    // Filter out recipes with no ratings and sort by popularity score
    return recipesWithRatings
      .filter(recipe => recipe.totalRatings > 0) // Only include recipes with at least 1 rating
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error fetching trending recipes:', error);
    return [];
  }
}

/**
 * Get trending recipes with fallback to the old system if no ratings exist
 */
export async function getTrendingRecipesHybrid(
  allRecipes: Cocktail[], 
  limit: number = 10
): Promise<Cocktail[]> {
  // Try the new rating-based system first
  const ratingBasedTrending = await getTrendingRecipesByRating(allRecipes, limit);
  
  // If we have enough recipes with ratings, use those
  if (ratingBasedTrending.length >= Math.min(5, limit)) {
    return ratingBasedTrending;
  }
  
  // Otherwise, fall back to the old like-based system and combine
  const { getTrendingRecipes } = await import('./likes');
  const likeBasedTrending = getTrendingRecipes(allRecipes);
  
  // Combine both systems, prioritizing rating-based results
  const combined = [
    ...ratingBasedTrending,
    ...likeBasedTrending.filter(recipe => 
      !ratingBasedTrending.some(ratedRecipe => ratedRecipe.id === recipe.id)
    )
  ];
  
  return combined.slice(0, limit);
}
