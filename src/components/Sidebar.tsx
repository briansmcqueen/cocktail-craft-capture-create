import { useState } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleNavClick = (id: string) => {
    if (onCloseForm) {
      onCloseForm();
    }
    onSelect(id);
  };

  return (
    <aside 
      className={cn(
        "bg-rich-charcoal border-r border-light-charcoal h-screen flex flex-col py-6 gap-2 sticky top-0 rounded-organic-lg transition-all duration-500 ease-out overflow-hidden",
        isCollapsed ? "w-14" : "w-60"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Header */}
      <div className={cn(
        "transition-all duration-500 ease-out flex-shrink-0",
        isCollapsed ? "px-3 mb-4" : "px-6 mb-8"
      )}>
        <div className="flex items-center gap-0 mb-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-auto h-8 text-3xl text-pure-white font-medium"
          >
            B
          </button>
          {!isCollapsed && (
            <span className="text-3xl font-medium text-pure-white tracking-tight animate-fade-in -ml-1">
              ARBOOK
            </span>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0">
        {nav.map((item, index) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center rounded-organic-sm transition-all font-medium duration-300",
              isCollapsed 
                ? "mx-2 px-2 py-3 justify-center" 
                : "mx-3 px-6 py-3 gap-3",
              active === item.id 
                ? "bg-primary/20 text-emerald border border-primary/30 transform scale-[1.02] rotate-[0.5deg]" 
                : "text-light-text hover:bg-medium-charcoal hover:text-pure-white hover:scale-[1.01] hover:rotate-[-0.3deg]"
            )}
            style={{ 
              transitionDelay: `${index * 50}ms`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onClick={() => {
              if (onCloseForm) {
                onCloseForm();
              }
            }}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="animate-fade-in transition-all duration-300 whitespace-nowrap truncate">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>
      
      {/* Bottom Section */}
      <div className={cn(
        "mt-auto space-y-3 flex-shrink-0",
        isCollapsed ? "px-2" : "px-6"
      )}>
        <button
          className={cn(
            "w-full bg-primary text-primary-foreground rounded-organic-sm flex items-center justify-center hover:bg-primary/90 hover:scale-[1.02] hover:rotate-[0.5deg] transition-all font-medium duration-300",
            isCollapsed ? "py-3 px-2" : "py-3 px-4 gap-2"
          )}
          onClick={onAdd}
        >
          <Plus size={18} />
          {!isCollapsed && <span className="animate-fade-in">Add New Recipe</span>}
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
                className={cn(
                  "w-full rounded-organic-sm",
                  isCollapsed ? "px-2 py-2" : "gap-2"
                )}
              >
                <User className="h-4 w-4" />
                {!isCollapsed && <span className="animate-fade-in">Create Account</span>}
              </Button>
              <Button 
                onClick={onSignInClick}
                className={cn(
                  "w-full rounded-organic-sm",
                  isCollapsed ? "px-2 py-2" : "gap-2"
                )}
              >
                <LogIn className="h-4 w-4" />
                {!isCollapsed && <span className="animate-fade-in">Sign In</span>}
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
