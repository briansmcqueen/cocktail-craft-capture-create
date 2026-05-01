import { Star } from 'lucide-react';
import { useRecipeRating } from '@/hooks/useRecipeRatings';

interface RecipeRatingStarsProps {
  recipeId: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}

export default function RecipeRatingStars({ recipeId, size = 16, onClick, className }: RecipeRatingStarsProps) {
  const { rating, loading } = useRecipeRating(recipeId);

  if (loading) {
    return <div className={`h-5 w-24 animate-pulse bg-muted rounded-organic-sm ${className || ''}`} />;
  }

  if (rating.totalRatings === 0) return null;

  const ariaLabel = `Average rating ${rating.averageRating.toFixed(1)} out of 5 from ${rating.totalRatings} ${rating.totalRatings === 1 ? 'rating' : 'ratings'}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity ${className || ''}`}
      >
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={size}
              className={
                star <= Math.round(rating.averageRating)
                  ? 'text-golden-amber fill-golden-amber'
                  : 'text-muted-foreground/30'
              }
            />
          ))}
        </span>
        <span className="text-sm text-light-text font-medium" aria-hidden="true">
          {rating.averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-soft-gray" aria-hidden="true">
          ({rating.totalRatings})
        </span>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className || ''}`} role="img" aria-label={ariaLabel}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.round(rating.averageRating)
                ? 'text-golden-amber fill-golden-amber'
                : 'text-muted-foreground/30'
            }
          />
        ))}
      </div>
      <span className="text-sm text-light-text font-medium" aria-hidden="true">
        {rating.averageRating.toFixed(1)}
      </span>
      <span className="text-xs text-soft-gray" aria-hidden="true">
        ({rating.totalRatings})
      </span>
    </div>
  );
}
