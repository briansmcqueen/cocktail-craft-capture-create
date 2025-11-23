import { supabase } from "@/integrations/supabase/client";
import { Cocktail } from "@/data/classicCocktails";
import { privacyService } from "./privacyService";

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
  const recipes = recipesResult.data?.map(recipe => ({
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

  // Deduplicate by ID to ensure unique recipes
  const uniqueRecipes = recipes.reduce((acc, recipe) => {
    if (!acc.find(r => r.id === recipe.id)) {
      acc.push(recipe);
    }
    return acc;
  }, [] as Cocktail[]);

  return uniqueRecipes;
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

export async function getCommunityRecipesFromDB(limit: number = 50): Promise<Cocktail[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Get public recipes ordered by creation date
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching community recipes:', error);
      return [];
    }

    if (!recipes || recipes.length === 0) return [];

    // Get unique user IDs
    const userIds = [...new Set(recipes.map(r => r.user_id))];

    // Fetch all profiles in one query
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    // Create a map for quick profile lookup
    const profileMap = new Map(
      profiles?.map(p => [p.id, p]) || []
    );

    // Transform recipes with creator info
    const recipesWithCreators: Cocktail[] = [];

    for (const recipe of recipes) {
      // Check privacy if user is logged in
      if (user) {
        const blocked = await privacyService.isBlockedBy(user.id, recipe.user_id);
        if (blocked) continue;

        const canView = await privacyService.canViewRecipes(recipe.user_id, user.id);
        if (!canView.canView) continue;
      }

      const profile = profileMap.get(recipe.user_id);
      recipesWithCreators.push({
        id: recipe.id,
        name: recipe.name,
        image: recipe.image_url || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
        ingredients: recipe.ingredients,
        steps: recipe.instructions,
        notes: recipe.description || undefined,
        tags: recipe.tags || [],
        createdBy: profile?.username || 'Anonymous',
        isUserRecipe: true,
        creatorUsername: profile?.username || undefined,
        creatorAvatar: profile?.avatar_url || undefined,
        creatorUserId: recipe.user_id,
      });
    }

    return recipesWithCreators;
  } catch (error) {
    console.error('Error fetching community recipes:', error);
    return [];
  }
}

export async function getRecipeByUsernameAndName(username: string, recipeName: string): Promise<Cocktail | null> {
  try {
    // First, find the user by username via safe public RPC
    const { data: publicProfile, error: profileError } = await supabase
      .rpc('get_public_profile_by_username', { p_username: username })
      .single();

    if (profileError || !publicProfile) {
      console.error('User not found:', username, profileError);
      return null;
    }

    // Check privacy settings
    const { data: { user } } = await supabase.auth.getUser();
    const privacyCheck = await privacyService.canViewRecipes(publicProfile.id, user?.id);
    
    if (!privacyCheck.canView) {
      console.log('Recipe not accessible due to privacy settings');
      return null;
    }

    // Convert URL slug back to recipe name for searching
    const searchName = recipeName.replace(/-/g, ' ');
    
    // Then find the recipe by that user with matching name
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', publicProfile.id)
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
      createdBy: publicProfile.username || undefined,
      isUserRecipe: true
    };
  } catch (error) {
    console.error('Error fetching recipe by username and name:', error);
    return null;
  }
}