// Unit conversion utilities for recipe scaling

export interface UnitConversion {
  unit: string;
  toOz: number; // conversion factor to ounces
  category: 'volume' | 'weight' | 'count';
  displayName: string;
}

// Standard unit conversions
export const UNIT_CONVERSIONS: Record<string, UnitConversion> = {
  // Volume - Imperial
  'oz': { unit: 'oz', toOz: 1, category: 'volume', displayName: 'oz' },
  'ounce': { unit: 'oz', toOz: 1, category: 'volume', displayName: 'oz' },
  'ounces': { unit: 'oz', toOz: 1, category: 'volume', displayName: 'oz' },
  'cup': { unit: 'cup', toOz: 8, category: 'volume', displayName: 'cup' },
  'cups': { unit: 'cup', toOz: 8, category: 'volume', displayName: 'cups' },
  'pint': { unit: 'pint', toOz: 16, category: 'volume', displayName: 'pint' },
  'pints': { unit: 'pint', toOz: 16, category: 'volume', displayName: 'pints' },
  'quart': { unit: 'quart', toOz: 32, category: 'volume', displayName: 'quart' },
  'quarts': { unit: 'quart', toOz: 32, category: 'volume', displayName: 'quarts' },
  'gallon': { unit: 'gallon', toOz: 128, category: 'volume', displayName: 'gallon' },
  'gallons': { unit: 'gallon', toOz: 128, category: 'volume', displayName: 'gallons' },
  
  // Volume - Metric
  'ml': { unit: 'ml', toOz: 0.033814, category: 'volume', displayName: 'ml' },
  'milliliter': { unit: 'ml', toOz: 0.033814, category: 'volume', displayName: 'ml' },
  'milliliters': { unit: 'ml', toOz: 0.033814, category: 'volume', displayName: 'ml' },
  'cl': { unit: 'cl', toOz: 0.33814, category: 'volume', displayName: 'cl' },
  'centiliter': { unit: 'cl', toOz: 0.33814, category: 'volume', displayName: 'cl' },
  'centiliters': { unit: 'cl', toOz: 0.33814, category: 'volume', displayName: 'cl' },
  'l': { unit: 'l', toOz: 33.814, category: 'volume', displayName: 'L' },
  'liter': { unit: 'l', toOz: 33.814, category: 'volume', displayName: 'L' },
  'liters': { unit: 'l', toOz: 33.814, category: 'volume', displayName: 'L' },
  
  // Special cocktail measurements
  'dash': { unit: 'dash', toOz: 0.03125, category: 'volume', displayName: 'dash' },
  'dashes': { unit: 'dash', toOz: 0.03125, category: 'volume', displayName: 'dashes' },
  'splash': { unit: 'splash', toOz: 0.125, category: 'volume', displayName: 'splash' },
  'splashes': { unit: 'splash', toOz: 0.125, category: 'volume', displayName: 'splashes' },
  'barspoon': { unit: 'barspoon', toOz: 0.125, category: 'volume', displayName: 'barspoon' },
  'barspoons': { unit: 'barspoon', toOz: 0.125, category: 'volume', displayName: 'barspoons' },
  'tsp': { unit: 'tsp', toOz: 0.1667, category: 'volume', displayName: 'tsp' },
  'teaspoon': { unit: 'tsp', toOz: 0.1667, category: 'volume', displayName: 'tsp' },
  'teaspoons': { unit: 'tsp', toOz: 0.1667, category: 'volume', displayName: 'tsp' },
  'tbsp': { unit: 'tbsp', toOz: 0.5, category: 'volume', displayName: 'tbsp' },
  'tablespoon': { unit: 'tbsp', toOz: 0.5, category: 'volume', displayName: 'tbsp' },
  'tablespoons': { unit: 'tbsp', toOz: 0.5, category: 'volume', displayName: 'tbsp' },
  
  // Count items
  'piece': { unit: 'piece', toOz: 1, category: 'count', displayName: 'piece' },
  'pieces': { unit: 'piece', toOz: 1, category: 'count', displayName: 'pieces' },
  'slice': { unit: 'slice', toOz: 1, category: 'count', displayName: 'slice' },
  'slices': { unit: 'slice', toOz: 1, category: 'count', displayName: 'slices' },
  'leaf': { unit: 'leaf', toOz: 1, category: 'count', displayName: 'leaf' },
  'leaves': { unit: 'leaf', toOz: 1, category: 'count', displayName: 'leaves' },
  'sprig': { unit: 'sprig', toOz: 1, category: 'count', displayName: 'sprig' },
  'sprigs': { unit: 'sprig', toOz: 1, category: 'count', displayName: 'sprigs' },
  'wheel': { unit: 'wheel', toOz: 1, category: 'count', displayName: 'wheel' },
  'wheels': { unit: 'wheel', toOz: 1, category: 'count', displayName: 'wheels' },
  'twist': { unit: 'twist', toOz: 1, category: 'count', displayName: 'twist' },
  'twists': { unit: 'twist', toOz: 1, category: 'count', displayName: 'twists' },
};

