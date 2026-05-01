
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useMyBarData } from "@/hooks/useMyBarData";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import ShareRecipe from "@/components/ShareRecipe";
import AuthenticatedView from "@/components/AuthenticatedView";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageSEO from "@/components/PageSEO";
import {
  LIBRARY_TO_PATH,
  libraryFromPath,
  type LibraryKey,
} from "@/types/library";

export default function Index() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Library derived from the current URL — single source of truth
  const library = useMemo<LibraryKey>(
    () => libraryFromPath(location.pathname),
    [location.pathname]
  );

  const {
    searchTerm,
    setSearchTerm,
    selectedTags,
    showForm,
    setShowForm,
    editingRecipe,
    setEditingRecipe,
    shareRecipe,
    setShareRecipe,
    userRecipes,
    handleSaveRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleLike,
    handleTagClick,
    allRecipes,
    favoriteRecipes,
    filteredRecipes,
  } = useIndexPage(library);

  // Get user's bar ingredients for search filtering
  const { myBarIngredients } = useMyBarData();

  // Handle navigation state from other pages (like RecipePage)
  useEffect(() => {
    const state = location.state as { editingRecipe?: any; showForm?: boolean } | null;
    if (state?.editingRecipe && state?.showForm) {
      setEditingRecipe(state.editingRecipe);
      setShowForm(true);
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
    const key = newLibrary as LibraryKey;
    if ((key === "favorites" || key === "mine") && !user) {
      setShowAuthModal(true);
      return;
    }
    const path = LIBRARY_TO_PATH[key];
    if (path && path !== location.pathname) navigate(path);
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

  const handleMyRecipesClick = () => handleLibraryChange("mine");
  const handleFavoritesClick = () => handleLibraryChange("favorites");

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <IndexSEO library={library} pathname={location.pathname} />
      <AuthenticatedView
        user={user}
        library={library}
        setLibrary={handleLibraryChange}
        showForm={showForm}
        setShowForm={setShowForm}
        editingRecipe={editingRecipe}
        setEditingRecipe={setEditingRecipe}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        allRecipes={allRecipes}
        favoriteRecipes={favoriteRecipes}
        userRecipes={userRecipes}
        getFilteredRecipes={() => filteredRecipes}
        handleRecipeClick={() => {}}
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
    </>
  );
}

function IndexSEO({ library, pathname }: { library: LibraryKey; pathname: string }) {
  const map: Record<string, { title: string; description: string; path: string }> = {
    "/": {
      title: "Barbook — Craft Cocktails, Your Bar, Endless Recipes",
      description:
        "Track your home bar inventory, discover cocktails you can make right now, and save originals. The modern companion for craft bartenders.",
      path: "/",
    },
    "/recipes": {
      title: "All Cocktail Recipes | Barbook",
      description:
        "Browse every cocktail in Barbook — classics, modern originals, and recipes from creators around the world.",
      path: "/recipes",
    },
    "/mybar": {
      title: "My Bar — Track Ingredients & Find Drinks | Barbook",
      description:
        "Add the spirits, mixers, and bitters you have on hand and instantly see every cocktail you can make.",
      path: "/mybar",
    },
    "/favorites": {
      title: "Favorite Cocktails | Barbook",
      description: "Your saved cocktail recipes — quick access to the drinks you love most.",
      path: "/favorites",
    },
  };
  const meta = map[pathname] ?? map["/"];
  const isHome = pathname === "/";

  const jsonLd = isHome
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Barbook",
        url: "https://barbook.io",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://barbook.io/recipes?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }
    : undefined;

  return <PageSEO {...meta} jsonLd={jsonLd} />;
}
