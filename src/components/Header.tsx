
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
    <div className="bg-background border-b border-border px-4 py-4">
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
          <div className="w-8 h-8 bg-primary rounded-organic-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-serif font-normal text-foreground tracking-wide">
            Barbook
          </h1>
        </div>
        {/* Desktop/tablet auth buttons - hidden only on mobile */}
        <div className="hidden md:flex">
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
                className="gap-2 rounded-organic-sm"
              >
                <User className="h-4 w-4" />
                Create Account
              </Button>
              <Button 
                onClick={onSignInClick}
                className="gap-2 rounded-organic-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Organic bottom accent bar */}
      <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full"></div>
    </div>
  );
}
