import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getAggregatedRating, type AggregatedRating } from '@/services/ratingsService';

interface RecipeOverallRatingProps {
  recipeId: string;
}

export default function RecipeOverallRating({ recipeId }: RecipeOverallRatingProps) {
  const [aggregatedRating, setAggregatedRating] = useState<AggregatedRating>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recipeId) {
      fetchRatings();
    }
  }, [recipeId]);

  const fetchRatings = async () => {
    if (!recipeId) return;
    
    setLoading(true);
    try {
      const aggregated = await getAggregatedRating(recipeId);
      setAggregatedRating(aggregated);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {renderStars(aggregatedRating.averageRating)}
        <span className="font-medium">
          {aggregatedRating.averageRating > 0 
            ? aggregatedRating.averageRating.toFixed(1)
            : 'No ratings'
          }
        </span>
        {aggregatedRating.totalRatings > 0 && (
          <span className="text-white text-sm">
            ({aggregatedRating.totalRatings} rating{aggregatedRating.totalRatings !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  );
}