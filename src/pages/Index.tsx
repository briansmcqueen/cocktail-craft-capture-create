
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIndexPage } from "@/hooks/useIndexPage";
import NonAuthenticatedView from "@/components/NonAuthenticatedView";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

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
    sidebarOpen,
    setSidebarOpen,
    forceUpdate,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <NonAuthenticatedView
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
        shareRecipe={shareRecipe}
        setShareRecipe={setShareRecipe}
        onRecipeClick={handleRecipeClick}
        onShareRecipe={handleShareRecipe}
      />
    );
  }

  return (
    <AuthenticatedLayout
      library={library}
      setLibrary={setLibrary}
      showForm={showForm}
      setShowForm={setShowForm}
      editingRecipe={editingRecipe}
      setEditingRecipe={setEditingRecipe}
      selectedRecipe={selectedRecipe}
      setSelectedRecipe={setSelectedRecipe}
      shareRecipe={shareRecipe}
      setShareRecipe={setShareRecipe}
      isMobile={isMobile}
      userRecipes={userRecipes}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedTags={selectedTags}
      allRecipes={allRecipes}
      favoriteRecipes={favoriteRecipes}
      forceUpdate={forceUpdate}
      getFilteredRecipes={getFilteredRecipes}
      onSaveRecipe={handleSaveRecipe}
      onDeleteRecipe={handleDeleteRecipe}
      onRecipeClick={handleRecipeClick}
      onEditRecipe={handleEditRecipe}
      onShareRecipe={handleShareRecipe}
      onToggleFavorite={handleToggleFavorite}
      onLike={handleLike}
      onTagClick={handleTagClick}
    />
  );
}
