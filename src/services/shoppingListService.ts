import { supabase } from "@/integrations/supabase/client";

export interface ShoppingListItem {
  id: string;
  user_id: string;
  ingredient_id: string;
  quantity: string | null;
  purchased: boolean;
  created_at: string;
  updated_at: string;
}

export async function getShoppingListItems(): Promise<ShoppingListItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('purchased', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shopping list items:', error);
    return [];
  }

  return data as ShoppingListItem[];
}

export async function addShoppingListItem(ingredientId: string, quantity?: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('shopping_list_items')
    .upsert({
      user_id: user.id,
      ingredient_id: ingredientId,
      quantity: quantity ?? null,
      purchased: false,
    }, {
      onConflict: 'user_id,ingredient_id',
      ignoreDuplicates: false
    });

  if (error) {
    console.error('Error adding to shopping list:', error);
    return false;
  }

  return true;
}

export async function removeShoppingListItemByIngredient(ingredientId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('shopping_list_items')
    .delete()
    .eq('user_id', user.id)
    .eq('ingredient_id', ingredientId)
    .eq('purchased', false);

  if (error) {
    console.error('Error removing from shopping list:', error);
    return false;
  }

  return true;
}

export async function markShoppingListItemPurchased(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('shopping_list_items')
    .update({ purchased: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error marking shopping item purchased:', error);
    return false;
  }

  return true;
}
