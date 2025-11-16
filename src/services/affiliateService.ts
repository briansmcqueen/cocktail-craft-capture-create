import { supabase } from "@/integrations/supabase/client";
import { CartItem, Retailer } from "./productMappingService";

export interface ShoppingSession {
  id: string;
  user_id: string | null;
  retailer_id: string;
  recipe_ids: string[];
  ingredient_ids: string[];
  estimated_total_cents: number;
  affiliate_url: string;
  status: 'pending' | 'completed' | 'abandoned';
  created_at: string;
  completed_at: string | null;
}

// Generate affiliate URL for Total Wine (MVP implementation)
export function generateAffiliateUrl(
  retailer: Retailer,
  cartItems: CartItem[],
  userId?: string
): string {
  const baseUrl = retailer.base_url;
  const affiliateId = retailer.affiliate_id;
  
  // For Total Wine, we'll use a simple product listing approach
  // In a real implementation, this would use their specific affiliate URL format
  if (retailer.id === 'total-wine') {
    const productIds = cartItems.map(item => item.product.product_id).join(',');
    const sessionId = generateSessionId(userId);
    
    // Example Total Wine affiliate URL structure
    // This is a simplified version - real implementation would use their actual format
    return `${baseUrl}/cart/add?products=${encodeURIComponent(productIds)}&affiliate=${encodeURIComponent(affiliateId)}&session=${encodeURIComponent(sessionId)}`;
  }
  
  // Default fallback
  return `${baseUrl}?ref=${encodeURIComponent(affiliateId)}`;
}

// Create a shopping session for tracking
export async function createShoppingSession(
  retailerId: string,
  recipeIds: string[],
  ingredientIds: string[],
  estimatedTotalCents: number,
  affiliateUrl: string,
  userId?: string
): Promise<ShoppingSession | null> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .insert({
      user_id: userId || null,
      retailer_id: retailerId,
      recipe_ids: recipeIds,
      ingredient_ids: ingredientIds,
      estimated_total_cents: estimatedTotalCents,
      affiliate_url: affiliateUrl,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating shopping session:', error);
    return null;
  }

  return data as ShoppingSession;
}

// Update shopping session status
export async function updateShoppingSessionStatus(
  sessionId: string,
  status: 'completed' | 'abandoned'
): Promise<boolean> {
  const { error } = await supabase
    .from('shopping_sessions')
    .update({ 
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating shopping session:', error);
    return false;
  }

  return true;
}

// Get user's shopping sessions
export async function getUserShoppingSessions(userId: string): Promise<ShoppingSession[]> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shopping sessions:', error);
    return [];
  }

  return (data as ShoppingSession[]) || [];
}

// Track conversion (when user completes purchase)
export async function trackConversion(
  shoppingSessionId: string,
  orderId: string,
  actualTotalCents: number,
  commissionCents: number
): Promise<boolean> {
  const { error } = await supabase
    .from('affiliate_conversions')
    .insert({
      shopping_session_id: shoppingSessionId,
      order_id: orderId,
      actual_total_cents: actualTotalCents,
      commission_cents: commissionCents
    });

  if (error) {
    console.error('Error tracking conversion:', error);
    return false;
  }

  // Also update the shopping session status
  await updateShoppingSessionStatus(shoppingSessionId, 'completed');
  
  return true;
}

// Generate a unique session ID for tracking
function generateSessionId(userId?: string): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  const userPart = userId ? userId.substring(0, 8) : 'guest';
  
  return `${userPart}_${timestamp}_${randomPart}`;
}

// Format price for display
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Calculate estimated savings or value proposition
export function calculateValueProposition(
  cartItems: CartItem[],
  retailer: Retailer
): string {
  const totalValue = cartItems.reduce((sum, item) => 
    sum + (item.product.price_cents || 0), 0
  );
  
  const numRecipes = cartItems.length; // Simplified - each ingredient unlocks recipes
  
  if (retailer.min_order_for_delivery && totalValue >= (retailer.min_order_for_delivery * 100)) {
    return "Free delivery included!";
  }
  
  if (numRecipes > 3) {
    return `Unlock ${numRecipes}+ cocktail recipes`;
  }
  
  return "Everything you need to get started";
}