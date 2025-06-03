
import { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getUserRecipes, saveUserRecipe, deleteUserRecipe } from "@/utils/storage";

export function useIndexPage() {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setUserRecipes(getUserRecipes());
  }, []);

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
    saveUserRecipe(recipe);
    setUserRecipes(getUserRecipes());
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (id: string) => {
    deleteUserRecipe(id);
    setUserRecipes(getUserRecipes());
  };

  const handleEditRecipe = (recipe: Cocktail) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleShareRecipe = (recipe: Cocktail) => {
    setShareRecipe(recipe);
  };

  const handleCloseShare = () => {
    setShareRecipe(null);
  };

  const handleLike = (recipe: Cocktail) => {
    console.log('Like recipe:', recipe.name);
  };

  const handleToggleFavorite = (recipe: Cocktail) => {
    console.log('Toggle favorite:', recipe.name);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const allRecipes = [...classicCocktails, ...userRecipes];
  const favoriteRecipes = allRecipes.filter(recipe => 
    localStorage.getItem('barbook_favorites')?.includes(recipe.id) || false
  );

  const getFilteredRecipes = () => {
    let recipes = library === "classics" ? classicCocktails 
                 : library === "user" ? userRecipes
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
    sidebarOpen,
    setSidebarOpen,
    handleRecipeClick,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleEditRecipe,
    handleShareRecipe,
    handleCloseShare,
    handleLike,
    handleToggleFavorite,
    handleTagClick,
    allRecipes,
    favoriteRecipes,
    getFilteredRecipes
  };
}
