import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  type: 'recipe' | 'comment' | 'like' | 'follow';
  timestamp: string;
  recipe_id?: string;
  recipe_name?: string;
  recipe_image?: string;
  comment_content?: string;
  followed_user_id?: string;
  followed_username?: string;
  followed_user_avatar?: string;
}

export async function getUserActivity(userId: string, limit: number = 20): Promise<ActivityItem[]> {
  try {
    const activities: ActivityItem[] = [];

    // Fetch recent recipes
    const { data: recipes } = await supabase
      .from('recipes')
      .select('id, name, created_at, image_url')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (recipes) {
      activities.push(...recipes.map(r => ({
        id: `recipe-${r.id}`,
        type: 'recipe' as const,
        timestamp: r.created_at,
        recipe_id: r.id,
        recipe_name: r.name,
        recipe_image: r.image_url || undefined
      })));
    }

    // Fetch recent comments
    const { data: comments } = await supabase
      .from('recipe_comments')
      .select('id, content, created_at, recipe_id, recipes!inner(name, is_public, image_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (comments) {
      activities.push(...comments
        .filter(c => (c as any).recipes?.is_public)
        .map(c => ({
          id: `comment-${c.id}`,
          type: 'comment' as const,
          timestamp: c.created_at,
          recipe_id: c.recipe_id,
          recipe_name: (c as any).recipes?.name,
          recipe_image: (c as any).recipes?.image_url || undefined,
          comment_content: c.content
        })));
    }

    // Fetch recent likes
    const { data: likes } = await supabase
      .from('likes')
      .select('id, created_at, recipe_id, recipes!inner(name, is_public, image_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (likes) {
      activities.push(...likes
        .filter(l => (l as any).recipes?.is_public)
        .map(l => ({
          id: `like-${l.id}`,
          type: 'like' as const,
          timestamp: l.created_at || new Date().toISOString(),
          recipe_id: l.recipe_id,
          recipe_name: (l as any).recipes?.name,
          recipe_image: (l as any).recipes?.image_url || undefined
        })));
    }

    // Fetch recent follows
    const { data: follows } = await supabase
      .from('follows')
      .select('id, created_at, following_id')
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (follows) {
      const followingIds = follows.map(f => f.following_id);
      const { data: profiles } = await supabase
        .rpc('get_public_profiles', { user_ids: followingIds as any });

      activities.push(...follows.map(f => {
        const profile = (profiles as any[] || []).find((p: any) => p.id === f.following_id);
        return {
          id: `follow-${f.id}`,
          type: 'follow' as const,
          timestamp: f.created_at,
          followed_user_id: f.following_id,
          followed_username: profile?.username || 'User',
          followed_user_avatar: profile?.avatar_url || undefined
        };
      }));
    }

    // Sort all activities by timestamp
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }
}
