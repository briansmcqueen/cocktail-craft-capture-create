import { User } from "@supabase/supabase-js";
import { Cocktail } from "@/data/classicCocktails";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import TopNavigation from "@/components/TopNavigation";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import type { LibraryKey } from "@/types/library";

interface AuthenticatedViewProps {
  user: User | null;
  library: LibraryKey;
  setLibrary: (library: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingRecipe: Cocktail | null;
  setEditingRecipe: (recipe: Cocktail | null) => void;
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
  setShowAuthModal: (show: boolean) => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onProfileClick: () => void;
  onMyRecipesClick: () => void;
  onFavoritesClick: () => void;
  myBarIngredients: string[];
}

export default function AuthenticatedView({
  user,
  library,
  setLibrary,
  showForm,
  setShowForm,
  editingRecipe,
  setEditingRecipe,
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
  setShowAuthModal,
  onSignInClick,
  onSignUpClick,
  onProfileClick,
  onMyRecipesClick,
  onFavoritesClick,
  myBarIngredients
}: AuthenticatedViewProps) {
  const [sidebarCollapsed, toggleSidebar] = useSidebarCollapsed();

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleNavigateToMyBar = () => {
    setLibrary("ingredients");
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      {/* Top Navigation for Mobile Only */}
      <TopNavigation
        user={user}
        activeLibrary={library}
        onLibrarySelect={setLibrary}
        onAddRecipe={handleAddRecipe}
        onSignInClick={onSignInClick}
        onSignUpClick={onSignUpClick}
        onProfileClick={onProfileClick}
        onMyRecipesClick={onMyRecipesClick}
        onFavoritesClick={onFavoritesClick}
      />
      
      <div className="flex h-full">
        {/* Sidebar - Visible on tablet and desktop */}
        <div className="hidden md:block">
          <Sidebar
            active={library}
            onSelect={setLibrary}
            onAdd={handleAddRecipe}
            onCloseForm={handleCloseForm}
            user={user}
            onSignInClick={onSignInClick}
            onSignUpClick={onSignUpClick}
            onProfileClick={onProfileClick}
            onMyRecipesClick={onMyRecipesClick}
            onFavoritesClick={onFavoritesClick}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main id="main-content" className="w-full h-full">
            <div className="max-w-7xl mx-auto px-5 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-0">
              <MainContent
                user={user}
                library={library}
                showForm={showForm}
                editingRecipe={editingRecipe}
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
                setShowForm={setShowForm}
                setEditingRecipe={setEditingRecipe}
                setShowAuthModal={setShowAuthModal}
                onNavigateToMyBar={handleNavigateToMyBar}
                myBarIngredients={myBarIngredients}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
