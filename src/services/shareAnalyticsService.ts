import { supabase } from "@/integrations/supabase/client";

export interface TopSharedRecipe {
  recipe_id: string;
  recipe_name: string;
  total_shares: number;
  recent_shares: number;
}

export interface PlatformStats {
  platform: string;
  share_count: number;
  percentage: number;
}

export interface ShareVelocity {
  date: string;
  share_count: number;
}

export interface TimeRangeStats {
  total_shares: number;
  unique_users: number;
  unique_recipes: number;
  average_shares_per_recipe: number;
}

/**
 * Get top shared recipes
 */
export async function getTopSharedRecipes(limit: number = 10): Promise<TopSharedRecipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipe_shares')
      .select('recipe_id')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Count shares per recipe
    const recipeShareCounts: Record<string, { total: number; recent: number }> = {};
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    data?.forEach((share: any) => {
      const recipeId = share.recipe_id;
      if (!recipeShareCounts[recipeId]) {
        recipeShareCounts[recipeId] = { total: 0, recent: 0 };
      }
      recipeShareCounts[recipeId].total++;
      
      const shareDate = new Date(share.created_at);
      if (shareDate >= sevenDaysAgo) {
        recipeShareCounts[recipeId].recent++;
      }
    });

    // Sort by total shares and take top N
    const topRecipes = Object.entries(recipeShareCounts)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, limit)
      .map(([recipe_id, counts]) => ({
        recipe_id,
        recipe_name: recipe_id, // Will need to join with recipes to get names
        total_shares: counts.total,
        recent_shares: counts.recent,
      }));

    return topRecipes;
  } catch (error) {
    console.error('Error fetching top shared recipes:', error);
    return [];
  }
}

/**
 * Get platform distribution statistics
 */
export async function getPlatformStats(): Promise<PlatformStats[]> {
  try {
    const { data, error } = await supabase
      .from('recipe_shares')
      .select('platform');

    if (error) throw error;

    // Count shares per platform
    const platformCounts: Record<string, number> = {};
    let totalShares = 0;

    data?.forEach((share: any) => {
      const platform = share.platform;
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      totalShares++;
    });

    // Convert to array with percentages
    const stats: PlatformStats[] = Object.entries(platformCounts)
      .map(([platform, count]) => ({
        platform,
        share_count: count,
        percentage: (count / totalShares) * 100,
      }))
      .sort((a, b) => b.share_count - a.share_count);

    return stats;
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return [];
  }
}

/**
 * Get share velocity over time (daily for last 30 days)
 */
export async function getShareVelocity(days: number = 30): Promise<ShareVelocity[]> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('recipe_shares')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date
    const dailyCounts: Record<string, number> = {};
    
    data?.forEach((share: any) => {
      const date = new Date(share.created_at).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Fill in missing dates with 0 counts
    const velocity: ShareVelocity[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      velocity.push({
        date,
        share_count: dailyCounts[date] || 0,
      });
    }

    return velocity;
  } catch (error) {
    console.error('Error fetching share velocity:', error);
    return [];
  }
}

/**
 * Get overall statistics for a time range
 */
export async function getTimeRangeStats(days: number = 30): Promise<TimeRangeStats> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('recipe_shares')
      .select('recipe_id, user_id')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const uniqueUsers = new Set<string>();
    const uniqueRecipes = new Set<string>();

    data?.forEach((share: any) => {
      if (share.user_id) uniqueUsers.add(share.user_id);
      uniqueRecipes.add(share.recipe_id);
    });

    const totalShares = data?.length || 0;
    const averageSharesPerRecipe = uniqueRecipes.size > 0 
      ? totalShares / uniqueRecipes.size 
      : 0;

    return {
      total_shares: totalShares,
      unique_users: uniqueUsers.size,
      unique_recipes: uniqueRecipes.size,
      average_shares_per_recipe: Number(averageSharesPerRecipe.toFixed(2)),
    };
  } catch (error) {
    console.error('Error fetching time range stats:', error);
    return {
      total_shares: 0,
      unique_users: 0,
      unique_recipes: 0,
      average_shares_per_recipe: 0,
    };
  }
}

/**
 * Get hourly distribution (peak sharing times)
 */
export async function getHourlyDistribution(): Promise<{ hour: number; share_count: number }[]> {
  try {
    const { data, error } = await supabase
      .from('recipe_shares')
      .select('created_at');

    if (error) throw error;

    // Count shares per hour
    const hourlyCounts: Record<number, number> = {};
    
    data?.forEach((share: any) => {
      const hour = new Date(share.created_at).getHours();
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    });

    // Convert to array
    const distribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      share_count: hourlyCounts[hour] || 0,
    }));

    return distribution;
  } catch (error) {
    console.error('Error fetching hourly distribution:', error);
    return [];
  }
}
