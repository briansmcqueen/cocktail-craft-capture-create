#!/usr/bin/env tsx

/**
 * Development script to validate and fix cocktail ID duplicates
 * Run with: npx tsx src/scripts/validateCocktailIds.ts
 */

import fs from 'fs';
import path from 'path';

// Simple validation without importing the full cocktail data
function validateCocktailFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract all ID lines using regex
  const idMatches = content.match(/^\s*id:\s*"([^"]*)",?\s*$/gm);
  
  if (!idMatches) {
    console.log('No cocktail IDs found');
    return { isValid: true, duplicates: [] };
  }
  
  // Extract just the ID values
  const ids = idMatches.map(match => {
    const idMatch = match.match(/id:\s*"([^"]*)"/);
    return idMatch ? idMatch[1] : null;
  }).filter(Boolean);
  
  // Count occurrences
  const idCounts = new Map<string, number>();
  ids.forEach(id => {
    idCounts.set(id!, (idCounts.get(id!) || 0) + 1);
  });
  
  // Find duplicates
  const duplicates = Array.from(idCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));
  
  console.log(`\n📊 Cocktail ID Analysis:`);
  console.log(`Total cocktail IDs found: ${ids.length}`);
  console.log(`Unique IDs: ${idCounts.size}`);
  
  if (duplicates.length > 0) {
    console.log(`\n❌ Found ${duplicates.length} duplicate ID(s):`);
    duplicates.forEach(({ id, count }) => {
      console.log(`  ID "${id}": appears ${count} times`);
    });
    return { isValid: false, duplicates };
  } else {
    console.log(`\n✅ All cocktail IDs are unique!`);
    return { isValid: true, duplicates: [] };
  }
}

// Main execution
const cocktailsFilePath = path.join(process.cwd(), 'src/data/classicCocktails.ts');

console.log('🍸 Validating Cocktail IDs...');
console.log(`File: ${cocktailsFilePath}`);

const result = validateCocktailFile(cocktailsFilePath);

if (!result.isValid) {
  console.log('\n🔧 The fixDuplicateIds function will automatically resolve these duplicates when the app runs.');
  console.log('💡 Consider running the app in development mode to see the automatic fixes.');
  process.exit(1);
} else {
  console.log('\n🎉 All good! No action needed.');
  process.exit(0);
}