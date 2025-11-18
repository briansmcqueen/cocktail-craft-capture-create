import React, { useState, useMemo, useRef } from "react";
import { Search, X, Save, Bookmark, User, MoreHorizontal, Edit, Copy, Trash2, Martini } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ingredient } from "@/data/ingredients";
import AddCustomIngredient from "@/components/AddCustomIngredient";
import { getUserCustomIngredients, CustomIngredient } from "@/services/customIngredientsService";
import { barPresetsService, type BarPreset } from "@/services/barPresetsService";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";

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
  onUpdatePreset: (presetId: string, name: string) => Promise<void>;
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
  onDeletePreset,
  onUpdatePreset
}: IngredientSelectorProps) {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add keyboard shortcut for search
  useSearchShortcut(inputRef);
  const [open, setOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingPresetName, setEditingPresetName] = useState("");

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

  // Example bar configurations for new users
  const examplePresets = [
    {
      name: "Home Bar Basics",
      ingredients: ["vodka", "gin", "whiskey", "rum", "tequila", "lime juice", "lemon juice", "simple syrup"]
    },
    {
      name: "Cocktail Essentials", 
      ingredients: ["gin", "vodka", "dry vermouth", "sweet vermouth", "lime juice", "lemon juice", "simple syrup", "angostura bitters"]
    },
    {
      name: "Tiki Setup",
      ingredients: ["rum", "dark rum", "triple sec", "lime juice", "simple syrup", "grenadine", "orange juice"]
    }
  ];

  const loadPreset = async (preset: BarPreset) => {
    try {
      await onLoadPreset(preset);
    } catch (error) {
      console.error('Error loading preset:', error);
    }
  };

  const loadExamplePreset = async (examplePreset: { name: string; ingredients: string[] }) => {
    // Find matching ingredient IDs using more flexible matching
    const matchingIngredients = examplePreset.ingredients
      .map(name => allIngredients.find(ing => {
        const searchName = name.toLowerCase();
        const ingName = ing.name.toLowerCase();
        const ingId = ing.id.toLowerCase();
        
        // Direct name match
        if (ingName === searchName) return true;
        // Direct ID match  
        if (ingId === searchName) return true;
        // Partial name match
        if (ingName.includes(searchName) || searchName.includes(ingName)) return true;
        // Handle common variations
        if (searchName.replace(/\s+/g, '-') === ingId.replace(/\s+/g, '-')) return true;
        
        return false;
      }))
      .filter(Boolean)
      .map(ing => ing!.id);

    console.log(`Loading ${examplePreset.name}:`, {
      requested: examplePreset.ingredients,
      found: matchingIngredients.map(id => allIngredients.find(ing => ing.id === id)?.name),
      foundCount: matchingIngredients.length
    });

    // First, remove all current ingredients (same as loadPreset behavior)
    for (const ingredientId of myBarIngredients) {
      await toggleIngredient(ingredientId);
    }

    // Then add preset ingredients
    for (const ingredientId of matchingIngredients) {
      await toggleIngredient(ingredientId);
    }
  };

  const duplicatePreset = async (preset: BarPreset) => {
    try {
      await onSavePreset(`${preset.name} (Copy)`);
    } catch (error) {
      console.error('Error duplicating preset:', error);
    }
  };

  const startEditingPreset = (preset: BarPreset) => {
    setEditingPresetId(preset.id);
    setEditingPresetName(preset.name);
  };

  const savePresetRename = async () => {
    if (editingPresetId && editingPresetName.trim()) {
      try {
        await onUpdatePreset(editingPresetId, editingPresetName.trim());
        setEditingPresetId(null);
        setEditingPresetName("");
      } catch (error) {
        console.error('Error renaming preset:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
            <Input
              ref={inputRef}
              placeholder="Search and add ingredients to your bar..."
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredIngredients.length > 0) {
                  e.preventDefault();
                  addIngredient(filteredIngredients[0].id);
                  setSearchValue("");
                  setOpen(false);
                }
              }}
              className="pl-10 pr-16 h-12 text-base bg-medium-charcoal border-light-charcoal text-light-text"
            />
            {!searchValue && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-soft-gray pointer-events-none z-10">
                <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-mono">
                  {typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-mono">
                  K
                </kbd>
              </div>
            )}
            
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
          
          <AddCustomIngredient 
            onIngredientAdded={async () => {
              const customIngs = await getUserCustomIngredients();
              setCustomIngredients(customIngs);
            }}
          />
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

        {/* Example Bar Setups - Always show */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-pure-white">Popular Bar Setups:</h4>
          <div className="flex flex-wrap gap-2">
            {examplePresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => loadExamplePreset(preset)}
                className="text-xs bg-medium-charcoal border-light-charcoal hover:bg-light-charcoal text-pure-white hover:text-pure-white"
              >
                <Bookmark className="h-3 w-3 mr-1" />
                {preset.name} ({preset.ingredients.length})
              </Button>
            ))}
          </div>
        </div>

        {/* User's Saved Presets with Management */}
        {presets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-pure-white">Your Saved Presets:</h4>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <div key={preset.id} className="group relative">
                  {editingPresetId === preset.id ? (
                    <div className="flex items-center gap-1 bg-medium-charcoal border border-light-charcoal rounded-organic-sm p-1">
                      <Input
                        value={editingPresetName}
                        onChange={(e) => setEditingPresetName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') savePresetRename();
                          if (e.key === 'Escape') {
                            setEditingPresetId(null);
                            setEditingPresetName("");
                          }
                        }}
                        className="h-6 text-xs bg-light-charcoal border-light-charcoal text-pure-white"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={savePresetRename}
                        className="h-6 w-6 p-0"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingPresetId(null);
                          setEditingPresetName("");
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset(preset)}
                        className="text-xs bg-medium-charcoal border-light-charcoal hover:bg-light-charcoal text-pure-white rounded-r-none border-r-0"
                      >
                        <Bookmark className="h-3 w-3 mr-1" />
                        {preset.name} ({preset.ingredient_ids.length})
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-medium-charcoal border-light-charcoal hover:bg-light-charcoal text-pure-white rounded-l-none px-2"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-medium-charcoal border-light-charcoal">
                          <DropdownMenuItem
                            onClick={() => startEditingPreset(preset)}
                            className="text-light-text hover:bg-light-charcoal cursor-pointer"
                          >
                            <Edit className="h-3 w-3 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => duplicatePreset(preset)}
                            className="text-light-text hover:bg-light-charcoal cursor-pointer"
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-light-charcoal" />
                          <DropdownMenuItem
                            onClick={() => onDeletePreset(preset.id)}
                            className="text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Ingredients Pills */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-pure-white">
              Your Bar ({myBarIngredients.length} ingredients)
            </h3>
            {user && !showSaveDialog && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Save as Preset
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {myBarIngredients.map((ingredientId) => {
              const ingredient = ingredientMap[ingredientId];
              if (!ingredient) return null;
              
              return (
                <Badge
                  key={ingredientId}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-primary/10 text-pure-white border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
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
        user ? (
          <Card className="p-8 text-center bg-medium-charcoal border-light-charcoal animate-fade-in">
            <Search className="h-12 w-12 mx-auto mb-4 text-soft-gray" />
            <h3 className="text-lg font-medium text-light-text mb-2">
              Start Building Your Bar
            </h3>
            <p className="text-soft-gray">
              Search and add ingredients you have on hand to discover what cocktails you can make.
            </p>
          </Card>
        ) : (
          <AuthPrompt
            icon={Martini}
            title="Build Your Personal Bar"
            description="Create a free account to save your ingredients and discover personalized cocktail recommendations."
          />
        )
      )}
    </div>
  );
}