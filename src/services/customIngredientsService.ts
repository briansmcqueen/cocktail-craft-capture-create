import { supabase } from "@/integrations/supabase/client";

export interface CustomIngredient {
  id: string;
  user_id: string;
  name: string;
  category: string;
  sub_category: string;
  description?: string;
  aliases: string[];
  created_at: string;
  updated_at: string;
}

export async function createCustomIngredient(ingredient: Omit<CustomIngredient, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CustomIngredient | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('custom_ingredients')
    .insert({
      user_id: user.id,
      name: ingredient.name,
      category: ingredient.category,
      sub_category: ingredient.sub_category,
      description: ingredient.description,
      aliases: ingredient.aliases
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating custom ingredient:', error);
    return null;
  }

  return data;
}

export async function getUserCustomIngredients(): Promise<CustomIngredient[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('custom_ingredients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom ingredients:', error);
    return [];
  }

  return data || [];
}

export async function updateCustomIngredient(id: string, updates: Partial<CustomIngredient>): Promise<boolean> {
  const { error } = await supabase
    .from('custom_ingredients')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating custom ingredient:', error);
    return false;
  }

  return true;
}

export async function deleteCustomIngredient(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('custom_ingredients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting custom ingredient:', error);
    return false;
  }

  return true;
}