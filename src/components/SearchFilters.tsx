
import React from "react";
import { Input } from "@/components/ui/input";
import TagBadge from "@/components/ui/tag";
import { Search, X } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";

type SearchFiltersProps = {
  searchType: "ingredient" | "tag" | "name" | "location" | "everything";
  setSearchType: (type: "ingredient" | "tag" | "name" | "location" | "everything") => void;
  ingredientQuery: string;
  setIngredientQuery: (query: string) => void;
  tagFilters: string[];
  onTagFilterToggle: (tag: string) => void;
  allTags: string[];
  recipes: Cocktail[];
};

export default function SearchFilters({
  searchType,
  setSearchType,
  ingredientQuery,
  setIngredientQuery,
  tagFilters,
  onTagFilterToggle,
  allTags,
  recipes
}: SearchFiltersProps) {
  // Filter tags to only show those that will have results
  const getAvailableTags = () => {
    if (tagFilters.length === 0) {
      return allTags;
    }

    // Find recipes that match current filters
    let filteredRecipes = [...recipes];

    // Apply search query filter first
    if (ingredientQuery.trim()) {
      const query = ingredientQuery.trim().toLowerCase();
      
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
        (recipe.origin && recipe.origin.toLowerCase().includes(query)) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (recipe.notes && recipe.notes.toLowerCase().includes(query))
      );
    }

    // Apply current tag filters
    if (tagFilters.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        tagFilters.every(tag => recipe.tags && recipe.tags.includes(tag))
      );
    }

    // Get all tags from the filtered recipes
    const availableTags = new Set<string>();
    filteredRecipes.forEach(recipe => {
      if (recipe.tags) {
        recipe.tags.forEach(tag => availableTags.add(tag));
      }
    });

    return Array.from(availableTags);
  };

  const availableTags = getAvailableTags();

  return (
    <>
      {/* Enhanced Search - visible on all screen sizes with matching padding */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4 mb-6 mx-4 sm:mx-0">
        {/* Search section */}
        <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
          {/* Search bar - always visible */}
          <div className="relative flex-1 search-container">
            <Input
              value={ingredientQuery}
              onChange={e => setIngredientQuery(e.target.value)}
              placeholder="Find cocktails, ingredients, or techniques..."
              className="pl-12 rounded-organic-pill bg-card border-border text-light-text placeholder:text-soft-gray focus:border-primary focus:bg-muted focus:scale-[1.02] focus:rotate-[0.2deg] focus:shadow-lg focus:shadow-primary/20"
              style={{ borderRadius: '25px 35px 30px 40px' }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-soft-gray search-icon transition-all duration-300" size={18} />
          </div>
        </div>
      </div>

      {/* Tag filters with multi-select and reduced padding */}
      {availableTags.length > 0 && (
        <div className="mb-6 mx-4 sm:mx-0">
          <h3 className="text-sm font-semibold text-light-text mb-3">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                className={`
                  relative text-xs px-3 py-1.5 cursor-pointer transition-all duration-300 border font-medium
                  ${tagFilters.includes(tag)
                    ? "bg-primary/20 text-secondary border-primary rounded-organic-sm hover:bg-primary/30"
                    : "bg-card text-light-text border-border rounded-organic-sm hover:bg-muted hover:border-soft-gray"
                  }
                `}
                style={{ transitionTimingFunction: 'var(--timing-stir)' }}
                onClick={() => onTagFilterToggle(tag)}
              >
                {tag}
                {tagFilters.includes(tag) && (
                  <X size={12} className="ml-1 inline-block" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