// Fraction handling
export const FRACTIONS: Record<string, number> = {
  '1/8': 0.125,
  '1/6': 0.1667,
  '1/4': 0.25,
  '1/3': 0.3333,
  '3/8': 0.375,
  '1/2': 0.5,
  '5/8': 0.625,
  '2/3': 0.6667,
  '3/4': 0.75,
  '7/8': 0.875,
};

export const REVERSE_FRACTIONS: Record<number, string> = {
  0.125: '1/8',
  0.1667: '1/6',
  0.25: '1/4',
  0.3333: '1/3',
  0.375: '3/8',
  0.5: '1/2',
  0.625: '5/8',
  0.6667: '2/3',
  0.75: '3/4',
  0.875: '7/8',
};

/**
 * Converts a decimal to the nearest practical fraction
 */
export function decimalToFraction(decimal: number): string {
  const wholePart = Math.floor(decimal);
  const fractionalPart = decimal - wholePart;
  
  if (fractionalPart < 0.0625) {
    return wholePart.toString();
  }
  
  // Find the closest fraction
  let closestFraction = '';
  let closestDiff = Infinity;
  
  Object.entries(REVERSE_FRACTIONS).forEach(([decimalVal, fraction]) => {
    const diff = Math.abs(fractionalPart - parseFloat(decimalVal));
    if (diff < closestDiff) {
      closestDiff = diff;
      closestFraction = fraction;
    }
  });
  
  if (wholePart > 0) {
    return `${wholePart} ${closestFraction}`;
  }
  
  return closestFraction;
}

/**
 * Converts fractions in text to decimal
 */
export function fractionToDecimal(text: string): number {
  const fractionMatch = text.match(/(\d+\/\d+)/);
  if (fractionMatch) {
    const [numerator, denominator] = fractionMatch[1].split('/').map(Number);
    return numerator / denominator;
  }
  
  // Check for mixed numbers like "1 1/2"
  const mixedMatch = text.match(/(\d+)\s+(\d+\/\d+)/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const [numerator, denominator] = mixedMatch[2].split('/').map(Number);
    return whole + (numerator / denominator);
  }
  
  return parseFloat(text) || 0;
}

/**
 * Suggests a better unit for large scaled amounts
 */
export function suggestBetterUnit(amount: number, currentUnit: string): { amount: number; unit: string } {
  const conversion = UNIT_CONVERSIONS[currentUnit.toLowerCase()];
  if (!conversion || conversion.category !== 'volume') {
    return { amount, unit: currentUnit };
  }
  
  const totalOz = amount * conversion.toOz;
  
  // Convert to more appropriate units for large amounts
  if (totalOz >= 128) { // 1 gallon or more
    return { amount: totalOz / 128, unit: 'gallon' };
  } else if (totalOz >= 32) { // 1 quart or more
    return { amount: totalOz / 32, unit: 'quart' };
  } else if (totalOz >= 16) { // 1 pint or more
    return { amount: totalOz / 16, unit: 'pint' };
  } else if (totalOz >= 8) { // 1 cup or more
    return { amount: totalOz / 8, unit: 'cup' };
  }
  
  return { amount, unit: currentUnit };
}

/**
 * Formats an amount with appropriate precision
 */
export function formatAmount(amount: number): string {
  if (amount >= 10) {
    return Math.round(amount).toString();
  } else if (amount >= 1) {
    return amount.toFixed(1).replace(/\.0$/, '');
  } else {
    // Try to convert to fraction for small amounts
    const fraction = decimalToFraction(amount);
    if (fraction.includes('/')) {
      return fraction;
    }
    return amount.toFixed(2).replace(/\.?0+$/, '');
  }
}