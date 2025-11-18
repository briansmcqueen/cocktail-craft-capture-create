import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { followsService } from '@/services/followsService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/contexts/AuthModalContext';

interface FollowButtonProps {
  userId: string;
  username: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({ userId, username, onFollowChange }: FollowButtonProps) {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && userId) {
      checkFollowStatus();
    }
  }, [user, userId]);

  const checkFollowStatus = async () => {
    const following = await followsService.isFollowing(userId);
    setIsFollowing(following);
  };

  const handleToggleFollow = async () => {
    if (!user) {
      openAuthModal('signin', 'Please sign in to follow bartenders');
      return;
    }

    setLoading(true);

    try {
      let success;
      if (isFollowing) {
        success = await followsService.unfollowUser(userId);
        if (success) {
          setIsFollowing(false);
          toast({
            title: "Unfollowed",
            description: `You unfollowed @${username}`,
          });
          onFollowChange?.(false);
        }
      } else {
        success = await followsService.followUser(userId);
        if (success) {
          setIsFollowing(true);
          toast({
            title: "Following",
            description: `You're now following @${username}`,
          });
          onFollowChange?.(true);
        }
      }

      if (!success) {
        toast({
          title: "Error",
          description: "Failed to update follow status. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button if viewing own profile
  if (user?.id === userId) {
    return null;
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className="rounded-organic-sm gap-2"
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
