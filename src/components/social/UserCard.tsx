import { useNavigate } from 'react-router-dom';
import { Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FollowButton from '@/components/FollowButton';

interface UserCardProps {
  userId: string;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  recipeCount?: number;
  followerCount?: number;
  isCurrentUser?: boolean;
}

export default function UserCard({
  userId,
  username,
  fullName,
  avatarUrl,
  bio,
  recipeCount = 0,
  followerCount = 0,
  isCurrentUser = false,
}: UserCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-medium-charcoal border border-light-charcoal rounded-organic-md p-4 hover:border-primary/30 transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <button
          onClick={() => navigate(`/profile/${username}`)}
          className="flex-shrink-0 group"
        >
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-primary-foreground font-bold text-xl">
                {username[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(`/profile/${username}`)}
            className="text-left group"
          >
            <h3 className="text-lg font-semibold text-pure-white group-hover:text-emerald transition-colors truncate">
              {fullName || username}
            </h3>
            <p className="text-soft-gray text-sm">@{username}</p>
          </button>

          {bio && (
            <p className="text-light-text text-sm mt-2 line-clamp-2">
              {bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-soft-gray">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{followerCount} {followerCount === 1 ? 'follower' : 'followers'}</span>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            <FollowButton userId={userId} username={username} />
          </div>
        )}
      </div>
    </div>
  );
}
