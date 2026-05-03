import React, { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Heart, Star, Eye, EyeOff } from "lucide-react";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { useAuth } from "@/hooks/useAuth";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { getUserFavoritesWithVisibility, toggleFavoriteVisibility, FavoriteWithVisibility } from "@/services/favoritesService";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useBatchShareCounts } from "@/hooks/useBatchShareCounts";

type FavoritesProps = {
  favoriteRecipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onEditRecipe?: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  userRecipes: Cocktail[];
};

export default function Favorites({ favoriteRecipes, onRecipeClick, onEditRecipe, onShareRecipe, userRecipes }: FavoritesProps) {
  const { user } = useAuth();
  const [favoritesWithVisibility, setFavoritesWithVisibility] = useState<FavoriteWithVisibility[]>([]);
  const [loading, setLoading] = useState(false);
  const shareCounts = useBatchShareCounts(favoriteRecipes.map((r) => r.id));

  useEffect(() => {
    if (user) {
      loadFavoritesWithVisibility();
    }
  }, [user, favoriteRecipes]);

  const loadFavoritesWithVisibility = async () => {
    setLoading(true);
    try {
      const data = await getUserFavoritesWithVisibility();
      setFavoritesWithVisibility(data);
    } catch (error) {
      console.error('Error loading favorites visibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (favoriteId: string, currentlyPublic: boolean) => {
    const newValue = !currentlyPublic;
    
    // Optimistic update
    setFavoritesWithVisibility(prev => 
      prev.map(fav => 
        fav.id === favoriteId ? { ...fav, is_public: newValue } : fav
      )
    );

    const success = await toggleFavoriteVisibility(favoriteId, newValue);
    
    if (success) {
      toast({
        title: newValue ? "Made public" : "Made private",
        description: newValue 
          ? "This favorite will now appear on your public profile." 
          : "This favorite has been hidden from your public profile.",
      });
    } else {
      // Revert on failure
      setFavoritesWithVisibility(prev => 
        prev.map(fav => 
          fav.id === favoriteId ? { ...fav, is_public: currentlyPublic } : fav
        )
      );
      toast({
        title: "Error",
        description: "Failed to update visibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFavoriteVisibility = (recipeId: string): { id: string; isPublic: boolean } | null => {
    const fav = favoritesWithVisibility.find(f => f.recipe_id === recipeId);
    return fav ? { id: fav.id, isPublic: fav.is_public } : null;
  };

  if (!user) {
    return (
      <AuthPrompt
        icon={Star}
        title="Save Your Favorite Cocktails"
        description="Create a free account to save your favorite recipes and access them from any device."
      />
    );
  }

  if (favoriteRecipes.length === 0) {
    return (
      <div className="container mx-auto px-md py-xl text-center animate-fade-in">
        <Heart className="mx-auto mb-lg text-muted-foreground" size={48} />
        <h2 className="text-3xl font-medium mb-4 text-foreground">No favorites yet</h2>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Start favoriting recipes by clicking the heart icon on any cocktail you love!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-medium-charcoal border border-light-charcoal rounded-organic-md p-4">
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-emerald flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-pure-white mb-1">Public Profile Visibility</h3>
            <p className="text-sm text-light-text">
              Toggle the visibility switch to control which favorites appear on your public profile at /profile/{user.user_metadata?.username || 'your-username'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {favoriteRecipes.map((recipe, idx) => {
          const visibility = getFavoriteVisibility(recipe.id);
          
          return (
            <div key={recipe.id} className="relative">
              <UniversalRecipeCard
                recipe={recipe}
                priority={idx === 0}
                shareCount={shareCounts[recipe.id] ?? 0}
              />
              
              {/* Visibility toggle overlay */}
              {visibility && (
                <div className="absolute top-2 right-2 z-10 bg-rich-charcoal/95 backdrop-blur-sm border border-light-charcoal rounded-organic-sm p-2 flex items-center gap-2 shadow-lg">
                  <Label htmlFor={`visibility-${visibility.id}`} className="text-xs text-light-text cursor-pointer flex items-center gap-1.5">
                    {visibility.isPublic ? (
                      <Eye className="h-3.5 w-3.5 text-emerald" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-soft-gray" />
                    )}
                    <span className="whitespace-nowrap">
                      {visibility.isPublic ? 'Public' : 'Private'}
                    </span>
                  </Label>
                  <Switch
                    id={`visibility-${visibility.id}`}
                    checked={visibility.isPublic}
                    onCheckedChange={() => handleVisibilityToggle(visibility.id, visibility.isPublic)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
