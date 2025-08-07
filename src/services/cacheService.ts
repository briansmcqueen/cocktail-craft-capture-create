// High-performance caching service for recipes and ratings
import { Cocktail } from "@/data/classicCocktails";
import { AggregatedRating } from "@/services/ratingsService";

// Memory cache for fast access
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const RATING_CACHE_TTL = 2 * 60 * 1000; // 2 minutes for ratings

// Batch operations cache
const batchCache = new Map<string, Promise<any>>();

export class CacheService {
  // Memory cache operations
  static set(key: string, data: any, ttl: number = MEMORY_CACHE_TTL): void {
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get<T>(key: string): T | null {
    const cached = memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      memoryCache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  static delete(key: string): void {
    memoryCache.delete(key);
  }

  static clear(): void {
    memoryCache.clear();
    batchCache.clear();
  }

  // Batch operation management
  static setBatchPromise(key: string, promise: Promise<any>): void {
    batchCache.set(key, promise);
    // Auto-cleanup after promise resolves
    promise.finally(() => {
      batchCache.delete(key);
    });
  }

  static getBatchPromise<T>(key: string): Promise<T> | null {
    return batchCache.get(key) as Promise<T> || null;
  }

  // Recipe cache operations
  static setRecipes(recipes: Cocktail[]): void {
    this.set('user_recipes', recipes);
    // Cache individual recipes too
    recipes.forEach(recipe => {
      this.set(`recipe_${recipe.id}`, recipe);
    });
  }

  static getRecipes(): Cocktail[] | null {
    return this.get<Cocktail[]>('user_recipes');
  }

  static setRecipe(recipe: Cocktail): void {
    this.set(`recipe_${recipe.id}`, recipe);
    // Update recipes array cache if it exists
    const recipes = this.getRecipes();
    if (recipes) {
      const updated = recipes.map(r => r.id === recipe.id ? recipe : r);
      if (!updated.find(r => r.id === recipe.id)) {
        updated.push(recipe);
      }
      this.setRecipes(updated);
    }
  }

  static getRecipe(id: string): Cocktail | null {
    return this.get<Cocktail>(`recipe_${id}`);
  }

  static deleteRecipe(id: string): void {
    this.delete(`recipe_${id}`);
    this.delete(`rating_${id}`);
    // Update recipes array cache
    const recipes = this.getRecipes();
    if (recipes) {
      this.setRecipes(recipes.filter(r => r.id !== id));
    }
  }

  // Rating cache operations
  static setRating(recipeId: string, rating: AggregatedRating): void {
    this.set(`rating_${recipeId}`, rating, RATING_CACHE_TTL);
  }

  static getRating(recipeId: string): AggregatedRating | null {
    return this.get<AggregatedRating>(`rating_${recipeId}`);
  }

  static setBatchRatings(ratings: Record<string, AggregatedRating>): void {
    Object.entries(ratings).forEach(([recipeId, rating]) => {
      this.setRating(recipeId, rating);
    });
  }

  // LocalStorage operations with error handling and compression
  static async setLocalStorage(key: string, data: any): Promise<void> {
    try {
      const jsonString = JSON.stringify(data);
      // Use requestIdleCallback for non-blocking storage operations
      if ('requestIdleCallback' in window) {
        return new Promise(resolve => {
          requestIdleCallback(() => {
            localStorage.setItem(key, jsonString);
            resolve();
          });
        });
      } else {
        localStorage.setItem(key, jsonString);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // Clear some cache if storage is full
      this.clearOldCache();
    }
  }

  static getLocalStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      localStorage.removeItem(key); // Remove corrupted data
      return null;
    }
  }

  // Cache maintenance
  static clearOldCache(): void {
    const now = Date.now();
    for (const [key, cached] of memoryCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        memoryCache.delete(key);
      }
    }
  }

  // Performance metrics
  static getCacheStats(): { memorySize: number; batchSize: number } {
    return {
      memorySize: memoryCache.size,
      batchSize: batchCache.size
    };
  }
}

// Auto-cleanup interval
setInterval(() => {
  CacheService.clearOldCache();
}, 60000); // Clean every minute