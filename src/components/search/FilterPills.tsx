import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, X, RotateCcw } from 'lucide-react';
import { SearchFilters, SPIRIT_ICONS, BaseSpirit } from '@/types/search';
import { cn } from '@/lib/utils';

interface FilterPillsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onAdvancedToggle: () => void;
  isAdvancedOpen: boolean;
  activeFilterCount: number;
  availableIngredients: string[];
  canMakeCount?: number;
  onClearAllFilters?: () => void;
}

export default function FilterPills({
  filters,
  onFiltersChange,
  onAdvancedToggle,
  isAdvancedOpen,
  activeFilterCount,
  availableIngredients,
  canMakeCount = 0,
  onClearAllFilters
}: FilterPillsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleBaseSpiritsToggle = (spirit: BaseSpirit) => {
    const newSpirits = filters.baseSpirits.includes(spirit)
      ? filters.baseSpirits.filter(s => s !== spirit)
      : [...filters.baseSpirits, spirit];
    onFiltersChange({ baseSpirits: newSpirits });
  };

  const handleDifficultyChange = (difficulty: SearchFilters['difficulty']) => {
    onFiltersChange({ difficulty });
  };

  const handleGlassTypeChange = (glassType: SearchFilters['glassType']) => {
    onFiltersChange({ glassType });
  };

  const clearFilter = (filterType: keyof SearchFilters) => {
    setOpenDropdown(null); // Close any open dropdown
    switch (filterType) {
      case 'canMakeOnly':
        onFiltersChange({ canMakeOnly: false });
        break;
      case 'baseSpirits':
        onFiltersChange({ baseSpirits: [] });
        break;
      case 'difficulty':
        onFiltersChange({ difficulty: 'any' });
        break;
      case 'glassType':
        onFiltersChange({ glassType: 'any' });
        break;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Can Make Now Pill */}
      <Button
        variant={filters.canMakeOnly ? "default" : "outline"}
        size="sm"
        onClick={() => onFiltersChange({ canMakeOnly: !filters.canMakeOnly })}
        className={cn(
          "rounded-organic-sm transition-all duration-200",
          filters.canMakeOnly 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "border-border text-light-text hover:bg-card/50"
        )}
        disabled={availableIngredients.length === 0}
      >
        <span className="flex items-center gap-2">
          ✓ Can Make Now
           {canMakeCount > 0 && (
             <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs text-pure-white">
               {canMakeCount}
             </Badge>
           )}
          {filters.canMakeOnly && (
            <X 
              size={14} 
              className="ml-1 cursor-pointer hover:text-destructive" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearFilter('canMakeOnly');
              }}
            />
          )}
        </span>
      </Button>

      {/* Base Spirits Dropdown */}
      <Popover open={openDropdown === 'spirits'} onOpenChange={(open) => setOpenDropdown(open ? 'spirits' : null)}>
        <PopoverTrigger asChild>
          <Button
            variant={filters.baseSpirits.length > 0 ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-organic-sm transition-all duration-200",
              filters.baseSpirits.length > 0
                ? "bg-primary text-primary-foreground shadow-md"
                : "border-border text-light-text hover:bg-card/50"
            )}
          >
            <span className="flex items-center gap-2">
              Base Spirit
               {filters.baseSpirits.length > 0 && (
                 <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs text-pure-white">
                   {filters.baseSpirits.length}
                 </Badge>
               )}
              <ChevronDown size={14} />
              {filters.baseSpirits.length > 0 && (
                <X 
                  size={14} 
                  className="ml-1 cursor-pointer hover:text-destructive" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearFilter('baseSpirits');
                  }}
                />
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3 bg-card border-border">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SPIRIT_ICONS).map(([spirit, icon]) => (
              <Button
                key={spirit}
                variant={filters.baseSpirits.includes(spirit as BaseSpirit) ? "default" : "outline"}
                size="sm"
                onClick={() => handleBaseSpiritsToggle(spirit as BaseSpirit)}
                className="justify-start gap-2 h-9"
              >
                <span className="text-base">{icon}</span>
                <span className="capitalize">{spirit}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Difficulty Filter */}
      <Popover open={openDropdown === 'difficulty'} onOpenChange={(open) => setOpenDropdown(open ? 'difficulty' : null)}>
        <PopoverTrigger asChild>
          <Button
            variant={filters.difficulty !== 'any' ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-organic-sm transition-all duration-200",
              filters.difficulty !== 'any'
                ? "bg-primary text-primary-foreground shadow-md"
                : "border-border text-light-text hover:bg-card/50"
            )}
          >
            <span className="flex items-center gap-2">
              Difficulty
              {filters.difficulty !== 'any' && (
                 <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs capitalize text-pure-white">
                   {filters.difficulty}
                 </Badge>
              )}
              <ChevronDown size={14} />
              {filters.difficulty !== 'any' && (
                <X 
                  size={14} 
                  className="ml-1 cursor-pointer hover:text-destructive" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearFilter('difficulty');
                  }}
                />
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3 bg-card border-border">
          <div className="space-y-2">
            <Button
              variant={filters.difficulty === 'any' ? "default" : "outline"}
              size="sm"
              onClick={() => handleDifficultyChange('any')}
              className="w-full justify-start"
            >
              Any Difficulty
            </Button>
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={filters.difficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => handleDifficultyChange(difficulty)}
                className="w-full justify-start capitalize"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Glass Type Filter */}
      <Popover open={openDropdown === 'glass'} onOpenChange={(open) => setOpenDropdown(open ? 'glass' : null)}>
        <PopoverTrigger asChild>
          <Button
            variant={filters.glassType !== 'any' ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-organic-sm transition-all duration-200",
              filters.glassType !== 'any'
                ? "bg-primary text-primary-foreground shadow-md"
                : "border-border text-light-text hover:bg-card/50"
            )}
          >
            <span className="flex items-center gap-2">
              Glass Type
              {filters.glassType !== 'any' && (
                 <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs capitalize text-pure-white">
                   {filters.glassType}
                 </Badge>
              )}
              <ChevronDown size={14} />
              {filters.glassType !== 'any' && (
                <X 
                  size={14} 
                  className="ml-1 cursor-pointer hover:text-destructive" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearFilter('glassType');
                  }}
                />
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3 bg-card border-border">
          <div className="space-y-2">
            <Button
              variant={filters.glassType === 'any' ? "default" : "outline"}
              size="sm"
              onClick={() => handleGlassTypeChange('any')}
              className="w-full justify-start"
            >
              Any Glass
            </Button>
            {(['coupe', 'rocks', 'collins', 'martini'] as const).map((glassType) => (
              <Button
                key={glassType}
                variant={filters.glassType === glassType ? "default" : "outline"}
                size="sm"
                onClick={() => handleGlassTypeChange(glassType)}
                className="w-full justify-start capitalize"
              >
                {glassType}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Advanced Filters Toggle */}
      <Button
        variant={isAdvancedOpen || activeFilterCount > 0 ? "default" : "outline"}
        size="sm"
        onClick={onAdvancedToggle}
        className={cn(
          "rounded-organic-sm transition-all duration-200",
          isAdvancedOpen || activeFilterCount > 0
            ? "bg-primary text-primary-foreground shadow-md"
            : "border-border text-light-text hover:bg-card/50"
        )}
      >
        <span className="flex items-center gap-2">
          More Filters
          {activeFilterCount > 0 && (
             <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs text-pure-white">
               {activeFilterCount}
             </Badge>
          )}
          <ChevronDown 
            size={14} 
            className={cn("transition-transform", isAdvancedOpen && "rotate-180")}
          />
        </span>
      </Button>

      {/* Clear All Filters Button */}
      {(activeFilterCount > 0 || filters.canMakeOnly || filters.query) && onClearAllFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAllFilters}
          className="gap-2 text-pure-white hover:text-pure-white border-border rounded-organic-sm"
        >
          <RotateCcw size={14} />
          Clear All
        </Button>
      )}
    </div>
  );
}