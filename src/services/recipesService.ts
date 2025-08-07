import { supabase } from "@/integrations/supabase/client";
import { Cocktail } from "@/data/classicCocktails";

export async function getUserRecipesFromDB(): Promise<Cocktail[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  // Fetch both user recipes and profile in parallel for better performance
  const [recipesResult, profileResult] = await Promise.all([
    supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single()
  ]);

  if (recipesResult.error) {
    console.error('Error fetching user recipes:', recipesResult.error);
    return [];
  }

  const profile = profileResult.data;
  return recipesResult.data?.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    image: recipe.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
    ingredients: recipe.ingredients,
    steps: recipe.instructions,
    notes: recipe.description || undefined,
    tags: recipe.tags || [],
    createdBy: profile?.username || profile?.full_name,
    isUserRecipe: true
  })) || [];
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

export async function getRecipeByUsernameAndName(username: string, recipeName: string): Promise<Cocktail | null> {
  try {
    // First, find the user by username
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .eq('username', username)
      .single();

    if (profileError || !profile) {
      console.error('User not found:', username);
      return null;
    }

    // Convert URL slug back to recipe name for searching
    const searchName = recipeName.replace(/-/g, ' ');
    
    // Then find the recipe by that user with matching name
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_public', true);

    if (recipeError || !recipes) {
      console.error('Error fetching recipe:', recipeError);
      return null;
    }

    // Find recipe with matching name (case-insensitive)
    const recipe = recipes.find(r => r.name.toLowerCase() === searchName.toLowerCase());
    
    if (!recipe) {
      return null;
    }

    return {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
      ingredients: recipe.ingredients,
      steps: recipe.instructions,
      notes: recipe.description || undefined,
      tags: recipe.tags || [],
      createdBy: profile.username || profile.full_name,
      isUserRecipe: true
    };
  } catch (error) {
    console.error('Error fetching recipe by username and name:', error);
    return null;
  }
}