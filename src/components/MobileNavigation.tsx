
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Book, Edit, Star, TrendingUp, Home, ChefHat, User, LogIn } from "lucide-react";
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
  { id: "featured", label: "Featured", icon: Home },
  { id: "all", label: "Recipes", icon: Book },
  { id: "ingredients", label: "My Bar", icon: ChefHat },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "mine", label: "My Creations", icon: Edit },
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
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="px-6 py-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-serif font-bold text-orange-600 tracking-wide">BARBOOK</h1>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
            {nav.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded transition-all font-medium",
                  activeLibrary === item.id 
                    ? "bg-orange-50 text-orange-700 border border-orange-200" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t p-6 space-y-4">
            <button
              className="w-full bg-orange-600 text-white py-3 px-4 rounded flex items-center gap-2 justify-center hover:bg-orange-700 transition-all font-medium"
              onClick={handleAddRecipe}
            >
              <Plus size={18} />
              <span>Add New Recipe</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
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
                  <span className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</span>
                  <span className="text-xs text-gray-500 truncate">{user.email}</span>
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
                  className="w-full gap-2 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
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
                  className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white"
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
