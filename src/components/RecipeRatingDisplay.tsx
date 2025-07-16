import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getAggregatedRating, getUserRating, rateRecipe, type AggregatedRating, type RecipeRating } from '@/services/ratingsService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface RecipeRatingDisplayProps {
  recipeId: string;
}

export default function RecipeRatingDisplay({ recipeId }: RecipeRatingDisplayProps) {
  const { user } = useAuth();
  const [aggregatedRating, setAggregatedRating] = useState<AggregatedRating>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: {}
  });
  const [userRating, setUserRating] = useState<RecipeRating | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [recipeId, user]);

  const fetchRatings = async () => {
    setLoading(true);
    
    // Fetch aggregated rating
    const aggregated = await getAggregatedRating(recipeId);
    setAggregatedRating(aggregated);

    // Fetch user's rating if logged in
    if (user) {
      const userRatingData = await getUserRating(recipeId);
      setUserRating(userRatingData);
    }

    setLoading(false);
  };

  const handleRating = async (rating: number) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to rate this recipe",
        variant: "destructive",
      });
      return;
    }

    const success = await rateRecipe(recipeId, rating);
    if (success) {
      await fetchRatings();
      toast({
        title: "Rating submitted",
        description: `You rated this recipe ${rating} star${rating !== 1 ? 's' : ''}`,
      });
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
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
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={interactive ? () => handleRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Rating Display */}
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
            <span className="text-gray-500 text-sm">
              ({aggregatedRating.totalRatings} rating{aggregatedRating.totalRatings !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      </div>

      {/* User Rating Section */}
      {user && (
        <div className="border-t pt-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {userRating ? 'Your rating:' : 'Rate this recipe:'}
            </p>
            <div className="flex items-center gap-2">
              {renderStars(hoveredRating || userRating?.rating || 0, true)}
              {userRating && (
                <span className="text-sm text-gray-600">
                  ({userRating.rating} star{userRating.rating !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Distribution (Optional - for detailed view) */}
      {aggregatedRating.totalRatings > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = aggregatedRating.ratingDistribution[star] || 0;
            const percentage = (count / aggregatedRating.totalRatings) * 100;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}