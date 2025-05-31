import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import RecipeModal from "@/components/RecipeModal";
import ShareRecipe from "@/components/ShareRecipe";
import Featured from "@/components/Featured";
import Favorites from "@/components/Favorites";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { getFavoriteRecipes, toggleFavorite, isFavorite } from "@/utils/favorites";
import { addLike, getLikeCount } from "@/utils/likes";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TagBadge from "@/components/ui/tag";
import { Search, Menu, X, Heart, Share, ThumbsUp } from "lucide-react";

// New: Flavor profiles (you can adjust as needed)
const FLAVOR_PROFILES = [
  "bitter",
  "sweet",
  "sour",
  "citrus",
  "herbal",
  "spicy",
  "aperitif",
  "gin",
  "whiskey",
  "tequila",
];

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
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<"ingredient" | "tag">("ingredient");
  const [flavorProfile, setFlavorProfile] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [recipeToShare, setRecipeToShare] = useState<Cocktail | null>(null);

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
    // Main search logic: by ingredient or tag
    if (ingredientQuery.trim()) {
      if (searchType === "ingredient") {
        displayed = displayed.filter(recipe =>
          recipe.ingredients.some(ing =>
            ing.toLowerCase().includes(ingredientQuery.trim().toLowerCase())
          )
        );
      } else {
        displayed = displayed.filter(recipe =>
          recipe.tags && recipe.tags.some(tag =>
            tag.toLowerCase().includes(ingredientQuery.trim().toLowerCase())
          )
        );
      }
    }

    // Tag badge filter
    if (tagFilter) {
      displayed = displayed.filter(recipe => recipe.tags && recipe.tags.includes(tagFilter));
    }

    // Flavor profile filter
    if (flavorProfile) {
      displayed = displayed.filter(recipe =>
        recipe.tags && recipe.tags.map(tag => tag.toLowerCase()).includes(flavorProfile.toLowerCase())
      );
    }
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
  }

  function handleLike(recipe: Cocktail) {
    const newCount = addLike(recipe.id);
  }

  // Get all tags for the active visible library (used for tag filter selection)
  const fullRecipes = library === "all"
    ? allRecipes
    : library === "classics"
    ? classicCocktails
    : library === "favorites"
    ? favoriteRecipes
    : userRecipes;

  const allTags = getAllTags(fullRecipes);

  const getLibraryTitle = () => {
    switch (library) {
      case "featured": return "Featured";
      case "all": return "All Cocktails";
      case "classics": return "Classic Collection";
      case "favorites": return "Your Favorites";
      case "mine": return "My Creations";
      default: return "Cocktails";
    }
  };

  // Mobile-first UI with NYT Cooking inspired aesthetic
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-display font-bold text-orange-600 tracking-wide">
              BARBOOK
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            className="text-sm px-3 bg-orange-600 text-white hover:bg-orange-700"
          >
            Add
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          lg:relative lg:translate-x-0 lg:bg-transparent
          fixed top-0 left-0 h-full z-40 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="lg:hidden absolute top-4 right-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <Sidebar
            active={library}
            onSelect={(id) => {
              setLibrary(id as Library);
              setIngredientQuery("");
              setTagFilter(null);
              setSidebarOpen(false); // Close mobile sidebar
            }}
            onAdd={() => {
              setShowForm(true);
              setEditing(null);
              setSidebarOpen(false); // Close mobile sidebar
            }}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 lg:px-8 py-4 lg:py-8 min-w-0 bg-gray-50">
          {/* Mobile library title */}
          <div className="lg:hidden mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {getLibraryTitle()}
            </h2>
            {library === "mine" && (
              <Button 
                variant="secondary" 
                size="sm"
                className="mt-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                onClick={() => setCopyDialogOpen(true)}
              >
                Copy from…
              </Button>
            )}
          </div>

          {/* Render Featured component for featured library */}
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
            <>
              {/* Desktop header with NYT styling */}
              <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl xl:text-4xl font-display font-light text-gray-900 mb-1 tracking-wide">
                    {getLibraryTitle()}
                  </h2>
                </div>
                {library === "mine" && (
                  <Button 
                    variant="secondary" 
                    onClick={() => setCopyDialogOpen(true)}
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Copy from…
                  </Button>
                )}
              </div>

              {/* Enhanced Search & Filter - NYT inspired */}
              <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4 mb-6">
                {/* Search section */}
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
                  {/* Search type selector */}
                  <select
                    value={searchType}
                    onChange={e => setSearchType(e.target.value as "ingredient" | "tag")}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 text-sm min-w-[120px] focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    aria-label="Search by"
                  >
                    <option value="ingredient">Ingredient</option>
                    <option value="tag">Tag</option>
                  </select>
                  
                  {/* Search bar */}
                  <div className="relative flex-1">
                    <Input
                      value={ingredientQuery}
                      onChange={e => setIngredientQuery(e.target.value)}
                      placeholder={searchType === "ingredient" ? "Search by ingredient…" : "Search by tag…"}
                      className="pl-9 bg-white border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-orange-500"
                    />
                    <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>

                {/* Flavor profile dropdown */}
                <div className="sm:w-auto">
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 w-full sm:min-w-[150px] text-sm focus:border-orange-500"
                    value={flavorProfile || ""}
                    onChange={e => setFlavorProfile(e.target.value || null)}
                    aria-label="Flavor profile"
                  >
                    <option value="">All Flavors</option>
                    {FLAVOR_PROFILES.map(f => (
                      <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tag filters - NYT optimized */}
              {allTags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <TagBadge
                        key={tag}
                        className={`
                          text-xs px-3 py-1 cursor-pointer transition-all duration-200 border
                          ${tagFilter === tag
                            ? "bg-orange-600 text-white border-orange-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }
                        `}
                        onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                      >
                        {tag}
                      </TagBadge>
                    ))}
                    {tagFilter && (
                      <button
                        onClick={() => setTagFilter(null)}
                        className="text-xs px-3 py-1 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {displayed.length === 0 && (
                <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
                  <p className="mb-4 text-sm lg:text-base">No recipes yet in this library.</p>
                  {library !== "classics" && library !== "favorites" && (
                    <Button 
                      onClick={() => setShowForm(true)} 
                      className="w-full sm:w-auto bg-orange-600 text-white hover:bg-orange-700"
                    >
                      Add Your First Recipe
                    </Button>
                  )}
                </div>
              )}

              {/* Recipe grid - NYT inspired cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {displayed.map((r) => (
                  <div key={r.id} className="relative group">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white">
                      <RecipeCard
                        recipe={r}
                        onSelect={() => handleRecipeClick(r)}
                        editable={library === "mine" || (userRecipes.find((ur) => ur.id === r.id) !== undefined)}
                        onEdit={
                          (library === "mine" || userRecipes.find((ur) => ur.id === r.id) !== undefined)
                            ? () => handleEditRecipe(r)
                            : undefined
                        }
                      />
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                          isFavorite(r.id) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                        onClick={() => handleToggleFavorite(r)}
                      >
                        <Heart size={14} fill={isFavorite(r.id) ? 'currentColor' : 'none'} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`p-2 bg-white/90 hover:bg-white border border-gray-200 shadow-sm backdrop-blur-sm rounded-full transition-colors ${
                          getLikeCount(r.id) > 0 ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                        onClick={() => handleLike(r)}
                      >
                        <ThumbsUp size={14} fill={getLikeCount(r.id) > 0 ? 'currentColor' : 'none'} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="p-2 bg-white/90 hover:bg-white text-red-600 border border-gray-200 shadow-sm backdrop-blur-sm rounded-full"
                        onClick={() => handleShareRecipe(r)}
                      >
                        <Share size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

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

          {/* Recipe Form */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
              <div className="min-w-0 w-full max-w-lg">
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

          {/* Copy From Dialog */}
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
        </main>
      </div>
    </div>
  );
}
