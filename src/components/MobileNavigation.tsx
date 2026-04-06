
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Book, Edit, Heart, TrendingUp, Home, Martini, User, LogIn, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/auth/UserMenu";

interface MobileNavigationProps {
  user: SupabaseUser | null;
  activeLibrary: string;
  onLibrarySelect: (library: string) => void;
  onAddRecipe: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onProfileClick: () => void;
  onMyRecipesClick: () => void;
  onFavoritesClick: () => void;
}

const nav = [
  { id: "featured", label: "Featured", icon: Home, path: "/" },
  { id: "all", label: "Recipes", icon: Book, path: "/recipes" },
  { id: "discover", label: "Discover", icon: TrendingUp, path: "/discover" },
  { id: "ingredients", label: "My Bar", icon: Martini, path: "/mybar" },
  { id: "favorites", label: "Favorites", icon: Star, path: "/favorites" },
  { id: "mine", label: "My Drinks", icon: Edit, path: "/recipes/my-drinks" },
];

export default function MobileNavigation({
  user,
  activeLibrary,
  onLibrarySelect,
  onAddRecipe,
  onSignInClick,
  onSignUpClick,
  onProfileClick,
  onMyRecipesClick,
  onFavoritesClick
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onLibrarySelect(id);
    setOpen(false);
  };

  const handleAddRecipe = () => {
    onAddRecipe();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted rounded-organic-sm">
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 rounded-r-organic-lg border-r-border">
        <div className="flex flex-col h-full bg-card">
          {/* Header with organic accent */}
          <div className="px-6 py-6 border-b border-border relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-organic-sm flex items-center justify-center">
                <Martini className="text-primary-foreground" size={20} />
              </div>
              <h1 className="text-3xl font-medium text-primary tracking-tight">BARBOOK</h1>
            </div>
            {/* Organic top accent */}
            <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full"></div>
          </div>
          
          {/* Navigation with organic shapes */}
          <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
            {nav.map((item, index) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 transition-all font-medium rounded-organic-sm",
                  activeLibrary === item.id 
                    ? "bg-primary/20 text-emerald border border-primary/30" 
                    : "text-light-text hover:bg-muted/50 hover:text-pure-white"
                )}
                onClick={() => setOpen(false)}
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

          {/* Bottom section with organic styling */}
          <div className="border-t border-border p-6 space-y-4">
            <button
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-organic-md flex items-center gap-2 justify-center hover:bg-primary/90 transition-all font-medium"
              onClick={handleAddRecipe}
              style={{ transitionTimingFunction: 'var(--timing-pour)' }}
            >
              <Plus size={18} />
              <span>Add New Recipe</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-organic-md border border-border">
                <UserMenu
                  onProfileClick={() => {
                    onProfileClick();
                    setOpen(false);
                  }}
                  onMyRecipesClick={() => {
                    onMyRecipesClick();
                    setOpen(false);
                  }}
                  onFavoritesClick={() => {
                    onFavoritesClick();
                    setOpen(false);
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{user.user_metadata?.full_name || 'User'}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    onSignUpClick();
                    setOpen(false);
                  }}
                  variant="secondary"
                  className="w-full gap-2 rounded-organic-sm transition-all duration-300"
                  size="sm"
                >
                  <User className="h-4 w-4" />
                  Create Account
                </Button>
                <Button 
                  onClick={() => {
                    onSignInClick();
                    setOpen(false);
                  }}
                  className="w-full gap-2 rounded-organic-sm"
                  size="sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
