import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useRecipeRating } from '@/hooks/useRecipeRatings';

interface RecipeOverallRatingProps {
  recipeId: string;
}

export default function RecipeOverallRating({ recipeId }: RecipeOverallRatingProps) {
  const { rating, loading } = useRecipeRating(recipeId);

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
        {renderStars(rating.averageRating)}
        <span className="font-medium">
          {rating.averageRating > 0 
            ? rating.averageRating.toFixed(1)
            : 'No ratings'
          }
        </span>
        {rating.totalRatings > 0 && (
          <span className="text-white text-sm">
            ({rating.totalRatings} rating{rating.totalRatings !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  );
}