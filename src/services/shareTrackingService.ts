import { supabase } from "@/integrations/supabase/client";

export type SharePlatform = 
  | 'native' 
  | 'copy_link' 
  | 'whatsapp' 
  | 'x' 
  | 'facebook' 
  | 'pinterest' 
  | 'tiktok' 
  | 'instagram';

export interface ShareStats {
  totalShares: number;
  platformBreakdown: Record<SharePlatform, number>;
  recentShares: number;
}

/**
 * Track a recipe share event
 */
export async function trackShare(
  recipeId: string,
  platform: SharePlatform,
  userId?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('recipe_shares')
      .insert({
        recipe_id: recipeId,
        platform,
        user_id: userId || null,
      });

    if (error) {
      console.error('Error tracking share:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error tracking share:', error);
    return false;
  }
}

/**
 * Get share statistics for a recipe
 */
export async function getRecipeShareStats(recipeId: string): Promise<ShareStats | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_recipe_share_stats', { p_recipe_id: recipeId });

    if (error) {
      console.error('Error fetching share stats:', error);
      return null;
    }

    return data as unknown as ShareStats;
  } catch (error) {
    console.error('Error fetching share stats:', error);
    return null;
  }
}

/**
 * Get share counts for multiple recipes (batch)
 */
export async function getBatchRecipeShareCounts(
  recipeIds: string[]
): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from('recipe_shares')
      .select('recipe_id')
      .in('recipe_id', recipeIds);

    if (error) {
      console.error('Error fetching batch share counts:', error);
      return {};
    }

    // Count shares per recipe
    const counts: Record<string, number> = {};
    data?.forEach((share) => {
      counts[share.recipe_id] = (counts[share.recipe_id] || 0) + 1;
    });

    return counts;
  } catch (error) {
    console.error('Error fetching batch share counts:', error);
    return {};
  }
}
