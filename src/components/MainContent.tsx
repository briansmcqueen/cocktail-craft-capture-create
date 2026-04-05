
import { User } from "@supabase/supabase-js";
import { Cocktail } from "@/data/classicCocktails";
import RecipeForm from "@/components/RecipeForm";
import LibraryHeader from "@/components/LibraryHeader";
import SearchInterface from "@/components/search/SearchInterface";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";

import LazyRecipeGrid from "@/components/LazyRecipeGrid";
import MyBarEngine from "@/components/MyBarEngine";
import { Edit } from "lucide-react";
import AuthPrompt from "@/components/auth/AuthPrompt";

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
  myBarIngredients: string[];
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
  forceUpdate,
  myBarIngredients
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
        />

        {library !== "featured" && library !== "ingredients" && library !== "mine" && (
          <div className="mb-6">
            <SearchInterface
              recipes={library === "favorites" ? favoriteRecipes : allRecipes}
              availableIngredients={myBarIngredients}
              onRecipeClick={handleRecipeClick}
              onTagClick={handleTagClick}
              placeholder={`Search ${library === "favorites" ? "favorites" : "all recipes"}...`}
              user={user}
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
            onShowForm={handleAddRecipe}
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
            <AuthPrompt
              icon={Edit}
              title="Create & Share Your Recipes"
              description="Sign up for a free account to create your own cocktail recipes and share them with the community."
            />
          )
        ) : null}
      </div>
    </div>
  );
}
