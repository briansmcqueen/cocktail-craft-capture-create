import React, { useState, useEffect } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAffiliateCart } from "@/hooks/useAffiliateCart";
import { ProductMapping } from "@/services/productMappingService";
import { formatPrice } from "@/services/affiliateService";
import { Ingredient } from "@/data/ingredients";

interface BuyIngredientButtonProps {
  ingredientId: string;
  ingredient: Ingredient;
  userIngredients: string[];
  ingredientMap: Map<string, Ingredient>;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showPrice?: boolean;
  className?: string;
  onAddToCart?: () => void;
}

export default function BuyIngredientButton({
  ingredientId,
  ingredient,
  userIngredients,
  ingredientMap,
  variant = "outline",
  size = "sm",
  showPrice = true,
  className = "",
  onAddToCart
}: BuyIngredientButtonProps) {
  const { 
    buildCartForIngredients, 
    buyIngredients,
    getBestPriceForIngredient,
    selectedRetailer,
    loading
  } = useAffiliateCart();
  
  const [bestProduct, setBestProduct] = useState<ProductMapping | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Check if user already has this ingredient
  const hasIngredient = userIngredients.includes(ingredientId);

  // Load best price for this ingredient
  useEffect(() => {
    if (!hasIngredient && selectedRetailer) {
      setLoadingPrice(true);
      getBestPriceForIngredient(ingredientId)
        .then(setBestProduct)
        .finally(() => setLoadingPrice(false));
    }
  }, [ingredientId, selectedRetailer, hasIngredient, getBestPriceForIngredient]);

  const handleBuyIngredient = async () => {
    if (hasIngredient) return;
    
    try {
      await buildCartForIngredients([ingredientId], userIngredients, ingredientMap);
      // The cart will be built and then user can complete purchase
      onAddToCart?.();
    } catch (error) {
      console.error('Error buying ingredient:', error);
    }
  };

  if (hasIngredient) {
    return null; // Don't show buy button if user already has ingredient
  }

  if (!bestProduct && !loadingPrice) {
    return null; // No product available for this ingredient
  }

  return (
    <Button
      onClick={handleBuyIngredient}
      variant={variant}
      size={size}
      disabled={loading || loadingPrice || !bestProduct}
      className={`gap-1 ${className}`}
    >
      {loading || loadingPrice ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <ShoppingCart className="h-3 w-3" />
      )}
      
      {size !== "icon" && (
        <>
          {loading ? "Adding..." : "Buy"}
          {showPrice && bestProduct?.price_cents && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {formatPrice(bestProduct.price_cents)}
            </Badge>
          )}
        </>
      )}
    </Button>
  );
}