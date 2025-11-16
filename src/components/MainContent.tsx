
import { User } from "@supabase/supabase-js";
import { Cocktail } from "@/data/classicCocktails";
import RecipeForm from "@/components/RecipeForm";
import LibraryHeader from "@/components/LibraryHeader";
import SearchInterface from "@/components/search/SearchInterface";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";
import LazyRecipeGrid from "@/components/LazyRecipeGrid";
import MyBarEngine from "@/components/MyBarEngine";
import Learn from "@/components/Learn";
import { Button } from "@/components/ui/button";
import { User as UserIcon } from "lucide-react";

interface MainContentProps {
  user: User | null;
  library: string;
  showForm: boolean;
  editingRecipe: Cocktail | null;
  isMobile: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  allRecipes: Cocktail[];
  favoriteRecipes: Cocktail[];
  userRecipes: Cocktail[];
  getFilteredRecipes: () => Cocktail[];
  handleRecipeClick: (recipe: Cocktail) => void;
  handleSaveRecipe: (recipe: Cocktail) => void;
  handleEditRecipe: (recipe: Cocktail) => void;
  handleShareRecipe: (recipe: Cocktail) => void;
  handleLikeWithAuth: (recipe: Cocktail) => void;
  handleTagClick: (tag: string) => void;
  handleAddRecipe: () => void;
  setShowForm: (show: boolean) => void;
  setEditingRecipe: (recipe: Cocktail | null) => void;
  setShowAuthModal: (show: boolean) => void;
  onNavigateToMyBar: () => void;
  forceUpdate: number;
}

export default function MainContent({
  user,
  library,
  showForm,
  editingRecipe,
  isMobile,
  searchTerm,
  setSearchTerm,
  selectedTags,
  allRecipes,
  favoriteRecipes,
  userRecipes,
  getFilteredRecipes,
  handleRecipeClick,
  handleSaveRecipe,
  handleEditRecipe,
  handleShareRecipe,
  handleLikeWithAuth,
  handleTagClick,
  handleAddRecipe,
  setShowForm,
  setEditingRecipe,
  setShowAuthModal,
  onNavigateToMyBar,
  forceUpdate
}: MainContentProps) {
  if (showForm) {
    return (
      <div className="flex justify-center min-h-screen p-4 lg:p-6">
        <div className="w-full max-w-2xl">
          <RecipeForm
            initial={editingRecipe || undefined}
            onSave={handleSaveRecipe}
            onCancel={() => {
              setShowForm(false);
              setEditingRecipe(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="space-y-4 lg:space-y-6">
        <LibraryHeader
          library={library as any}
          onCopyDialogOpen={() => {}}
        />

        {library !== "featured" && library !== "ingredients" && library !== "learn" && (
          <div className="mb-6">
            <SearchInterface
              recipes={library === "favorites" ? favoriteRecipes : library === "mine" ? userRecipes : allRecipes}
              onRecipeClick={handleRecipeClick}
              onTagClick={handleTagClick}
              placeholder={`Search ${library === "favorites" ? "favorites" : library === "mine" ? "your recipes" : "all recipes"}...`}
            />
          </div>
        )}

        {library === "featured" ? (
          <Featured
            recipes={allRecipes}
            onRecipeClick={handleRecipeClick}
            onEditRecipe={handleEditRecipe}
            onShareRecipe={handleShareRecipe}
            userRecipes={userRecipes}
            onToggleFavorite={() => {}}
            onShowAuthModal={() => setShowAuthModal(true)}
            onNavigateToMyBar={onNavigateToMyBar}
          />
        ) : library === "ingredients" ? (
          <MyBarEngine
            recipes={allRecipes}
            onRecipeClick={handleRecipeClick}
            onToggleFavorite={() => {}}
            onTagClick={handleTagClick}
            forceUpdate={forceUpdate}
          />
        ) : library === "favorites" ? (
          <Favorites
            favoriteRecipes={favoriteRecipes}
            onRecipeClick={handleRecipeClick}
            onEditRecipe={handleEditRecipe}
            onShareRecipe={handleShareRecipe}
            userRecipes={userRecipes}
          />
        ) : library === "learn" ? (
          <Learn
            onShowAuthModal={() => setShowAuthModal(true)}
          />
        ) : library === "mine" ? (
          user ? (
            <LazyRecipeGrid
              recipes={userRecipes}
              onRecipeClick={handleRecipeClick}
              onToggleFavorite={() => {}}
              onLike={handleLikeWithAuth}
              onShareRecipe={handleShareRecipe}
              onTagClick={handleTagClick}
              onShowForm={handleAddRecipe}
              forceUpdate={forceUpdate}
              library={library}
              onShowAuthModal={() => setShowAuthModal(true)}
            />
          ) : (
            <div className="text-center text-light-text mt-12 lg:mt-16 px-4">
              <UserIcon className="mx-auto mb-4 text-available" size={64} />
              <h2 className="text-2xl font-semibold mb-2 text-pure-white">Create & Share Your Recipes</h2>
              <p className="mb-6 text-sm lg:text-base max-w-md mx-auto">
                Sign up for a free account to create your own cocktail recipes and share them with the community.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="gap-2 rounded-organic-md"
                >
                  <UserIcon className="h-5 w-5" />
                  Create Free Account
                </Button>
              </div>
            </div>
          )
        ) : (
          <LazyRecipeGrid
            recipes={getFilteredRecipes()}
            onRecipeClick={handleRecipeClick}
            onToggleFavorite={() => {}}
            onLike={handleLikeWithAuth}
            onShareRecipe={handleShareRecipe}
            onTagClick={handleTagClick}
            onShowForm={handleAddRecipe}
            forceUpdate={forceUpdate}
            library={library}
            onShowAuthModal={() => setShowAuthModal(true)}
          />
        )}
      </div>
    </div>
  );
}
