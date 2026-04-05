import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getUserRating, rateRecipe } from '@/services/ratingsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ratingsCache } from '@/services/ratingsCache';

interface RecipeRatingInputProps {
  recipeId: string;
}

export default function RecipeRatingInput({ recipeId }: RecipeRatingInputProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !recipeId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const data = await getUserRating(recipeId);
      if (data) setUserRating(data.rating);
      setLoading(false);
    };
    load();
  }, [recipeId, user]);

  if (!user || loading) return null;

  const handleRating = async (rating: number) => {
    const prev = userRating;
    setUserRating(rating);

    const success = await rateRecipe(recipeId, rating);
    if (success) {
      ratingsCache.invalidate(recipeId);
      toast({
        title: 'Rating submitted',
        description: `You rated this recipe ${rating} star${rating !== 1 ? 's' : ''}`,
      });
    } else {
      setUserRating(prev);
      toast({
        title: 'Error',
        description: 'Failed to submit rating.',
        variant: 'destructive',
      });
    }
  };

  const displayRating = hoveredRating || userRating;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {userRating ? 'Your rating:' : 'Rate this recipe:'}
      </p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={22}
            className={`cursor-pointer transition-transform hover:scale-110 ${
              star <= displayRating
                ? 'text-golden-amber fill-golden-amber'
                : 'text-muted-foreground/30'
            }`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          />
        ))}
        {userRating > 0 && (
          <span className="text-xs text-soft-gray ml-1">
            ({userRating} star{userRating !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  );
}
