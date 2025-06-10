
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";
import MobileNavigation from "@/components/MobileNavigation";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  user: SupabaseUser | null;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onLibraryChange: (library: string) => void;
  onProfileClick: () => void;
  onMyRecipesClick: () => void;
  onFavoritesClick: () => void;
  activeLibrary?: string;
  onAddRecipe?: () => void;
}

export default function Header({ 
  user, 
  onSignInClick, 
  onSignUpClick, 
  onLibraryChange,
  onProfileClick,
  onMyRecipesClick,
  onFavoritesClick,
  activeLibrary = "featured",
  onAddRecipe = () => {}
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileNavigation
            user={user}
            activeLibrary={activeLibrary}
            onLibrarySelect={onLibraryChange}
            onAddRecipe={onAddRecipe}
            onSignInClick={onSignInClick}
            onSignUpClick={onSignUpClick}
            onProfileClick={onProfileClick}
            onMyRecipesClick={onMyRecipesClick}
            onFavoritesClick={onFavoritesClick}
          />
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-serif font-normal text-gray-900 tracking-wide">
            Barbook
          </h1>
        </div>
        {/* Desktop auth buttons - hidden on mobile */}
        <div className="hidden lg:flex">
          {user ? (
            <UserMenu
              onProfileClick={onProfileClick}
              onMyRecipesClick={onMyRecipesClick}
              onFavoritesClick={onFavoritesClick}
            />
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={onSignUpClick}
                variant="secondary"
                className="gap-2 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
              >
                <User className="h-4 w-4" />
                Create Account
              </Button>
              <Button 
                onClick={onSignInClick}
                className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
