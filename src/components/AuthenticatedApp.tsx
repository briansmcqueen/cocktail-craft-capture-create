
import { useState, useEffect } from 'react';
import { Cocktail } from '@/data/classicCocktails';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import UserMenu from './auth/UserMenu';
import ProfileSettings from './profile/ProfileSettings';
import { toast } from '@/hooks/use-toast';

interface AuthenticatedAppProps {
  children: React.ReactNode;
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
}

type ViewMode = 'main' | 'profile' | 'myrecipes' | 'favorites';

export default function AuthenticatedApp({ 
  children, 
  recipes, 
  onRecipeClick, 
  onShareRecipe 
}: AuthenticatedAppProps) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [userRecipes, setUserRecipes] = useState<Cocktail[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Cocktail[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserRecipes();
      fetchFavoriteRecipes();
    }
  }, [user]);

  useEffect(() => {
    if (user && userRecipes.length > 0) {
      fetchFavoriteRecipes();
    }
  }, [userRecipes, recipes]);

  const fetchUserRecipes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading recipes",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Transform to match Cocktail interface
      const transformedRecipes = data.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        image: recipe.image_url || "/placeholder.svg",
        ingredients: recipe.ingredients,
        steps: recipe.instructions,
        notes: recipe.description || "",
        origin: recipe.difficulty || "",
        tags: recipe.tags || [],
      }));
      setUserRecipes(transformedRecipes);
    }
  };

  const fetchFavoriteRecipes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error loading favorites",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Get favorite recipe IDs
      const favoriteIds = data.map(fav => fav.recipe_id);
      
      // Filter recipes from both classic cocktails and user recipes
      const allRecipes = [...recipes, ...userRecipes];
      const favoriteRecipes = allRecipes.filter(recipe => favoriteIds.includes(recipe.id));
      
      setFavoriteRecipes(favoriteRecipes);
    }
  };

  const handleAddToFavorites = async (recipe: Cocktail) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        recipe_id: recipe.id,
      });

    if (error) {
      toast({
        title: "Error adding to favorites",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Added to favorites",
        description: `${recipe.name} has been saved to your favorites.`,
      });
      fetchFavoriteRecipes();
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'profile':
        return <ProfileSettings />;
      case 'myrecipes':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-serif mb-6">My Recipes</h2>
            {userRecipes.length === 0 ? (
              <p className="text-center text-gray-500">You haven't created any recipes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => onRecipeClick(recipe)}
                    className="cursor-pointer p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{recipe.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'favorites':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-serif mb-6">Favorite Recipes</h2>
            {favoriteRecipes.length === 0 ? (
              <p className="text-center text-gray-500">You haven't favorited any recipes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => onRecipeClick(recipe)}
                    className="cursor-pointer p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{recipe.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="relative">
            {children}
            <div className="absolute top-4 right-4">
              <UserMenu
                onProfileClick={() => setViewMode('profile')}
                onMyRecipesClick={() => setViewMode('myrecipes')}
                onFavoritesClick={() => setViewMode('favorites')}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {viewMode !== 'main' && (
        <div className="p-4 border-b">
          <button
            onClick={() => setViewMode('main')}
            className="text-primary hover:text-primary/80 font-medium"
          >
            ← Back to Barbook
          </button>
        </div>
      )}
      {renderContent()}
    </div>
  );
}
