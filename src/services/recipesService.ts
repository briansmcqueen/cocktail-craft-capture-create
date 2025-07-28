import { supabase } from "@/integrations/supabase/client";
import { Cocktail } from "@/data/classicCocktails";

export async function getUserRecipesFromDB(): Promise<Cocktail[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user recipes:', error);
    return [];
  }

  console.log('Raw database data:', data);
  const mappedRecipes = data?.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    image: recipe.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
    ingredients: recipe.ingredients,
    steps: recipe.instructions,
    notes: recipe.description || undefined,
    tags: recipe.tags || []
  })) || [];
  
  console.log('Mapped recipes:', mappedRecipes);
  return mappedRecipes;
}

export async function saveRecipeToDB(recipe: Cocktail): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const recipeData = {
    ...(recipe.id && { id: recipe.id }), // Only include id if it exists (editing)
    user_id: user.id,
    name: recipe.name,
    description: recipe.notes,
    ingredients: recipe.ingredients,
    instructions: recipe.steps,
    tags: recipe.tags,
    image_url: recipe.image,
    is_public: true
  };

  const { error } = await supabase
    .from('recipes')
    .upsert(recipeData);

  if (error) {
    console.error('Error saving recipe:', error);
    return false;
  }

  return true;
}

export async function deleteRecipeFromDB(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }

  return true;
}

export async function syncUserRecipesFromLocalStorage(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  // Get existing localStorage data
  const localRecipesKey = "user_cocktail_recipes";
  const localRecipes = localStorage.getItem(localRecipesKey);
  
  if (!localRecipes) return;

  try {
    const recipes: Cocktail[] = JSON.parse(localRecipes);
    
    // Save all recipes to Supabase
    for (const recipe of recipes) {
      await saveRecipeToDB(recipe);
    }
    
    // Clear localStorage after successful sync
    localStorage.removeItem(localRecipesKey);
  } catch (error) {
    console.error('Error syncing recipes from localStorage:', error);
  }
}