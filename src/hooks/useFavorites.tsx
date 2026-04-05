import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { getUserFavorites, addFavorite, removeFavorite } from '@/services/favoritesService';

interface FavoritesContextType {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string, onUnauthenticated?: () => void) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
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
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = useCallback((recipeId: string) => {
    return favoriteIds.includes(recipeId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (recipeId: string, onUnauthenticated?: () => void) => {
    if (!user) {
      onUnauthenticated?.();
      return false;
    }
    
    const wasLiked = favoriteIds.includes(recipeId);
    
    // Optimistic update
    setFavoriteIds(prev => 
      wasLiked 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
    
    try {
      const success = wasLiked 
        ? await removeFavorite(recipeId)
        : await addFavorite(recipeId);
      
      if (!success) {
        // Revert on failure
        setFavoriteIds(prev => 
          wasLiked 
            ? [...prev, recipeId]
            : prev.filter(id => id !== recipeId)
        );
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setFavoriteIds(prev => 
        wasLiked 
          ? [...prev, recipeId]
          : prev.filter(id => id !== recipeId)
      );
      return false;
    }
  }, [user, favoriteIds]);

  const value = {
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    refreshFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}