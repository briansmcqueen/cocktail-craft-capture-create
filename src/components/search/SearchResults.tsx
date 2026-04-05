import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat, Package, Grid3X3, List } from 'lucide-react';
import RecipeResultCard from './RecipeResultCard';
import { SearchResult } from '@/types/search';
import { cn } from '@/lib/utils';
import { useRecipeRatings } from '@/hooks/useRecipeRatings';

interface SearchResultsProps {
  results: {
    canMake: SearchResult[];
    missing1: SearchResult[];
    missing2Plus: SearchResult[];
    all: SearchResult[];
  };
  onRecipeClick: (recipe: any) => void;
  onAddIngredient?: (ingredient: string) => void;
  onTagClick?: (tag: string) => void;
  onShowAuthModal?: () => void;
  loading?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  user?: any;
}

type ViewMode = 'grid' | 'list';

export default function SearchResults({
  results,
  onRecipeClick,
  onAddIngredient,
  onTagClick,
  onShowAuthModal,
  loading = false,
  emptyStateTitle = "No cocktails found",
  emptyStateDescription = "Try adjusting your filters or search terms",
  hasActiveFilters = false,
  onClearFilters,
  user
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 12;

  // Extract recipe IDs for batch rating fetch
  const recipeIds = results.all.map(result => result.cocktail.id).filter(Boolean);
  const { getRating } = useRecipeRatings(recipeIds);

  const totalResults = results.all.length;
  const canMakeCount = results.canMake.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Searching cocktails...</p>
        </div>
      </div>
    );
  }

  if (totalResults === 0) {
    if (!user) {
      return null;
    }
    
    return (
      <div className="text-center py-12 px-4">
        <ChefHat className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h3 className="text-xl font-medium text-pure-white mb-2">{emptyStateTitle}</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          {emptyStateDescription}
        </p>
        
        {hasActiveFilters && (
          <div className="space-y-2">
            <p className="text-sm text-light-text">Suggestions:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Remove some filters</li>
              <li>• Try broader search terms</li>
              <li>• Browse all available cocktails</li>
            </ul>
            <div className="pt-4 space-x-2">
              {onClearFilters && (
                <Button variant="outline" onClick={onClearFilters}>
                  Clear Filters
                </Button>
              )}
              <Button variant="secondary" className="transition-all duration-300">
                Browse All Cocktails
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderResults = (searchResults: SearchResult[], showPagination = false) => {
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="mx-auto mb-2 text-muted-foreground" size={32} />
          <p className="text-sm text-muted-foreground">No cocktails in this category</p>
        </div>
      );
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedResults = showPagination 
      ? searchResults.slice(0, currentPage * ITEMS_PER_PAGE)
      : searchResults;
    const hasMoreResults = showPagination && searchResults.length > currentPage * ITEMS_PER_PAGE;

    return (
      <div className="space-y-4">
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
        )}>
          {displayedResults.map((result) => (
            <RecipeResultCard
              key={result.cocktail.id}
              result={result}
              onRecipeClick={onRecipeClick}
              onAddIngredient={onAddIngredient}
              onTagClick={onTagClick}
              onShowAuthModal={onShowAuthModal}
              className={viewMode === 'list' ? "max-w-none" : ""}
              preloadedRating={getRating(result.cocktail.id)}
            />
          ))}
        </div>
        
        {showPagination && hasMoreResults && (
          <div className="flex justify-center pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="rounded-organic-sm"
            >
              Show More ({searchResults.length - (currentPage * ITEMS_PER_PAGE)} remaining)
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Results header with view mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-light-text">
          <span className="font-medium">{totalResults}</span>
          <span>cocktail{totalResults !== 1 ? 's' : ''} found</span>
        </div>
        
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        {renderResults(results.all, true)}
      </div>
    </div>
  );
}