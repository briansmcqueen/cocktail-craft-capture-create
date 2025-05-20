
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import RecipeModal from "@/components/RecipeModal";
import { classicCocktails, Cocktail } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Library = "all" | "classics" | "mine";

export default function Index() {
  // State
  const [library, setLibrary] = useState<Library>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cocktail | null>(null);
  const [selected, setSelected] = useState<Cocktail | null>(null);
  const [userRecipes, setUserRecipes] = useState<Cocktail[]>(getUserRecipes());

  // Gather recipes to display
  let displayed: Cocktail[] = [];
  if (library === "all") {
    displayed = [...classicCocktails, ...userRecipes];
  } else if (library === "classics") {
    displayed = [...classicCocktails];
  } else if (library === "mine") {
    displayed = [...userRecipes];
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

  // UI
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        active={library}
        onSelect={(id) => setLibrary(id as Library)}
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
      </main>
    </div>
  );
}
