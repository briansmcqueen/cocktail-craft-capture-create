import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Save, BookmarkPlus, RotateCcw } from 'lucide-react';
import { 
  SearchFilters, 
  BaseSpirit, 
  Technique, 
  GlassType, 
  Difficulty,
  FlavorProfile,
  Occasion,
  SPIRIT_ICONS,
  TECHNIQUE_ICONS,
  GLASS_ICONS,
  SavedFilter
} from '@/types/search';
import { cn } from '@/lib/utils';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClose: () => void;
  onSaveFilter: (name: string) => void;
  savedFilters: SavedFilter[];
  onLoadSavedFilter: (filter: SavedFilter) => void;
  onDeleteSavedFilter: (id: string) => void;
  onClearFilters?: () => void;
}

const FLAVOR_PROFILES: FlavorProfile[] = [
  'bitter', 'sweet', 'sour', 'herbal', 'fruity', 'smoky',
  'spicy', 'creamy', 'dry', 'refreshing', 'strong', 'light'
];

const OCCASIONS: Occasion[] = [
  'aperitif', 'digestif', 'brunch', 'date-night', 'party',
  'nightcap', 'summer', 'winter', 'classic'
];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const TECHNIQUES: Technique[] = ['shake', 'stir', 'build', 'muddle', 'blend'];
const GLASS_TYPES: GlassType[] = ['coupe', 'rocks', 'collins', 'martini', 'hurricane', 'flute', 'nick-nora', 'wine'];

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onClose,
  onSaveFilter,
  savedFilters,
  onLoadSavedFilter,
  onDeleteSavedFilter,
  onClearFilters
}: AdvancedFiltersProps) {
  const [saveFilterName, setSaveFilterName] = React.useState('');
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toggleArrayFilter = <T,>(
    key: keyof SearchFilters,
    value: T,
    currentArray: T[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    onFiltersChange({ [key]: newArray });
  };

  const toggleBooleanFilter = (key: keyof SearchFilters) => {
    onFiltersChange({ [key]: !filters[key as keyof SearchFilters] });
  };

  const handleSaveFilter = () => {
    if (saveFilterName.trim()) {
      onSaveFilter(saveFilterName.trim());
      setSaveFilterName('');
    }
  };

  return (
    <Card ref={cardRef} className="w-full bg-card border-border rounded-organic-md">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-pure-white">Advanced Filters</h3>
          <div className="flex items-center gap-2">
            {onClearFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="h-8 gap-2 text-pure-white hover:text-pure-white border-border rounded-organic-sm"
              >
                <RotateCcw size={14} />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-light-text">Quick Apply</Label>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((savedFilter) => (
                <div key={savedFilter.id} className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadSavedFilter(savedFilter)}
                    className="rounded-organic-sm border-border text-light-text hover:bg-card/50"
                  >
                    {savedFilter.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteSavedFilter(savedFilter.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="bg-border" />
          </div>
        )}

        {/* Base Spirits */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-light-text">Base Spirits</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(SPIRIT_ICONS).map(([spirit, icon]) => (
              <Button
                key={spirit}
                variant={filters.baseSpirits.includes(spirit as BaseSpirit) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleArrayFilter('baseSpirits', spirit as BaseSpirit, filters.baseSpirits)}
                className={cn(
                  "justify-start gap-2 rounded-organic-sm",
                  filters.baseSpirits.includes(spirit as BaseSpirit)
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-light-text hover:bg-card/50"
                )}
              >
                <span className="text-base">{icon}</span>
                <span className="capitalize">{spirit}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Technique & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technique */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-light-text">Technique</Label>
            <div className="space-y-2">
              <Button
                variant={filters.technique === 'any' ? "default" : "outline"}
                size="sm"
                onClick={() => onFiltersChange({ technique: 'any' })}
                className={cn(
                  "w-full justify-start rounded-organic-sm",
                  filters.technique === 'any'
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-light-text hover:bg-card/50"
                )}
              >
                Any Technique
              </Button>
              {TECHNIQUES.map((technique) => (
                <Button
                  key={technique}
                  variant={filters.technique === technique ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFiltersChange({ technique })}
                  className={cn(
                    "w-full justify-start gap-2 rounded-organic-sm",
                    filters.technique === technique
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-light-text hover:bg-card/50"
                  )}
                >
                  <span>{TECHNIQUE_ICONS[technique]}</span>
                  <span className="capitalize">{technique}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-light-text">Difficulty</Label>
            <div className="space-y-2">
              <Button
                variant={filters.difficulty === 'any' ? "default" : "outline"}
                size="sm"
                onClick={() => onFiltersChange({ difficulty: 'any' })}
                className={cn(
                  "w-full justify-start rounded-organic-sm",
                  filters.difficulty === 'any'
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-light-text hover:bg-card/50"
                )}
              >
                Any Difficulty
              </Button>
              {DIFFICULTIES.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={filters.difficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFiltersChange({ difficulty })}
                  className={cn(
                    "w-full justify-start rounded-organic-sm",
                    filters.difficulty === difficulty
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-light-text hover:bg-card/50"
                  )}
                >
                  <span className="capitalize">{difficulty}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Glass Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-light-text">Glass Type</Label>
          <div className="space-y-2">
            <Button
              variant={filters.glassType === 'any' ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ glassType: 'any' })}
              className={cn(
                "justify-start rounded-organic-sm",
                filters.glassType === 'any'
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-light-text hover:bg-card/50"
              )}
            >
              Any Glass
            </Button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GLASS_TYPES.map((glassType) => (
                <Button
                  key={glassType}
                  variant={filters.glassType === glassType ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFiltersChange({ glassType })}
                  className={cn(
                    "justify-start gap-2 rounded-organic-sm",
                    filters.glassType === glassType
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-light-text hover:bg-card/50"
                  )}
                >
                  <span>{GLASS_ICONS[glassType]}</span>
                  <span className="capitalize text-xs">{glassType}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Flavor Profiles */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-light-text">Flavor Profile</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {FLAVOR_PROFILES.map((profile) => (
              <Button
                key={profile}
                variant={filters.flavorProfiles.includes(profile) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleArrayFilter('flavorProfiles', profile, filters.flavorProfiles)}
                className={cn(
                  "justify-start rounded-organic-sm",
                  filters.flavorProfiles.includes(profile)
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-light-text hover:bg-card/50"
                )}
              >
                <span className="capitalize">{profile}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Occasions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-light-text">Perfect For</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {OCCASIONS.map((occasion) => (
              <Button
                key={occasion}
                variant={filters.occasions.includes(occasion) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleArrayFilter('occasions', occasion, filters.occasions)}
                className={cn(
                  "justify-start rounded-organic-sm",
                  filters.occasions.includes(occasion)
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-light-text hover:bg-card/50"
                )}
              >
                <span className="capitalize">{occasion.replace('-', ' ')}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Special Constraints */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-light-text">Special Requirements</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'noEggWhites', label: 'No egg whites' },
              { key: 'noAbsinthe', label: 'No absinthe' },
              { key: 'lowAlcohol', label: 'Low alcohol' },
              { key: 'noCream', label: 'No cream' },
              { key: 'batchFriendly', label: 'Batch-friendly' },
              { key: 'makeAhead', label: 'Make-ahead' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={filters[key as keyof SearchFilters] ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBooleanFilter(key as keyof SearchFilters)}
                className={cn(
                  "justify-start rounded-organic-sm",
                  filters[key as keyof SearchFilters]
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-light-text hover:bg-card/50"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Save Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-light-text">Save Current Filters</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Filter name (e.g., 'Date Night Drinks')"
              value={saveFilterName}
              onChange={(e) => setSaveFilterName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSaveFilter}
              disabled={!saveFilterName.trim()}
              size="sm"
              className="gap-2"
            >
              <Save size={14} />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}