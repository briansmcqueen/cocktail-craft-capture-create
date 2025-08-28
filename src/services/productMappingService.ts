import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "@/data/ingredients";

export interface ProductMapping {
  id: string;
  ingredient_id: string;
  retailer_id: string;
  product_id: string;
  product_name: string;
  product_url: string;
  price_cents: number | null;
  size_ml: number | null;
  size_description: string | null;
  affiliate_url: string;
  in_stock: boolean;
  priority: number;
}

export interface Retailer {
  id: string;
  name: string;
  logo_url: string | null;
  base_url: string;
  affiliate_id: string;
  commission_rate: number | null;
  supports_api: boolean;
  min_order_for_delivery: number | null;
  delivery_fee_cents: number | null;
}

export interface CartItem {
  ingredient_id: string;
  ingredient_name: string;
  product: ProductMapping;
  quantity: number;
}

export interface EstimatedCart {
  items: CartItem[];
  subtotal_cents: number;
  estimated_tax_cents: number;
  estimated_delivery_cents: number;
  estimated_total_cents: number;
  retailer: Retailer;
}

// Get all available retailers
export async function getRetailers(): Promise<Retailer[]> {
  const { data, error } = await supabase
    .from('retailers')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching retailers:', error);
    return [];
  }

  return data || [];
}

// Find products for a specific ingredient
export async function findProductsForIngredient(
  ingredientId: string, 
  retailerId?: string
): Promise<ProductMapping[]> {
  let query = supabase
    .from('product_mappings')
    .select('*')
    .eq('ingredient_id', ingredientId)
    .eq('in_stock', true)
    .order('priority', { ascending: true });

  if (retailerId) {
    query = query.eq('retailer_id', retailerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products for ingredient:', error);
    return [];
  }

  return data || [];
}

// Find products for multiple ingredients
export async function findProductsForIngredients(
  ingredientIds: string[], 
  retailerId?: string
): Promise<Map<string, ProductMapping[]>> {
  let query = supabase
    .from('product_mappings')
    .select('*')
    .in('ingredient_id', ingredientIds)
    .eq('in_stock', true)
    .order('priority', { ascending: true });

  if (retailerId) {
    query = query.eq('retailer_id', retailerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products for ingredients:', error);
    return new Map();
  }

  // Group products by ingredient_id
  const productMap = new Map<string, ProductMapping[]>();
  data?.forEach(product => {
    const existing = productMap.get(product.ingredient_id) || [];
    productMap.set(product.ingredient_id, [...existing, product]);
  });

  return productMap;
}

// Build estimated cart for recipe ingredients
export async function buildEstimatedCart(
  ingredientIds: string[],
  retailerId: string,
  userIngredients: string[] = [],
  ingredientMap: Map<string, Ingredient>
): Promise<EstimatedCart | null> {
  // Filter out ingredients the user already has
  const missingIngredientIds = ingredientIds.filter(id => !userIngredients.includes(id));
  
  if (missingIngredientIds.length === 0) {
    return null; // User has all ingredients
  }

  // Get retailer info
  const { data: retailerData, error: retailerError } = await supabase
    .from('retailers')
    .select('*')
    .eq('id', retailerId)
    .single();

  if (retailerError || !retailerData) {
    console.error('Error fetching retailer:', retailerError);
    return null;
  }

  // Get products for missing ingredients
  const productMap = await findProductsForIngredients(missingIngredientIds, retailerId);
  
  const cartItems: CartItem[] = [];
  let subtotalCents = 0;

  for (const ingredientId of missingIngredientIds) {
    const products = productMap.get(ingredientId);
    const ingredient = ingredientMap.get(ingredientId);
    
    if (products && products.length > 0 && ingredient) {
      // Use the highest priority (lowest priority number) product
      const bestProduct = products[0];
      
      cartItems.push({
        ingredient_id: ingredientId,
        ingredient_name: ingredient.name,
        product: bestProduct,
        quantity: 1
      });

      if (bestProduct.price_cents) {
        subtotalCents += bestProduct.price_cents;
      }
    }
  }

  // Estimate tax (8.5% average)
  const estimatedTaxCents = Math.round(subtotalCents * 0.085);
  
  // Estimate delivery fee
  const estimatedDeliveryCents = retailerData.delivery_fee_cents || 0;
  
  const estimatedTotalCents = subtotalCents + estimatedTaxCents + estimatedDeliveryCents;

  return {
    items: cartItems,
    subtotal_cents: subtotalCents,
    estimated_tax_cents: estimatedTaxCents,
    estimated_delivery_cents: estimatedDeliveryCents,
    estimated_total_cents: estimatedTotalCents,
    retailer: retailerData
  };
}

// Get best product for an ingredient (lowest price, highest priority)
export async function getBestProductForIngredient(
  ingredientId: string,
  retailerId?: string
): Promise<ProductMapping | null> {
  const products = await findProductsForIngredient(ingredientId, retailerId);
  
  if (products.length === 0) {
    return null;
  }

  // Sort by priority first, then by price
  const sortedProducts = products.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    if (a.price_cents && b.price_cents) {
      return a.price_cents - b.price_cents;
    }
    return 0;
  });

  return sortedProducts[0];
}