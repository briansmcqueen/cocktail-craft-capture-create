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

  // Mobile-first UI with neon dive bar aesthetic
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-gray-900">
      {/* Mobile header */}
      <header className="lg:hidden bg-black/90 backdrop-blur-md border-b border-pink-500/20 sticky top-0 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-pink-500/10 rounded-lg transition-colors text-pink-400"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/0fbd9c77-fecf-48ea-8d31-580fb27e6206.png" 
              alt="Barbook" 
              className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
            />
            <h1 className="text-lg font-display font-bold text-pink-400 tracking-wider neon-text">
              BARBOOK
            </h1>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            className="text-sm px-3 bg-pink-500 text-black hover:bg-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400"
          >
            Add
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
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
              className="p-2 text-pink-400 hover:bg-pink-500/10 rounded-lg"
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
        <main className="flex-1 px-4 lg:px-6 py-4 lg:py-8 min-w-0 bg-gradient-to-b from-transparent to-gray-900/30">
          {/* Desktop header with neon styling */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/0fbd9c77-fecf-48ea-8d31-580fb27e6206.png" 
                alt="Barbook" 
                className="w-12 h-12 filter drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]"
              />
              <div>
                <h1 className="text-4xl xl:text-5xl font-display font-bold text-pink-400 mb-1 tracking-wider neon-text">
                  BARBOOK
                </h1>
                <h2 className="text-xl xl:text-2xl font-display font-semibold text-pink-300/80">
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
                variant="secondary" 
                onClick={() => setCopyDialogOpen(true)}
                className="bg-gray-800 text-pink-400 border border-pink-500/30 hover:bg-gray-700 hover:border-pink-400"
              >
                Copy from…
              </Button>
            )}
          </div>

          {/* Mobile library title */}
          <div className="lg:hidden mb-4">
            <h2 className="text-xl font-display font-semibold text-pink-300">
              {library === "all"
                ? "All Cocktails"
                : library === "classics"
                ? "Classic Collection"
                : "My Creations"}
            </h2>
            {library === "mine" && (
              <Button 
                variant="secondary" 
                size="sm"
                className="mt-2 bg-gray-800 text-pink-400 border border-pink-500/30 hover:bg-gray-700"
                onClick={() => setCopyDialogOpen(true)}
              >
                Copy from…
              </Button>
            )}
          </div>

          {/* Enhanced Search & Filter - Mobile First */}
          <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4 mb-6">
            {/* Search section */}
            <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
              {/* Search type selector */}
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value as "ingredient" | "tag")}
                className="border border-pink-500/30 rounded-lg px-3 py-2 pr-8 bg-gray-900 text-pink-300 text-sm min-w-[120px] focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
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
                  className="pl-9 bg-gray-900 border-pink-500/30 text-pink-300 placeholder:text-pink-500/50 focus:border-pink-400"
                />
                <Search className="absolute left-2.5 top-2.5 text-pink-500/70" size={16} />
              </div>
            </div>

            {/* Flavor profile dropdown */}
            <div className="sm:w-auto">
              <select
                className="border border-pink-500/30 rounded-lg px-3 py-2 pr-8 bg-gray-900 text-pink-300 w-full sm:min-w-[150px] text-sm focus:border-pink-400"
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

          {/* Tag filters - Mobile optimized */}
          {allTags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <TagBadge
                    key={tag}
                    className={`
                      text-xs px-3 py-1 cursor-pointer transition-all duration-200 border
                      ${tagFilter === tag
                        ? "bg-pink-500 text-black border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                        : "bg-gray-900 text-pink-300 border-pink-500/30 hover:bg-gray-800 hover:border-pink-400"
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
                    className="text-xs px-3 py-1 rounded-md bg-gray-800 text-pink-400 border border-pink-500/30 hover:bg-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="text-center text-pink-400/70 mt-12 lg:mt-16 px-4">
              <p className="mb-4 text-sm lg:text-base">No recipes yet in this library.</p>
              {library !== "classics" && (
                <Button 
                  onClick={() => setShowForm(true)} 
                  className="w-full sm:w-auto bg-pink-500 text-black hover:bg-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                >
                  Add Your First Recipe
                </Button>
              )}
            </div>
          )}

          {/* Recipe grid - Mobile first responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {displayed.map((r) => (
              <div key={r.id} className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300">
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
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-pink-400 border border-pink-500/30 shadow-lg backdrop-blur-sm rounded-full hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                  onClick={() => handleShareRecipe(r)}
                >
                  <Share size={14} />
                </Button>
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
            <DialogContent className="max-w-lg bg-gray-900 border border-pink-500/30 text-pink-300">
              <DialogHeader>
                <DialogTitle className="text-pink-400">Copy Recipe Into My Creations</DialogTitle>
              </DialogHeader>
              <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                {[...classicCocktails, ...userRecipes].map((rec) => (
                  <button
                    key={rec.id}
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 border border-pink-500/20 hover:border-pink-400/40 transition text-left"
                    onClick={() => handleCopyFrom(rec)}
                  >
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-pink-300">{rec.name}</div>
                      <div className="text-xs text-pink-500/70 line-clamp-1">{rec.origin ?? ""}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setCopyDialogOpen(false)}
                  className="bg-gray-800 text-pink-400 border border-pink-500/30 hover:bg-gray-700"
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
