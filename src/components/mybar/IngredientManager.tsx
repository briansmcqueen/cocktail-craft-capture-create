import React, { useState, useMemo, useRef } from "react";
import { Search, X, Check, ChevronLeft, ChevronDown, ChevronRight, MoreVertical, Save, Trash2, Martini } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useToast } from "@/hooks/use-toast";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";
import AuthPrompt from "@/components/auth/AuthPrompt";

interface IngredientManagerProps {
  allIngredients: Ingredient[];
  myBar: { [ingredientId: string]: boolean };
  myBarIngredients: string[];
  ingredientMap: { [id: string]: Ingredient };
  toggleIngredient: (ingredientId: string) => void;
  user: any;
  setCustomIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  onSavePreset: (name: string) => Promise<void>;
}

function CollapsibleCategory({ category, ingredients, toggleIngredient }: { 
  category: string; 
  ingredients: Ingredient[]; 
  toggleIngredient: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full py-1.5 text-xs font-medium text-soft-gray hover:text-light-text transition-colors"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {category} ({ingredients.length})
      </button>
      {open && (
        <div className="flex flex-wrap gap-1.5 pb-1.5">
          {ingredients.map((ing) => (
            <Badge
              key={ing.id}
              variant="secondary"
              className="px-2.5 py-1 bg-accent/20 border-accent/40 text-pure-white hover:bg-destructive/20 hover:border-destructive/40 cursor-pointer group text-xs"
              onClick={() => toggleIngredient(ing.id)}
            >
              {ing.name}
              <X className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = true }: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-sm font-semibold text-pure-white uppercase tracking-wider hover:text-light-text transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {title}
      </button>
      {open && children}
    </div>
  );
}

export default function IngredientManager({
  allIngredients,
  myBar,
  myBarIngredients,
  ingredientMap,
  toggleIngredient,
  user,
  setCustomIngredients,
  onSavePreset,
}: IngredientManagerProps) {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  useSearchShortcut(inputRef);

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Search results
  const filteredIngredients = useMemo(() => {
    if (!searchValue) return [];
    const term = searchValue.toLowerCase();

    const nameMatches: Ingredient[] = [];
    const aliasMatches: Ingredient[] = [];
    const categoryMatches: Ingredient[] = [];

    allIngredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      const category = ingredient.category.toLowerCase();
      const subCategory = ingredient.subCategory.toLowerCase();

      if (name.includes(term)) nameMatches.push(ingredient);
      else if (ingredient.aliases?.some(a => a.toLowerCase().includes(term))) aliasMatches.push(ingredient);
      else if (category.includes(term) || subCategory.includes(term)) categoryMatches.push(ingredient);
    });

    const sortByRelevance = (a: Ingredient, b: Ingredient) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName === term && bName !== term) return -1;
      if (bName === term && aName !== term) return 1;
      if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
      if (bName.startsWith(term) && !aName.startsWith(term)) return 1;
      return a.name.localeCompare(b.name);
    };

    nameMatches.sort(sortByRelevance);
    aliasMatches.sort(sortByRelevance);
    categoryMatches.sort(sortByRelevance);

    return [...nameMatches, ...aliasMatches, ...categoryMatches];
  }, [searchValue, allIngredients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (searchValue.length > 0) setOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setOpen(false), 200);
  };

  const addIngredient = (ingredientId: string) => {
    toggleIngredient(ingredientId);
    setSearchValue("");
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const clearAllIngredients = async () => {
    await Promise.all(myBarIngredients.map(id => toggleIngredient(id)));
    setShowClearAllDialog(false);
    toast({ description: "All ingredients cleared", duration: 2000 });
  };

  const savePreset = async () => {
    if (presetName.trim()) {
      await onSavePreset(presetName.trim());
      setPresetName("");
      setShowSaveDialog(false);
    }
  };

  // Group bar ingredients by category
  const selectedByCategory = useMemo(() => {
    const grouped: Record<string, Ingredient[]> = {};
    myBarIngredients.forEach(id => {
      const ing = ingredientMap[id];
      if (ing) {
        if (!grouped[ing.category]) grouped[ing.category] = [];
        grouped[ing.category].push(ing);
      }
    });
    Object.values(grouped).forEach(list => list.sort((a, b) => a.name.localeCompare(b.name)));
    return grouped;
  }, [myBarIngredients, ingredientMap]);

  // Categories for browsing
  const categories = useMemo(() => {
    return Array.from(new Set(allIngredients.map(ing => ing.category))).sort();
  }, [allIngredients]);

  // Ingredients for selected category (checklist)
  const categoryIngredients = useMemo(() => {
    if (!selectedCategory) return [];
    return allIngredients
      .filter(i => i.category === selectedCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, allIngredients]);

  // Count how many in bar per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat] = allIngredients.filter(i => i.category === cat && myBar[i.id]).length;
    });
    return counts;
  }, [categories, allIngredients, myBar]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
        <Input
          ref={inputRef}
          placeholder="Search ingredients..."
          value={searchValue}
          onChange={(e) => {
            handleSearchChange(e);
            setFocusedIndex(-1);
          }}
          onFocus={handleInputFocus}
          onBlur={() => {
            handleInputBlur();
            setFocusedIndex(-1);
          }}
          onKeyDown={(e) => {
            const visible = filteredIngredients.slice(0, 20);
            if (open && visible.length > 0) {
              if (e.key === 'Tab') {
                e.preventDefault();
                setFocusedIndex(prev => {
                  const next = e.shiftKey ? prev - 1 : prev + 1;
                  if (next < 0) return visible.length - 1;
                  if (next >= visible.length) return 0;
                  return next;
                });
                return;
              }
              if (e.key === 'Enter') {
                e.preventDefault();
                const idx = focusedIndex >= 0 ? focusedIndex : 0;
                const ing = visible[idx];
                if (ing) {
                  myBar[ing.id] ? toggleIngredient(ing.id) : addIngredient(ing.id);
                }
                return;
              }
              if (e.key === 'Escape') {
                setOpen(false);
                setFocusedIndex(-1);
                return;
              }
            }
          }}
          className="pl-10 pr-16 h-11 text-sm bg-medium-charcoal border-light-charcoal text-light-text"
        />
        {!searchValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-soft-gray pointer-events-none z-10">
            <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-mono">
              {typeof navigator !== 'undefined' && /Mac/.test(navigator.platform) ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-mono">K</kbd>
          </div>
        )}

        {/* Search dropdown */}
        {open && filteredIngredients.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-medium-charcoal border border-light-charcoal rounded-organic-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
            {filteredIngredients.slice(0, 20).map((ingredient, index) => {
              const inBar = myBar[ingredient.id];
              return (
                <button
                  key={ingredient.id}
                  onClick={() => inBar ? toggleIngredient(ingredient.id) : addIngredient(ingredient.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm text-left border-b border-light-charcoal last:border-b-0 transition-colors",
                    focusedIndex === index ? "bg-primary/20" : "hover:bg-light-charcoal"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {inBar && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    <span className="text-light-text">{ingredient.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-primary/30 text-soft-gray">
                    {ingredient.category}
                  </Badge>
                </button>
              );
            })}
            {/* Can't find it link */}
            <div className="px-3 py-2 border-t border-light-charcoal">
              <AddCustomIngredient
                onIngredientAdded={async () => {
                  const customIngs = await getUserCustomIngredients();
                  setCustomIngredients(customIngs);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Your Bar - grouped badges */}
      {myBarIngredients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-pure-white uppercase tracking-wider">
              Your Bar ({myBarIngredients.length})
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="h-4 w-4 text-soft-gray" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user && (
                  <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
                    <Save className="h-3 w-3 mr-2" />
                    Save as Preset
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowClearAllDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1">
            {Object.entries(selectedByCategory).map(([category, ingredients]) => (
              <CollapsibleCategory key={category} category={category} ingredients={ingredients} toggleIngredient={toggleIngredient} />
            ))}
          </div>
        </div>
      )}

      {/* Category Browsing */}
      {!selectedCategory ? (
        <CollapsibleSection title="Browse by Category">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="flex items-center justify-between px-3 py-2.5 rounded-organic-sm border border-light-charcoal bg-medium-charcoal hover:bg-light-charcoal transition-colors text-left"
              >
                <span className="text-sm text-light-text">{category}</span>
                {categoryCounts[category] > 0 && (
                  <Badge variant="secondary" className="bg-accent/20 border-accent/40 text-emerald-400 text-xs px-1.5 py-0">
                    {categoryCounts[category]}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CollapsibleSection>
      ) : (
        /* Category checklist view */
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="h-7 px-2 text-soft-gray hover:text-pure-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-sm font-semibold text-pure-white uppercase tracking-wider">{selectedCategory}</h3>
            <Badge variant="secondary" className="bg-accent/20 border-accent/40 text-pure-white text-xs">
              {categoryIngredients.filter(i => myBar[i.id]).length}/{categoryIngredients.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
            {categoryIngredients.map((ingredient) => {
              const inBar = myBar[ingredient.id];
              return (
                <button
                  key={ingredient.id}
                  onClick={() => toggleIngredient(ingredient.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-organic-sm text-left transition-colors ${
                    inBar 
                      ? 'bg-accent/10 hover:bg-accent/20' 
                      : 'hover:bg-light-charcoal/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    inBar 
                      ? 'bg-primary border-primary' 
                      : 'border-light-charcoal'
                  }`}>
                    {inBar && <Check className="h-3 w-3 text-pure-white" />}
                  </div>
                  <span className={`text-sm ${inBar ? 'text-pure-white' : 'text-light-text'}`}>
                    {ingredient.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for unauthenticated */}
      {myBarIngredients.length === 0 && !user && !searchValue && !selectedCategory && (
        <AuthPrompt
          icon={Martini}
          title="Build Your Personal Bar"
          description="Create a free account to save your ingredients and discover personalized cocktail recommendations."
        />
      )}

      {/* Save Preset Dialog */}
      {showSaveDialog && (
        <div className="p-3 border border-primary/20 bg-medium-charcoal rounded-organic-sm space-y-2">
          <h4 className="text-sm font-medium text-light-text">Save Current Selection</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && savePreset()}
              className="h-8 text-sm bg-light-charcoal border-light-charcoal text-light-text"
            />
            <Button size="sm" onClick={savePreset} disabled={!presetName.trim()} className="h-8">Save</Button>
            <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)} className="h-8">Cancel</Button>
          </div>
        </div>
      )}

      {/* Clear All Dialog */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent className="bg-medium-charcoal border-light-charcoal">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-pure-white">Clear all ingredients?</AlertDialogTitle>
            <AlertDialogDescription className="text-soft-gray">
              This will remove all {myBarIngredients.length} ingredients from your bar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-light-charcoal border-light-charcoal text-light-text">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllIngredients} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
