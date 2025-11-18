import { supabase } from "@/integrations/supabase/client";

export interface RecipeNotification {
  id: string;
  recipe_id: string;
  recipe_author_id: string;
  recipe_name: string;
  is_read: boolean;
  created_at: string;
}

export const notificationsService = {
  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return 0;

    const { count, error } = await supabase
      .from('recipe_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }

    return count || 0;
  },

  async getNotifications(limit: number = 20): Promise<RecipeNotification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('recipe_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('recipe_notifications')
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

    const { error } = await supabase
      .from('recipe_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }

    return true;
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('recipe_notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }

    return true;
  },

  // Subscribe to real-time notifications with unique channel per subscriber
  subscribeToNotifications(callback: (notification: RecipeNotification) => void) {
    // Create a unique channel name to avoid multiple subscription errors
    const channelName = `recipe-notifications-${Math.random().toString(36).substring(7)}`;
    
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
          callback(payload.new as RecipeNotification);
        }
      )
      .subscribe();

    return channel;
  }
};
