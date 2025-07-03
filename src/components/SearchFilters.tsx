
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
      {/* Enhanced Search - visible on all screen sizes */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4 mb-6">
        {/* Search section */}
        <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
          {/* Search bar - always visible */}
          <div className="relative flex-1">
            <Input
              value={ingredientQuery}
              onChange={e => setIngredientQuery(e.target.value)}
              placeholder="Search by ingredient, name, tags, and more..."
              className="pl-9 bg-white border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-orange-500"
            />
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Tag filters with multi-select and reduced padding */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                className={`
                  relative text-xs px-3 py-0.5 rounded-md cursor-pointer transition-all duration-200 border
                  ${tagFilters.includes(tag)
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }
                `}
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
