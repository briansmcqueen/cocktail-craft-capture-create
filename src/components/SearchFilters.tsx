
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TagBadge from "@/components/ui/tag";
import { Search, X } from "lucide-react";

type SearchFiltersProps = {
  searchType: "ingredient" | "tag" | "name" | "location" | "everything";
  setSearchType: (type: "ingredient" | "tag" | "name" | "location" | "everything") => void;
  ingredientQuery: string;
  setIngredientQuery: (query: string) => void;
  tagFilters: string[];
  onTagFilterToggle: (tag: string) => void;
  allTags: string[];
};

export default function SearchFilters({
  searchType,
  setSearchType,
  ingredientQuery,
  setIngredientQuery,
  tagFilters,
  onTagFilterToggle,
  allTags
}: SearchFiltersProps) {
  const getPlaceholderText = () => {
    switch (searchType) {
      case "ingredient": return "Search by ingredient…";
      case "tag": return "Search by tag…";
      case "name": return "Search by recipe name…";
      case "location": return "Search by location/origin…";
      case "everything": return "Search everything…";
      default: return "Search…";
    }
  };

  return (
    <>
      {/* Enhanced Search & Filter - NYT inspired */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4 mb-6">
        {/* Search section */}
        <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
          {/* Search type selector */}
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value as "ingredient" | "tag" | "name" | "location" | "everything")}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 text-sm min-w-[140px] focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            aria-label="Search by"
          >
            <option value="ingredient">Ingredient</option>
            <option value="name">Name</option>
            <option value="location">Location</option>
            <option value="tag">Tag</option>
            <option value="everything">Everything</option>
          </select>
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Input
              value={ingredientQuery}
              onChange={e => setIngredientQuery(e.target.value)}
              placeholder={getPlaceholderText()}
              className="pl-9 bg-white border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-orange-500"
            />
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Tag filters with multi-select and reduced padding */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
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
