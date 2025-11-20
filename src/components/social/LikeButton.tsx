import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LikeButtonProps {
  recipeId: string;
  initialLikeCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

export default function LikeButton({
  recipeId,
  initialLikeCount = 0,
  showCount = true,
  size = 'md',
  onLikeChange,
}: LikeButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
    }
    loadLikeCount();
  }, [user, recipeId]);

  const checkLikeStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('has_user_liked_recipe', {
          p_user_id: user.id,
          p_recipe_id: recipeId,
        });

      if (!error && data !== null) {
        setIsLiked(data);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const loadLikeCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_recipe_like_count', { p_recipe_id: recipeId });

      if (!error && data !== null) {
        setLikeCount(data);
      }
    } catch (error) {
      console.error('Error loading like count:', error);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      if (window.__openAuthModal) {
        window.__openAuthModal('signup', 'Like this recipe to save it for later!');
      } else {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to like recipes.',
          variant: 'destructive',
        });
      }
      return;
    }

    setLoading(true);

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);

        if (error) throw error;

        const newCount = Math.max(0, likeCount - 1);
        setIsLiked(false);
        setLikeCount(newCount);
        onLikeChange?.(false, newCount);
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
          });

        if (error) throw error;

        const newCount = likeCount + 1;
        setIsLiked(true);
        setLikeCount(newCount);
        onLikeChange?.(true, newCount);

        // Create notification for recipe author
        const { data: recipe } = await supabase
          .from('recipes')
          .select('user_id')
          .eq('id', recipeId)
          .single();

        if (recipe && recipe.user_id !== user.id) {
          await supabase
            .from('social_notifications')
            .insert({
              user_id: recipe.user_id,
              actor_id: user.id,
              notification_type: 'like',
              recipe_id: recipeId,
            });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={`gap-2 rounded-organic-sm hover:bg-card/50 ${
        isLiked ? 'text-heart-red' : 'text-soft-gray'
      }`}
    >
      <Heart
        size={iconSize}
        className={`transition-all ${isLiked ? 'fill-heart-red' : 'fill-transparent'}`}
        strokeWidth={isLiked ? 1 : 2}
      />
      {showCount && (
        <span className="text-sm font-medium">
          {likeCount}
        </span>
      )}
    </Button>
  );
}
