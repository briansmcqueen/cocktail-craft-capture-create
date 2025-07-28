import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getUserRating, rateRecipe, type RecipeRating } from '@/services/ratingsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface RecipeUserRatingProps {
  recipeId: string;
}

export default function RecipeUserRating({ recipeId }: RecipeUserRatingProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<RecipeRating | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRating();
  }, [recipeId, user]);

  const fetchUserRating = async () => {
    setLoading(true);
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
      await fetchUserRating();
      toast({
        title: "Rating submitted",
        description: `You rated this recipe ${rating} star${rating !== 1 ? 's' : ''}`,
      });
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
            } cursor-pointer hover:scale-110 transition-transform`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  if (!user || loading) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          {userRating ? 'Your rating:' : 'Rate this recipe:'}
        </p>
        <div className="flex items-center gap-2">
          {renderStars(hoveredRating || userRating?.rating || 0)}
          {userRating && (
            <span className="text-sm text-gray-600">
              ({userRating.rating} star{userRating.rating !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}