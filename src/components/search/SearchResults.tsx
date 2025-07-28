import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Package, AlertCircle, Grid3X3, List } from 'lucide-react';
import RecipeResultCard from './RecipeResultCard';
import { SearchResult } from '@/types/search';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  results: {
    canMake: SearchResult[];
    missing1: SearchResult[];
    missing2Plus: SearchResult[];
    all: SearchResult[];
  };
  onRecipeClick: (recipe: any) => void;
  onToggleFavorite: (recipe: any) => void;
  onAddIngredient?: (ingredient: string) => void;
  onTagClick?: (tag: string) => void;
  favoriteIds?: string[];
  loading?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

type ViewMode = 'grid' | 'list';

export default function SearchResults({
  results,
  onRecipeClick,
  onToggleFavorite,
  onAddIngredient,
  onTagClick,
  favoriteIds = [],
  loading = false,
  emptyStateTitle = "No cocktails found",
  emptyStateDescription = "Try adjusting your filters or search terms",
  hasActiveFilters = false,
  onClearFilters
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('all');

  const totalResults = results.all.length;
  const canMakeCount = results.canMake.length;
  const missing1Count = results.missing1.length;
  const missing2PlusCount = results.missing2Plus.length;

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
              <Button variant="secondary">
                Browse All Cocktails
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderResults = (searchResults: SearchResult[]) => {
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="mx-auto mb-2 text-muted-foreground" size={32} />
          <p className="text-sm text-muted-foreground">No cocktails in this category</p>
        </div>
      );
    }

    return (
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-3"
      )}>
        {searchResults.map((result) => (
          <RecipeResultCard
            key={result.cocktail.id}
            result={result}
            onRecipeClick={onRecipeClick}
            onToggleFavorite={onToggleFavorite}
            onAddIngredient={onAddIngredient}
            onTagClick={onTagClick}
            isFavorite={favoriteIds.includes(result.cocktail.id)}
            className={viewMode === 'list' ? "max-w-none" : ""}
          />
        ))}
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
          {canMakeCount > 0 && (
            <>
              <span>•</span>
              <span className="text-primary font-medium">{canMakeCount} you can make</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1">
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

      {/* Results tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50">
          <TabsTrigger 
            value="canMake" 
            className="relative"
            disabled={canMakeCount === 0}
          >
            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Can Make
              {canMakeCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {canMakeCount}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="missing1"
            disabled={missing1Count === 0}
          >
            <span className="flex items-center gap-2">
              <span className="text-yellow-400">1</span>
              Missing 1
              {missing1Count > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {missing1Count}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="missing2Plus"
            disabled={missing2PlusCount === 0}
          >
            <span className="flex items-center gap-2">
              <span className="text-red-400">2+</span>
              Missing 2+
              {missing2PlusCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {missing2PlusCount}
                </Badge>
              )}
            </span>
          </TabsTrigger>
          
          <TabsTrigger value="all">
            <span className="flex items-center gap-2">
              All Results
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {totalResults}
              </Badge>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canMake" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-pure-white mb-1">
              Ready to Make ({canMakeCount})
            </h3>
            <p className="text-sm text-light-text">
              You have all the ingredients for these cocktails
            </p>
          </div>
          {renderResults(results.canMake)}
        </TabsContent>

        <TabsContent value="missing1" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-pure-white mb-1">
              Close Calls ({missing1Count})
            </h3>
            <p className="text-sm text-light-text">
              Just one ingredient away from making these
            </p>
          </div>
          {renderResults(results.missing1)}
        </TabsContent>

        <TabsContent value="missing2Plus" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-pure-white mb-1">
              Future Possibilities ({missing2PlusCount})
            </h3>
            <p className="text-sm text-light-text">
              Great cocktails to consider for your next shopping trip
            </p>
          </div>
          {renderResults(results.missing2Plus)}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {renderResults(results.all)}
        </TabsContent>
      </Tabs>
    </div>
  );
}