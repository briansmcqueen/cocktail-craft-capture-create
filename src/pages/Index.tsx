
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useLocation } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import ShareRecipe from "@/components/ShareRecipe";
import AuthenticatedView from "@/components/AuthenticatedView";
import ProfileSettings from "@/components/profile/ProfileSettings";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { useOnboarding } from "@/hooks/useOnboarding";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Index() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  
  // Onboarding for new users
  const {
    showOnboarding,
    loading: onboardingLoading,
    completeOnboarding,
    skipOnboarding,
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
    forceUpdate,
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

  // Set library based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setLibrary('featured');
    } else if (path === '/recipes') {
      setLibrary('all');
    } else if (path === '/mybar') {
      setLibrary('ingredients');
    } else if (path === '/feed') {
      setLibrary('feed');
    } else if (path === '/favorites') {
      setLibrary('favorites');
    } else if (path === '/recipes/my-drinks') {
      setLibrary('mine');
    } else if (path === '/learn') {
      setLibrary('learn');
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
    if ((newLibrary === "favorites" || newLibrary === "mine" || newLibrary === "feed") && !user) {
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

  if (loading || onboardingLoading) {
    return <LoadingSpinner />;
  }

  if (showProfileSettings) {
    return (
      <div className="min-h-screen bg-rich-charcoal">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowProfileSettings(false)}
            className="mb-4 text-available hover:text-available/80 font-medium"
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
      
      {/* Onboarding Modal for new users */}
      <OnboardingModal
        open={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />
    </>
  );
}
