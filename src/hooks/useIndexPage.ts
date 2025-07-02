
import { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getUserRecipesFromDB, saveRecipeToDB, deleteRecipeFromDB } from "@/services/recipesService";
import { getUserFavorites, toggleFavoriteInDB } from "@/services/favoritesService";
import { toggleLikeInDB } from "@/services/likesService";
import { useAuth } from "@/hooks/useAuth";
import { useDataMigration } from "@/hooks/useDataMigration";

export function useIndexPage() {
  const { user } = useAuth();
  useDataMigration(); // Auto-migrate localStorage data
  
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
      const loadUserRecipes = async () => {
        const recipes = await getUserRecipesFromDB();
        setUserRecipes(recipes);
      };
      loadUserRecipes();
    } else {
      setUserRecipes([]);
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

  const handleSaveRecipe = async (recipe: Cocktail) => {
    if (!user) return;
    const success = await saveRecipeToDB(recipe);
    if (success) {
      const recipes = await getUserRecipesFromDB();
      setUserRecipes(recipes);
      setShowForm(false);
      setEditingRecipe(null);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!user) return;
    const success = await deleteRecipeFromDB(id);
    if (success) {
      const recipes = await getUserRecipesFromDB();
      setUserRecipes(recipes);
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

  const handleToggleFavorite = async (recipe: Cocktail) => {
    if (!user) return;
    await toggleFavoriteInDB(recipe.id);
    setForceUpdate(prev => prev + 1);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const loadFavorites = async () => {
        const favorites = await getUserFavorites();
        setFavoriteRecipeIds(favorites);
      };
      loadFavorites();
    } else {
      setFavoriteRecipeIds([]);
    }
  }, [user, forceUpdate]);

  const allRecipes = [...classicCocktails, ...userRecipes];
  const favoriteRecipes = user ? allRecipes.filter(recipe => 
    favoriteRecipeIds.includes(recipe.id)
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
