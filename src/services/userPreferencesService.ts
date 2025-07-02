import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_spirit_types: string[];
  flavor_preferences: string[];
  difficulty_preference: number;
  created_at: string;
  updated_at: string;
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data;
}

export async function updateUserPreferences(preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...preferences
    });

  if (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }

  return true;
}

// Analytics functions for learning user behavior
export async function trackRecipeView(recipeId: string): Promise<void> {
  // This would typically go to an analytics service
  // For now, we'll just log it
  console.log(`Recipe viewed: ${recipeId}`);
}

export async function trackIngredientAdded(ingredientId: string): Promise<void> {
  console.log(`Ingredient added: ${ingredientId}`);
}

export async function trackRecipeMade(recipeId: string): Promise<void> {
  console.log(`Recipe made: ${recipeId}`);
}