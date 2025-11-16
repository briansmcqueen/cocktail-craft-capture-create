import { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Book, Edit, Star, TrendingUp, Home, ChefHat, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/auth/UserMenu";

interface TopNavigationProps {
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
  { id: "ingredients", label: "My Bar", icon: ChefHat, path: "/mybar" },
  { id: "favorites", label: "Favorites", icon: Star, path: "/favorites" },
  { id: "mine", label: "My Drinks", icon: Edit, path: "/recipes/my-drinks" },
  { id: "learn", label: "Learn", icon: TrendingUp, path: "/learn" },
];

const TopNavigation = memo(function TopNavigation({
  user,
  activeLibrary,
  onLibrarySelect,
  onAddRecipe,
  onSignInClick,
  onSignUpClick,
  onProfileClick,
  onMyRecipesClick,
  onFavoritesClick
}: TopNavigationProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleAddRecipe = () => {
    onAddRecipe();
    setOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar - Hidden on desktop */}
      <div className="lg:hidden bg-background border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted rounded-organic-sm">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 rounded-r-organic-lg border-r-border">
              <div className="flex flex-col h-full bg-background">
                {/* Header with organic accent */}
                <div className="px-6 py-6 border-b border-border relative">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-organic-sm flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">B</span>
                    </div>
                    <h1 className="text-3xl font-medium text-pure-white tracking-tight">BARBOOK</h1>
                  </div>
                  {/* Organic accent bar */}
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
                        location.pathname === item.path
                          ? "bg-primary/20 text-emerald border border-primary/30 transform scale-[1.02] rotate-[0.5deg]" 
                          : "text-light-text hover:bg-medium-charcoal hover:text-pure-white hover:transform hover:scale-[1.01]"
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
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-organic-md flex items-center gap-2 justify-center hover:bg-primary/90 transition-all font-medium hover:transform hover:scale-[1.02] hover:rotate-[0.5deg] active:scale-[0.98]"
                    onClick={handleAddRecipe}
                    style={{ transitionTimingFunction: 'var(--timing-pour)' }}
                  >
                    <Plus size={18} />
                    <span>Add New Recipe</span>
                  </button>

                  {/* Authentication section */}
                  <div className="border-t border-light-charcoal pt-3">
                    {user ? (
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
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          onClick={() => {
                            onSignUpClick();
                            setOpen(false);
                          }}
                          variant="secondary"
                          className="w-full gap-2 rounded-organic-sm"
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
                        >
                          <LogIn className="h-4 w-4" />
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="w-8 h-8 bg-primary rounded-organic-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-medium text-pure-white tracking-tight">
            BARBOOK
          </h1>
        </div>
      </div>
    </>
  );
});

export default TopNavigation;