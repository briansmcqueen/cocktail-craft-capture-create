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
import { Search } from "lucide-react";

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

  // UI
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        active={library}
        onSelect={(id) => {
          setLibrary(id as Library);
          setIngredientQuery("");
          setTagFilter(null);
        }}
        onAdd={() => {
          setShowForm(true);
          setEditing(null);
        }}
      />
      <main className="flex-1 px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-2xl font-bold">
            {library === "all"
              ? "All Cocktails"
              : library === "classics"
              ? "Classic Collection"
              : "My Creations"}
          </h2>
          {library === "mine" && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setCopyDialogOpen(true)}>
                Copy from…
              </Button>
            </div>
          )}
        </div>
        {/* Enhanced Search & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
          <div className="flex items-center gap-2 flex-1">
            {/* New: Search type selector */}
            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value as "ingredient" | "tag")}
              className="border rounded px-2 py-1 mr-2 bg-background text-foreground"
              aria-label="Search by"
            >
              <option value="ingredient">Ingredient</option>
              <option value="tag">Tag</option>
            </select>
            {/* Search bar */}
            <div className="relative w-full">
              <input
                value={ingredientQuery}
                onChange={e => setIngredientQuery(e.target.value)}
                placeholder={searchType === "ingredient" ? "Search by ingredient…" : "Search by tag…"}
                className="border rounded px-3 py-2 w-full pl-9"
              />
              <Search className="absolute left-2 top-2.5 text-muted-foreground" size={16} />
            </div>
          </div>

          {/* New: Flavor profile dropdown */}
          <div>
            <select
              className="border rounded px-2 py-2 bg-background text-foreground min-w-[150px]"
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

          {/* Tag badge filter */}
          {allTags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              {allTags.map(tag => (
                <TagBadge
                  key={tag}
                  className={
                    tagFilter === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground cursor-pointer"
                  }
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </TagBadge>
              ))}
              {tagFilter && 
                <button
                  onClick={() => setTagFilter(null)}
                  className="ml-2 px-2 rounded text-xs bg-secondary text-secondary-foreground"
                >Clear Tag</button>
              }
            </div>
          )}
        </div>
        {displayed.length === 0 && (
          <div className="text-center text-muted-foreground mt-16">
            <p className="mb-2">No recipes yet in this library.</p>
            {library !== "classics" && (
              <Button onClick={() => setShowForm(true)}>Add Your First Recipe</Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
  );
}
