import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Lock } from 'lucide-react';
import { followsService } from '@/services/followsService';
import { privacyService } from '@/services/privacyService';
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
  const [canFollowUser, setCanFollowUser] = useState(true);

  useEffect(() => {
    if (user && userId) {
      checkFollowStatus();
      checkCanFollow();
    }
  }, [user, userId]);

  const checkFollowStatus = async () => {
    const following = await followsService.isFollowing(userId);
    setIsFollowing(following);
  };

  const checkCanFollow = async () => {
    if (!user) return;
    const check = await privacyService.canFollow(userId, user.id);
    setCanFollowUser(check.canView);
  };

  const handleToggleFollow = async () => {
    if (!user) {
      openAuthModal('signin', 'Please sign in to follow bartenders');
      return;
    }

    if (!canFollowUser && !isFollowing) {
      toast({
        title: "Cannot follow",
        description: "This user's privacy settings don't allow new followers.",
        variant: "destructive",
      });
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
        } else {
          toast({
            title: "Cannot follow",
            description: "This user cannot be followed due to privacy settings or you are blocked.",
            variant: "destructive",
          });
        }
      }

      if (!success && isFollowing) {
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

  // Show lock icon if user cannot be followed
  if (!canFollowUser && !isFollowing) {
    return (
      <Button
        disabled
        size="sm"
        variant="outline"
        className="rounded-organic-sm h-8 w-8 p-0"
        title="Private account"
      >
        <Lock className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={loading}
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      className="rounded-organic-sm h-8 px-3 gap-1.5"
      title={isFollowing ? `Unfollow @${username}` : `Follow @${username}`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Follow</span>
        </>
      )}
    </Button>
  );
}
