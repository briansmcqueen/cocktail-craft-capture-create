import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, TrendingUp, ExternalLink, Star } from "lucide-react";
import { ProductMapping, Retailer, findProductsForIngredient, getRetailers } from "@/services/productMappingService";
import { formatPrice } from "@/services/affiliateService";
import { Ingredient } from "@/data/ingredients";

interface PriceComparisonProps {
  ingredient: Ingredient;
  onAddToCart: (retailerId: string, product: ProductMapping) => void;
  className?: string;
}

export default function PriceComparison({ 
  ingredient, 
  onAddToCart, 
  className = "" 
}: PriceComparisonProps) {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [productsByRetailer, setProductsByRetailer] = useState<Map<string, ProductMapping[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<"comparison" | "best">("best");

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      
      try {
        // Get all retailers
        const retailerList = await getRetailers();
        setRetailers(retailerList);
        
        // Get products for each retailer
        const productMap = new Map<string, ProductMapping[]>();
        
        for (const retailer of retailerList) {
          const products = await findProductsForIngredient(ingredient.id, retailer.id);
          if (products.length > 0) {
            productMap.set(retailer.id, products);
          }
        }
        
        setProductsByRetailer(productMap);
      } catch (error) {
        console.error('Error fetching price comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [ingredient.id]);

  const getBestDeal = () => {
    let bestProduct: ProductMapping | null = null;
    let bestRetailer: Retailer | null = null;
    let lowestPrice = Infinity;
    
    for (const [retailerId, products] of productsByRetailer) {
      const retailer = retailers.find(r => r.id === retailerId);
      if (!retailer) continue;
      
      for (const product of products) {
        if (product.price_cents && product.price_cents < lowestPrice) {
          lowestPrice = product.price_cents;
          bestProduct = product;
          bestRetailer = retailer;
        }
      }
    }
    
    return { product: bestProduct, retailer: bestRetailer };
  };

  const getRetailerProducts = (retailerId: string) => {
    return productsByRetailer.get(retailerId) || [];
  };

  if (loading) {
    return (
      <Card className={`organic-md ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Loading price comparison...</div>
        </CardContent>
      </Card>
    );
  }

  if (productsByRetailer.size === 0) {
    return (
      <Card className={`organic-md border-border bg-card ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No products found for {ingredient.name}</div>
        </CardContent>
      </Card>
    );
  }

  const { product: bestProduct, retailer: bestRetailer } = getBestDeal();

  return (
    <Card className={`organic-md border-border bg-card ${className}`}>
      <CardHeader>
        <CardTitle className="text-pure-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {ingredient.name} - Price Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as "comparison" | "best")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="best">Best Deal</TabsTrigger>
            <TabsTrigger value="comparison">Compare All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="best" className="space-y-4">
            {bestProduct && bestRetailer ? (
              <Card className="organic-sm border-available bg-available/10">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-pure-white">{bestProduct.product_name}</div>
                      <div className="text-sm text-muted-foreground">{bestRetailer.name}</div>
                      {bestProduct.size_description && (
                        <div className="text-xs text-muted-foreground">{bestProduct.size_description}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-available">
                        {formatPrice(bestProduct.price_cents || 0)}
                      </div>
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Best Price
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onAddToCart(bestRetailer.id, bestProduct)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(bestProduct.product_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center text-muted-foreground">No products available</div>
            )}
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-4">
            {retailers.map(retailer => {
              const products = getRetailerProducts(retailer.id);
              if (products.length === 0) return null;
              
              const cheapestProduct = products.reduce((prev, current) => 
                (prev.price_cents || 0) < (current.price_cents || 0) ? prev : current
              );
              
              return (
                <Card key={retailer.id} className="organic-sm border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-pure-white">{retailer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {products.length} option{products.length !== 1 ? 's' : ''} available
                        </div>
                      </div>
                      {retailer.logo_url && (
                        <img 
                          src={retailer.logo_url} 
                          alt={`${retailer.name} logo`}
                          className="h-8 w-8 rounded object-contain"
                        />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {products.slice(0, 2).map(product => (
                        <div key={product.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-light-text">
                              {product.product_name}
                            </div>
                            {product.size_description && (
                              <div className="text-xs text-muted-foreground">
                                {product.size_description}
                              </div>
                            )}
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <span className="font-bold text-available">
                              {formatPrice(product.price_cents || 0)}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onAddToCart(retailer.id, product)}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {products.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                          +{products.length - 2} more options
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}