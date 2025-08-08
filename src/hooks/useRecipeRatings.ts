import { useState, useEffect } from 'react';
import { ratingsCache } from '@/services/ratingsCache';
import { getAggregatedRating, getAggregatedRatingsBatch } from '@/services/ratingsService';

interface RatingData {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<string, number>;
}

export function useRecipeRatings(recipeIds: string[]) {
  const [ratings, setRatings] = useState<Map<string, RatingData>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipeIds.length === 0) return;

    const fetchRatings = async () => {
      setLoading(true);
      try {
        const uniqueIds = Array.from(new Set(recipeIds));

        // Pull from cache first
        const cachedMap = new Map<string, RatingData>();
        const toFetch: string[] = [];
        for (const id of uniqueIds) {
          const cached = ratingsCache.get(id);
          if (cached) {
            cachedMap.set(id, {
              averageRating: cached.averageRating,
              totalRatings: cached.totalRatings,
              ratingDistribution: cached.ratingDistribution
            });
          } else {
            toFetch.push(id);
          }
        }

        // Batch fetch missing ids in a single RPC
        if (toFetch.length > 0) {
          const batch = await getAggregatedRatingsBatch(toFetch);
          for (const id of toFetch) {
            const aggregated = batch[id] || { averageRating: 0, totalRatings: 0, ratingDistribution: {} };
            const data = {
              averageRating: aggregated.averageRating,
              totalRatings: aggregated.totalRatings,
              ratingDistribution: aggregated.ratingDistribution
            };
            ratingsCache.set(id, data);
            cachedMap.set(id, data);
          }
        }

        setRatings(cachedMap);
      } catch (error) {
        console.error('Error batch fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [recipeIds.join(',')]); // Use join to create stable dependency

  const getRating = (recipeId: string): RatingData => {
    return ratings.get(recipeId) || {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {}
    };
  };

  return {
    ratings,
    loading,
    getRating
  };
}

export function useRecipeRating(recipeId: string) {
  const [rating, setRating] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recipeId) return;

    const fetchRating = async () => {
      setLoading(true);
      try {
        const ratingData = await ratingsCache.getOrFetch(recipeId, async (id) => {
          const aggregated = await getAggregatedRating(id);
          return {
            averageRating: aggregated.averageRating,
            totalRatings: aggregated.totalRatings,
            ratingDistribution: aggregated.ratingDistribution
          };
        });
        
        setRating({
          averageRating: ratingData.averageRating,
          totalRatings: ratingData.totalRatings,
          ratingDistribution: ratingData.ratingDistribution
        });
      } catch (error) {
        console.error('Error fetching rating:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [recipeId]);

  return {
    rating,
    loading
  };
}