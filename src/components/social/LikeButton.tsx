import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';

interface LikeButtonProps {
  recipeId: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeButton({
  recipeId,
  showCount = true,
  size = 'md',
}: LikeButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const isLiked = isFavorite(recipeId);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    await toggleFavorite(recipeId, () => {
      if (window.__openAuthModal) {
        window.__openAuthModal('signup', 'Save this recipe to your favorites!');
      }
    });
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`gap-2 rounded-organic-sm hover:bg-card/50 ${
        isLiked ? 'text-heart-red' : 'text-soft-gray'
      }`}
    >
      <Heart
        size={iconSize}
        className={`transition-all ${isLiked ? 'fill-heart-red' : 'fill-transparent'}`}
        strokeWidth={isLiked ? 1 : 2}
      />
    </Button>
  );
}
