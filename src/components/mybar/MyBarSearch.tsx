import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Ingredient } from "@/data/ingredients";

interface MyBarSearchProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  onToggle: (ingredientId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function MyBarSearch({
  allIngredients,
  myBar,
  onToggle,
  searchTerm,
  onSearchChange
}: MyBarSearchProps) {
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return allIngredients.filter(ingredient => 
      ingredient.name.toLowerCase().includes(term)
    ).sort((a, b) => {
      // Prioritize exact matches
      const aNameMatch = a.name.toLowerCase().startsWith(term);
      const bNameMatch = b.name.toLowerCase().startsWith(term);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // Then alphabetical
      return a.name.localeCompare(b.name);
    });
  }, [allIngredients, searchTerm]);

  if (!searchTerm.trim()) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-pure-white">
          Search Results ({filteredIngredients.length})
        </h3>
        <button
          onClick={() => onSearchChange("")}
          className="text-light-text hover:text-pure-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-light-text mx-auto mb-3" />
          <p className="text-light-text">
            No ingredients found for "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredIngredients.map((ingredient) => (
            <button
              key={ingredient.id}
              onClick={() => onToggle(ingredient.id)}
              className={`p-3 rounded-lg border transition-all duration-150 text-left hover:scale-[1.02] ${
                myBar[ingredient.id]
                  ? "border-available bg-available/10 text-available"
                  : "border-border bg-secondary-surface hover:border-border-hover text-pure-white"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate pr-2">
                    {ingredient.name}
                  </h4>
                  {myBar[ingredient.id] && (
                    <div className="w-4 h-4 rounded-full bg-available border border-white flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-light-text truncate">
                  {ingredient.subCategory}
                </p>
                <p className="text-xs text-light-text/70 truncate">
                  {ingredient.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}