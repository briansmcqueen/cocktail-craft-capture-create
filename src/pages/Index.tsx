
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import RecipeModal from "@/components/RecipeModal";
import ShareRecipe from "@/components/ShareRecipe";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TagBadge from "@/components/ui/tag";
import { Search, Menu, X, Martini, Share } from "lucide-react";

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

type Library = "all" | "classics" | "mine";

function getAllTags(recipes: Cocktail[]): string[] {
  const tags = new Set<string>();
  recipes.forEach(r => (r.tags || []).forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

export default function Index() {
  // State
  const [library, setLibrary] = useState<Library>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cocktail | null>(null);
  const [selected, setSelected] = useState<Cocktail | null>(null);
  const [userRecipes, setUserRecipes] = useState<Cocktail[]>(getUserRecipes());
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
  if (library === "all") {
    displayed = [...classicCocktails, ...userRecipes];
  } else if (library === "classics") {
    displayed = [...classicCocktails];
  } else if (library === "mine") {
    displayed = [...userRecipes];
  }

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

  // Tag badge filter - THIS WAS THE BUG, NOW FIXED
  if (tagFilter) {
    displayed = displayed.filter(recipe => recipe.tags && recipe.tags.includes(tagFilter));
  }

  // Flavor profile filter
  if (flavorProfile) {
    displayed = displayed.filter(recipe =>
      recipe.tags && recipe.tags.map(tag => tag.toLowerCase()).includes(flavorProfile.toLowerCase())
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

  // Get all tags for the active visible library (used for tag filter selection)
  const fullRecipes = library === "all"
    ? [...classicCocktails, ...userRecipes]
    : library === "classics"
    ? classicCocktails
    : userRecipes;

  const allTags = getAllTags(fullRecipes);

  // Mobile-first UI with Supabase-inspired design
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Martini size={20} className="text-green-600" />
            <h1 className="text-lg font-semibold text-gray-900">
              Mixology Maven
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            className="text-sm px-3 bg-green-600 text-white hover:bg-green-700"
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
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 min-w-0 bg-white">
          {/* Desktop header - hidden on mobile */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <Martini size={32} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-1">
                  Mixology Maven
                </h1>
                <h2 className="text-xl xl:text-2xl font-medium text-gray-600">
                  {library === "all"
                    ? "All Cocktails"
                    : library === "classics"
                    ? "Classic Collection"
                    : "My Creations"}
                </h2>
              </div>
            </div>
            {library === "mine" && (
              <Button 
                variant="outline" 
                onClick={() => setCopyDialogOpen(true)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Copy from…
              </Button>
            )}
          </div>

          {/* Mobile library title */}
          <div className="lg:hidden mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {library === "all"
                ? "All Cocktails"
                : library === "classics"
                ? "Classic Collection"
                : "My Creations"}
            </h2>
            <p className="text-gray-600 text-sm">
              {displayed.length} recipe{displayed.length !== 1 ? 's' : ''}
            </p>
            {library === "mine" && (
              <Button 
                variant="outline" 
                size="sm"
                className="mt-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setCopyDialogOpen(true)}
              >
                Copy from…
              </Button>
            )}
          </div>

          {/* Enhanced Search & Filter - Supabase style */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
              {/* Search section */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-1">
                {/* Search type selector */}
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value as "ingredient" | "tag")}
                  className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 text-sm min-w-[130px] focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="pl-10 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>

              {/* Flavor profile dropdown */}
              <div className="sm:w-auto">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 w-full sm:min-w-[160px] text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          </div>

          {/* Tag filters - Supabase style */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`
                      text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium
                      ${tagFilter === tag
                        ? "bg-green-100 text-green-700 border-green-300 shadow-sm"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }
                    `}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  >
                    {tag}
                  </button>
                ))}
                {tagFilter && (
                  <button
                    onClick={() => setTagFilter(null)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="text-center text-gray-500 mt-16 lg:mt-20 px-4">
              <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                <Martini size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="mb-4 text-gray-600">No recipes found matching your criteria.</p>
                {library !== "classics" && (
                  <Button 
                    onClick={() => setShowForm(true)} 
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    Add Your First Recipe
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Recipe grid - Supabase style cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayed.map((r) => (
              <div key={r.id} className="relative group">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
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
                  {/* Share button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-700 border border-gray-200 shadow-sm backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => handleShareRecipe(r)}
                  >
                    <Share size={14} />
                  </Button>
                </div>
              </div>
            ))}
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

          {/* Recipe Form */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
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
            <DialogContent className="max-w-lg bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Copy Recipe Into My Creations</DialogTitle>
              </DialogHeader>
              <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                {[...classicCocktails, ...userRecipes].map((rec) => (
                  <button
                    key={rec.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-left border border-gray-200"
                    onClick={() => handleCopyFrom(rec)}
                  >
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="h-10 w-10 object-cover rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{rec.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{rec.origin ?? ""}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCopyDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
