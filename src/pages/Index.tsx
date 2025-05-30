import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import RecipeModal from "@/components/RecipeModal";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TagBadge from "@/components/ui/tag";
import { Search, Menu, X } from "lucide-react";

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

  // Get all tags for the active visible library (used for tag filter selection)
  const fullRecipes = library === "all"
    ? [...classicCocktails, ...userRecipes]
    : library === "classics"
    ? classicCocktails
    : userRecipes;

  const allTags = getAllTags(fullRecipes);

  // Mobile-first UI with responsive design
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-display font-semibold text-gradient-primary">
            Cocktail Craft
          </h1>
          <Button
            size="sm"
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}
            className="text-sm px-3"
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
              className="p-2 text-white hover:bg-white/10 rounded-lg"
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
        <main className="flex-1 px-4 lg:px-6 py-4 lg:py-8 min-w-0">
          {/* Desktop header - hidden on mobile */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h2 className="text-2xl xl:text-3xl font-display font-bold text-gradient-primary">
              {library === "all"
                ? "All Cocktails"
                : library === "classics"
                ? "Classic Collection"
                : "My Creations"}
            </h2>
            {library === "mine" && (
              <Button variant="secondary" onClick={() => setCopyDialogOpen(true)}>
                Copy from…
              </Button>
            )}
          </div>

          {/* Mobile library title */}
          <div className="lg:hidden mb-4">
            <h2 className="text-xl font-display font-semibold text-foreground">
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
                className="mt-2"
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
                className="border rounded-lg px-3 py-2 bg-background text-foreground text-sm min-w-[120px]"
                aria-label="Search by"
              >
                <option value="ingredient">Ingredient</option>
                <option value="tag">Tag</option>
              </select>
              
              {/* Search bar */}
              <div className="relative flex-1">
                <input
                  value={ingredientQuery}
                  onChange={e => setIngredientQuery(e.target.value)}
                  placeholder={searchType === "ingredient" ? "Search by ingredient…" : "Search by tag…"}
                  className="border rounded-lg px-3 py-2 w-full pl-9 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
              </div>
            </div>

            {/* Flavor profile dropdown */}
            <div className="sm:w-auto">
              <select
                className="border rounded-lg px-3 py-2 bg-background text-foreground w-full sm:min-w-[150px] text-sm"
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
                      text-xs px-2 py-1 cursor-pointer transition-colors
                      ${tagFilter === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
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
                    className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="text-center text-muted-foreground mt-12 lg:mt-16 px-4">
              <p className="mb-4 text-sm lg:text-base">No recipes yet in this library.</p>
              {library !== "classics" && (
                <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
                  Add Your First Recipe
                </Button>
              )}
            </div>
          )}

          {/* Recipe grid - Mobile first responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {displayed.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onSelect={() => handleRecipeClick(r)}
                editable={library === "mine" || (userRecipes.find((ur) => ur.id === r.id) !== undefined)}
                onEdit={
                  (library === "mine" || userRecipes.find((ur) => ur.id === r.id) !== undefined)
                    ? () => handleEditRecipe(r)
                    : undefined
                }
              />
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
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-30">
              <div className="min-w-0">
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
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Copy Recipe Into My Creations</DialogTitle>
              </DialogHeader>
              <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                {[...classicCocktails, ...userRecipes].map((rec) => (
                  <button
                    key={rec.id}
                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-accent transition text-left"
                    onClick={() => handleCopyFrom(rec)}
                  >
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{rec.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{rec.origin ?? ""}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="secondary" onClick={() => setCopyDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
