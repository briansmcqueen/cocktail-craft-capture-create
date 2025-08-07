import { useState, useEffect, useCallback } from 'react';
import { Cocktail } from '@/data/classicCocktails';
import { CacheService } from '@/services/cacheService';
import { getUserRecipesFromDB } from '@/services/recipesService';
import { getUserRecipes } from '@/utils/storage';
import { useAuth } from '@/hooks/useAuth';

interface RecipeCacheHook {
  recipes: Cocktail[];
  isLoading: boolean;
  refreshRecipes: () => Promise<void>;
  getRecipe: (id: string) => Cocktail | null;
  addRecipe: (recipe: Cocktail) => void;
  updateRecipe: (recipe: Cocktail) => void;
  deleteRecipe: (id: string) => void;
}

export function useRecipeCache(): RecipeCacheHook {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, [user]);

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try cache first
      const cachedRecipes = CacheService.getRecipes();
      if (cachedRecipes) {
        setRecipes(cachedRecipes);
        setIsLoading(false);
        
        // Background refresh if data is older than 30 seconds
        const cacheAge = Date.now() - (CacheService.get<number>('recipes_timestamp') || 0);
        if (cacheAge > 30000) {
          refreshRecipesInBackground();
        }
        return;
      }

      // Load from appropriate source
      let loadedRecipes: Cocktail[] = [];
      
      if (user) {
        // Load from database for authenticated users
        loadedRecipes = await getUserRecipesFromDB();
      } else {
        // Load from localStorage for non-authenticated users
        loadedRecipes = getUserRecipes();
      }

      // Cache and set recipes
      CacheService.setRecipes(loadedRecipes);
      CacheService.set('recipes_timestamp', Date.now());
      setRecipes(loadedRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      // Fallback to empty array
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshRecipesInBackground = useCallback(async () => {
    try {
      let freshRecipes: Cocktail[] = [];
      
      if (user) {
        freshRecipes = await getUserRecipesFromDB();
      } else {
        freshRecipes = getUserRecipes();
      }

      // Update cache and state
      CacheService.setRecipes(freshRecipes);
      CacheService.set('recipes_timestamp', Date.now());
      setRecipes(freshRecipes);
    } catch (error) {
      console.error('Error refreshing recipes in background:', error);
    }
  }, [user]);

  const refreshRecipes = useCallback(async (): Promise<void> => {
    await loadRecipes();
  }, [loadRecipes]);

  const getRecipe = useCallback((id: string): Cocktail | null => {
    // Try cache first
    const cached = CacheService.getRecipe(id);
    if (cached) return cached;

    // Fallback to current recipes array
    return recipes.find(r => r.id === id) || null;
  }, [recipes]);

  const addRecipe = useCallback((recipe: Cocktail) => {
    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
    CacheService.setRecipes(updatedRecipes);
    CacheService.set('recipes_timestamp', Date.now());
  }, [recipes]);

  const updateRecipe = useCallback((recipe: Cocktail) => {
    const updatedRecipes = recipes.map(r => r.id === recipe.id ? recipe : r);
    setRecipes(updatedRecipes);
    CacheService.setRecipe(recipe);
    CacheService.set('recipes_timestamp', Date.now());
  }, [recipes]);

  const deleteRecipe = useCallback((id: string) => {
    const updatedRecipes = recipes.filter(r => r.id !== id);
    setRecipes(updatedRecipes);
    CacheService.deleteRecipe(id);
    CacheService.set('recipes_timestamp', Date.now());
  }, [recipes]);

  return {
    recipes,
    isLoading,
    refreshRecipes,
    getRecipe,
    addRecipe,
    updateRecipe,
    deleteRecipe
  };
}