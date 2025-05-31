
const LIKES_KEY = "barbook_likes";

export interface RecipeLikes {
  [recipeId: string]: {
    count: number;
    timestamps: number[];
  };
}

export function getRecipeLikes(): RecipeLikes {
  const data = localStorage.getItem(LIKES_KEY);
  return data ? JSON.parse(data) : {};
}

export function getLikeCount(recipeId: string): number {
  const likes = getRecipeLikes();
  return likes[recipeId]?.count || 0;
}

export function addLike(recipeId: string): number {
  const likes = getRecipeLikes();
  const now = Date.now();
  
  if (!likes[recipeId]) {
    likes[recipeId] = { count: 0, timestamps: [] };
  }
  
  likes[recipeId].count += 1;
  likes[recipeId].timestamps.push(now);
  
  localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  return likes[recipeId].count;
}

export function getTrendingRecipes(allRecipes: any[]): any[] {
  const likes = getRecipeLikes();
  const now = Date.now();
  const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
  
  // Calculate recent likes for each recipe
  const recentLikes: { [recipeId: string]: number } = {};
  
  Object.entries(likes).forEach(([recipeId, data]) => {
    const recentTimestamps = data.timestamps.filter(timestamp => timestamp > fortyEightHoursAgo);
    if (recentTimestamps.length > 0) {
      recentLikes[recipeId] = recentTimestamps.length;
    }
  });
  
  // Sort recipes by recent likes
  return allRecipes
    .map(recipe => ({
      ...recipe,
      recentLikes: recentLikes[recipe.id] || 0
    }))
    .sort((a, b) => b.recentLikes - a.recentLikes)
    .slice(0, 6);
}
