
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import ShareRecipe from "@/components/ShareRecipe";
import AuthenticatedView from "@/components/AuthenticatedView";
import ProfileSetupModal from "@/components/onboarding/ProfileSetupModal";
import { useOnboarding } from "@/hooks/useOnboarding";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Index() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  
  // Onboarding for new users
  const {
    showProfileSetup,
    loading: onboardingLoading,
    completeProfileSetup,
  } = useOnboarding(user);
  
  const {
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
    handleSaveRecipe,
    handleDeleteRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleLike,
    handleTagClick,
    allRecipes,
    favoriteRecipes,
    filteredRecipes
  } = useIndexPage();

  // Get user's bar ingredients for search filtering
  const forceUpdate = 0; // Legacy prop - favorites context handles re-renders now
  const { myBarIngredients } = useMyBarData(forceUpdate);

  // Set library based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setLibrary('featured');
    } else if (path === '/recipes') {
      setLibrary('all');
    } else if (path === '/mybar') {
      setLibrary('ingredients');
    } else if (path === '/favorites') {
      setLibrary('favorites');
    } else if (path === '/recipes/my-drinks') {
      setLibrary('mine');
    }
  }, [location.pathname, setLibrary]);

  // Handle navigation state from other pages (like RecipePage)
  useEffect(() => {
    const state = location.state as any;
    if (state?.editingRecipe && state?.showForm) {
      setEditingRecipe(state.editingRecipe);
      setShowForm(true);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setEditingRecipe, setShowForm]);

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
    if (user) {
      navigate(`/user/${user.id}`);
    }
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

  if (loading || onboardingLoading) {
    return <LoadingSpinner />;
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
        getFilteredRecipes={() => filteredRecipes}
        handleRecipeClick={() => {}} // No longer needed since we use URL navigation
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
        myBarIngredients={myBarIngredients}
      />

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        initialMode={authModalMode}
      />
      <ShareRecipe 
        recipe={shareRecipe} 
        open={!!shareRecipe} 
        onOpenChange={(open) => !open && setShareRecipe(null)} 
      />
      
      {/* Profile Setup Modal for new users */}
      {user && (
        <ProfileSetupModal
          open={showProfileSetup}
          userId={user.id}
          onComplete={completeProfileSetup}
        />
      )}
    </>
  );
}
