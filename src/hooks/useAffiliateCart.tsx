import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { Ingredient } from "@/data/ingredients";
import { Cocktail } from "@/data/classicCocktails";
import {
  buildEstimatedCart,
  getBestProductForIngredient,
  getRetailers,
  EstimatedCart,
  ProductMapping,
  Retailer
} from "@/services/productMappingService";
import {
  generateAffiliateUrl,
  createShoppingSession,
  formatPrice,
  calculateValueProposition
} from "@/services/affiliateService";

interface UseAffiliateCartResult {
  estimatedCart: EstimatedCart | null;
  retailers: Retailer[];
  selectedRetailer: Retailer | null;
  loading: boolean;
  buildCartForRecipe: (
    recipe: Cocktail,
    userIngredients: string[],
    ingredientMap: Map<string, Ingredient>
  ) => Promise<void>;
  buildCartForIngredients: (
    ingredientIds: string[],
    userIngredients: string[],
    ingredientMap: Map<string, Ingredient>
  ) => Promise<void>;
  selectRetailer: (retailerId: string) => void;
  buyIngredients: () => Promise<void>;
  getBestPriceForIngredient: (ingredientId: string) => Promise<ProductMapping | null>;
  clearCart: () => void;
}

export function useAffiliateCart(): UseAffiliateCartResult {
  const { user } = useAuth();
  const [estimatedCart, setEstimatedCart] = useState<EstimatedCart | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize retailers on first use
  const initializeRetailers = useCallback(async () => {
    if (retailers.length === 0) {
      const fetchedRetailers = await getRetailers();
      setRetailers(fetchedRetailers);
      
      // Default to Total Wine for MVP
      const totalWine = fetchedRetailers.find(r => r.id === 'total-wine');
      if (totalWine && !selectedRetailer) {
        setSelectedRetailer(totalWine);
      }
    }
  }, [retailers.length, selectedRetailer]);

  // Build cart for a specific recipe
  const buildCartForRecipe = useCallback(async (
    recipe: Cocktail,
    userIngredients: string[],
    ingredientMap: Map<string, Ingredient>
  ) => {
    await initializeRetailers();
    
    if (!selectedRetailer) {
      toast.error("No retailer selected");
      return;
    }

    setLoading(true);
    try {
      // Extract ingredient IDs from recipe
      const recipeIngredientIds = recipe.ingredients.map(ing => {
        // Try to find ingredient by name in the map
        for (const [id, ingredient] of ingredientMap) {
          if (ingredient.name.toLowerCase() === ing.toLowerCase().replace(/^\d+(\.\d+)?\s*(oz|ml|dash|splash|drops?)\s*/i, '').trim()) {
            return id;
          }
        }
        return null;
      }).filter(Boolean) as string[];

      const cart = await buildEstimatedCart(
        recipeIngredientIds,
        selectedRetailer.id,
        userIngredients,
        ingredientMap
      );

      setEstimatedCart(cart);
      
      if (!cart || cart.items.length === 0) {
        toast.info("You already have all the ingredients for this recipe!");
      } else {
        toast.success(`Cart built with ${cart.items.length} ingredients`);
      }
    } catch (error) {
      console.error('Error building cart for recipe:', error);
      toast.error("Failed to build cart");
    } finally {
      setLoading(false);
    }
  }, [selectedRetailer, initializeRetailers]);

  // Build cart for specific ingredients
  const buildCartForIngredients = useCallback(async (
    ingredientIds: string[],
    userIngredients: string[],
    ingredientMap: Map<string, Ingredient>
  ) => {
    await initializeRetailers();
    
    if (!selectedRetailer) {
      toast.error("No retailer selected");
      return;
    }

    setLoading(true);
    try {
      const cart = await buildEstimatedCart(
        ingredientIds,
        selectedRetailer.id,
        userIngredients,
        ingredientMap
      );

      setEstimatedCart(cart);
      
      if (!cart || cart.items.length === 0) {
        toast.info("You already have all these ingredients!");
      } else {
        toast.success(`Cart built with ${cart.items.length} ingredients`);
      }
    } catch (error) {
      console.error('Error building cart for ingredients:', error);
      toast.error("Failed to build cart");
    } finally {
      setLoading(false);
    }
  }, [selectedRetailer, initializeRetailers]);

  // Select a different retailer
  const selectRetailer = useCallback((retailerId: string) => {
    const retailer = retailers.find(r => r.id === retailerId);
    if (retailer) {
      setSelectedRetailer(retailer);
      setEstimatedCart(null); // Clear cart when switching retailers
    }
  }, [retailers]);

  // Buy ingredients (redirect to affiliate URL)
  const buyIngredients = useCallback(async () => {
    if (!estimatedCart || !selectedRetailer) {
      toast.error("No cart or retailer selected");
      return;
    }

    try {
      setLoading(true);
      
      // Generate affiliate URL
      const affiliateUrl = generateAffiliateUrl(
        selectedRetailer,
        estimatedCart.items,
        user?.id
      );

      // Create shopping session for tracking
      const session = await createShoppingSession(
        selectedRetailer.id,
        [], // Recipe IDs - we'll add this in future iterations
        estimatedCart.items.map(item => item.ingredient_id),
        estimatedCart.estimated_total_cents,
        affiliateUrl,
        user?.id
      );

      if (session) {
        // Store session ID in localStorage for potential conversion tracking
        localStorage.setItem('lastShoppingSession', session.id);
        
        // Show success message with value proposition
        const valueMessage = calculateValueProposition(estimatedCart.items, selectedRetailer);
        toast.success(`Redirecting to ${selectedRetailer.name}... ${valueMessage}`);
        
        // Small delay to show the toast, then redirect
        setTimeout(() => {
          window.open(affiliateUrl, '_blank');
        }, 1000);
      } else {
        // Still redirect even if session creation failed
        window.open(affiliateUrl, '_blank');
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error("Failed to process purchase");
    } finally {
      setLoading(false);
    }
  }, [estimatedCart, selectedRetailer, user?.id]);

  // Get best price for a single ingredient
  const getBestPriceForIngredient = useCallback(async (
    ingredientId: string
  ): Promise<ProductMapping | null> => {
    await initializeRetailers();
    
    if (!selectedRetailer) {
      return null;
    }

    return await getBestProductForIngredient(ingredientId, selectedRetailer.id);
  }, [selectedRetailer, initializeRetailers]);

  // Clear the current cart
  const clearCart = useCallback(() => {
    setEstimatedCart(null);
  }, []);

  return {
    estimatedCart,
    retailers,
    selectedRetailer,
    loading,
    buildCartForRecipe,
    buildCartForIngredients,
    selectRetailer,
    buyIngredients,
    getBestPriceForIngredient,
    clearCart
  };
}