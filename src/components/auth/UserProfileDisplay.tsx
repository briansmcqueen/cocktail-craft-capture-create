import { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileDisplayProps {
  user: SupabaseUser;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserProfileDisplay({ 
  user, 
  showAvatar = true,
  avatarSize = 'md',
  className = ''
}: UserProfileDisplayProps) {
  const initials = user.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAvatar && (
        <div className={`relative ${sizeClasses[avatarSize]} rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0`}>
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.full_name || 'User'}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className={`text-primary-foreground font-bold ${textSizeClasses[avatarSize]}`}>
              {initials}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">
          {user.user_metadata?.full_name || 'User'}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {user.user_metadata?.username 
            ? `@${user.user_metadata.username}`
            : user.email
          }
        </p>
      </div>
    </div>
  );
}
