
import { User } from "@supabase/supabase-js";
import { Cocktail } from "@/data/classicCocktails";
import RecipeForm from "@/components/RecipeForm";
import LibraryHeader from "@/components/LibraryHeader";
import SearchInterface from "@/components/search/SearchInterface";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";
import RecipeGrid from "@/components/RecipeGrid";
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
              onToggleFavorite={() => {}}
              onTagClick={handleTagClick}
              favoriteIds={favoriteRecipes.map(r => r.id)}
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
          user ? (
            <Favorites
              favoriteRecipes={favoriteRecipes}
              onRecipeClick={handleRecipeClick}
              onEditRecipe={handleEditRecipe}
              onShareRecipe={handleShareRecipe}
              userRecipes={userRecipes}
            />
          ) : (
            <div className="text-center text-light-text mt-12 lg:mt-16 px-4">
              <UserIcon className="mx-auto mb-4 text-light-text/60" size={48} />
              <h2 className="text-xl font-serif font-normal mb-2 text-pure-white">Sign in to view favorites</h2>
              <p className="mb-4 text-sm lg:text-base">
                Create an account or sign in to save your favorite cocktail recipes!
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )
        ) : library === "learn" ? (
          <Learn
            onShowAuthModal={() => setShowAuthModal(true)}
          />
        ) : (
          <RecipeGrid
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
