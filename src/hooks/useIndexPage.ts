
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Cocktail, classicCocktails } from "@/data/classicCocktails";
import { useUserRecipes, useSaveRecipe, useDeleteRecipe } from "./useOptimizedRecipes";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import type { LibraryKey } from "@/types/library";

export function useIndexPage(library: LibraryKey) {
  const { user } = useAuth();

  const { favoriteIds, toggleFavorite } = useFavorites();
  const { data: userRecipes = [], isLoading } = useUserRecipes();
  const saveRecipeMutation = useSaveRecipe();
  const deleteRecipeMutation = useDeleteRecipe();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Cocktail | null>(null);
  const [shareRecipe, setShareRecipe] = useState<Cocktail | null>(null);

  // Memoize expensive calculations
  const allRecipes = useMemo(() => [...classicCocktails, ...userRecipes], [userRecipes]);

  const favoriteRecipes = useMemo(() =>
    user ? allRecipes.filter(recipe => favoriteIds.includes(recipe.id)) : [],
    [allRecipes, favoriteIds, user]
  );

  const filteredRecipes = useMemo(() => {
    let recipes = library === "classics" ? classicCocktails
                 : library === "mine" ? userRecipes
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
  }, [library, userRecipes, favoriteRecipes, allRecipes, searchTerm, selectedTags]);


  const handleSaveRecipe = (recipe: Cocktail) => {
    if (!user) {
      toast.error("You need to be signed in to save a recipe.");
      return;
    }

    // Optimistically close form for better UX
    setShowForm(false);
    setEditingRecipe(null);

    saveRecipeMutation.mutate(recipe, {
      onSuccess: () => {
        toast.success(recipe.id ? "Recipe updated" : "Recipe saved");
      },
      onError: (error) => {
        console.error("Failed to save recipe:", error);
        toast.error("Couldn't save your recipe. Please try again.");
      },
    });
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!user) return;
    try {
      await deleteRecipeMutation.mutateAsync(id);
      toast.success("Recipe deleted");
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      toast.error("Couldn't delete that recipe. Please try again.");
    }
  };

  const handleEditRecipe = (recipe: Cocktail) => {
    if (!user) return;
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleShareRecipe = (recipe: Cocktail) => {
    setShareRecipe(recipe);
  };

  const handleLike = async (recipe: Cocktail) => {
    if (!user) return;
    try {
      await toggleFavorite(recipe.id);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Couldn't update your favorites. Please try again.");
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };


  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    showForm,
    setShowForm,
    editingRecipe,
    setEditingRecipe,
    shareRecipe,
    setShareRecipe,
    userRecipes,
    isLoading,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleLike,
    handleTagClick,
    allRecipes,
    favoriteRecipes,
    filteredRecipes
  };
}
