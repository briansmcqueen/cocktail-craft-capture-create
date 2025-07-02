import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ingredientDatabase, Ingredient } from "@/data/ingredients";
import { 
  getUserIngredients, 
  addUserIngredient, 
  removeUserIngredient 
} from "@/services/userIngredientsService";
import { 
  getUserCustomIngredients,
  CustomIngredient 
} from "@/services/customIngredientsService";
import { supabase } from "@/integrations/supabase/client";

interface MyBarInventory {
  [ingredientId: string]: boolean;
}

export function useMyBarData(forceUpdate: number) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myBar, setMyBar] = useState<MyBarInventory>({});
  const [customIngredients, setCustomIngredients] = useState<CustomIngredient[]>([]);
  const [loading, setLoading] = useState(false);

  // Load bar ingredients and custom ingredients from Supabase
  useEffect(() => {
    if (!user) {
      setMyBar({});
      setCustomIngredients([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const [ingredientIds, customIngs] = await Promise.all([
        getUserIngredients(),
        getUserCustomIngredients()
      ]);
      
      const newMyBar: MyBarInventory = {};
      ingredientIds.forEach(id => {
        newMyBar[id] = true;
      });
      setMyBar(newMyBar);
      setCustomIngredients(customIngs);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-ingredients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_ingredients',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, forceUpdate]);

  // Create combined ingredient lookup map (database + custom)
  const allIngredients = useMemo(() => {
    const combined = [...ingredientDatabase];
    customIngredients.forEach(custom => {
      combined.push({
        id: custom.id,
        name: custom.name,
        category: custom.category as "Spirits" | "Liqueurs" | "Wines & Vermouths" | "Beers & Ciders" | "Mixers" | "Produce" | "Pantry",
        subCategory: custom.sub_category,
        aliases: custom.aliases,
        description: custom.description || "",
        isCustom: true
      });
    });
    return combined;
  }, [customIngredients]);

  const ingredientMap = useMemo(() => {
    const map: { [id: string]: Ingredient } = {};
    allIngredients.forEach(ingredient => {
      map[ingredient.id] = ingredient;
    });
    return map;
  }, [allIngredients]);

  // Get current user's ingredients
  const myBarIngredients = Object.keys(myBar).filter(id => myBar[id]);

  const toggleIngredient = async (ingredientId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your bar inventory.",
        variant: "destructive"
      });
      return;
    }

    const isSelected = myBar[ingredientId];
    
    // Optimistically update UI
    setMyBar(prev => ({
      ...prev,
      [ingredientId]: !isSelected
    }));

    try {
      const success = isSelected 
        ? await removeUserIngredient(ingredientId)
        : await addUserIngredient(ingredientId);
      
      if (success) {
        toast({
          title: isSelected ? "Ingredient Removed" : "Ingredient Added",
          description: `${ingredientMap[ingredientId]?.name} ${isSelected ? 'removed from' : 'added to'} your bar.`
        });
      } else {
        // Revert on failure
        setMyBar(prev => ({
          ...prev,
          [ingredientId]: isSelected
        }));
        toast({
          title: "Error",
          description: "Failed to update your bar. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Revert on error
      setMyBar(prev => ({
        ...prev,
        [ingredientId]: isSelected
      }));
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    myBar,
    customIngredients,
    setCustomIngredients,
    loading,
    allIngredients,
    ingredientMap,
    myBarIngredients,
    toggleIngredient,
    user
  };
}