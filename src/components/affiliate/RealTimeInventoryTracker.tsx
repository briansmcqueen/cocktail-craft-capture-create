import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Bell,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  retailerId: string;
  retailerName: string;
  stockLevel: number;
  lowStockThreshold: number;
  priceHistory: PricePoint[];
  lastUpdated: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  trending: 'up' | 'down' | 'stable';
}

interface PricePoint {
  timestamp: string;
  price: number;
}

interface StockAlert {
  id: string;
  ingredientName: string;
  retailerName: string;
  type: 'low-stock' | 'out-of-stock' | 'price-drop' | 'back-in-stock';
  message: string;
  timestamp: string;
}

export default function RealTimeInventoryTracker() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadInventoryData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadInventoryData();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadInventoryData = async () => {
    try {
      // Simulate real-time inventory data
      const mockInventory: InventoryItem[] = [
        {
          id: '1',
          ingredientId: 'gin',
          ingredientName: 'Premium London Dry Gin',
          retailerId: 'total-wine',
          retailerName: 'Total Wine',
          stockLevel: 85,
          lowStockThreshold: 20,
          lastUpdated: new Date().toISOString(),
          availability: 'in-stock',
          trending: 'stable',
          priceHistory: [
            { timestamp: '2024-01-01', price: 2499 },
            { timestamp: '2024-01-02', price: 2399 },
            { timestamp: '2024-01-03', price: 2499 }
          ]
        },
        {
          id: '2',
          ingredientId: 'sweet-vermouth',
          ingredientName: 'Sweet Vermouth',
          retailerId: 'wine-com',
          retailerName: 'Wine.com',
          stockLevel: 12,
          lowStockThreshold: 15,
          lastUpdated: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          availability: 'low-stock',
          trending: 'down',
          priceHistory: [
            { timestamp: '2024-01-01', price: 1599 },
            { timestamp: '2024-01-02', price: 1699 },
            { timestamp: '2024-01-03', price: 1799 }
          ]
        },
        {
          id: '3',
          ingredientId: 'angostura-bitters',
          ingredientName: 'Angostura Bitters',
          retailerId: 'drizly',
          retailerName: 'Drizly',
          stockLevel: 0,
          lowStockThreshold: 10,
          lastUpdated: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          availability: 'out-of-stock',
          trending: 'down',
          priceHistory: [
            { timestamp: '2024-01-01', price: 899 },
            { timestamp: '2024-01-02', price: 849 },
            { timestamp: '2024-01-03', price: 899 }
          ]
        }
      ];

      setInventory(mockInventory);

      // Generate alerts based on inventory
      const newAlerts: StockAlert[] = [];
      mockInventory.forEach(item => {
        if (item.availability === 'low-stock') {
          newAlerts.push({
            id: `alert-${item.id}`,
            ingredientName: item.ingredientName,
            retailerName: item.retailerName,
            type: 'low-stock',
            message: `Only ${item.stockLevel} units remaining`,
            timestamp: new Date().toISOString()
          });
        } else if (item.availability === 'out-of-stock') {
          newAlerts.push({
            id: `alert-${item.id}`,
            ingredientName: item.ingredientName,
            retailerName: item.retailerName,
            type: 'out-of-stock',
            message: 'Currently out of stock',
            timestamp: new Date().toISOString()
          });
        }
      });

      setAlerts(newAlerts);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast.error('Failed to load inventory data');
    }
  };

  const refreshInventory = async () => {
    setLoading(true);
    await loadInventoryData();
    setLoading(false);
    toast.success('Inventory data refreshed');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-emerald-500';
      case 'low-stock': return 'text-yellow-500';
      case 'out-of-stock': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'in-stock': return <CheckCircle className="h-4 w-4" />;
      case 'low-stock': return <AlertTriangle className="h-4 w-4" />;
      case 'out-of-stock': return <Package className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTrendingIcon = (trending: string) => {
    switch (trending) {
      case 'up': return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-pure-white flex items-center gap-2">
            <Package className="h-6 w-6 text-available" />
            Real-Time Inventory
          </h2>
          <p className="text-muted-foreground">
            Live stock levels and price tracking across retailers
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              id="auto-refresh"
            />
            <label htmlFor="auto-refresh" className="text-sm text-light-text">
              Auto-refresh
            </label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshInventory}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="organic-md border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-pure-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              Stock Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="font-medium text-pure-white">
                      {alert.ingredientName} at {alert.retailerName}
                    </div>
                    <div className="text-sm text-muted-foreground">{alert.message}</div>
                  </div>
                </div>
                <Badge variant={alert.type === 'out-of-stock' ? 'destructive' : 'secondary'}>
                  {alert.type.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid gap-4">
        {inventory.map((item) => (
          <Card key={item.id} className="organic-md border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={getAvailabilityColor(item.availability)}>
                    {getAvailabilityIcon(item.availability)}
                  </div>
                  <div>
                    <div className="font-medium text-pure-white">{item.ingredientName}</div>
                    <div className="text-sm text-muted-foreground">{item.retailerName}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getTrendingIcon(item.trending)}
                  <Badge 
                    variant={item.availability === 'in-stock' ? 'default' : 
                            item.availability === 'low-stock' ? 'secondary' : 'destructive'}
                  >
                    {item.availability.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Stock Level Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-light-text">Stock Level</span>
                  <span className={getAvailabilityColor(item.availability)}>
                    {item.stockLevel} units
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, (item.stockLevel / 100) * 100)} 
                  className="h-2"
                />
                {item.stockLevel <= item.lowStockThreshold && item.stockLevel > 0 && (
                  <div className="text-xs text-yellow-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Below threshold ({item.lowStockThreshold} units)
                  </div>
                )}
              </div>

              {/* Price Trend */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-light-text">Current Price</span>
                  <span className="text-available font-medium">
                    ${(item.priceHistory[item.priceHistory.length - 1]?.price / 100).toFixed(2)}
                  </span>
                </div>
                
                {item.priceHistory.length >= 2 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {item.trending === 'up' ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-red-500" />
                        Price increased from ${(item.priceHistory[0].price / 100).toFixed(2)}
                      </>
                    ) : item.trending === 'down' ? (
                      <>
                        <TrendingDown className="h-3 w-3 text-emerald-500" />
                        Price dropped from ${(item.priceHistory[0].price / 100).toFixed(2)}
                      </>
                    ) : (
                      <span>Price stable</span>
                    )}
                  </div>
                )}
              </div>

              {/* Last Updated */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated {new Date(item.lastUpdated).toLocaleTimeString()}
                </div>
                
                {item.availability === 'in-stock' && (
                  <div className="flex items-center gap-1 text-emerald-500">
                    <Zap className="h-3 w-3" />
                    Available now
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Last Refresh Info */}
      <div className="text-center text-xs text-muted-foreground">
        Last refreshed: {lastRefresh.toLocaleTimeString()}
        {autoRefresh && " • Auto-refresh enabled"}
      </div>
    </div>
  );
}