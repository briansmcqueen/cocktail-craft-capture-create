
import { useState } from 'react';
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
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    }
    setLoading(false);
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
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
