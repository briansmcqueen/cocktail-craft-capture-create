
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIndexPage } from "@/hooks/useIndexPage";
import AuthModal from "@/components/auth/AuthModal";
import RecipeModal from "@/components/RecipeModal";
import ShareRecipe from "@/components/ShareRecipe";
import Sidebar from "@/components/Sidebar";
import LibraryHeader from "@/components/LibraryHeader";
import SearchFilters from "@/components/SearchFilters";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";
import RecipeGrid from "@/components/RecipeGrid";
import RecipeForm from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";

export default function Index() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const {
    selectedRecipe,
    setSelectedRecipe,
    library,
    setLibrary,
    searchTerm,
    setSearchTerm,
    selectedTags,
    showForm,
    setShowForm,
    editingRecipe,
    setEditingRecipe,
    shareRecipe,
    setShareRecipe,
    isMobile,
    userRecipes,
    handleRecipeClick,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleLike,
    handleToggleFavorite,
    handleTagClick,
    allRecipes,
    favoriteRecipes,
    getFilteredRecipes
  } = useIndexPage();

  const handleAuthenticatedAction = (action: () => void) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleLibraryChange = (newLibrary: string) => {
    if ((newLibrary === "favorites" || newLibrary === "mine") && !user) {
      setShowAuthModal(true);
      return;
    }
    setLibrary(newLibrary);
  };

  const handleAddRecipe = () => {
    handleAuthenticatedAction(() => setShowForm(true));
  };

  const handleLikeWithAuth = (recipe: any) => {
    handleAuthenticatedAction(() => handleLike(recipe));
  };

  const handleFavoriteWithAuth = (recipe: any) => {
    handleAuthenticatedAction(() => handleToggleFavorite(recipe));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="flex h-screen">
        <Sidebar
          active={library}
          onSelect={handleLibraryChange}
          onAdd={handleAddRecipe}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className="text-2xl font-serif font-normal text-gray-900 tracking-wide">
                  Barbook
                </h1>
              </div>
              {user ? (
                <UserMenu
                  onProfileClick={() => {}}
                  onMyRecipesClick={() => setLibrary("mine")}
                  onFavoritesClick={() => setLibrary("favorites")}
                />
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="gap-2 bg-orange-600 hover:bg-orange-700"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>

          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
              {showForm ? (
                <div className="flex justify-center">
                  <RecipeForm
                    initial={editingRecipe || undefined}
                    onSave={handleSaveRecipe}
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
                        <User className="mx-auto mb-4 text-gray-400" size={48} />
                        <h2 className="text-xl font-serif font-normal mb-2 text-gray-900">Sign in to view favorites</h2>
                        <p className="mb-4 text-sm lg:text-base">
                          Create an account or sign in to save your favorite cocktail recipes!
                        </p>
                        <Button 
                          onClick={() => setShowAuthModal(true)}
                          className="gap-2 bg-orange-600 hover:bg-orange-700"
                        >
                          <User className="h-4 w-4" />
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
                      forceUpdate={0}
                      library={library}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <RecipeModal
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        recipe={selectedRecipe}
        onEdit={() => handleEditRecipe(selectedRecipe!)}
        editable={user && userRecipes.some(r => r.id === selectedRecipe?.id)}
        onShareRecipe={handleShareRecipe}
      />
      <ShareRecipe 
        recipe={shareRecipe} 
        open={!!shareRecipe} 
        onOpenChange={(open) => !open && setShareRecipe(null)} 
      />
    </div>
  );
}
