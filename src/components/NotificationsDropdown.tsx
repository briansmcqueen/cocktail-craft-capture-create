import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { notificationsService, RecipeNotification } from '@/services/notificationsService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<RecipeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    loadNotifications();
    loadUnreadCount();

    // Subscribe to real-time notifications
    let channel: any = null;
    
    const setupSubscription = async () => {
      try {
        channel = notificationsService.subscribeToNotifications((newNotification) => {
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notification
          toast({
            title: "New Recipe Posted",
            description: `${newNotification.recipe_name} was just published!`,
          });
        });
      } catch (error) {
        console.error('Error setting up notification subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel).catch(err => {
          console.error('Error removing channel:', err);
        });
      }
    };
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getNotifications(20);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    const count = await notificationsService.getUnreadCount();
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const success = await notificationsService.markAsRead(notificationId);
    
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await notificationsService.markAllAsRead();
    
    if (success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      toast({
        title: "All notifications marked as read",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const success = await notificationsService.deleteNotification(notificationId);
    
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notifications.find(n => n.id === notificationId && !n.is_read)) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleNotificationClick = async (notification: RecipeNotification) => {
    // Mark as read
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id, { stopPropagation: () => {} } as any);
    }
    
    // Navigate to recipe
    setOpen(false);
    navigate(`/cocktail/${notification.recipe_id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-medium-charcoal rounded-organic-sm"
        >
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-rich-charcoal border-light-charcoal z-50"
      >
        {/* Header */}
        <div className="p-3 border-b border-light-charcoal">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-pure-white">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-7 text-xs hover:bg-medium-charcoal"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-8 text-center text-soft-gray">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-3 text-soft-gray opacity-50" />
            <p className="text-sm text-soft-gray">No notifications yet</p>
            <p className="text-xs text-soft-gray mt-1">
              Follow bartenders to see their latest recipes here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={`p-3 cursor-pointer focus:bg-medium-charcoal ${
                    !notification.is_read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 w-full">
                    {/* Unread indicator */}
                    <div className="mt-1">
                      {!notification.is_read ? (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      ) : (
                        <div className="h-2 w-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-pure-white mb-1">
                        New Recipe Posted
                      </p>
                      <p className="text-sm text-light-text line-clamp-2">
                        {notification.recipe_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-soft-gray">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-primary/20"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-destructive/20"
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                        title="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-light-charcoal/30" />
              </div>
            ))}
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-light-charcoal" />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full hover:bg-medium-charcoal rounded-organic-sm"
                onClick={() => {
                  setOpen(false);
                  navigate('/feed');
                }}
              >
                View Feed
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
