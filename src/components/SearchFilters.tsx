
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TagBadge from "@/components/ui/tag";
import { Search } from "lucide-react";

type SearchFiltersProps = {
  searchType: "ingredient" | "tag";
  setSearchType: (type: "ingredient" | "tag") => void;
  ingredientQuery: string;
  setIngredientQuery: (query: string) => void;
  flavorProfile: string | null;
  setFlavorProfile: (profile: string | null) => void;
  tagFilter: string | null;
  setTagFilter: (tag: string | null) => void;
  allTags: string[];
  flavorProfiles: string[];
};

export default function SearchFilters({
  searchType,
  setSearchType,
  ingredientQuery,
  setIngredientQuery,
  flavorProfile,
  setFlavorProfile,
  tagFilter,
  setTagFilter,
  allTags,
  flavorProfiles
}: SearchFiltersProps) {
  return (
    <>
      {/* Enhanced Search & Filter - NYT inspired */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-4 mb-6">
        {/* Search section */}
        <div className="flex flex-col sm:flex-row gap-2 lg:flex-1">
          {/* Search type selector */}
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value as "ingredient" | "tag")}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 text-sm min-w-[120px] focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            aria-label="Search by"
          >
            <option value="ingredient">Ingredient</option>
            <option value="tag">Tag</option>
          </select>
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Input
              value={ingredientQuery}
              onChange={e => setIngredientQuery(e.target.value)}
              placeholder={searchType === "ingredient" ? "Search by ingredient…" : "Search by tag…"}
              className="pl-9 bg-white border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-orange-500"
            />
            <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        {/* Flavor profile dropdown */}
        <div className="sm:w-auto">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 w-full sm:min-w-[150px] text-sm focus:border-orange-500"
            value={flavorProfile || ""}
            onChange={e => setFlavorProfile(e.target.value || null)}
            aria-label="Flavor profile"
          >
            <option value="">All Flavors</option>
            {flavorProfiles.map(f => (
              <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Flavor Profile Filter Tags */}
      {flavorProfiles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Flavor Profile:</h3>
          <div className="flex flex-wrap gap-2">
            {flavorProfiles.map(profile => (
              <TagBadge
                key={profile}
                className={`
                  text-xs px-3 py-1 cursor-pointer transition-all duration-200 border
                  ${flavorProfile === profile
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }
                `}
                onClick={() => setFlavorProfile(flavorProfile === profile ? null : profile)}
              >
                {profile.charAt(0).toUpperCase() + profile.slice(1)}
              </TagBadge>
            ))}
            {flavorProfile && (
              <button
                onClick={() => setFlavorProfile(null)}
                className="text-xs px-3 py-1 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tag filters - NYT optimized */}
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <TagBadge
                key={tag}
                className={`
                  text-xs px-3 py-1 cursor-pointer transition-all duration-200 border
                  ${tagFilter === tag
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }
                `}
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              >
                {tag}
              </TagBadge>
            ))}
            {tagFilter && (
              <button
                onClick={() => setTagFilter(null)}
                className="text-xs px-3 py-1 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
