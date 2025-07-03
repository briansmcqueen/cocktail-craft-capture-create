import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getUserFavorites, toggleFavoriteInDB } from '@/services/favoritesService';

export function useFavorites() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    setLoading(true);
    try {
      const favorites = await getUserFavorites();
      setFavoriteIds(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const handleUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favorites-update', handleUpdate);
    return () => window.removeEventListener('favorites-update', handleUpdate);
  }, [loadFavorites]);

  const isFavorite = useCallback((recipeId: string) => {
    return favoriteIds.includes(recipeId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (recipeId: string) => {
    if (!user) return false;
    
    console.log('Toggling favorite for recipe:', recipeId);
    
    // Optimistically update the UI immediately
    setFavoriteIds(prev => {
      const newFavorites = prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      console.log('Updated favorites optimistically:', newFavorites);
      return newFavorites;
    });
    
    // Then sync with database
    try {
      const success = await toggleFavoriteInDB(recipeId);
      console.log('Database toggle result:', success);
      if (!success) {
        // Revert on failure
        setFavoriteIds(prev => {
          return prev.includes(recipeId) 
            ? prev.filter(id => id !== recipeId)
            : [...prev, recipeId];
        });
      }
      return success;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setFavoriteIds(prev => {
        return prev.includes(recipeId) 
          ? prev.filter(id => id !== recipeId)
          : [...prev, recipeId];
      });
      return false;
    }
  }, [user]);

  return {
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    refresh: loadFavorites
  };
}