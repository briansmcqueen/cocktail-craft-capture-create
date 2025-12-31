import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, ChevronUp, Wine, Droplets, CircleDot, Sparkles, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FILTER_CATEGORIES, FilterCategoryKey, CocktailFilters as CocktailFiltersType } from '@/hooks/useCocktailFilters';

interface CocktailFiltersProps {
  filters: CocktailFiltersType;
  onToggleFilter: (category: FilterCategoryKey, optionId: string) => void;
  onClearAll: () => void;
  onClearCategory: (category: FilterCategoryKey) => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
}

const CATEGORY_ICONS: Record<FilterCategoryKey, React.ReactNode> = {
  baseSpirits: <Wine size={14} />,
  modifiers: <Droplets size={14} />,
  citrus: <CircleDot size={14} />,
  syrups: <Sparkles size={14} />,
  style: <Flame size={14} />,
};

export default function CocktailFilters({
  filters,
  onToggleFilter,
  onClearAll,
  onClearCategory,
  activeFilterCount,
  filteredCount,
  totalCount,
}: CocktailFiltersProps) {
  const [expandedCategory, setExpandedCategory] = useState<FilterCategoryKey | null>(null);

  const toggleCategory = (category: FilterCategoryKey) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };

  const getCategoryCount = (category: FilterCategoryKey) => {
    return filters[category].length;
  };

  return (
    <div className="space-y-4">
      {/* Category tabs with paper notebook aesthetic */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_CATEGORIES) as FilterCategoryKey[]).map((categoryKey) => {
          const category = FILTER_CATEGORIES[categoryKey];
          const count = getCategoryCount(categoryKey);
          const isExpanded = expandedCategory === categoryKey;
          
          return (
            <button
              key={categoryKey}
              onClick={() => toggleCategory(categoryKey)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-300",
                "border rounded-t-lg rounded-b-sm",
                "hover:scale-[1.02]",
                isExpanded
                  ? "bg-primary/10 border-primary text-primary border-b-transparent -mb-px z-10"
                  : "bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={{ 
                borderRadius: isExpanded ? '8px 12px 2px 2px' : '6px 10px 4px 4px',
              }}
            >
              {CATEGORY_ICONS[categoryKey]}
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              {count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-1 h-5 min-w-5 px-1.5 text-xs bg-primary text-primary-foreground"
                >
                  {count}
                </Badge>
              )}
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          );
        })}
        
        {/* Clear all button */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X size={14} className="mr-1" />
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Expanded category panel with paper notebook style */}
      {expandedCategory && (
        <div 
          className="relative bg-card border border-border border-t-0 rounded-b-lg rounded-tr-lg p-4 -mt-1"
          style={{ borderRadius: '4px 12px 12px 12px' }}
        >
          {/* Paper texture lines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, hsl(var(--foreground)) 28px)',
            }}
          />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground">
                {FILTER_CATEGORIES[expandedCategory].label}
              </h4>
              {getCategoryCount(expandedCategory) > 0 && (
                <button
                  onClick={() => onClearCategory(expandedCategory)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {FILTER_CATEGORIES[expandedCategory].options.map((option) => {
                const isSelected = filters[expandedCategory].includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => onToggleFilter(expandedCategory, option.id)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                      "border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {option.label}
                    {isSelected && (
                      <X size={12} className="ml-1.5 inline-block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active filters summary (always visible when filters are applied) */}
      {activeFilterCount > 0 && !expandedCategory && (
        <div className="flex flex-wrap items-center gap-2 py-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {(Object.keys(FILTER_CATEGORIES) as FilterCategoryKey[]).map((categoryKey) => {
            const selectedOptions = filters[categoryKey];
            if (selectedOptions.length === 0) return null;
            
            return selectedOptions.map((optionId) => {
              const option = FILTER_CATEGORIES[categoryKey].options.find(o => o.id === optionId);
              if (!option) return null;
              
              return (
                <button
                  key={`${categoryKey}-${optionId}`}
                  onClick={() => onToggleFilter(categoryKey, optionId)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {option.label}
                  <X size={10} />
                </button>
              );
            });
          })}
        </div>
      )}

      {/* Results count */}
      {activeFilterCount > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCount}</span> of {totalCount} cocktails
        </div>
      )}
    </div>
  );
}
