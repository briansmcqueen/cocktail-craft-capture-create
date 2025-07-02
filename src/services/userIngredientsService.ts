import { supabase } from "@/integrations/supabase/client";

export interface UserIngredient {
  id: string;
  user_id: string;
  ingredient_id: string;
  created_at: string;
  updated_at: string;
}

export async function getUserIngredients(): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_ingredients')
    .select('ingredient_id')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user ingredients:', error);
    return [];
  }

  return data?.map(item => item.ingredient_id) || [];
}

export async function addUserIngredient(ingredientId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('user_ingredients')
    .insert({
      user_id: user.id,
      ingredient_id: ingredientId
    });

  if (error) {
    console.error('Error adding ingredient:', error);
    return false;
  }

  return true;
}

export async function removeUserIngredient(ingredientId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('user_ingredients')
    .delete()
    .eq('user_id', user.id)
    .eq('ingredient_id', ingredientId);

  if (error) {
    console.error('Error removing ingredient:', error);
    return false;
  }

  return true;
}

export async function syncUserIngredientsFromLocalStorage(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  // Get existing localStorage data
  const localBarKey = "barbook_user_bar";
  const localBar = localStorage.getItem(localBarKey);
  
  if (!localBar) return;

  try {
    const ingredientIds = JSON.parse(localBar);
    
    // Insert all ingredients (ignore duplicates due to UNIQUE constraint)
    for (const ingredientId of ingredientIds) {
      await addUserIngredient(ingredientId);
    }
    
    // Clear localStorage after successful sync
    localStorage.removeItem(localBarKey);
  } catch (error) {
    console.error('Error syncing ingredients from localStorage:', error);
  }
}