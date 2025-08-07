export interface IngredientTiers {
  primary: string[];
  secondary: string[];
  assumed: string[];
}

export const INGREDIENT_TIERS: IngredientTiers = {
  // Tier 1: Primary Bar Essentials - Always visible, these differentiate one bar from another
  primary: ["Spirits", "Liqueurs", "Wines & Vermouths"],
  
  // Tier 2: Secondary/Optional - Collapsible section, nice to track but not essential
  secondary: ["Mixers", "Produce", "Pantry", "Beers & Ciders"],
  
  // Tier 3: Assumed Available - Auto-included ingredients most people have
  assumed: [
    "ice",
    "lemon",
    "lime", 
    "simple syrup",
    "salt",
    "water",
    "egg white",
    "sugar"
  ]
};

// Assumed ingredient IDs from the database that match common ingredients
export const ASSUMED_INGREDIENT_IDS = [
  "produce_001", // Lemon
  "produce_002", // Lime
  "pantry_001",  // Simple Syrup
  "pantry_002",  // Salt
  "pantry_004",  // Egg White
  "pantry_005",  // Sugar
];

export interface MyBarSettings {
  includeFreshIngredients: boolean;
  includePantryItems: boolean;
  assumeBasicIngredients: boolean;
  preciseMatchingOnly: boolean;
  showSecondaryByDefault: boolean;
}

export const DEFAULT_MYBAR_SETTINGS: MyBarSettings = {
  includeFreshIngredients: true,
  includePantryItems: true,
  assumeBasicIngredients: true,
  preciseMatchingOnly: false,
  showSecondaryByDefault: false,
};