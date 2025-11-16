import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getUserRating, rateRecipe, type RecipeRating } from '@/services/ratingsService';
import { useRecipeRating } from '@/hooks/useRecipeRatings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ratingsCache } from '@/services/ratingsCache';

interface RecipeRatingDisplayProps {
  recipeId: string;
}

export default function RecipeRatingDisplay({ recipeId }: RecipeRatingDisplayProps) {
  const { user } = useAuth();
  const { rating: aggregatedRating, loading } = useRecipeRating(recipeId);
  const [userRating, setUserRating] = useState<RecipeRating | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userLoading, setUserLoading] = useState(false);

  // Local optimistic aggregate state for instant UI updates
  const [displayedAggregated, setDisplayedAggregated] = useState(aggregatedRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      setDisplayedAggregated(aggregatedRating);
    }
  }, [aggregatedRating, isSubmitting]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!user || !recipeId) return;
      
      setUserLoading(true);
      const userRatingData = await getUserRating(recipeId);
      setUserRating(userRatingData);
      setUserLoading(false);
    };

    fetchUserRating();
  }, [recipeId, user]);

  const handleRating = async (newRating: number) => {
    if (!user) {
      toast({
        title: '🍸 Join the Community!',
        description: 'Create a free account to rate recipes and share your feedback with other bartenders!',
      });
      return;
    }

    // Optimistic aggregate update
    const prevUserRating = userRating?.rating;
    const prevAgg = displayedAggregated;

    const prevTotal = prevAgg.totalRatings;
    const prevSum = prevAgg.averageRating * prevTotal;

    const nextTotal = prevUserRating ? prevTotal : prevTotal + 1;
    const adjustedSum = prevUserRating ? prevSum - prevUserRating + newRating : prevSum + newRating;
    const nextAverage = nextTotal === 0 ? 0 : Math.round((adjustedSum / nextTotal) * 10) / 10;

    const nextDist: Record<string, number> = { ...prevAgg.ratingDistribution };
    if (prevUserRating) {
      const key = String(prevUserRating);
      nextDist[key] = Math.max(0, (nextDist[key] || 0) - 1);
    }
    const newKey = String(newRating);
    nextDist[newKey] = (nextDist[newKey] || 0) + 1;

    const optimisticAgg = {
      averageRating: nextAverage,
      totalRatings: nextTotal,
      ratingDistribution: nextDist,
    };

    // Apply optimistic UI
    setIsSubmitting(true);
    setUserRating({
      id: `temp-${Date.now()}`,
      user_id: user.id,
      recipe_id: recipeId,
      rating: newRating,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      review: undefined,
    });
    setDisplayedAggregated(optimisticAgg);
    ratingsCache.set(recipeId, optimisticAgg);
    toast({ title: 'Submitting rating…', description: `You rated ${newRating}★` });

    const success = await rateRecipe(recipeId, newRating);
    if (success) {
      const freshUser = await getUserRating(recipeId);
      setUserRating(freshUser);
      setIsSubmitting(false);
      toast({ title: 'Rating submitted', description: 'Thanks for your feedback!' });
    } else {
      // Rollback on failure
      setIsSubmitting(false);
      setDisplayedAggregated(prevAgg);
      ratingsCache.set(recipeId, prevAgg);
      if (prevUserRating && userRating) {
        setUserRating({ ...userRating, rating: prevUserRating });
      }
      toast({ title: 'Rating failed', description: 'We reverted your rating.', variant: 'destructive' });
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

  if (loading || userLoading) {
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