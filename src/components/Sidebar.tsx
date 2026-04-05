import { Book, Plus, Edit, Heart, Compass, Home, Martini, User, LogIn, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { memo } from "react";
import UserProfileDisplay from "@/components/auth/UserProfileDisplay";
import NotificationsDropdown from "@/components/NotificationsDropdown";

type SidebarProps = {
  active: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onCloseForm?: () => void;
  user?: SupabaseUser | null;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  onProfileClick?: () => void;
  onMyRecipesClick?: () => void;
  onFavoritesClick?: () => void;
};

const nav = [
  { id: "featured", label: "Featured", icon: Home, path: "/" },
  { id: "all", label: "Recipes", icon: Book, path: "/recipes" },
  { id: "discover", label: "Discover", icon: TrendingUp, path: "/discover" },
  { id: "ingredients", label: "My Bar", icon: Martini, path: "/mybar" },
  { id: "favorites", label: "Favorites", icon: Heart, path: "/favorites" },
  { id: "mine", label: "My Drinks", icon: Edit, path: "/recipes/my-drinks" },
];

const Sidebar = memo(function Sidebar({ active, onSelect, onAdd, onCloseForm, user, onSignInClick, onSignUpClick, onProfileClick, onMyRecipesClick, onFavoritesClick }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="bg-rich-charcoal border-r border-light-charcoal w-60 h-screen flex flex-col py-6 gap-2 sticky top-0 rounded-organic-lg overflow-hidden">
      <div className="px-6 mb-8 flex-shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h1 className="text-3xl font-medium text-pure-white tracking-tight">BARBOOK</h1>
          {user && <NotificationsDropdown />}
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 px-3">
        {nav.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-organic-sm transition-all font-medium duration-300",
              location.pathname === item.path
                ? "bg-primary/20 text-emerald border border-primary/30 transform scale-[1.02] rotate-[0.5deg]" 
                : "text-light-text hover:bg-medium-charcoal hover:text-pure-white hover:scale-[1.01] hover:rotate-[-0.3deg]"
            )}
            onClick={() => {
              if (onCloseForm) {
                onCloseForm();
              }
            }}
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span className="whitespace-nowrap truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 space-y-3">
        <button
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-organic-sm flex items-center gap-2 justify-center hover:bg-primary/90 hover:scale-[1.02] hover:rotate-[0.5deg] transition-all font-medium duration-300"
          onClick={onAdd}
        >
          <Plus size={18} /> <span>Add New Recipe</span>
        </button>
        
        {/* Authentication section */}
        <div className="border-t border-light-charcoal pt-3">
          {user ? (
            <div className="space-y-3">
              {/* User info display */}
              <UserProfileDisplay 
                user={user} 
                avatarSize="md"
                onAvatarClick={onProfileClick}
              />

              {/* View Profile Button */}
              <Button
                onClick={onProfileClick}
                variant="outline"
                className="w-full rounded-organic-sm border-border hover:bg-medium-charcoal"
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={onSignUpClick}
                variant="secondary"
                className="w-full gap-2 rounded-organic-sm text-pure-white hover:scale-[1.02] hover:rotate-[0.5deg] transition-all duration-300"
              >
                <User className="h-4 w-4" />
                Create Account
              </Button>
              <Button 
                onClick={onSignInClick}
                className="w-full gap-2 rounded-organic-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
