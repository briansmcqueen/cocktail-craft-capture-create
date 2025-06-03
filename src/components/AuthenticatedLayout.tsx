
import React from "react";
import { Cocktail } from "@/data/classicCocktails";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import LibraryHeader from "@/components/LibraryHeader";
import RecipeModal from "@/components/RecipeModal";
import RecipeForm from "@/components/RecipeForm";
import ShareRecipe from "@/components/ShareRecipe";
import Featured from "@/components/Featured";
import SearchFilters from "@/components/SearchFilters";
import Favorites from "@/components/Favorites";
import RecipeGrid from "@/components/RecipeGrid";
import AuthenticatedApp from "@/components/AuthenticatedApp";

type AuthenticatedLayoutProps = {
  library: string;
  setLibrary: (library: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingRecipe: Cocktail | null;
  setEditingRecipe: (recipe: Cocktail | null) => void;
  selectedRecipe: Cocktail | null;
  setSelectedRecipe: (recipe: Cocktail | null) => void;
  shareRecipe: Cocktail | null;
  setShareRecipe: (recipe: Cocktail | null) => void;
  isMobile: boolean;
  userRecipes: Cocktail[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  allRecipes: Cocktail[];
  favoriteRecipes: Cocktail[];
  forceUpdate: number;
  getFilteredRecipes: () => Cocktail[];
  onSaveRecipe: (recipe: Cocktail) => void;
  onDeleteRecipe: (id: string) => void;
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onLike: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
};

export default function AuthenticatedLayout({
  library,
  setLibrary,
  showForm,
  setShowForm,
  editingRecipe,
  setEditingRecipe,
  selectedRecipe,
  setSelectedRecipe,
  shareRecipe,
  setShareRecipe,
  isMobile,
  userRecipes,
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  selectedTags,
  allRecipes,
  favoriteRecipes,
  forceUpdate,
  getFilteredRecipes,
  onSaveRecipe,
  onDeleteRecipe,
  onRecipeClick,
  onEditRecipe,
  onShareRecipe,
  onToggleFavorite,
  onLike,
  onTagClick
}: AuthenticatedLayoutProps) {
  return (
    <AuthenticatedApp 
      recipes={allRecipes}
      onRecipeClick={onRecipeClick}
      onShareRecipe={onShareRecipe}
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex h-screen">
          <Sidebar
            active={library}
            onSelect={setLibrary}
            onAdd={() => setShowForm(true)}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <MobileHeader
              onSidebarOpen={() => setSidebarOpen(true)}
              onAddRecipe={() => setShowForm(true)}
            />

            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
                {showForm ? (
                  <div className="flex justify-center">
                    <RecipeForm
                      initial={editingRecipe || undefined}
                      onSave={onSaveRecipe}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingRecipe(null);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <LibraryHeader
                      library={library as any}
                      onCopyDialogOpen={() => {}}
                    />

                    {!isMobile && (
                      <SearchFilters
                        searchType="everything"
                        setSearchType={() => {}}
                        ingredientQuery={searchTerm}
                        setIngredientQuery={setSearchTerm}
                        tagFilters={selectedTags}
                        onTagFilterToggle={onTagClick}
                        allTags={[]}
                        recipes={allRecipes}
                      />
                    )}

                    {library === "featured" ? (
                      <Featured
                        recipes={allRecipes}
                        onRecipeClick={onRecipeClick}
                        onEditRecipe={onEditRecipe}
                        onShareRecipe={onShareRecipe}
                        userRecipes={userRecipes}
                      />
                    ) : library === "favorites" ? (
                      <Favorites
                        favoriteRecipes={favoriteRecipes}
                        onRecipeClick={onRecipeClick}
                        onEditRecipe={onEditRecipe}
                        onShareRecipe={onShareRecipe}
                        userRecipes={userRecipes}
                      />
                    ) : (
                      <RecipeGrid
                        recipes={getFilteredRecipes()}
                        onRecipeClick={onRecipeClick}
                        onToggleFavorite={onToggleFavorite}
                        onLike={onLike}
                        onShareRecipe={onShareRecipe}
                        onTagClick={onTagClick}
                        onShowForm={() => setShowForm(true)}
                        forceUpdate={forceUpdate}
                        library={library}
                      />
                    )}
                  </>
                )}
              </div>
            </main>
          </div>
        </div>

        <RecipeModal
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
          recipe={selectedRecipe}
          onEdit={() => onEditRecipe(selectedRecipe!)}
          editable={userRecipes.some(r => r.id === selectedRecipe?.id)}
          onShareRecipe={onShareRecipe}
        />

        <ShareRecipe 
          recipe={shareRecipe} 
          open={!!shareRecipe} 
          onOpenChange={(open) => !open && setShareRecipe(null)} 
        />
      </div>
    </AuthenticatedApp>
  );
}
