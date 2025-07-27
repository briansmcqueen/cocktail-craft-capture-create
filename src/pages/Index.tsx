
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIndexPage } from "@/hooks/useIndexPage";
import AuthModal from "@/components/auth/AuthModal";
import RecipeModal from "@/components/RecipeModal";
import ShareRecipe from "@/components/ShareRecipe";
import AuthenticatedView from "@/components/AuthenticatedView";
import ProfileSettings from "@/components/profile/ProfileSettings";

export default function Index() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  
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
    forceUpdate,
    isMobile,
    userRecipes,
    handleRecipeClick,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleLike,
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


  const handleSignInClick = () => {
    setAuthModalMode('signin');
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode('signup');
    setShowAuthModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileSettings(true);
  };

  const handleMyRecipesClick = () => {
    setLibrary("mine");
  };

  const handleFavoritesClick = () => {
    setLibrary("favorites");
  };

  const handleRemixRecipe = (recipe: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Create a new recipe based on the original but with no ID
    const remixedRecipe = { 
      ...recipe, 
      id: undefined,
      name: `${recipe.name} (Remix)`
    };
    setEditingRecipe(remixedRecipe);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (showProfileSettings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowProfileSettings(false)}
            className="mb-4 text-primary hover:text-primary/80 font-medium"
          >
            ← Back to recipes
          </button>
          <ProfileSettings />
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthenticatedView
        user={user}
        library={library}
        setLibrary={handleLibraryChange}
        showForm={showForm}
        setShowForm={setShowForm}
        editingRecipe={editingRecipe}
        setEditingRecipe={setEditingRecipe}
        isMobile={isMobile}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        allRecipes={allRecipes}
        favoriteRecipes={favoriteRecipes}
        userRecipes={userRecipes}
        getFilteredRecipes={getFilteredRecipes}
        handleRecipeClick={handleRecipeClick}
        handleSaveRecipe={handleSaveRecipe}
        handleEditRecipe={handleEditRecipe}
        handleShareRecipe={handleShareRecipe}
        handleLikeWithAuth={handleLikeWithAuth}
        handleTagClick={handleTagClick}
        handleAddRecipe={handleAddRecipe}
        setShowAuthModal={setShowAuthModal}
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
        onProfileClick={handleProfileClick}
        onMyRecipesClick={handleMyRecipesClick}
        onFavoritesClick={handleFavoritesClick}
        forceUpdate={forceUpdate}
      />

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        initialMode={authModalMode}
      />
      <RecipeModal
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        recipe={selectedRecipe}
        onEdit={() => handleEditRecipe(selectedRecipe!)}
        editable={user && userRecipes.some(r => r.id === selectedRecipe?.id)}
        onShareRecipe={handleShareRecipe}
        onRemix={handleRemixRecipe}
        onShowAuthModal={() => setShowAuthModal(true)}
      />
      <ShareRecipe 
        recipe={shareRecipe} 
        open={!!shareRecipe} 
        onOpenChange={(open) => !open && setShareRecipe(null)} 
      />
    </>
  );
}
