import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Ingredient } from "@/data/ingredients";
import AddCustomIngredient from "@/components/AddCustomIngredient";
import { getUserCustomIngredients, CustomIngredient } from "@/services/customIngredientsService";

interface IngredientSelectorProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  myBarIngredients: string[];
  ingredientMap: { [id: string]: Ingredient };
  toggleIngredient: (ingredientId: string) => void;
  user: any;
  setCustomIngredients: (ingredients: CustomIngredient[]) => void;
}

export default function IngredientSelector({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
  setCustomIngredients
}: IngredientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter ingredients for display (including custom ones)
  const filteredIngredients = useMemo(() => {
    let filtered = allIngredients;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(ing => ing.category.toLowerCase() === selectedCategory);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(searchLower) ||
        ing.aliases.some(alias => alias.toLowerCase().includes(searchLower)) ||
        ing.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, searchTerm, allIngredients]);

  const categories = ["all", "spirits", "liqueurs", "wines & vermouths", "mixers", "produce", "pantry"];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddCustomIngredient onIngredientAdded={() => {
          // Trigger reload of custom ingredients
          if (user) {
            getUserCustomIngredients().then(setCustomIngredients);
          }
        }} />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize text-xs">
              {category === "all" ? "All" : category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Selected Ingredients Pills */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">My Bar ({myBarIngredients.length} ingredients)</h3>
          <div className="flex flex-wrap gap-2">
            {myBarIngredients.map(ingredientId => {
              const ingredient = ingredientMap[ingredientId];
              if (!ingredient) return null;
              return (
                <Badge 
                  key={ingredientId} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => toggleIngredient(ingredientId)}
                >
                  {ingredient.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Ingredient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {filteredIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
              myBar[ingredient.id] 
                ? 'bg-primary/10 border-primary' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => toggleIngredient(ingredient.id)}
          >
            <div className="flex-1">
              <div className="font-medium text-sm flex items-center gap-2">
                {ingredient.name}
                {ingredient.isCustom && (
                  <Badge variant="secondary" className="text-xs">Custom</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{ingredient.subCategory}</div>
            </div>
            <div className="ml-2">
              {myBar[ingredient.id] ? (
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                </div>
              ) : (
                <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}