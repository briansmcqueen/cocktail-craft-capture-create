import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getUserRecipesFromDB, saveRecipeToDB, deleteRecipeFromDB } from '@/services/recipesService';
import { useRecipeRating as useOptimizedRecipeRating } from './useRecipeRatings';
import { useAuth } from './useAuth';
import { Cocktail } from '@/data/classicCocktails';
import { toast } from '@/hooks/use-toast';

export function useUserRecipes() {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['userRecipes', user?.id],
    queryFn: getUserRecipesFromDB,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
  });

  // Ensure no duplicates in the returned data
  const deduplicatedData = useMemo(() => {
    if (!query.data) return [];
    const seen = new Set<string>();
    return query.data.filter(recipe => {
      if (seen.has(recipe.id)) return false;
      seen.add(recipe.id);
      return true;
    });
  }, [query.data]);

  return {
    ...query,
    data: deduplicatedData
  };
}

// Use the new optimized hook instead
export function useRecipeRating(recipeId: string) {
  return useOptimizedRecipeRating(recipeId);
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipe: Cocktail) => saveRecipeToDB(recipe),
    onMutate: async (newRecipe: Cocktail) => {
      await queryClient.cancelQueries({ queryKey: ['userRecipes'] });
      const snapshots = queryClient.getQueriesData<Cocktail[]>({ queryKey: ['userRecipes'] });

      // Optimistically update all userRecipes caches
      snapshots.forEach(([key, data]) => {
        const current = data || [];
        const exists = current.some(r => r.id === newRecipe.id && newRecipe.id);
        const optimistic: Cocktail = {
          ...newRecipe,
          // Ensure image and flags exist for UI
          image: newRecipe.image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
          isUserRecipe: true,
        };
        const updated = exists
          ? current.map(r => (r.id === newRecipe.id ? optimistic : r))
          : [optimistic, ...current];
        queryClient.setQueryData(key, updated);
      });

      toast({ title: 'Saving recipe…', description: 'Your changes are being synced.' });
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      context?.snapshots?.forEach(([key, data]: any) => {
        queryClient.setQueryData(key, data);
      });
      toast({ title: 'Save failed', description: 'We reverted your changes.', variant: 'destructive' });
    },
    onSuccess: () => {
      toast({ title: 'Recipe saved', description: 'All set!' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes'] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipeFromDB(recipeId),
    onMutate: async (recipeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['userRecipes'] });
      const snapshots = queryClient.getQueriesData<Cocktail[]>({ queryKey: ['userRecipes'] });

      // Optimistically remove from all caches
      snapshots.forEach(([key, data]) => {
        const current = data || [];
        queryClient.setQueryData(key, current.filter(r => r.id !== recipeId));
      });

      toast({ title: 'Deleting…', description: 'Removing your recipe.' });
      return { snapshots };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      context?.snapshots?.forEach(([key, data]: any) => {
        queryClient.setQueryData(key, data);
      });
      toast({ title: 'Delete failed', description: 'We restored your recipe.', variant: 'destructive' });
    },
    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Recipe removed.' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes'] });
    },
  });
}