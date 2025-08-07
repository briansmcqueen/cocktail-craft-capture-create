import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AggregatedRating } from '@/services/ratingsService';
import { CacheService } from '@/services/cacheService';

interface BatchRatingsHook {
  getRating: (recipeId: string) => AggregatedRating | null;
  isLoading: boolean;
  prefetchRatings: (recipeIds: string[]) => Promise<void>;
}

export function useBatchRatings(): BatchRatingsHook {
  const [isLoading, setIsLoading] = useState(false);

  const getRating = useCallback((recipeId: string): AggregatedRating | null => {
    return CacheService.getRating(recipeId);
  }, []);

  const prefetchRatings = useCallback(async (recipeIds: string[]): Promise<void> => {
    if (recipeIds.length === 0) return;

    // Filter out already cached ratings
    const uncachedIds = recipeIds.filter(id => !CacheService.getRating(id));
    if (uncachedIds.length === 0) return;

    const batchKey = `batch_ratings_${uncachedIds.sort().join(',')}`;
    
    // Check if this batch is already being fetched
    const existingPromise = CacheService.getBatchPromise<Record<string, AggregatedRating>>(batchKey);
    if (existingPromise) {
      await existingPromise;
      return;
    }

    setIsLoading(true);

    // Create the batch fetch promise
    const batchPromise = fetchRatingsBatch(uncachedIds);
    CacheService.setBatchPromise(batchKey, batchPromise);

    try {
      const ratings = await batchPromise;
      CacheService.setBatchRatings(ratings);
    } catch (error) {
      console.error('Error fetching batch ratings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getRating,
    isLoading,
    prefetchRatings
  };
}

async function fetchRatingsBatch(recipeIds: string[]): Promise<Record<string, AggregatedRating>> {
  if (recipeIds.length === 0) return {};

  try {
    // Fetch all ratings for the given recipe IDs in a single query
    const { data: ratings, error } = await supabase
      .from('recipe_ratings')
      .select('recipe_id, rating')
      .in('recipe_id', recipeIds);

    if (error) {
      console.error('Error fetching batch ratings:', error);
      return {};
    }

    // Group ratings by recipe_id and calculate aggregated data
    const groupedRatings: Record<string, number[]> = {};
    
    ratings?.forEach(rating => {
      if (!groupedRatings[rating.recipe_id]) {
        groupedRatings[rating.recipe_id] = [];
      }
      groupedRatings[rating.recipe_id].push(rating.rating);
    });

    // Calculate aggregated ratings for each recipe
    const result: Record<string, AggregatedRating> = {};
    
    recipeIds.forEach(recipeId => {
      const recipeRatings = groupedRatings[recipeId] || [];
      
      if (recipeRatings.length === 0) {
        result[recipeId] = {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: {}
        };
      } else {
        const sum = recipeRatings.reduce((acc, rating) => acc + rating, 0);
        const averageRating = sum / recipeRatings.length;
        
        const ratingDistribution: { [key: number]: number } = {};
        recipeRatings.forEach(rating => {
          ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
        });

        result[recipeId] = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: recipeRatings.length,
          ratingDistribution
        };
      }
    });

    return result;
  } catch (error) {
    console.error('Error in fetchRatingsBatch:', error);
    return {};
  }
}