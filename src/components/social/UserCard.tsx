import { useNavigate } from 'react-router-dom';
import { Users, BookOpen } from 'lucide-react';
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
    <div className="bg-card border border-border rounded-organic-md p-4 hover:border-primary/40 transition-all flex flex-col h-full">
      {/* Header: Avatar + Info */}
      <button
        onClick={() => navigate(`/profile/${username}`)}
        className="flex items-center gap-3 text-left group mb-3"
      >
        <div className="h-10 w-10 flex-shrink-0 bg-primary rounded-full flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all">
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
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {fullName || username}
          </h3>
          <p className="text-muted-foreground text-sm truncate">@{username}</p>
        </div>
      </button>

      {/* Bio */}
      {bio && (
        <p className="text-foreground text-sm line-clamp-2 mb-3 flex-1">
          {bio}
        </p>
      )}

      {/* Footer: Stats + Follow */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-md">
            <BookOpen size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{recipeCount}</span>
            <span className="text-xs text-muted-foreground">recipes</span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-md">
            <Users size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{followerCount}</span>
            <span className="text-xs text-muted-foreground">followers</span>
          </div>
        </div>

        {!isCurrentUser && (
          <FollowButton userId={userId} username={username} />
        )}
      </div>
    </div>
  );
}
