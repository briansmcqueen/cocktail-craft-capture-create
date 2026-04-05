import { Cocktail } from "@/data/classicCocktails";
import { 
  UNIT_CONVERSIONS, 
  fractionToDecimal, 
  formatAmount, 
  suggestBetterUnit,
  FRACTIONS 
} from "@/utils/unitConversions";

export interface ParsedIngredient {
  amount: number;
  unit: string;
  ingredient: string;
  originalText: string;
  isScalable: boolean;
}

export interface ScaledRecipe extends Cocktail {
  currentServings: number;
  scaledIngredients: string[];
  scalingWarnings: string[];
}

export interface ScalingConfig {
  currentServings: number;
  defaultServings: number;
  minServings: number;
  maxServings: number;
  scalingWarnings?: string[];
}

export class RecipeScalingService {
  
  /**
   * Parses an ingredient string to extract amount, unit, and ingredient name
   */
  static parseIngredient(ingredientText: string): ParsedIngredient {
    const original = ingredientText.trim();
    
    // Common patterns for ingredients
    const patterns = [
      // "2 oz gin" or "1 1/2 oz gin" or "1/2 oz gin"
      /^(\d+(?:\s+\d+\/\d+|\s*\d+\/\d+)?)\s+([a-zA-Z]+)\s+(.+)$/,
      // "2oz gin" (no space)
      /^(\d*\.?\d+)\s*([a-zA-Z]+)\s+(.+)$/,
      // "dash of bitters" or "splash of lime juice"
      /^(\d*)\s*(dash|dashes|splash|splashes|barspoon|barspoons)\s+(?:of\s+)?(.+)$/i,
      // "1 lime wheel" or "2 cherry"
      /^(\d+)\s+(.+?)(?:\s+(wheel|wheels|slice|slices|piece|pieces|sprig|sprigs|leaf|leaves|twist|twists))?$/,
    ];
    
    for (const pattern of patterns) {
      const match = original.match(pattern);
      if (match) {
        let amount = match[1] ? fractionToDecimal(match[1]) : 1;
        const unit = match[2]?.toLowerCase() || 'piece';
        const ingredient = match[3] || match[2] || original;
        
        // Special handling for dashes/splashes without numbers
        if (!match[1] && (unit === 'dash' || unit === 'splash' || unit === 'barspoon')) {
          amount = 1;
        }
        
        const isScalable = this.isIngredientScalable(ingredient, unit);
        
        return {
          amount,
          unit,
          ingredient: ingredient.trim(),
          originalText: original,
          isScalable
        };
      }
    }
    
    // Fallback for unparseable ingredients
    return {
      amount: 1,
      unit: 'piece',
      ingredient: original,
      originalText: original,
      isScalable: false
    };
  }
  
