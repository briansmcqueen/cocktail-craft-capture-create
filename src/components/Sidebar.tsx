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
    <aside className="bg-rich-charcoal border-r border-light-charcoal w-60 min-h-screen flex flex-col py-6 gap-2 sticky top-0 rounded-organic-lg">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-medium text-pure-white tracking-tight">BARBOOK</h1>
        </div>
      </div>
      <nav className="flex flex-col gap-1 grow">
        {nav.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-6 py-3 mx-3 rounded-organic-sm transition-all font-medium duration-300",
              active === item.id 
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
