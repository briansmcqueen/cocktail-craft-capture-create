
import React, { useState, useMemo } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Button } from "@/components/ui/button";
import { ChefHat, X } from "lucide-react";
import RecipeCardWithFavorite from "./RecipeCardWithFavorite";

type CategorizedIngredientFilterProps = {
  recipes: Cocktail[];
  onRecipeClick: (recipe: Cocktail) => void;
  onToggleFavorite: (recipe: Cocktail) => void;
  onTagClick: (tag: string) => void;
  forceUpdate: number;
};

export default function CategorizedIngredientFilter({
  recipes,
  onRecipeClick,
  onToggleFavorite,
  onTagClick,
  forceUpdate
}: CategorizedIngredientFilterProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Categorize ingredients
  const categorizedIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        // Clean ingredient name by removing measurements, volumes, and extra descriptors
        let cleanIngredient = ingredient
          .replace(/^\d+[\s\w]*\s/, '') // Remove measurements like "2 oz", "1 dash", "1/2 cup"
          .replace(/^\d+\/\d+[\s\w]*\s/, '') // Remove fractions like "1/2 oz"
          .replace(/^\.\d+[\s\w]*\s/, '') // Remove decimal measurements like ".5 oz"
          .replace(/\s*\([^)]*\)/g, '') // Remove all parenthetical descriptions
          .replace(/,.*$/, '') // Remove everything after the first comma
          .replace(/\s+(juice|syrup|bitters|liqueur|garnish|twist|peel|wedge|slice|wheel).*$/i, '') // Remove descriptors
          .replace(/\s+(fresh|dried|simple|grenadine|maraschino).*$/i, '') // Remove modifiers
          .trim()
          .toLowerCase();

        // Better ingredient standardization
        if (cleanIngredient.includes('vermouth')) {
          if (cleanIngredient.includes('dry') || cleanIngredient.includes('blanc')) {
            cleanIngredient = 'dry vermouth';
          } else if (cleanIngredient.includes('sweet') || cleanIngredient.includes('red')) {
            cleanIngredient = 'sweet vermouth';
          } else {
            cleanIngredient = 'vermouth';
          }
        } else if (cleanIngredient.includes('gin')) {
          cleanIngredient = 'gin';
        } else if (cleanIngredient.includes('vodka')) {
          cleanIngredient = 'vodka';
        } else if (cleanIngredient.includes('rum')) {
          cleanIngredient = 'rum';
        } else if (cleanIngredient.includes('whiskey') || cleanIngredient.includes('whisky') || cleanIngredient.includes('bourbon') || cleanIngredient.includes('rye')) {
          cleanIngredient = 'whiskey';
        } else if (cleanIngredient.includes('tequila')) {
          cleanIngredient = 'tequila';
        } else if (cleanIngredient.includes('brandy') || cleanIngredient.includes('cognac')) {
          cleanIngredient = 'brandy';
        } else if (cleanIngredient.includes('lime')) {
          cleanIngredient = 'lime juice';
        } else if (cleanIngredient.includes('lemon')) {
          cleanIngredient = 'lemon juice';
        } else if (cleanIngredient.includes('orange') && cleanIngredient.includes('juice')) {
          cleanIngredient = 'orange juice';
        } else if (cleanIngredient.includes('grapefruit')) {
          cleanIngredient = 'grapefruit juice';
        } else if (cleanIngredient.includes('cranberry')) {
          cleanIngredient = 'cranberry juice';
        } else if (cleanIngredient.includes('pineapple')) {
          cleanIngredient = 'pineapple juice';
        } else if (cleanIngredient.includes('mint')) {
          cleanIngredient = 'mint';
        } else if (cleanIngredient.includes('triple sec') || cleanIngredient.includes('cointreau') || cleanIngredient.includes('orange liqueur')) {
          cleanIngredient = 'triple sec';
        } else if (cleanIngredient.includes('amaretto')) {
          cleanIngredient = 'amaretto';
        } else if (cleanIngredient.includes('kahlua') || cleanIngredient.includes('coffee liqueur')) {
          cleanIngredient = 'coffee liqueur';
        } else if (cleanIngredient.includes('baileys') || cleanIngredient.includes('irish cream')) {
          cleanIngredient = 'irish cream';
        } else if (cleanIngredient.includes('champagne') || cleanIngredient.includes('prosecco') || cleanIngredient.includes('sparkling wine')) {
          cleanIngredient = 'sparkling wine';
        } else if (cleanIngredient.includes('white wine')) {
          cleanIngredient = 'white wine';
        } else if (cleanIngredient.includes('red wine')) {
          cleanIngredient = 'red wine';
        } else if (cleanIngredient.includes('sugar') || cleanIngredient.includes('syrup')) {
          cleanIngredient = 'simple syrup';
        } else if (cleanIngredient.includes('grenadine')) {
          cleanIngredient = 'grenadine';
        } else if (cleanIngredient.includes('honey')) {
          cleanIngredient = 'honey';
        } else if (cleanIngredient.includes('agave')) {
          cleanIngredient = 'agave syrup';
        } else if (cleanIngredient.includes('angostura') || cleanIngredient.includes('bitter')) {
          cleanIngredient = 'bitters';
        } else {
          // Take only the first meaningful word and filter out numbers/measurements
          const words = cleanIngredient.split(' ').filter(word => 
            !word.match(/^\d/) && // No words starting with numbers
            !word.match(/^(one|two|three|four|five|six|seven|eight|nine|ten|half|quarter)$/) && // No spelled out numbers
            word.length > 2 // No very short words
          );
          cleanIngredient = words[0] || '';
        }
        
        if (cleanIngredient && cleanIngredient.length > 2) {
          ingredientSet.add(cleanIngredient);
        }
      });
    });

    const allIngredients = Array.from(ingredientSet);
    
    const spirits = allIngredients.filter(ing => 
      ['gin', 'vodka', 'rum', 'whiskey', 'tequila', 'brandy', 'bourbon', 'rye'].includes(ing)
    );
    
    const citrus = allIngredients.filter(ing => 
      ['lime juice', 'lemon juice', 'orange juice', 'grapefruit juice'].includes(ing)
    );
    
    const fruit = allIngredients.filter(ing => 
      ['cranberry juice', 'pineapple juice', 'apple juice', 'peach', 'strawberry', 'raspberry', 'blackberry', 'cherry', 'mint'].includes(ing)
    );
    
    const wine = allIngredients.filter(ing => 
      ['sparkling wine', 'white wine', 'red wine', 'champagne', 'prosecco'].includes(ing)
    );
    
    const liqueurs = allIngredients.filter(ing => 
      ['triple sec', 'amaretto', 'coffee liqueur', 'irish cream', 'cointreau', 'grand marnier', 'sambuca', 'frangelico'].includes(ing)
    );
    
    const sweeteners = allIngredients.filter(ing => 
      ['simple syrup', 'grenadine', 'honey', 'agave syrup', 'maple syrup'].includes(ing)
    );
    
    const others = allIngredients.filter(ing => 
      !spirits.includes(ing) && !citrus.includes(ing) && !sweeteners.includes(ing) && 
      !fruit.includes(ing) && !wine.includes(ing) && !liqueurs.includes(ing)
    );

    return {
      spirits: spirits.sort(),
      citrus: citrus.sort(),
      fruit: fruit.sort(),
      wine: wine.sort(),
      liqueurs: liqueurs.sort(),
      sweeteners: sweeteners.sort(),
      others: others.sort()
    };
  }, [recipes]);

  // Filter recipes that can be made with ALL selected ingredients
  const filteredRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];
    
    return recipes.filter(recipe => {
      return selectedIngredients.every(selectedIngredient => {
        return recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(selectedIngredient.toLowerCase())
        );
      });
    });
  }, [recipes, selectedIngredients]);

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const clearAll = () => {
    setSelectedIngredients([]);
  };

  const renderIngredientCategory = (title: string, ingredients: string[]) => {
    if (ingredients.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {ingredients.map(ingredient => (
            <Button
              key={ingredient}
              variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
              size="sm"
              onClick={() => handleIngredientToggle(ingredient)}
              className={`capitalize ${
                selectedIngredients.includes(ingredient)
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {ingredient}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="text-orange-600" size={24} />
        <h2 className="text-2xl lg:text-3xl font-serif font-normal text-gray-900 tracking-wide">
          Find Cocktails by Ingredients
        </h2>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Select ingredients you have:
          </h3>
          {selectedIngredients.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="gap-2"
            >
              <X size={16} />
              Clear all
            </Button>
          )}
        </div>
        
        {renderIngredientCategory("Spirits", categorizedIngredients.spirits)}
        {renderIngredientCategory("Citrus", categorizedIngredients.citrus)}
        {renderIngredientCategory("Fruit", categorizedIngredients.fruit)}
        {renderIngredientCategory("Wine", categorizedIngredients.wine)}
        {renderIngredientCategory("Liqueurs", categorizedIngredients.liqueurs)}
        {renderIngredientCategory("Sweeteners", categorizedIngredients.sweeteners)}
        {renderIngredientCategory("Others", categorizedIngredients.others)}

        {selectedIngredients.length > 0 && (
          <div className="text-sm text-gray-600 mt-4">
            <span className="font-medium">{filteredRecipes.length}</span> cocktail{filteredRecipes.length !== 1 ? 's' : ''} found with selected ingredients
          </div>
        )}
      </div>

      {selectedIngredients.length === 0 ? (
        <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
          <ChefHat className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-serif font-normal mb-2 text-gray-900">Select ingredients to get started</h3>
          <p className="mb-4 text-sm lg:text-base">
            Choose the ingredients you have available and we'll show you cocktails you can make!
          </p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center text-gray-500 mt-12 lg:mt-16 px-4">
          <p className="mb-4 text-sm lg:text-base">
            No cocktails found with those ingredients. Try selecting different ones!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCardWithFavorite
              key={`${recipe.id}-${forceUpdate}`}
              recipe={recipe}
              onRecipeClick={onRecipeClick}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
