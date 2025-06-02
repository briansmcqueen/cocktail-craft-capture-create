
const FAVORITES_KEY = "barbook_favorites";

export function getFavoriteRecipes(): string[] {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function toggleFavorite(recipeId: string): boolean {
  const favorites = getFavoriteRecipes();
  const index = favorites.indexOf(recipeId);
  
  if (index === -1) {
    favorites.push(recipeId);
  } else {
    favorites.splice(index, 1);
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index === -1; // Return true if added, false if removed
}

export function isFavorite(recipeId: string): boolean {
  const favorites = getFavoriteRecipes();
  return favorites.includes(recipeId);
}

// Re-export from likes utility for convenience
export { isLiked } from "./likes";
