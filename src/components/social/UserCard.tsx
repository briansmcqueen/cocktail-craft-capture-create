import { useNavigate } from 'react-router-dom';
import { Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FollowButton from '@/components/FollowButton';
import { getAvatarUrl } from '@/utils/avatarUrl';

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
  const fullAvatarUrl = getAvatarUrl(avatarUrl);

  return (
    <div className="bg-card border border-border rounded-organic-md p-4 hover:border-primary/40 transition-all">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <button
          onClick={() => navigate(`/profile/${username}`)}
          className="flex-shrink-0 group"
        >
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all">
            {fullAvatarUrl ? (
              <img
                src={fullAvatarUrl}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-primary-foreground font-bold text-sm">
                {username[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </button>

        {/* Info and Follow Button Container */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <button
                onClick={() => navigate(`/profile/${username}`)}
                className="text-left group block w-full"
              >
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {fullName || username}
                </h3>
                <p className="text-muted-foreground text-sm truncate">@{username}</p>
              </button>
            </div>

            {/* Follow Button */}
            {!isCurrentUser && (
              <div className="flex-shrink-0">
                <FollowButton userId={userId} username={username} />
              </div>
            )}
          </div>

          {bio && (
            <p className="text-foreground text-sm line-clamp-2">
              {bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{recipeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{followerCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
