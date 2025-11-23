import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import UniversalRecipeCard from "./UniversalRecipeCard";
import { Cocktail } from "@/data/classicCocktails";

type LazyRecipeGridProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onLike: (recipe: Cocktail) => void;
  onShareRecipe: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  onShowForm: () => void;
  forceUpdate: number;
  library: string;
  onShowAuthModal?: () => void;
  itemsPerPage?: number;
};

export default function LazyRecipeGrid({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onLike,
  onShareRecipe,
  onTagClick,
  onShowForm,
  forceUpdate,
  library,
  onShowAuthModal,
  itemsPerPage = 12
}: LazyRecipeGridProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debug: Log recipes to check for duplicates
  useEffect(() => {
    const ids = recipes.map(r => r.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.error(`LazyRecipeGrid: Found ${ids.length - uniqueIds.size} duplicate recipe IDs`);
      console.error('Recipe IDs:', ids);
    } else {
      console.log(`LazyRecipeGrid: All ${recipes.length} recipes are unique`);
    }
  }, [recipes]);

  const loadMore = useCallback(() => {
    if (loading || visibleCount >= recipes.length) return;
    
    setLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + itemsPerPage, recipes.length));
      setLoading(false);
    }, 300);
  }, [loading, visibleCount, recipes.length, itemsPerPage]);

  // Reset visible count when recipes change
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [recipes, itemsPerPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && visibleCount < recipes.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, loading, visibleCount, recipes.length]);

  if (recipes.length === 0) {
    return (
      <div className="text-center text-soft-gray mt-12 lg:mt-16 px-4">
        <p className="mb-4 text-sm lg:text-base text-light-text">No recipes yet in this library.</p>
        {library !== "classics" && library !== "favorites" && (
          <Button 
            onClick={onShowForm} 
            className="w-full sm:w-auto"
          >
            Add Your First Recipe
          </Button>
        )}
      </div>
    );
  }

  const visibleRecipes = recipes.slice(0, visibleCount);
  const hasMore = visibleCount < recipes.length;

  // Debug logging with more detail
  console.log('=== LazyRecipeGrid Render ===');
  console.log('Library:', library);
  console.log('Total recipes:', recipes.length);
  console.log('Visible recipes:', visibleCount);
  console.log('Recipe IDs:', recipes.map(r => `${r.id.slice(0, 8)}... (${r.name})`));
  
  // Check for duplicates
  const idCounts = recipes.reduce((acc, r) => {
    acc[r.id] = (acc[r.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const duplicateIds = Object.entries(idCounts).filter(([_, count]) => count > 1);
  if (duplicateIds.length > 0) {
    console.error('DUPLICATE RECIPES FOUND:', duplicateIds.map(([id, count]) => {
      const recipe = recipes.find(r => r.id === id);
      return `${id.slice(0, 8)}... "${recipe?.name}" appears ${count} times`;
    }));
  } else {
    console.log('✓ No duplicates detected');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {visibleRecipes.map((recipe) => (
          <UniversalRecipeCard
            key={recipe.id}
            recipe={recipe}
            onShowAuthModal={onShowAuthModal}
          />
        ))}
      </div>

      {/* Loading indicator and load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading ? (
            <div className="flex items-center gap-3 text-light-text">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading more recipes...</span>
            </div>
          ) : (
            <Button 
              onClick={loadMore}
              variant="outline"
              className="text-light-text hover:text-foreground border-light-charcoal hover:border-primary"
            >
              Load More Recipes ({recipes.length - visibleCount} remaining)
            </Button>
          )}
        </div>
      )}

      {!hasMore && recipes.length > itemsPerPage && (
        <div className="text-center py-4">
          <p className="text-sm text-soft-gray">
            Showing all {recipes.length} recipes
          </p>
        </div>
      )}
    </div>
  );
}