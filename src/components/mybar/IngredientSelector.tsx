import React, { useState, useMemo, useRef } from "react";
import { Search, X, Save, Bookmark, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Ingredient } from "@/data/ingredients";
import AddCustomIngredient from "@/components/AddCustomIngredient";
import { getUserCustomIngredients, CustomIngredient } from "@/services/customIngredientsService";
import type { BarPreset } from "@/services/barPresetsService";

interface IngredientSelectorProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  myBarIngredients: string[];
  ingredientMap: { [id: string]: Ingredient };
  toggleIngredient: (ingredientId: string) => void;
  user: any;
  setCustomIngredients: (ingredients: CustomIngredient[]) => void;
  presets: BarPreset[];
  onSavePreset: (name: string) => Promise<void>;
  onLoadPreset: (preset: BarPreset) => Promise<void>;
  onDeletePreset: (presetId: string) => Promise<void>;
}

export default function IngredientSelector({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
  setCustomIngredients,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset
}: IngredientSelectorProps) {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredIngredients = useMemo(() => {
    if (!searchValue) return allIngredients;
    
    const searchLower = searchValue.toLowerCase();
    return allIngredients.filter(ing => 
      (ing.name.toLowerCase().includes(searchLower) ||
       ing.aliases?.some(alias => alias.toLowerCase().includes(searchLower)) ||
       ing.description?.toLowerCase().includes(searchLower)) &&
      !myBarIngredients.includes(ing.id)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchValue, allIngredients, myBarIngredients]);

  const addIngredient = (ingredientId: string) => {
    toggleIngredient(ingredientId);
    setSearchValue("");
    setOpen(false);
    // Keep focus on input for continued searching
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const removeIngredient = (ingredientId: string) => {
    toggleIngredient(ingredientId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setOpen(value.length > 0 && filteredIngredients.length > 0);
  };

  const handleInputFocus = () => {
    if (searchValue.length > 0 && filteredIngredients.length > 0) {
      setOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on items
    setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const savePreset = async () => {
    if (presetName.trim()) {
      try {
        await onSavePreset(presetName.trim());
        setPresetName("");
        setShowSaveDialog(false);
      } catch (error) {
        console.error('Error saving preset:', error);
      }
    }
  };

  const loadPreset = async (preset: BarPreset) => {
    try {
      await onLoadPreset(preset);
    } catch (error) {
      console.error('Error loading preset:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <User className="text-primary" size={24} />
        <h2 className="text-2xl lg:text-3xl font-serif font-normal text-pure-white tracking-wide">
          My Bar
        </h2>
      </div>
      <p className="text-light-text text-sm mb-6">
        Build your inventory and discover what cocktails you can make
      </p>

      {/* Search Interface */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
            <Input
              ref={inputRef}
              placeholder="Search and add ingredients to your bar..."
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pl-10 h-12 text-base bg-medium-charcoal border-light-charcoal text-light-text"
            />
            
            {/* Custom Dropdown */}
            {open && filteredIngredients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-medium-charcoal border border-light-charcoal rounded-organic-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
                {filteredIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => addIngredient(ingredient.id)}
                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-light-charcoal text-left border-b border-light-charcoal last:border-b-0 transition-colors"
                  >
                    <span className="text-light-text">{ingredient.name}</span>
                    <Badge variant="outline" className="text-xs border-primary/30 text-soft-gray">
                      {ingredient.category}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowSaveDialog(true)}
            disabled={myBarIngredients.length === 0}
            className="h-12 bg-medium-charcoal border-light-charcoal hover:bg-light-charcoal text-light-text"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Save Preset Dialog */}
        {showSaveDialog && (
          <Card className="p-4 border-2 border-primary/20 bg-medium-charcoal">
            <div className="space-y-3">
              <h4 className="font-medium text-light-text">Save Current Selection</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                  className="bg-light-charcoal border-light-charcoal text-light-text"
                />
                <Button onClick={savePreset} disabled={!presetName.trim()}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Saved Presets */}
        {presets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-soft-gray">Quick Load:</h4>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadPreset(preset)}
                  className="text-xs bg-medium-charcoal border-light-charcoal hover:bg-light-charcoal text-light-text"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  {preset.name} ({preset.ingredient_ids.length})
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Ingredients Pills */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-soft-gray">
            Your Bar ({myBarIngredients.length} ingredients)
          </h3>
          <div className="flex flex-wrap gap-2">
            {myBarIngredients.map((ingredientId) => {
              const ingredient = ingredientMap[ingredientId];
              if (!ingredient) return null;
              
              return (
                <Badge
                  key={ingredientId}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  onClick={() => removeIngredient(ingredientId)}
                >
                  {ingredient.name}
                  <button className="ml-2 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State - No Ingredients */}
      {myBarIngredients.length === 0 && (
        <Card className="p-8 text-center bg-medium-charcoal border-light-charcoal">
          <Search className="h-12 w-12 mx-auto mb-4 text-soft-gray" />
          <h3 className="text-lg font-medium text-light-text mb-2">
            Start Building Your Bar
          </h3>
          <p className="text-soft-gray">
            Search and add ingredients you have on hand to discover what cocktails you can make.
          </p>
        </Card>
      )}
    </div>
  );
}