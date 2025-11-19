import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingListItem,
  getShoppingListItems,
  addShoppingListItem,
  removeShoppingListItemByIngredient,
  markShoppingListItemPurchased,
} from "@/services/shoppingListService";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      const data = await getShoppingListItems();
      if (isMounted) setItems(data);
      setLoading(false);
    };
    init();

    // Create unique channel name to avoid duplicate subscription errors
    const channelName = `shopping_list_items_changes_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list_items' }, async (payload) => {
        const { data: { user } } = await supabase.auth.getUser();
        const changed = (payload.new || payload.old) as any;
        if (!user || !changed || changed.user_id !== user.id) return;
        setItems((prev) => {
          switch (payload.eventType) {
            case 'INSERT':
              if (changed.purchased) return prev;
              if (prev.find(i => i.id === changed.id)) return prev;
              return [changed as ShoppingListItem, ...prev];
            case 'UPDATE':
              if (changed.purchased) {
                return prev.filter(i => i.id !== changed.id);
              }
              return prev.map(i => i.id === changed.id ? { ...(changed as ShoppingListItem) } : i);
            case 'DELETE':
              return prev.filter(i => i.id !== changed.id);
            default:
              return prev;
          }
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addToList = async (ingredientId: string, quantity?: string) => {
    await addShoppingListItem(ingredientId, quantity);
  };

  const removeFromList = async (ingredientId: string) => {
    await removeShoppingListItemByIngredient(ingredientId);
  };

  const markPurchased = async (id: string) => {
    await markShoppingListItemPurchased(id);
  };

  return { items, loading, addToList, removeFromList, markPurchased };
}
