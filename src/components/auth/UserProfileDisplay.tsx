import { User as SupabaseUser } from "@supabase/supabase-js";
import { getAvatarUrl } from '@/utils/avatarUrl';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileDisplayProps {
  user: SupabaseUser;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  className?: string;
  onAvatarClick?: () => void;
}

export default function UserProfileDisplay({ 
  user, 
  showAvatar = true,
  avatarSize = 'md',
  className = '',
  onAvatarClick
}: UserProfileDisplayProps) {
  const { data: username } = useQuery({
    queryKey: ['profile-username', user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      return data?.username || null;
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });

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

  const avatarUrl = getAvatarUrl(user.user_metadata?.avatar_url);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showAvatar && (
        <button
          onClick={onAvatarClick}
          className={`relative ${sizeClasses[avatarSize]} rounded-full overflow-hidden bg-primary flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background cursor-pointer`}
          aria-label="Open profile settings"
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={user.user_metadata?.full_name || 'User'}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className={`text-primary-foreground font-bold ${textSizeClasses[avatarSize]}`}>
              {initials}
            </span>
          )}
        </button>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">
          {user.user_metadata?.full_name || 'User'}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {username ? `@${username}` : user.email}
        </p>
      </div>
    </div>
  );
}
