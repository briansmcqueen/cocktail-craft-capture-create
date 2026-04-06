
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { getAvatarUrl } from '@/utils/avatarUrl';
import UserProfileDisplay from '@/components/auth/UserProfileDisplay';

interface UserMenuProps {
  onProfileClick: () => void;
  onMyRecipesClick: () => void;
  onFavoritesClick: () => void;
}

export default function UserMenu({ onProfileClick, onMyRecipesClick, onFavoritesClick }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      window.location.href = '/';
    }
  };

  if (!user) return null;

  const initials = user.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getAvatarUrl(user.user_metadata?.avatar_url) || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="p-2">
          <UserProfileDisplay 
            user={user} 
            showAvatar={false}
            onAvatarClick={onProfileClick}
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfileClick}>
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMyRecipesClick}>
          <BookOpen className="mr-2 h-4 w-4" />
          My Recipes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onFavoritesClick}>
          <Heart className="mr-2 h-4 w-4" />
          Favorites
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
          <LogOut className="mr-2 h-4 w-4" />
          {loading ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
