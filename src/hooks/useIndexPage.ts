
import { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";
import { toggleFavorite, getFavoriteRecipes } from "@/utils/favorites";
import { toggleLike } from "@/utils/likes";
import { useAuth } from "@/hooks/useAuth";

export function useIndexPage() {
  const { user } = useAuth();
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      setUserRecipes(getUserRecipes());
    }
  }, [user]);

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
    if (!user) return;
    saveUserRecipe(recipe);
    setUserRecipes(getUserRecipes());
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (id: string) => {
    if (!user) return;
    deleteUserRecipe(id);
    setUserRecipes(getUserRecipes());
  };

  const handleEditRecipe = (recipe: Cocktail) => {
    if (!user) return;
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleShareRecipe = (recipe: Cocktail) => {
    setShareRecipe(recipe);
  };

  const handleLike = (recipe: Cocktail) => {
    if (!user) return;
    toggleLike(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    if (!user) return;
    toggleFavorite(recipe.id);
    window.dispatchEvent(new Event('favorites-update'));
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const allRecipes = [...classicCocktails, ...userRecipes];
  const favoriteRecipes = user ? allRecipes.filter(recipe => 
    getFavoriteRecipes().includes(recipe.id)
  ) : [];

  const getFilteredRecipes = () => {
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
    handleRecipeClick,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleLike,
    handleToggleFavorite,
    handleTagClick,
    allRecipes,
    favoriteRecipes,
    getFilteredRecipes
  };
}
