import { supabase } from "@/integrations/supabase/client";

export interface RecipeNotification {
  id: string;
  recipe_id: string;
  recipe_author_id: string;
  recipe_name: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialNotification {
  id: string;
  user_id: string;
  actor_id: string;
  notification_type: 'like' | 'comment' | 'follow';
  recipe_id?: string;
  comment_id?: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    id: string;
    username: string | null;
    full_name?: string | null;
    avatar_url: string | null;
  };
  recipe?: {
    name: string;
  };
}

export type Notification = (RecipeNotification & { type: 'recipe' }) | (SocialNotification & { type: 'social' });

export const notificationsService = {
  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 0;

    // Count unread recipe notifications
    const { count: recipeCount, error: recipeError } = await supabase
      .from('recipe_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (recipeError) {
      console.error('Error fetching recipe unread count:', recipeError);
    }

    // Count unread social notifications
    const { count: socialCount, error: socialError } = await supabase
      .from('social_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (socialError) {
      console.error('Error fetching social unread count:', socialError);
    }

    return (recipeCount || 0) + (socialCount || 0);
  },

  async getNotifications(limit: number = 20): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    // Fetch recipe notifications
    const { data: recipeNotifs, error: recipeError } = await supabase
      .from('recipe_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (recipeError) {
      console.error('Error fetching recipe notifications:', recipeError);
    }

    // Fetch social notifications with actor profile and recipe name
    const { data: socialNotifs, error: socialError } = await supabase
      .from('social_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (socialError) {
      console.error('Error fetching social notifications:', socialError);
    }

    // Get actor profiles for social notifications
    let enrichedSocialNotifs: SocialNotification[] = [];
    if (socialNotifs && socialNotifs.length > 0) {
      const actorIds = Array.from(new Set(socialNotifs.map(n => n.actor_id)));
      const { data: profiles } = await supabase.rpc('get_public_profiles', { user_ids: actorIds as any });
      
      const profilesMap = new Map();
      (profiles || []).forEach((p: any) => profilesMap.set(p.id, p));

      // Get recipe names for notifications that have recipe_id
      const recipeIds = socialNotifs.filter(n => n.recipe_id).map(n => n.recipe_id!);
      const recipesMap = new Map();
      if (recipeIds.length > 0) {
        const { data: recipes } = await supabase
          .from('recipes')
          .select('id, name')
          .in('id', recipeIds);
        (recipes || []).forEach((r: any) => recipesMap.set(r.id, r));
      }

      enrichedSocialNotifs = socialNotifs.map(n => ({
        ...n,
        notification_type: n.notification_type as 'like' | 'comment' | 'follow',
        actor: profilesMap.get(n.actor_id),
        recipe: n.recipe_id ? recipesMap.get(n.recipe_id) : undefined
      }));
    }

    // Combine and sort by created_at
    const combined: Notification[] = [
      ...(recipeNotifs || []).map(n => ({ ...n, type: 'recipe' as const })),
      ...enrichedSocialNotifs.map(n => ({ ...n, type: 'social' as const }))
    ];

    return combined.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
  },

  async markAsRead(notificationId: string, type: 'recipe' | 'social' = 'recipe'): Promise<boolean> {
    const table = type === 'recipe' ? 'recipe_notifications' : 'social_notifications';
    
    const { error } = await supabase
      .from(table)
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    // Mark all recipe notifications as read
    const { error: recipeError } = await supabase
      .from('recipe_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (recipeError) {
      console.error('Error marking recipe notifications as read:', recipeError);
    }

    // Mark all social notifications as read
    const { error: socialError } = await supabase
      .from('social_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (socialError) {
      console.error('Error marking social notifications as read:', socialError);
    }

    return !recipeError && !socialError;
  },

  async deleteNotification(notificationId: string, type: 'recipe' | 'social' = 'recipe'): Promise<boolean> {
    const table = type === 'recipe' ? 'recipe_notifications' : 'social_notifications';
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }

    return true;
  },

  // Subscribe to real-time notifications with unique channel per subscriber
  subscribeToNotifications(callback: (notification: Notification) => void) {
    // Create a unique channel name to avoid multiple subscription errors
    const channelName = `notifications-${Math.random().toString(36).substring(7)}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recipe_notifications'
        },
        (payload) => {
          callback({ ...payload.new, type: 'recipe' } as Notification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'social_notifications'
        },
        async (payload) => {
          const notification = payload.new as SocialNotification;
          
          // Enrich with actor profile
          const { data: profiles } = await supabase.rpc('get_public_profiles', { 
            user_ids: [notification.actor_id] as any 
          });
          
          if (profiles && profiles.length > 0) {
            notification.actor = profiles[0] as any;
          }

          // Enrich with recipe name if applicable
          if (notification.recipe_id) {
            const { data: recipe } = await supabase
              .from('recipes')
              .select('name')
              .eq('id', notification.recipe_id)
              .single();
            
            if (recipe) {
              notification.recipe = recipe;
            }
          }
          
          callback({ ...notification, type: 'social' } as Notification);
        }
      )
      .subscribe();

    return channel;
  }
};
