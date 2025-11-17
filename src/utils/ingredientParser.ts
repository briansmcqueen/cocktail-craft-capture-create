/**
 * Ingredient measurement parser and normalizer
 * Handles common cocktail measurements and formats them consistently
 */

// Common measurement units (case-insensitive)
const UNITS = {
  // Volume - Metric
  ml: ['ml', 'mls', 'milliliter', 'milliliters', 'millilitre', 'millilitres'],
  cl: ['cl', 'cls', 'centiliter', 'centiliters', 'centilitre', 'centilitres'],
  l: ['l', 'liter', 'liters', 'litre', 'litres'],
  
  // Volume - Imperial
  oz: ['oz', 'ozs', 'ounce', 'ounces', 'fl oz', 'fluid ounce', 'fluid ounces'],
  cup: ['cup', 'cups', 'c'],
  tbsp: ['tbsp', 'tablespoon', 'tablespoons', 'tbs', 'T'],
  tsp: ['tsp', 'teaspoon', 'teaspoons', 'ts', 't'],
  
  // Bartending specific
  dash: ['dash', 'dashes'],
  drop: ['drop', 'drops', 'drp'],
  splash: ['splash', 'splashes'],
  barspoon: ['barspoon', 'barspoons', 'bar spoon', 'bar spoons', 'bsp'],
  
  // Parts (for ratios)
  part: ['part', 'parts', 'pt', 'pts'],
  
  // Other
  piece: ['piece', 'pieces', 'pc', 'pcs'],
  leaf: ['leaf', 'leaves'],
  sprig: ['sprig', 'sprigs'],
  slice: ['slice', 'slices'],
  wedge: ['wedge', 'wedges'],
  wheel: ['wheel', 'wheels'],
  twist: ['twist', 'twists'],
};

// Normalize unit to standard form
function normalizeUnit(unit: string): string {
  const lowerUnit = unit.toLowerCase().trim();
  
  for (const [standard, variations] of Object.entries(UNITS)) {
    if (variations.includes(lowerUnit)) {
      return standard;
    }
  }
  
  return unit;
}

// Convert common fractions to unicode or decimal
function formatFraction(fraction: string): string {
  const fractionMap: { [key: string]: string } = {
    '1/4': '¼',
    '1/2': '½',
    '3/4': '¾',
    '1/3': '⅓',
    '2/3': '⅔',
    '1/8': '⅛',
    '3/8': '⅜',
    '5/8': '⅝',
    '7/8': '⅞',
  };
  
  return fractionMap[fraction] || fraction;
}

// Parse a quantity (handles numbers, fractions, and ranges)
function parseQuantity(quantity: string): string {
  // Handle ranges (1-2, 1/2-3/4)
  if (quantity.includes('-')) {
    const parts = quantity.split('-').map(p => p.trim());
    return parts.map(p => parseQuantity(p)).join('-');
  }
  
  // Handle mixed numbers (1 1/2, 2 3/4)
  const mixedMatch = quantity.match(/^(\d+)\s+(\d+\/\d+)$/);
  if (mixedMatch) {
    const [, whole, fraction] = mixedMatch;
    return `${whole} ${formatFraction(fraction)}`;
  }
  
  // Handle simple fractions
  const fractionMatch = quantity.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    return formatFraction(quantity);
  }
  
  // Handle decimals
  const decimal = parseFloat(quantity);
  if (!isNaN(decimal)) {
    return decimal % 1 === 0 ? decimal.toString() : decimal.toFixed(1);
  }
  
  return quantity;
}

/**
 * Parse and normalize an ingredient line
 * Examples:
 *   "2oz vodka" -> "2 oz Vodka"
 *   "1/2cup lime juice" -> "½ cup Lime juice"
 *   "3 dashes bitters" -> "3 dashes Bitters"
 */
export function parseIngredientLine(line: string): string {
  if (!line || !line.trim()) return line;
  
  const trimmed = line.trim();
  
  // Pattern to match: [quantity] [unit] [ingredient name]
  // Handles: "2oz vodka", "1/2 cup lime", "2 oz vodka", "1 1/2 cups sugar"
  const pattern = /^([0-9.\/\s-]+)\s*([a-zA-Z]+)\s+(.+)$/;
  const match = trimmed.match(pattern);
  
  if (match) {
    const [, rawQuantity, rawUnit, ingredientName] = match;
    
    const quantity = parseQuantity(rawQuantity.trim());
    const unit = normalizeUnit(rawUnit.trim());
    const ingredient = ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1);
    
    return `${quantity} ${unit} ${ingredient}`;
  }
  
  // Pattern without quantity: "[unit] [ingredient]" (e.g., "dash bitters")
  const unitOnlyPattern = /^([a-zA-Z]+)\s+(.+)$/;
  const unitMatch = trimmed.match(unitOnlyPattern);
  
  if (unitMatch) {
    const [, rawUnit, ingredientName] = unitMatch;
    const normalized = normalizeUnit(rawUnit.trim());
    
    // Only apply if it's actually a recognized unit
    if (normalized !== rawUnit.toLowerCase().trim()) {
      const ingredient = ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1);
      return `${normalized} ${ingredient}`;
    }
  }
  
  // Capitalize first letter if no match
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Parse multiple ingredient lines
 */
export function parseIngredientList(ingredients: string): string {
  return ingredients
    .split('\n')
    .map(line => parseIngredientLine(line))
    .join('\n');
}
