import React, { useState, useMemo, useRef } from "react";
import { Search, X, Save, Bookmark, User, MoreHorizontal, Edit, Copy, Trash2, Martini, Wine, Milk, Coffee, Droplet, Citrus, Leaf, ChevronDown, ChevronUp, Check } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Ingredient } from "@/data/ingredients";
import AddCustomIngredient from "@/components/AddCustomIngredient";
import { getUserCustomIngredients, CustomIngredient } from "@/services/customIngredientsService";
import { barPresetsService, type BarPreset } from "@/services/barPresetsService";
import AuthPrompt from "@/components/auth/AuthPrompt";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";

// Import category images
import ginImage from "@/assets/ingredients/gin.jpg";
import vodkaImage from "@/assets/ingredients/vodka.jpg";
import whiskeyImage from "@/assets/ingredients/whiskey.jpg";
import liqueursImage from "@/assets/ingredients/liqueurs.jpg";
import winesImage from "@/assets/ingredients/wines.jpg";

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
  const { toast } = useToast();
  
  // Add keyboard shortcut for search
  useSearchShortcut(inputRef);
  const [open, setOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingPresetName, setEditingPresetName] = useState("");
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  // Load Categories Section collapsed state from localStorage
  const [categoriesSectionCollapsed, setCategoriesSectionCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mybar_categories_section_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleCategoriesSection = () => {
    setCategoriesSectionCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('mybar_categories_section_collapsed', String(newState));
      return newState;
    });
  };

  // Helper to get ingredient image based on category/subcategory
  const getIngredientImage = (ingredient: Ingredient): string => {
    const category = ingredient.category.toLowerCase();
    const subCategory = ingredient.subCategory.toLowerCase();
    
    if (category.includes("spirit")) {
      if (subCategory.includes("gin")) return ginImage;
      if (subCategory.includes("vodka")) return vodkaImage;
      if (subCategory.includes("whiskey") || subCategory.includes("bourbon") || subCategory.includes("scotch") || subCategory.includes("rye")) return whiskeyImage;
      if (subCategory.includes("rum") || subCategory.includes("tequila")) return whiskeyImage;
      return whiskeyImage;
    }
    if (category.includes("liqueur")) return liqueursImage;
    if (category.includes("wine") || category.includes("vermouth")) return winesImage;
    if (subCategory.includes("gin")) return ginImage;
    if (subCategory.includes("vodka")) return vodkaImage;
    
    // Default fallback
    return whiskeyImage;
  };

  const filteredIngredients = useMemo(() => {
    if (!searchValue) return allIngredients.filter(i => !myBarIngredients.includes(i.id));
    
    const term = searchValue.toLowerCase();
    
    // Separate matches by priority
    const nameMatches: Ingredient[] = [];
    const aliasMatches: Ingredient[] = [];
    const categoryMatches: Ingredient[] = [];
    
    allIngredients
      .filter(i => !myBarIngredients.includes(i.id))
      .forEach(ingredient => {
        const name = ingredient.name.toLowerCase();
        const category = ingredient.category.toLowerCase();
        const subCategory = ingredient.subCategory.toLowerCase();
        
        // Prioritize name matches
        if (name.includes(term)) {
          nameMatches.push(ingredient);
        }
        // Then alias matches
        else if (ingredient.aliases && ingredient.aliases.some(alias => alias.toLowerCase().includes(term))) {
          aliasMatches.push(ingredient);
        }
        // Finally category/subcategory matches
        else if (category.includes(term) || subCategory.includes(term)) {
          categoryMatches.push(ingredient);
        }
      });
    
    // Sort each group
    const sortByRelevance = (a: Ingredient, b: Ingredient) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match first
      const aExact = aName === term;
      const bExact = bName === term;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Starts with second
      const aStarts = aName.startsWith(term);
      const bStarts = bName.startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Alphabetical
      return a.name.localeCompare(b.name);
    };
    
    nameMatches.sort(sortByRelevance);
    aliasMatches.sort(sortByRelevance);
    categoryMatches.sort(sortByRelevance);
    
    // Combine in priority order
    return [...nameMatches, ...aliasMatches, ...categoryMatches];
  }, [searchValue, allIngredients, myBarIngredients]);

  const addIngredient = (ingredientId: string) => {
    toggleIngredient(ingredientId);
    setSearchValue("");
    setOpen(false);
    
    // Show subtle saved indicator
    setShowSavedIndicator(true);
    setTimeout(() => setShowSavedIndicator(false), 2000);
    
    // Keep focus on input for continued searching
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const removeIngredient = (ingredientId: string) => {
    toggleIngredient(ingredientId);
    
    // Show subtle saved indicator
    setShowSavedIndicator(true);
    setTimeout(() => setShowSavedIndicator(false), 2000);
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

  const clearAllIngredients = async () => {
    // Remove all ingredients at once
    await Promise.all(myBarIngredients.map(ingredientId => toggleIngredient(ingredientId)));
    setShowClearAllDialog(false);
    toast({
      description: "All ingredients cleared",
      duration: 2000,
    });
  };

  // Category images mapping
  const categoryImages: Record<string, string> = {
    "Spirits": whiskeyImage,
    "Liqueurs": liqueursImage,
    "Wines & Vermouths": winesImage,
    "Bitters": liqueursImage,
    "Mixers": ginImage,
    "Syrups": liqueursImage,
    "Juices": ginImage,
    "Garnishes": ginImage,
    "Other": vodkaImage
  };

  const categories = useMemo(() => {
    const cats = new Set(allIngredients.map(ing => ing.category));
    return Array.from(cats).sort();
  }, [allIngredients]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Load collapsed categories from localStorage
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('mybar_collapsed_categories');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Load Your Bar collapsed state from localStorage
  const [yourBarCollapsed, setYourBarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mybar_section_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      // Save to localStorage
      localStorage.setItem('mybar_collapsed_categories', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const toggleYourBar = () => {
    setYourBarCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem('mybar_section_collapsed', String(newValue));
      return newValue;
    });
  };

  const categoryIngredients = useMemo(() => {
    if (!selectedCategory) return [];
    return allIngredients
      .filter(i => i.category === selectedCategory && !myBarIngredients.includes(i.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, allIngredients, myBarIngredients]);

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
      name: "Margarita Night",
      ingredients: ["tequila", "triple sec", "lime juice", "salt", "simple syrup"]
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

  // Group ingredients by category
  const selectedIngredientsByCategory = useMemo(() => {
    const grouped: Record<string, Ingredient[]> = {};
    
    myBarIngredients.forEach(ingredientId => {
      const ingredient = ingredientMap[ingredientId];
      if (ingredient) {
        if (!grouped[ingredient.category]) {
          grouped[ingredient.category] = [];
        }
        grouped[ingredient.category].push(ingredient);
      }
    });
    
    // Sort ingredients within each category
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  }, [myBarIngredients, ingredientMap]);

  return (
    <div className="space-y-6">
      {/* Popular Bar Setups - Always show */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-pure-white">Popular Bar Setups</h2>
        <p className="text-sm text-soft-gray">Quick start - load a preset to fill your bar instantly</p>
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
          <h2 className="text-lg font-semibold text-pure-white">Your Saved Presets</h2>
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
                    <Button size="sm" onClick={savePresetRename} className="h-6 px-2">
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset)}
                      className="text-xs bg-medium-charcoal border-light-charcoal hover:bg-light-charcoal text-pure-white hover:text-pure-white pr-8"
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      {preset.name}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-light-charcoal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => startEditingPreset(preset)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicatePreset(preset)}>
                          <Copy className="h-3 w-3 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeletePreset(preset.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Interface */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
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
            
            {/* Custom Dropdown - Show search results */}
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
      </div>

      {/* Your Bar Overview Section */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-2">
          <div 
            onClick={toggleYourBar}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-pure-white">
                Your Bar ({myBarIngredients.length} ingredient{myBarIngredients.length !== 1 ? 's' : ''})
              </h2>
              <button
                className="flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleYourBar();
                }}
              >
                {yourBarCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              {showSavedIndicator && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 animate-fade-in">
                  <Check className="h-3 w-3" />
                  Saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user && myBarIngredients.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowClearAllDialog(true);
                    }}
                    className="text-xs h-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSaveDialog(true);
                    }}
                    className="text-xs h-7"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save Preset
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {!yourBarCollapsed && (
            <Card className="bg-medium-charcoal border-light-charcoal p-4">
              <Tabs defaultValue={Object.keys(selectedIngredientsByCategory)[0] || "all"} className="w-full">
                <TabsList className="w-full mb-4">
                  {Object.entries(selectedIngredientsByCategory).map(([category, ingredients]) => (
                    <TabsTrigger key={category} value={category} className="flex-1">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(selectedIngredientsByCategory).map(([category, ingredients]) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient) => (
                        <Badge
                          key={ingredient.id}
                          variant="secondary"
                          className="px-3 py-1.5 bg-accent/20 border-accent/40 text-pure-white hover:bg-accent/30 cursor-pointer group"
                          onClick={() => removeIngredient(ingredient.id)}
                        >
                          {ingredient.name}
                          <X className="h-3 w-3 ml-1.5 opacity-50 group-hover:opacity-100" />
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          )}
        </div>
      )}

      {/* Popular Ingredients - Visual Quick Add */}
      {!searchValue && myBarIngredients.length === 0 && !selectedCategory && (
        <Card className="p-4 bg-medium-charcoal border-light-charcoal">
          <h2 className="text-lg font-semibold text-pure-white mb-2">Popular Ingredients</h2>
          <p className="text-sm text-soft-gray mb-3">Quick-add these common bar staples</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {["vodka", "gin", "whiskey", "rum", "tequila", "triple-sec", "lime-juice", "simple-syrup"].map((ingredientId) => {
              const ingredient = allIngredients.find(i => i.id === ingredientId);
              if (!ingredient) return null;
              
              return (
                <button
                  key={ingredient.id}
                  onClick={() => addIngredient(ingredient.id)}
                  className="group relative rounded-organic-md overflow-hidden border border-light-charcoal bg-card hover:border-accent/40 transition-all duration-300 hover:scale-105"
                >
                  {/* Ingredient Image */}
                  <div 
                    className="h-28 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${getIngredientImage(ingredient)})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-2.5 flex flex-col justify-end">
                    <h5 className="text-xs sm:text-sm font-semibold text-pure-white line-clamp-2 group-hover:text-accent transition-colors">
                      {ingredient.name}
                    </h5>
                  </div>
                  
                  {/* Hover effect - Add icon */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-pure-white text-base font-bold leading-none">+</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Category Browsing Section */}
        {!searchValue && !selectedCategory && (
          <div className="space-y-2">
            <div 
              onClick={toggleCategoriesSection}
              className="flex items-center gap-3 cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-pure-white">Browse by Category</h2>
              <button
                className="flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategoriesSection();
                }}
              >
                {categoriesSectionCollapsed ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            
            {!categoriesSectionCollapsed && (
              <Card className="bg-medium-charcoal border-light-charcoal p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map((category) => {
                    const categoryImage = categoryImages[category] || vodkaImage;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="group relative overflow-hidden rounded-organic-md border border-light-charcoal hover:border-primary/60 transition-all duration-300 aspect-square"
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img 
                            src={categoryImage} 
                            alt={category}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-rich-charcoal/95 via-rich-charcoal/60 to-transparent" />
                        </div>
                        
                        {/* Category Label */}
                        <div className="absolute inset-0 flex items-end p-3">
                          <span className="text-sm font-semibold text-pure-white leading-tight">
                            {category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
      )}

      {/* Category Ingredients Display */}
      {selectedCategory && categoryIngredients.length > 0 && (
          <Card className="p-4 bg-medium-charcoal border-light-charcoal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-pure-white flex items-center gap-2">
                {selectedCategory}
                <Badge variant="secondary" className="ml-2 bg-accent/20 border-accent/40 text-pure-white">
                  {categoryIngredients.length}
                </Badge>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-8 text-xs hover:bg-light-charcoal"
              >
                <X className="h-3 w-3 mr-1" />
                Back to Categories
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {categoryIngredients.map((ingredient, index) => {
                // Generate flavor notes based on ingredient properties
                const flavorNotes = [];
                const name = ingredient.name.toLowerCase();
                const subCat = ingredient.subCategory.toLowerCase();
                
                // Assign flavor profiles
                if (name.includes('gin') || subCat.includes('gin')) flavorNotes.push('Botanical');
                if (name.includes('whiskey') || name.includes('bourbon') || name.includes('scotch')) flavorNotes.push('Oaky', 'Smoky');
                if (name.includes('vodka')) flavorNotes.push('Neutral', 'Clean');
                if (name.includes('rum')) flavorNotes.push('Sweet', 'Tropical');
                if (name.includes('tequila') || name.includes('mezcal')) flavorNotes.push('Agave', 'Earthy');
                if (name.includes('vermouth') || subCat.includes('vermouth')) flavorNotes.push('Herbal', 'Aromatic');
                if (name.includes('amaro') || name.includes('bitter')) flavorNotes.push('Bitter', 'Herbal');
                if (name.includes('orange') || name.includes('citrus')) flavorNotes.push('Citrus', 'Bright');
                if (name.includes('mint') || name.includes('menthe')) flavorNotes.push('Minty', 'Fresh');
                if (name.includes('coffee') || name.includes('espresso')) flavorNotes.push('Coffee', 'Rich');
                if (name.includes('chocolate') || name.includes('cacao')) flavorNotes.push('Chocolate', 'Rich');
                if (name.includes('cream')) flavorNotes.push('Creamy', 'Sweet');
                if (name.includes('cherry') || name.includes('berry')) flavorNotes.push('Fruity', 'Sweet');
                if (name.includes('herb') || name.includes('basil') || name.includes('thyme')) flavorNotes.push('Herbaceous', 'Fresh');
                if (name.includes('spice') || name.includes('cinnamon') || name.includes('clove')) flavorNotes.push('Spiced', 'Warm');
                if (name.includes('honey') || name.includes('agave syrup')) flavorNotes.push('Sweet', 'Natural');
                if (name.includes('lime') || name.includes('lemon')) flavorNotes.push('Citrus', 'Tart');
                if (subCat.includes('liqueur')) flavorNotes.push('Sweet');
                
                // Default if no matches
                if (flavorNotes.length === 0) flavorNotes.push('Complex');
                
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => addIngredient(ingredient.id)}
                    className="group relative rounded-organic-md overflow-hidden border border-light-charcoal bg-card hover:border-primary/40 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Ingredient Image */}
                    <div 
                      className="h-32 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${getIngredientImage(ingredient)})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <div className="flex justify-end">
                        {/* Add button */}
                        <div className="w-6 h-6 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-pure-white text-sm font-bold leading-none">+</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-base font-semibold text-pure-white line-clamp-2 mb-2">
                          {ingredient.name}
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {flavorNotes.slice(0, 2).map((note, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-organic-sm bg-medium-charcoal border border-light-charcoal text-pure-white"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </Card>
      )}

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

      {/* Empty State - No Ingredients - Only show if not browsing categories */}
      {myBarIngredients.length === 0 && !selectedCategory && searchValue.trim() === "" && (
        user ? (
          <Card className="p-8 text-center bg-medium-charcoal border-light-charcoal animate-fade-in">
            <Search className="h-12 w-12 mx-auto mb-4 text-soft-gray" />
            <h3 className="text-lg font-medium text-light-text mb-2">
              Your bar is empty
            </h3>
            <p className="text-soft-gray">
              Search for ingredients above or browse by category below to start building your cocktail collection.
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

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent className="bg-medium-charcoal border-light-charcoal">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-pure-white">Clear all ingredients?</AlertDialogTitle>
            <AlertDialogDescription className="text-soft-gray">
              This will remove all {myBarIngredients.length} ingredient{myBarIngredients.length !== 1 ? 's' : ''} from your bar. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-light-charcoal border-light-charcoal text-light-text hover:bg-light-charcoal/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllIngredients}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}