  /**
   * Determines if an ingredient should be scaled
   */
  static isIngredientScalable(ingredient: string, unit: string): boolean {
    const nonScalableUnits = ['pinch', 'to taste', 'garnish'];
    const nonScalableIngredients = [
      'salt', 'pepper', 'to taste', 'garnish', 'ice', 'glass'
    ];
    
    if (nonScalableUnits.includes(unit.toLowerCase())) {
      return false;
    }
    
    if (nonScalableIngredients.some(item => 
      ingredient.toLowerCase().includes(item.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Scales a single ingredient
   */
  static scaleIngredient(parsed: ParsedIngredient, scaleFactor: number): string {
    if (!parsed.isScalable) {
      return parsed.originalText;
    }
    
    const newAmount = parsed.amount * scaleFactor;
    
    // Check for impractically small amounts
    if (newAmount < 0.03125) { // Less than 1/32 oz
      return `tiny amount of ${parsed.ingredient}`;
    }
    
    // Suggest better units for large amounts
    const { amount: suggestedAmount, unit: suggestedUnit } = suggestBetterUnit(
      newAmount, 
      parsed.unit
    );
    
    const formattedAmount = formatAmount(suggestedAmount);
    const displayUnit = suggestedAmount === 1 ? 
      this.getSingularUnit(suggestedUnit) : 
      this.getPluralUnit(suggestedUnit);
    
    return `${formattedAmount} ${displayUnit} ${parsed.ingredient}`;
  }
  
  /**
   * Gets singular form of unit
   */
  static getSingularUnit(unit: string): string {
    const singularMap: Record<string, string> = {
      'dashes': 'dash',
      'splashes': 'splash',
      'barspoons': 'barspoon',
      'cups': 'cup',
      'pints': 'pint',
      'quarts': 'quart',
      'gallons': 'gallon',
      'pieces': 'piece',
      'slices': 'slice',
      'wheels': 'wheel',
      'leaves': 'leaf',
      'sprigs': 'sprig',
      'twists': 'twist'
    };
    
    return singularMap[unit.toLowerCase()] || unit;
  }
  
  /**
   * Gets plural form of unit
   */
  static getPluralUnit(unit: string): string {
    const pluralMap: Record<string, string> = {
      'dash': 'dashes',
      'splash': 'splashes',
      'barspoon': 'barspoons',
      'cup': 'cups',
      'pint': 'pints',
      'quart': 'quarts',
      'gallon': 'gallons',
      'piece': 'pieces',
      'slice': 'slices',
      'wheel': 'wheels',
      'leaf': 'leaves',
      'sprig': 'sprigs',
      'twist': 'twists'
    };
    
    return pluralMap[unit.toLowerCase()] || unit;
  }
  
  /**
   * Generates warnings for scaling edge cases
   */
  static getScalingWarnings(recipe: Cocktail, scaleFactor: number): string[] {
    const warnings: string[] = [];
    
    if (scaleFactor > 10) {
      warnings.push("Large batch scaling - consider technique adjustments for mixing");
    }
    
    if (scaleFactor > 5) {
      warnings.push("Consider using pitcher preparation for large batches");
    }
    
    if (scaleFactor < 0.5) {
      warnings.push("Very small portions may be difficult to measure accurately");
    }
    
    // Check for ingredients that become problematic when scaled
    recipe.ingredients.forEach(ingredient => {
      const parsed = this.parseIngredient(ingredient);
      const newAmount = parsed.amount * scaleFactor;
      
      if (parsed.isScalable && newAmount < 0.0625) { // Less than 1/16 oz
        warnings.push(`${parsed.ingredient} becomes very small - consider adjusting to taste`);
      }
      
      if (parsed.unit.toLowerCase().includes('dash') && newAmount > 8) {
        warnings.push(`${parsed.ingredient} scales to many dashes - consider using teaspoons`);
      }
    });
    
    return warnings;
  }
  
  /**
   * Scales an entire recipe
   */
  static scaleRecipe(recipe: Cocktail, targetServings: number): ScaledRecipe {
    const defaultServings = (recipe as any).default_servings || 1;
    const scaleFactor = targetServings / defaultServings;
    
    const scaledIngredients = recipe.ingredients.map(ingredient => {
      const parsed = this.parseIngredient(ingredient);
      return this.scaleIngredient(parsed, scaleFactor);
    });
    
    const warnings = this.getScalingWarnings(recipe, scaleFactor);
    
    return {
      ...recipe,
      currentServings: targetServings,
      scaledIngredients,
      scalingWarnings: warnings,
      ingredients: scaledIngredients // Update the main ingredients array
    };
  }
  
  /**
   * Gets scaling configuration for a recipe
   */
  static getScalingConfig(recipe: Cocktail): ScalingConfig {
    const defaultServings = (recipe as any).default_servings || 1;
    const minServings = (recipe as any).min_servings || 1;
    const maxServings = (recipe as any).max_servings || 20;
    
    return {
      currentServings: defaultServings,
      defaultServings,
      minServings,
      maxServings
    };
  }
}