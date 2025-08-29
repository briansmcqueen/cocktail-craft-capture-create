import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Trash2, Plus, Minus, ExternalLink, Star } from "lucide-react";
import { ProductMapping, Retailer } from "@/services/productMappingService";
import { formatPrice, generateAffiliateUrl, createShoppingSession } from "@/services/affiliateService";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CartItem {
  id: string;
  ingredient_id: string;
  ingredient_name: string;
  product: ProductMapping;
  retailer: Retailer;
  quantity: number;
}

interface MultiRetailerCartProps {
  className?: string;
}

export default function MultiRetailerCart({ className = "" }: MultiRetailerCartProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Add item to cart
  const addToCart = (retailer: Retailer, product: ProductMapping, ingredientName: string) => {
    const existingItem = cartItems.find(
      item => item.product.id === product.id && item.retailer.id === retailer.id
    );

    if (existingItem) {
      // Increase quantity
      setCartItems(items => 
        items.map(item => 
          item.id === existingItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${retailer.id}_${product.id}_${Date.now()}`,
        ingredient_id: product.ingredient_id,
        ingredient_name: ingredientName,
        product,
        retailer,
        quantity: 1
      };
      setCartItems(items => [...items, newItem]);
    }

    toast.success(`${ingredientName} added to cart`);
  };

  // Update item quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast.info("Item removed from cart");
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  // Group items by retailer
  const itemsByRetailer = cartItems.reduce((groups, item) => {
    const retailerId = item.retailer.id;
    if (!groups[retailerId]) {
      groups[retailerId] = {
        retailer: item.retailer,
        items: []
      };
    }
    groups[retailerId].items.push(item);
    return groups;
  }, {} as Record<string, { retailer: Retailer; items: CartItem[] }>);

  // Calculate totals for a retailer
  const calculateRetailerTotal = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => 
      sum + (item.product.price_cents || 0) * item.quantity, 0
    );
    const tax = Math.round(subtotal * 0.085); // 8.5% tax
    const delivery = items[0]?.retailer.delivery_fee_cents || 0;
    return {
      subtotal,
      tax,
      delivery,
      total: subtotal + tax + delivery
    };
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return Object.values(itemsByRetailer).reduce((sum, { items }) => {
      const { total } = calculateRetailerTotal(items);
      return sum + total;
    }, 0);
  };

  // Checkout with a specific retailer
  const checkoutWithRetailer = async (retailerId: string) => {
    const retailerGroup = itemsByRetailer[retailerId];
    if (!retailerGroup) return;

    setLoading(true);
    try {
      // Generate affiliate URL
      const affiliateUrl = generateAffiliateUrl(
        retailerGroup.retailer,
        retailerGroup.items.map(item => ({
          ingredient_id: item.ingredient_id,
          ingredient_name: item.ingredient_name,
          product: item.product,
          quantity: item.quantity
        })),
        user?.id
      );

      // Create shopping session
      const { total } = calculateRetailerTotal(retailerGroup.items);
      const session = await createShoppingSession(
        retailerId,
        [], // Recipe IDs - could be enhanced later
        retailerGroup.items.map(item => item.ingredient_id),
        total,
        affiliateUrl,
        user?.id
      );

      if (session) {
        localStorage.setItem('lastShoppingSession', session.id);
        toast.success(`Redirecting to ${retailerGroup.retailer.name}...`);
        
        // Remove items from cart after successful checkout
        setCartItems(items => items.filter(item => item.retailer.id !== retailerId));
        
        setTimeout(() => {
          window.open(affiliateUrl, '_blank');
        }, 1000);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  // Expose addToCart function for parent components
  React.useImperativeHandle(React.createRef(), () => ({
    addToCart
  }));

  if (cartItems.length === 0) {
    return (
      <Card className={`organic-md border-border bg-card ${className}`}>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <div className="text-muted-foreground">Your cart is empty</div>
          <div className="text-sm text-muted-foreground mt-1">
            Add ingredients from price comparisons to get started
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`organic-md border-border bg-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-pure-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({cartItems.length} items)
          </span>
          <Button variant="outline" size="sm" onClick={clearCart}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="by-retailer">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-retailer">By Retailer</TabsTrigger>
            <TabsTrigger value="all-items">All Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="by-retailer" className="space-y-6">
            {Object.entries(itemsByRetailer).map(([retailerId, { retailer, items }]) => {
              const totals = calculateRetailerTotal(items);
              
              return (
                <Card key={retailerId} className="organic-sm border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {retailer.logo_url && (
                          <img 
                            src={retailer.logo_url} 
                            alt={`${retailer.name} logo`}
                            className="h-8 w-8 rounded object-contain"
                          />
                        )}
                        <div>
                          <div className="font-medium text-pure-white">{retailer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {items.length} item{items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-available">
                          {formatPrice(totals.total)}
                        </div>
                        {retailer.min_order_for_delivery && totals.subtotal >= (retailer.min_order_for_delivery * 100) && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Free Delivery
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-light-text">{item.ingredient_name}</div>
                          <div className="text-sm text-muted-foreground">{item.product.product_name}</div>
                          {item.product.size_description && (
                            <div className="text-xs text-muted-foreground">{item.product.size_description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <div className="font-medium text-available">
                              {formatPrice((item.product.price_cents || 0) * item.quantity)}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Order Summary */}
                    <div className="border-t border-border pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatPrice(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (est.):</span>
                        <span>{formatPrice(totals.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery:</span>
                        <span>{totals.delivery > 0 ? formatPrice(totals.delivery) : 'Free'}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-1">
                        <span>Total:</span>
                        <span className="text-available">{formatPrice(totals.total)}</span>
                      </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <Button 
                      className="w-full"
                      onClick={() => checkoutWithRetailer(retailerId)}
                      disabled={loading}
                    >
                      Checkout at {retailer.name}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          <TabsContent value="all-items" className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-light-text">{item.ingredient_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.product.product_name} • {item.retailer.name}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="font-medium text-available">
                      {formatPrice((item.product.price_cents || 0) * item.quantity)}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Grand Total */}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span className="text-available">{formatPrice(calculateGrandTotal())}</span>
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                Items will be purchased separately from each retailer
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Export the addToCart function for external use
export const addToMultiRetailerCart = (
  cartRef: React.RefObject<any>, 
  retailer: Retailer, 
  product: ProductMapping, 
  ingredientName: string
) => {
  if (cartRef.current) {
    cartRef.current.addToCart(retailer, product, ingredientName);
  }
};