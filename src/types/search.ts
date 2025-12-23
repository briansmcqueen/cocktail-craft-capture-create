// Search and filter types for the bartending app

export type BaseSpirit = 'gin' | 'vodka' | 'whiskey' | 'rum' | 'tequila' | 'brandy' | 'mezcal';

export type Technique = 'shake' | 'stir' | 'build' | 'muddle' | 'blend';

export type GlassType = 'coupe' | 'rocks' | 'collins' | 'martini' | 'hurricane' | 'flute' | 'nick-nora' | 'wine';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type FlavorProfile = 
  | 'bitter' | 'sweet' | 'sour' | 'herbal' | 'fruity' | 'smoky' 
  | 'spicy' | 'creamy' | 'dry' | 'refreshing' | 'strong' | 'light';

export type Occasion = 
  | 'aperitif' | 'digestif' | 'brunch' | 'date-night' | 'party' 
  | 'nightcap' | 'summer' | 'winter' | 'classic';

export interface SearchFilters {
  query: string;
  canMakeOnly: boolean;
  baseSpirits: BaseSpirit[];
  difficulty: Difficulty | 'any';
  technique: Technique | 'any';
  glassType: GlassType | 'any';
  flavorProfiles: FlavorProfile[];
  occasions: Occasion[];
  maxMissingIngredients: number | null;
  noEggWhites: boolean;
  lowAlcohol: boolean;
  noCream: boolean;
  nonAlcoholic: boolean;
}

export interface SearchState extends SearchFilters {
  isAdvancedOpen: boolean;
  recentSearches: string[];
  savedFilters: SavedFilter[];
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: Partial<SearchFilters>;
  createdAt: Date;
}

export interface SearchSuggestion {
  type: 'cocktail' | 'ingredient' | 'flavor' | 'recent' | 'popular';
  text: string;
  count?: number;
}

export interface SearchResult {
  cocktail: any; // Will use existing Cocktail type
  canMake: boolean;
  missingIngredients: string[];
  availabilityScore: number; // 0-100, higher = fewer missing ingredients
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: '',
  canMakeOnly: false,
  baseSpirits: [],
  difficulty: 'any',
  technique: 'any',
  glassType: 'any',
  flavorProfiles: [],
  occasions: [],
  maxMissingIngredients: null,
  noEggWhites: false,
  lowAlcohol: false,
  noCream: false,
  nonAlcoholic: false,
};

export const SPIRIT_ICONS: Record<BaseSpirit, string> = {
  gin: '🍸',
  vodka: '🍹',
  whiskey: '🥃',
  rum: '🍺',
  tequila: '🥂',
  brandy: '🍷',
  mezcal: '🌿'
};

export const TECHNIQUE_ICONS: Record<Technique, string> = {
  shake: '🍸',
  stir: '🥄',
  build: '🏗️',
  muddle: '🌿',
  blend: '🌪️'
};

export const GLASS_ICONS: Record<GlassType, string> = {
  coupe: '🍸',
  rocks: '🥃',
  collins: '🥤',
  martini: '🍸',
  hurricane: '🌪️',
  flute: '🥂',
  'nick-nora': '🍸',
  wine: '🍷'
};