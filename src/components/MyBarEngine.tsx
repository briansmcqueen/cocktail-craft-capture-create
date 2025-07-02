import React, { useState, useMemo, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { ingredientDatabase, Ingredient, findIngredientMatches } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Search, X, Plus, TrendingUp, Star, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";
import { useToast } from "@/hooks/use-toast";

type MyBarEngineProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  forceUpdate: number;
};

interface MyBarInventory {
  [ingredientId: string]: boolean;
}

interface WhatToBuyNext {
  ingredient: Ingredient;
  newCocktailsUnlocked: number;
  cocktailsUnlocked: Cocktail[];
}

export default function MyBarEngine({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onTagClick,
  forceUpdate
}: MyBarEngineProps) {
  const { toast } = useToast();
  const [myBar, setMyBar] = useState<MyBarInventory>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Load saved inventory on mount
  useEffect(() => {
    const saved = localStorage.getItem('myBarInventory');
    if (saved) {
      setMyBar(JSON.parse(saved));
      setShowOnboarding(false);
    }
  }, []);

  // Save inventory to localStorage
  useEffect(() => {
    localStorage.setItem('myBarInventory', JSON.stringify(myBar));
  }, [myBar]);

  const myBarIngredients = useMemo(() => {
    return Object.keys(myBar).filter(id => myBar[id]);
  }, [myBar]);

  // Starter ingredients for onboarding
  const starterIngredients = [
    "spirit_003", // Gin
    "spirit_004", // Vodka
    "spirit_001", // Bourbon
    "liqueur_001", // Orange Liqueur
    "wine_001", // Sweet Vermouth
    "wine_002", // Dry Vermouth
    "produce_001", // Lime
    "produce_002", // Lemon
    "pantry_001", // Simple Syrup
    "pantry_005", // Aromatic Bitters
    "mixer_001", // Club Soda
    "mixer_002", // Tonic Water
  ];

  // Filter ingredients based on search and category
  const filteredIngredients = useMemo(() => {
    let ingredients = ingredientDatabase;

    if (selectedCategory !== "all") {
      ingredients = ingredients.filter(ing => ing.category === selectedCategory);
    }

    if (searchTerm) {
      ingredients = findIngredientMatches(searchTerm);
    }

    return ingredients;
  }, [searchTerm, selectedCategory]);

  // Match exact recipes (user has all ingredients)
  const exactMatches = useMemo(() => {
    if (myBarIngredients.length === 0) return [];

    return recipes.filter(recipe => {
      return recipe.ingredients.every(ingredient => {
        return myBarIngredients.some(myIngId => {
          const myIng = ingredientDatabase.find(ing => ing.id === myIngId);
          if (!myIng) return false;

          // Check if ingredient name or aliases match
          const ingredientLower = ingredient.toLowerCase();
          const nameLower = myIng.name.toLowerCase();
          const aliasMatches = myIng.aliases.some(alias => 
            ingredientLower.includes(alias.toLowerCase()) || 
            alias.toLowerCase().includes(ingredientLower)
          );

          return ingredientLower.includes(nameLower) || 
                 nameLower.includes(ingredientLower) || 
                 aliasMatches;
        });
      });
    });
  }, [recipes, myBarIngredients]);

  // Near miss recipes (missing exactly 1 ingredient)
  const nearMissMatches = useMemo(() => {
    if (myBarIngredients.length === 0) return [];

    return recipes.filter(recipe => {
      const missingCount = recipe.ingredients.filter(ingredient => {
        return !myBarIngredients.some(myIngId => {
          const myIng = ingredientDatabase.find(ing => ing.id === myIngId);
          if (!myIng) return false;

          const ingredientLower = ingredient.toLowerCase();
          const nameLower = myIng.name.toLowerCase();
          const aliasMatches = myIng.aliases.some(alias => 
            ingredientLower.includes(alias.toLowerCase()) || 
            alias.toLowerCase().includes(ingredientLower)
          );

          return ingredientLower.includes(nameLower) || 
                 nameLower.includes(ingredientLower) || 
                 aliasMatches;
        });
      }).length;

      return missingCount === 1;
    });
  }, [recipes, myBarIngredients]);

  // Calculate "What to Buy Next" recommendations
  const whatToBuyNext = useMemo(() => {
    if (myBarIngredients.length === 0) return [];

    const recommendations: WhatToBuyNext[] = [];
    const availableIngredients = ingredientDatabase.filter(ing => !myBarIngredients.includes(ing.id));

    availableIngredients.forEach(ingredient => {
      const testBar = [...myBarIngredients, ingredient.id];
      
      const newCocktails = recipes.filter(recipe => {
        return recipe.ingredients.every(recipeIngredient => {
          return testBar.some(testIngId => {
            const testIng = ingredientDatabase.find(ing => ing.id === testIngId);
            if (!testIng) return false;

            const ingredientLower = recipeIngredient.toLowerCase();
            const nameLower = testIng.name.toLowerCase();
            const aliasMatches = testIng.aliases.some(alias => 
              ingredientLower.includes(alias.toLowerCase()) || 
              alias.toLowerCase().includes(ingredientLower)
            );

            return ingredientLower.includes(nameLower) || 
                   nameLower.includes(ingredientLower) || 
                   aliasMatches;
          });
        });
      });

      const currentlyMakeable = exactMatches.length;
      const newlyMakeable = newCocktails.length - currentlyMakeable;

      if (newlyMakeable > 0) {
        recommendations.push({
          ingredient,
          newCocktailsUnlocked: newlyMakeable,
          cocktailsUnlocked: newCocktails.slice(currentlyMakeable)
        });
      }
    });

    return recommendations
      .sort((a, b) => b.newCocktailsUnlocked - a.newCocktailsUnlocked)
      .slice(0, 5);
  }, [recipes, myBarIngredients, exactMatches.length]);

  const toggleIngredient = (ingredientId: string) => {
    setMyBar(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));

    const ingredient = ingredientDatabase.find(ing => ing.id === ingredientId);
    if (ingredient) {
      toast({
        description: myBar[ingredientId] 
          ? `Removed ${ingredient.name} from your bar`
          : `Added ${ingredient.name} to your bar`,
      });
    }
  };

  const clearBar = () => {
    setMyBar({});
    toast({
      description: "Cleared your entire bar inventory",
    });
  };

  const setupStarterBar = () => {
    const starterBar: MyBarInventory = {};
    starterIngredients.forEach(id => {
      starterBar[id] = true;
    });
    setMyBar(starterBar);
    setShowOnboarding(false);
    toast({
      description: "Added starter ingredients to your bar! Check what you can make now.",
    });
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
  };

  const categories = [
    { id: "all", name: "All Ingredients" },
    { id: "Spirits", name: "Spirits" },
    { id: "Liqueurs", name: "Liqueurs" },
    { id: "Wines & Vermouths", name: "Wines & Vermouths" },
    { id: "Mixers", name: "Mixers" },
    { id: "Produce", name: "Produce" },
    { id: "Pantry", name: "Pantry" }
  ];

  if (showOnboarding && myBarIngredients.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <ChefHat className="text-orange-600" size={24} />
          <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
            My Bar & Cocktail Discovery Engine
          </h2>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <ChefHat className="mx-auto mb-4 text-orange-600" size={64} />
              <h3 className="text-2xl font-serif font-normal mb-4 text-gray-900">
                Welcome to Your Personal Bar!
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Let's stock your bar! Add ingredients you have at home and we'll instantly show you 
                every cocktail you can make, plus recommend the single best ingredient to buy next 
                to unlock the most new recipes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={setupStarterBar}
                className="gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
                size="lg"
              >
                <Star className="h-5 w-5" />
                Quick Start with Common Ingredients
              </Button>
              <Button 
                onClick={skipOnboarding}
                variant="outline"
                className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-6 py-3"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                I'll Add My Own Ingredients
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="text-orange-600" size={24} />
        <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
          My Bar & Cocktail Discovery Engine
        </h2>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            What I Can Make ({exactMatches.length})
          </TabsTrigger>
          <TabsTrigger value="manage" className="gap-2">
            <ChefHat className="h-4 w-4" />
            Manage My Bar ({myBarIngredients.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          {/* What to Buy Next Section */}
          {whatToBuyNext.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold text-green-800">What to Buy Next</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {whatToBuyNext.slice(0, 3).map((rec) => (
                  <div key={rec.ingredient.id} className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-1">{rec.ingredient.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{rec.ingredient.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +{rec.newCocktailsUnlocked} cocktails
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => toggleIngredient(rec.ingredient.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Add to Bar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* You Can Make Section */}
          {exactMatches.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-orange-600" size={20} />
                <h3 className="text-xl font-semibold text-gray-900">
                  You Can Make {exactMatches.length} Cocktail{exactMatches.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {exactMatches.map((recipe) => (
                  <RecipeCardWithFavorite
                    key={`exact-${recipe.id}-${forceUpdate}`}
                    recipe={recipe}
                    onRecipeClick={onRecipeClick}
                    onToggleFavorite={onToggleFavorite}
                    onTagClick={onTagClick}
                    forceUpdate={forceUpdate}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <ChefHat className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-serif font-normal mb-2 text-gray-900">
                {myBarIngredients.length === 0 ? "Your bar is empty" : "No cocktails yet"}
              </h3>
              <p className="mb-4 text-sm lg:text-base">
                {myBarIngredients.length === 0 
                  ? "Add some ingredients to your bar to see what cocktails you can make!"
                  : "Add a few more ingredients to unlock your first cocktails."
                }
              </p>
            </div>
          )}

          {/* Just One Ingredient Away Section */}
          {nearMissMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plus className="text-blue-600" size={20} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Just One Ingredient Away ({nearMissMatches.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {nearMissMatches.map((recipe) => (
                  <div key={`near-miss-${recipe.id}`} className="relative">
                    <div className="opacity-75">
                      <RecipeCardWithFavorite
                        recipe={recipe}
                        onRecipeClick={onRecipeClick}
                        onToggleFavorite={onToggleFavorite}
                        onTagClick={onTagClick}
                        forceUpdate={forceUpdate}
                      />
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Need 1 more
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* My Bar Pills */}
          {myBarIngredients.length > 0 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">My Bar ({myBarIngredients.length} ingredients)</h3>
                <Button variant="outline" size="sm" onClick={clearBar} className="gap-2">
                  <X size={16} />
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {myBarIngredients.map(ingId => {
                  const ingredient = ingredientDatabase.find(ing => ing.id === ingId);
                  if (!ingredient) return null;
                  return (
                    <Badge 
                      key={ingId} 
                      variant="secondary" 
                      className="gap-2 bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200"
                      onClick={() => toggleIngredient(ingId)}
                    >
                      {ingredient.name}
                      <X size={12} />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search and Category Filters */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id 
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredient List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="max-h-96 overflow-y-auto">
              {filteredIngredients.map(ingredient => (
                <div 
                  key={ingredient.id} 
                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {ingredient.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{ingredient.description}</p>
                  </div>
                  <Button
                    variant={myBar[ingredient.id] ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleIngredient(ingredient.id)}
                    className={myBar[ingredient.id]
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {myBar[ingredient.id] ? "Remove" : "Add"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}