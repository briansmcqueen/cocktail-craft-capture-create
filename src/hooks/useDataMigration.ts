import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { syncUserIngredientsFromLocalStorage } from '@/services/userIngredientsService';
import { syncUserRecipesFromLocalStorage } from '@/services/recipesService';
import { syncFavoritesFromLocalStorage } from '@/services/favoritesService';
import { syncLikesFromLocalStorage } from '@/services/likesService';

export function useDataMigration() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const migrateLocalStorageData = async () => {
      try {
        // Check if migration has already been done
        const migrationKey = `barbook_migration_${user.id}`;
        const migrationDone = localStorage.getItem(migrationKey);
        
        if (migrationDone) return;

        // Perform all migrations
        await Promise.all([
          syncUserIngredientsFromLocalStorage(),
          syncUserRecipesFromLocalStorage(),
          syncFavoritesFromLocalStorage(),
          syncLikesFromLocalStorage()
        ]);

        // Mark migration as complete
        localStorage.setItem(migrationKey, 'true');
        
        console.log('Data migration completed successfully');
      } catch (error) {
        console.error('Error during data migration:', error);
      }
    };

    migrateLocalStorageData();
  }, [user]);
}