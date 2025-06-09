
import { User } from "@supabase/supabase-js";
import { Cocktail } from "@/data/classicCocktails";
import RecipeForm from "@/components/RecipeForm";
import LibraryHeader from "@/components/LibraryHeader";
import SearchFilters from "@/components/SearchFilters";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";
import RecipeGrid from "@/components/RecipeGrid";
import CategorizedIngredientFilter from "@/components/CategorizedIngredientFilter";
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
  handleFavoriteWithAuth: (recipe: Cocktail) => void;
  handleTagClick: (tag: string) => void;
  handleAddRecipe: () => void;
  setShowForm: (show: boolean) => void;
  setEditingRecipe: (recipe: Cocktail | null) => void;
  setShowAuthModal: (show: boolean) => void;
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
  handleFavoriteWithAuth,
  handleTagClick,
  handleAddRecipe,
  setShowForm,
  setEditingRecipe,
  setShowAuthModal,
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

        {!isMobile && library !== "featured" && library !== "ingredients" && (
          <SearchFilters
            searchType="everything"
            setSearchType={() => {}}
            ingredientQuery={searchTerm}
            setIngredientQuery={setSearchTerm}
            tagFilters={selectedTags}
            onTagFilterToggle={handleTagClick}
            allTags={[]}
            recipes={allRecipes}
          />
        )}

        {library === "featured" ? (
          <Featured
            recipes={allRecipes}
            onRecipeClick={handleRecipeClick}
            onEditRecipe={handleEditRecipe}
            onShareRecipe={handleShareRecipe}
            userRecipes={userRecipes}
            onToggleFavorite={handleFavoriteWithAuth}
          />
        ) : library === "ingredients" ? (
          <CategorizedIngredientFilter
            recipes={allRecipes}
            onRecipeClick={handleRecipeClick}
            onToggleFavorite={handleFavoriteWithAuth}
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
            <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
              <UserIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <h2 className="text-xl font-serif font-normal mb-2 text-gray-900">Sign in to view favorites</h2>
              <p className="mb-4 text-sm lg:text-base">
                Create an account or sign in to save your favorite cocktail recipes!
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <UserIcon className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )
        ) : (
          <RecipeGrid
            recipes={getFilteredRecipes()}
            onRecipeClick={handleRecipeClick}
            onToggleFavorite={handleFavoriteWithAuth}
            onLike={handleLikeWithAuth}
            onShareRecipe={handleShareRecipe}
            onTagClick={handleTagClick}
            onShowForm={handleAddRecipe}
            forceUpdate={forceUpdate}
            library={library}
          />
        )}
      </div>
    </div>
  );
}
