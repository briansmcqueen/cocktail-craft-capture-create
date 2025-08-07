import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getUserRecipesFromDB, saveRecipeToDB, deleteRecipeFromDB } from '@/services/recipesService';
import { getAggregatedRating } from '@/services/ratingsService';
import { useAuth } from './useAuth';
import { Cocktail } from '@/data/classicCocktails';

export function useUserRecipes() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRecipes', user?.id],
    queryFn: getUserRecipesFromDB,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
  });
}

export function useRecipeRating(recipeId: string) {
  return useQuery({
    queryKey: ['recipeRating', recipeId],
    queryFn: () => getAggregatedRating(recipeId),
    enabled: !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipe: Cocktail) => saveRecipeToDB(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes'] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipeFromDB(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes'] });
    },
  });
}