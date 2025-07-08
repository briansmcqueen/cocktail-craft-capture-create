import { Cocktail } from "@/data/classicCocktails";

/**
 * Validates that all cocktail IDs are unique
 */
export function validateUniqueIds(cocktails: Cocktail[]): {
  isValid: boolean;
  duplicates: { id: string; cocktails: string[] }[];
  errors: string[];
} {
  const idMap = new Map<string, string[]>();
  const errors: string[] = [];
  
  // Group cocktails by ID
  cocktails.forEach(cocktail => {
    if (!idMap.has(cocktail.id)) {
      idMap.set(cocktail.id, []);
    }
    idMap.get(cocktail.id)!.push(cocktail.name);
  });
  
  // Find duplicates
  const duplicates = Array.from(idMap.entries())
    .filter(([_, names]) => names.length > 1)
    .map(([id, names]) => ({ id, cocktails: names }));
  
  if (duplicates.length > 0) {
    errors.push(`Found ${duplicates.length} duplicate ID(s):`);
    duplicates.forEach(({ id, cocktails }) => {
      errors.push(`  ID "${id}": ${cocktails.join(', ')}`);
    });
  }
  
  return {
    isValid: duplicates.length === 0,
    duplicates,
    errors
  };
}

/**
 * Generates a unique ID based on the cocktail name
 */
export function generateUniqueId(cocktails: Cocktail[], cocktailName: string): string {
  const usedIds = new Set(cocktails.map(c => c.id));
  
  // Try simple incrementing numbers first
  let counter = 1;
  while (usedIds.has(counter.toString())) {
    counter++;
  }
  
  return counter.toString();
}

/**
 * Fixes duplicate IDs by reassigning them sequentially
 */
export function fixDuplicateIds(cocktails: Cocktail[]): Cocktail[] {
  const usedIds = new Set<string>();
  let nextId = 1;
  
  return cocktails.map(cocktail => {
    if (usedIds.has(cocktail.id)) {
      // Find next available ID
      while (usedIds.has(nextId.toString())) {
        nextId++;
      }
      const newId = nextId.toString();
      usedIds.add(newId);
      nextId++;
      
      console.warn(`Duplicate ID "${cocktail.id}" found for "${cocktail.name}", reassigned to "${newId}"`);
      return { ...cocktail, id: newId };
    } else {
      usedIds.add(cocktail.id);
      // Update nextId to be higher than current max
      const currentId = parseInt(cocktail.id);
      if (!isNaN(currentId) && currentId >= nextId) {
        nextId = currentId + 1;
      }
      return cocktail;
    }
  });
}