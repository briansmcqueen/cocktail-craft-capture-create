import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import RecipeForm from "@/components/RecipeForm";
import RecipeModal from "@/components/RecipeModal";
import ShareRecipe from "@/components/ShareRecipe";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";
import MobileHeader from "@/components/MobileHeader";
import LibraryHeader from "@/components/LibraryHeader";
import SearchFilters from "@/components/SearchFilters";
import RecipeGrid from "@/components/RecipeGrid";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { getFavoriteRecipes, toggleFavorite } from "@/utils/favorites";
import { toggleLike } from "@/utils/likes";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

type Library = "featured" | "all" | "classics" | "favorites" | "mine";

function getAllTags(recipes: Cocktail[]): string[] {
  const tags = new Set<string>();
  recipes.forEach(r => (r.tags || []).forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

export default function Index() {
  // State
  const [library, setLibrary] = useState<Library>("featured");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cocktail | null>(null);
  const [selected, setSelected] = useState<Cocktail | null>(null);
  const [userRecipes, setUserRecipes] = useState<Cocktail[]>(getUserRecipes());
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavoriteRecipes());
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [recipeToCopy, setRecipeToCopy] = useState<Cocktail | null>(null);
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<"ingredient" | "tag" | "name" | "location" | "everything">("ingredient");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [recipeToShare, setRecipeToShare] = useState<Cocktail | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Check for shared recipe in URL on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedRecipeName = urlParams.get('recipe');
    
    if (sharedRecipeName) {
      const allRecipes = [...classicCocktails, ...getUserRecipes()];
      const sharedRecipe = allRecipes.find(recipe => 
        recipe.name.toLowerCase() === decodeURIComponent(sharedRecipeName).toLowerCase()
      );
      
      if (sharedRecipe) {
        setSelected(sharedRecipe);
        // Clear the URL parameter after opening
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Listen for updates to favorites and likes
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setFavoriteIds(getFavoriteRecipes());
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('favorites-update', handleFavoritesUpdate);
    return () => window.removeEventListener('favorites-update', handleFavoritesUpdate);
  }, []);

  // Gather recipes to display & filter by ingredient/tag, flavor profile
  let displayed: Cocktail[] = [];
  const allRecipes = [...classicCocktails, ...userRecipes];
  const favoriteRecipes = allRecipes.filter(recipe => favoriteIds.includes(recipe.id));
  
  if (library === "featured") {
    // Featured page - handled by Featured component
    displayed = [];
  } else if (library === "all") {
    displayed = allRecipes;
  } else if (library === "classics") {
    displayed = [...classicCocktails];
  } else if (library === "favorites") {
    displayed = favoriteRecipes;
  } else if (library === "mine") {
    displayed = [...userRecipes];
  }

  // Apply filters only for non-featured libraries
  if (library !== "featured") {
    // Main search logic: by ingredient, name, location, tag, or everything
    if (ingredientQuery.trim()) {
      const query = ingredientQuery.trim().toLowerCase();
      
      if (searchType === "ingredient") {
        displayed = displayed.filter(recipe =>
          recipe.ingredients.some(ing =>
            ing.toLowerCase().includes(query)
          )
        );
      } else if (searchType === "tag") {
        displayed = displayed.filter(recipe =>
          recipe.tags && recipe.tags.some(tag =>
            tag.toLowerCase().includes(query)
          )
        );
      } else if (searchType === "name") {
        displayed = displayed.filter(recipe =>
          recipe.name.toLowerCase().includes(query)
        );
      } else if (searchType === "location") {
        displayed = displayed.filter(recipe =>
          recipe.origin && recipe.origin.toLowerCase().includes(query)
        );
      } else if (searchType === "everything") {
        displayed = displayed.filter(recipe =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
          (recipe.origin && recipe.origin.toLowerCase().includes(query)) ||
          (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query))) ||
          (recipe.notes && recipe.notes.toLowerCase().includes(query))
        );
      }
    }

    // Tag badge filter
    if (tagFilters.length > 0) {
      displayed = displayed.filter(recipe => 
        tagFilters.every(tag => recipe.tags && recipe.tags.includes(tag))
      );
    }
  }

  // Tag filter toggle function
  function handleTagFilterToggle(tag: string) {
    setTagFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }

  function handleSave(recipe: Cocktail) {
    saveUserRecipe(recipe);
    setUserRecipes(getUserRecipes());
    setShowForm(false);
    setEditing(null);
    toast({ title: "Recipe saved!", description: recipe.name + " added to your library." });
  }

  function handleEditRecipe(recipe: Cocktail) {
    setEditing(recipe);
    setShowForm(true);
  }

  function handleRecipeClick(recipe: Cocktail) {
    setSelected(recipe);
  }

  function handleDeleteRecipe(recipe: Cocktail) {
    if (window.confirm(`Delete recipe "${recipe.name}"?`)) {
      deleteUserRecipe(recipe.id);
      setUserRecipes(getUserRecipes());
      setSelected(null);
      toast({ title: "Recipe deleted." });
    }
  }

  function handleCopyFrom(recipe: Cocktail) {
    setEditing({
      ...recipe,
      id: undefined,
      name: recipe.name + " (Copy)",
    } as Cocktail);
    setShowForm(true);
    setCopyDialogOpen(false);
    setRecipeToCopy(null);
  }

  function handleShareRecipe(recipe: Cocktail) {
    setRecipeToShare(recipe);
    setShareDialogOpen(true);
  }

  function handleToggleFavorite(recipe: Cocktail) {
    const added = toggleFavorite(recipe.id);
    setFavoriteIds(getFavoriteRecipes());
    window.dispatchEvent(new Event('favorites-update'));
  }

  function handleLike(recipe: Cocktail) {
    toggleLike(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  }

  // Get all tags for the active visible library (used for tag filter selection)
  const fullRecipes = library === "all"
    ? allRecipes
    : library === "classics"
    ? classicCocktails
    : library === "favorites"
    ? favoriteRecipes
    : library === "mine"
    ? userRecipes
    : allRecipes;

  const allTags = getAllTags(fullRecipes);

  // Mobile-first UI with NYT Cooking inspired aesthetic
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header */}
      <MobileHeader
        onSidebarOpen={() => setSidebarOpen(true)}
        onAddRecipe={() => {
          setShowForm(true);
          setEditing(null);
        }}
      />

      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar - Fixed */}
        <div className={`
          lg:relative lg:translate-x-0 lg:bg-transparent
          fixed top-0 left-0 h-full z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:flex-shrink-0
        `}>
          <div className="lg:hidden absolute top-4 right-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-screen overflow-y-auto">
            <Sidebar
              active={library}
              onSelect={(id) => {
                setLibrary(id as Library);
                setIngredientQuery("");
                setTagFilters([]);
                setSidebarOpen(false);
              }}
              onAdd={() => {
                setShowForm(true);
                setEditing(null);
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {/* Main content - Mobile optimized */}
        <main className="flex-1 min-w-0 bg-gray-50 min-h-screen pt-16 lg:pt-0">
          <div className="px-4 lg:px-8 py-4 lg:py-8">
            <LibraryHeader
              library={library}
              onCopyDialogOpen={() => setCopyDialogOpen(true)}
            />

            {/* Render Featured component for featured library */}
            {library === "featured" ? (
              <Featured
                key={forceUpdate}
                recipes={allRecipes}
                onRecipeClick={handleRecipeClick}
                onEditRecipe={handleEditRecipe}
                onShareRecipe={handleShareRecipe}
                userRecipes={userRecipes}
              />
            ) : library === "favorites" ? (
              <Favorites
                key={forceUpdate}
                favoriteRecipes={favoriteRecipes}
                onRecipeClick={handleRecipeClick}
                onEditRecipe={handleEditRecipe}
                onShareRecipe={handleShareRecipe}
                userRecipes={userRecipes}
              />
            ) : (
              <>
                <SearchFilters
                  searchType={searchType}
                  setSearchType={setSearchType}
                  ingredientQuery={ingredientQuery}
                  setIngredientQuery={setIngredientQuery}
                  tagFilters={tagFilters}
                  onTagFilterToggle={handleTagFilterToggle}
                  allTags={allTags}
                  recipes={fullRecipes}
                />

                <RecipeGrid
                  recipes={displayed}
                  onRecipeClick={handleRecipeClick}
                  onToggleFavorite={handleToggleFavorite}
                  onLike={handleLike}
                  onShareRecipe={handleShareRecipe}
                  onTagClick={handleTagFilterToggle}
                  onShowForm={() => setShowForm(true)}
                  forceUpdate={forceUpdate}
                  library={library}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        open={!!selected}
        onOpenChange={() => setSelected(null)}
        recipe={selected}
        editable={selected && (userRecipes.find((ur) => ur.id === selected.id) !== undefined)}
        onEdit={
          selected && (userRecipes.find((ur) => ur.id === selected.id) !== undefined)
            ? () => {
                setEditing(selected);
                setShowForm(true);
                setSelected(null);
              }
            : undefined
        }
      />

      {/* Recipe Form - Improved modal with click-outside-to-close */}
      {showForm && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
          onClick={(e) => {
            // Close modal when clicking the backdrop (not on mobile)
            if (e.target === e.currentTarget && window.innerWidth >= 1024) {
              setShowForm(false);
              setEditing(null);
            }
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <RecipeForm
              initial={editing ?? undefined}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Copy From Dialog - Updated with standardized close button styling */}
      <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <DialogContent className="max-w-lg bg-gray-900 border border-red-500/30 text-red-300">
          <DialogHeader>
            <DialogTitle className="text-red-400">Copy Recipe Into My Creations</DialogTitle>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
            {allRecipes.map((rec) => (
              <button
                key={rec.id}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 border border-red-500/20 hover:border-red-400/40 transition text-left"
                onClick={() => handleCopyFrom(rec)}
              >
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="h-10 w-10 object-cover rounded"
                />
                <div>
                  <div className="font-medium text-red-300">{rec.name}</div>
                  <div className="text-xs text-red-500/70 line-clamp-1">{rec.origin ?? ""}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              variant="secondary" 
              onClick={() => setCopyDialogOpen(false)}
              className="bg-gray-800 text-red-400 border border-red-500/30 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Recipe Dialog */}
      {recipeToShare && (
        <ShareRecipe
          recipe={recipeToShare}
          open={shareDialogOpen}
          onOpenChange={(open) => {
            setShareDialogOpen(open);
            if (!open) setRecipeToShare(null);
          }}
        />
      )}
    </div>
  );
}
