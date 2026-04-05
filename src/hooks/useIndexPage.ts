
import { useState, useMemo } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { useUserRecipes, useSaveRecipe, useDeleteRecipe } from "./useOptimizedRecipes";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

export function useIndexPage() {
  const { user } = useAuth();
  useDataMigration(); // Auto-migrate localStorage data
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { data: userRecipes = [], isLoading } = useUserRecipes();
  const saveRecipeMutation = useSaveRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  
  const [selectedRecipe, setSelectedRecipe] = useState<Cocktail | null>(null);
  const [library, setLibrary] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Cocktail | null>(null);
  const [shareRecipe, setShareRecipe] = useState<Cocktail | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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


  const handleRecipeClick = (recipe: Cocktail) => {
    setSelectedRecipe(recipe);
  };

  const handleSaveRecipe = async (recipe: Cocktail) => {
    if (!user) {
      console.error('User not authenticated for recipe save');
      return;
    }
    
    try {
      // Optimistically close form immediately for better UX
      setShowForm(false);
      setEditingRecipe(null);
      
      // Show immediate success feedback
      console.log('Saving recipe in background...');
      
      // Save in background without blocking UI
      saveRecipeMutation.mutate(recipe, {
        onSuccess: () => {
          console.log('Recipe saved successfully');
        },
        onError: (error) => {
          console.error('Failed to save recipe:', error);
          // Could show error toast here if needed
        }
      });
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!user) return;
    try {
      await deleteRecipeMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
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
    await toggleLikeInDB(recipe.id);
    setForceUpdate(prev => prev + 1);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };


  return {
    selectedRecipe,
    setSelectedRecipe,
    library,
    setLibrary,
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
    forceUpdate,
    isMobile,
    userRecipes,
    isLoading,
    handleRecipeClick,
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
