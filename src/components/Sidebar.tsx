
import { Book, Plus, Edit, Star, TrendingUp, Home, ChefHat, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
  { id: "ingredients", label: "My Bar", icon: ChefHat, path: "/mybar" },
  { id: "favorites", label: "Favorites", icon: Star, path: "/favorites" },
  { id: "mine", label: "My Creations", icon: Edit, path: "/recipes/mine" },
  { id: "learn", label: "Learn", icon: TrendingUp, path: "/learn" },
];

export default function Sidebar({ active, onSelect, onAdd, onCloseForm, user, onSignInClick, onSignUpClick, onProfileClick, onMyRecipesClick, onFavoritesClick }: SidebarProps) {
  const handleNavClick = (id: string) => {
    if (onCloseForm) {
      onCloseForm();
    }
    onSelect(id);
  };

  return (
    <aside className="bg-card border-r border-border w-60 min-h-screen flex flex-col py-6 gap-2 sticky top-0 rounded-organic-lg">
      <div className="px-6 mb-8 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-primary rounded-organic-sm flex items-center justify-center">
            <ChefHat className="text-primary-foreground" size={20} />
          </div>
          <h1 className="text-3xl font-medium text-primary tracking-tight">BARBOOK</h1>
        </div>
        {/* Organic accent bar */}
        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full"></div>
      </div>
      <nav className="flex flex-col gap-1 px-3 grow">
        {nav.map((item, index) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-organic-sm transition-all font-medium",
              active === item.id 
                ? "bg-primary/20 text-emerald border border-primary/30 transform scale-[1.02] rotate-[0.5deg]" 
                : "text-light-text hover:bg-muted/50 hover:text-foreground hover:transform hover:scale-[1.01]"
            )}
            onClick={() => {
              if (onCloseForm) {
                onCloseForm();
              }
            }}
            style={{ 
              transitionTimingFunction: 'var(--timing-stir)',
              transitionDelay: `${index * 50}ms`
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 space-y-3">
        <button
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-organic-md flex items-center gap-2 justify-center hover:bg-primary/90 hover:transform hover:scale-[1.02] hover:rotate-[0.5deg] active:scale-[0.98] transition-all font-medium"
          onClick={onAdd}
          style={{ transitionTimingFunction: 'var(--timing-pour)' }}
        >
          <Plus size={18} /> <span>Add New Recipe</span>
        </button>
        
        {/* Authentication section */}
        <div className="border-t border-border pt-3">
          {user ? (
            <UserMenu
              onProfileClick={onProfileClick}
              onMyRecipesClick={onMyRecipesClick}
              onFavoritesClick={onFavoritesClick}
            />
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={onSignUpClick}
                variant="secondary"
                className="w-full gap-2 rounded-organic-sm"
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
}
