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
    
    const success = await toggleFavoriteInDB(recipeId);
    if (success) {
      window.dispatchEvent(new Event('favorites-update'));
    }
    return success;
  }, [user]);

  return {
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    refresh: loadFavorites
  };
}