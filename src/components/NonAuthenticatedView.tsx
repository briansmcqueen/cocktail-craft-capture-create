
import React from "react";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import AuthModal from "@/components/auth/AuthModal";
import RecipeModal from "@/components/RecipeModal";
import ShareRecipe from "@/components/ShareRecipe";
import Featured from "@/components/Featured";

type NonAuthenticatedViewProps = {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  selectedRecipe: Cocktail | null;
  setSelectedRecipe: (recipe: Cocktail | null) => void;
  shareRecipe: Cocktail | null;
  setShareRecipe: (recipe: Cocktail | null) => void;
  onRecipeClick: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
};

export default function NonAuthenticatedView({
  showAuthModal,
  setShowAuthModal,
  selectedRecipe,
  setSelectedRecipe,
  shareRecipe,
  setShareRecipe,
  onRecipeClick,
  onShareRecipe
}: NonAuthenticatedViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header for non-authenticated users */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h1 className="text-2xl font-serif font-normal text-gray-900 tracking-wide">
              Barbook
            </h1>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>

      {/* Main content for non-authenticated users */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-normal text-gray-900 mb-4">
            Discover Amazing Cocktails
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our collection of classic cocktail recipes, save your favorites, 
            and create your own custom recipes. Join the community today!
          </p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <User className="h-5 w-5" />
            Get Started
          </Button>
        </div>

        {/* Featured recipes preview */}
        <Featured
          recipes={classicCocktails}
          onRecipeClick={onRecipeClick}
          onShareRecipe={onShareRecipe}
          userRecipes={[]}
        />
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <RecipeModal
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        recipe={selectedRecipe}
        editable={false}
        onShareRecipe={onShareRecipe}
      />
      <ShareRecipe 
        recipe={shareRecipe} 
        open={!!shareRecipe} 
        onOpenChange={(open) => !open && setShareRecipe(null)} 
      />
    </div>
  );
}
