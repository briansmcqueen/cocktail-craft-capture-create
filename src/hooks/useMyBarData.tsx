import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { barPresetsService, type BarPreset } from "@/services/barPresetsService";
import { supabase } from "@/integrations/supabase/client";

interface MyBarInventory {
  [ingredientId: string]: boolean;
}

export function useMyBarData(forceUpdate: number) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myBar, setMyBar] = useState<MyBarInventory>({});
  const [customIngredients, setCustomIngredients] = useState<CustomIngredient[]>([]);
  const [presets, setPresets] = useState<BarPreset[]>([]);
  const [loading, setLoading] = useState(false);
  const pendingToggles = useRef<Set<string>>(new Set());

  // Load bar ingredients and custom ingredients from Supabase
  useEffect(() => {
    if (!user) {
      setMyBar({});
      setCustomIngredients([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [ingredientIds, customIngs, userPresets] = await Promise.all([
          getUserIngredients(),
          getUserCustomIngredients(),
          barPresetsService.getUserPresets(user.id)
        ]);
        
        const newMyBar: MyBarInventory = {};
        ingredientIds.forEach(id => {
          newMyBar[id] = true;
        });
        setMyBar(newMyBar);
        setCustomIngredients(customIngs);
        setPresets(userPresets);
      } catch (error) {
        console.error('Error loading bar data:', error);
        toast({
          title: "Error",
          description: "Failed to load your bar data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscription - optimize by updating local state instead of refetching
    const channel = supabase
      .channel('user-ingredients-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_ingredients',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new?.ingredient_id) {
            setMyBar(prev => ({
              ...prev,
              [payload.new.ingredient_id]: true
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'user_ingredients',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.old?.ingredient_id) {
            setMyBar(prev => {
              const updated = { ...prev };
              delete updated[payload.old.ingredient_id];
              return updated;
            });
          }
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
  
  const toggleIngredient = useCallback(async (ingredientId: string) => {
    if (!user) {
      // Open auth modal directly for more prominent signup prompt
      if (window.__openAuthModal) {
        window.__openAuthModal('signup', "Build your personal bar and discover cocktails you can make!");
      }
      return;
    }

    // Prevent duplicate toggles
    if (pendingToggles.current.has(ingredientId)) {
      return;
    }

    pendingToggles.current.add(ingredientId);
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
      
      if (!success) {
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
    } finally {
      pendingToggles.current.delete(ingredientId);
    }
  }, [user, myBar, ingredientMap, toast]);

  // Preset management functions
  const savePreset = useCallback(async (name: string): Promise<void> => {
    if (!user?.id || myBarIngredients.length === 0) return;

    try {
      const newPreset = await barPresetsService.savePreset(user.id, name, myBarIngredients);
      setPresets(prev => [newPreset, ...prev]);
      toast({
        title: "Preset Saved",
        description: `"${name}" has been saved to your presets.`,
      });
    } catch (error) {
      console.error('Error saving preset:', error);
      toast({
        title: "Error",
        description: "Failed to save preset. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, myBarIngredients, toast]);

  const loadPreset = useCallback(async (preset: BarPreset) => {
    if (!user?.id) return;

    try {
      // First, remove all current ingredients
      const removePromises = myBarIngredients.map(ingredientId => 
        removeUserIngredient(ingredientId)
      );

      // Then add preset ingredients
      const addPromises = preset.ingredient_ids.map(ingredientId =>
        addUserIngredient(ingredientId)
      );

      await Promise.all([...removePromises, ...addPromises]);

      // Update local state
      const newMyBar: MyBarInventory = {};
      preset.ingredient_ids.forEach(id => {
        newMyBar[id] = true;
      });
      setMyBar(newMyBar);

      toast({
        title: "Preset Loaded",
        description: `"${preset.name}" has been loaded into your bar.`,
      });
    } catch (error) {
      console.error('Error loading preset:', error);
      toast({
        title: "Error", 
        description: "Failed to load preset. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, myBarIngredients, toast]);

  // Update preset function
  const updatePreset = useCallback(async (presetId: string, name: string) => {
    if (!user?.id) return;

    try {
      const currentPreset = presets.find(p => p.id === presetId);
      if (!currentPreset) return;

      const updatedPreset = await barPresetsService.updatePreset(presetId, name, currentPreset.ingredient_ids);
      setPresets(prev => prev.map(p => p.id === presetId ? updatedPreset : p));
      
      toast({
        title: "Preset Updated",
        description: `"${name}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating preset:', error);
      toast({
        title: "Error",
        description: "Failed to update preset. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, presets, toast]);

  const deletePreset = useCallback(async (presetId: string) => {
    try {
      await barPresetsService.deletePreset(presetId);
      setPresets(prev => prev.filter(p => p.id !== presetId));
      toast({
        title: "Preset Deleted",
        description: "Preset has been removed.",
      });
    } catch (error) {
      console.error('Error deleting preset:', error);
      toast({
        title: "Error",
        description: "Failed to delete preset. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    myBar,
    customIngredients,
    setCustomIngredients,
    loading,
    allIngredients,
    ingredientMap,
    myBarIngredients,
    toggleIngredient,
    user,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    updatePreset
  };
}