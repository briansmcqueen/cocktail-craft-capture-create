import { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import AuthenticatedApp from "@/components/AuthenticatedApp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import LibraryHeader from "@/components/LibraryHeader";
import RecipeModal from "@/components/RecipeModal";
import RecipeForm from "@/components/RecipeForm";
import ShareRecipe from "@/components/ShareRecipe";
import Featured from "@/components/Featured";
import RecipeGrid from "@/components/RecipeGrid";
import SearchFilters from "@/components/SearchFilters";
import Favorites from "@/components/Favorites";

export default function Index() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState<Cocktail | null>(null);
  const [library, setLibrary] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Cocktail | null>(null);
  const [shareRecipe, setShareRecipe] = useState<Cocktail | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Cocktail[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setUserRecipes(getUserRecipes());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('favorites-update', handleUpdate);
    return () => window.removeEventListener('favorites-update', handleUpdate);
  }, []);

  const handleRecipeClick = (recipe: Cocktail) => {
    setSelectedRecipe(recipe);
  };

  const handleSaveRecipe = (recipe: Cocktail) => {
    saveUserRecipe(recipe);
    setUserRecipes(getUserRecipes());
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (id: string) => {
    deleteUserRecipe(id);
    setUserRecipes(getUserRecipes());
  };

  const handleEditRecipe = (recipe: Cocktail) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleShareRecipe = (recipe: Cocktail) => {
    setShareRecipe(recipe);
  };

  const handleCloseShare = () => {
    setShareRecipe(null);
  };

  const handleLike = (recipe: Cocktail) => {
    console.log('Like recipe:', recipe.name);
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    console.log('Toggle favorite:', recipe.name);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const allRecipes = [...classicCocktails, ...userRecipes];
  const favoriteRecipes = allRecipes.filter(recipe => 
    localStorage.getItem('barbook_favorites')?.includes(recipe.id) || false
  );

  const getFilteredRecipes = () => {
    let recipes = library === "classics" ? classicCocktails 
                 : library === "user" ? userRecipes
                 : library === "favorites" ? favoriteRecipes
                 : allRecipes;

    if (searchTerm) {
      recipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => 
          ing.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (recipe.tags && recipe.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    if (selectedTags.length > 0) {
      recipes = recipes.filter(recipe =>
        recipe.tags && selectedTags.every(tag => recipe.tags!.includes(tag))
      );
    }

    return recipes;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Header for non-authenticated users */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-2xl font-serif font-normal text-gray-900 tracking-wide">
                Barbook
              </h1>
            </div>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>

        {/* Main content for non-authenticated users */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-normal text-gray-900 mb-4">
              Discover Amazing Cocktails
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our collection of classic cocktail recipes, save your favorites, 
              and create your own custom recipes. Join the community today!
            </p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              size="lg"
              className="gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <User className="h-5 w-5" />
              Get Started
            </Button>
          </div>

          {/* Featured recipes preview */}
          <Featured
            recipes={classicCocktails}
            onRecipeClick={handleRecipeClick}
            onShareRecipe={handleShareRecipe}
            userRecipes={[]}
          />
        </div>

        <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
        <RecipeModal
          open={!!selectedRecipe}
          onOpenChange={(open) => !open && setSelectedRecipe(null)}
          recipe={selectedRecipe}
          editable={false}
          onShareRecipe={handleShareRecipe}
        />
        <ShareRecipe recipe={shareRecipe} onClose={handleCloseShare} />
      </div>
    );
  }

  // Authenticated user view
  return (
    <AuthenticatedApp 
      recipes={allRecipes}
      onRecipeClick={handleRecipeClick}
      onShareRecipe={handleShareRecipe}
    >
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex h-screen">
          <Sidebar
            library={library}
            onLibraryChange={setLibrary}
            onNewRecipe={() => setShowForm(true)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <MobileHeader
              library={library}
              onLibraryChange={setLibrary}
              onMenuClick={() => setSidebarOpen(true)}
              onNewRecipe={() => setShowForm(true)}
            />

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
                      library={library}
                      onNewRecipe={() => setShowForm(true)}
                      userRecipes={userRecipes}
                      onDeleteRecipe={handleDeleteRecipe}
                    />

                    {!isMobile && (
                      <SearchFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                        allRecipes={allRecipes}
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
                      <Favorites
                        favoriteRecipes={favoriteRecipes}
                        onRecipeClick={handleRecipeClick}
                        onEditRecipe={handleEditRecipe}
                        onShareRecipe={handleShareRecipe}
                        userRecipes={userRecipes}
                      />
                    ) : (
                      <RecipeGrid
                        recipes={getFilteredRecipes()}
                        onRecipeClick={handleRecipeClick}
                        onToggleFavorite={handleToggleFavorite}
                        onLike={handleLike}
                        onShareRecipe={handleShareRecipe}
                        onTagClick={handleTagClick}
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
          onEdit={() => handleEditRecipe(selectedRecipe!)}
          editable={userRecipes.some(r => r.id === selectedRecipe?.id)}
          onShareRecipe={handleShareRecipe}
        />

        <ShareRecipe recipe={shareRecipe} onClose={handleCloseShare} />
      </div>
    </AuthenticatedApp>
  );
}
