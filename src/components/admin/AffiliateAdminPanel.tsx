import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/services/affiliateService";
import { toast } from "sonner";

interface RetailerData {
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

interface ProductMappingData {
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

interface AffiliateStats {
  total_sessions: number;
  total_conversions: number;
  total_revenue_cents: number;
  total_commission_cents: number;
  conversion_rate: number;
  avg_order_value_cents: number;
}

export default function AffiliateAdminPanel() {
  const { user } = useAuth();
  const [retailers, setRetailers] = useState<RetailerData[]>([]);
  const [products, setProducts] = useState<ProductMappingData[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRetailer, setEditingRetailer] = useState<RetailerData | null>(null);
  const [newRetailer, setNewRetailer] = useState<Partial<RetailerData>>({});

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRetailers(),
        fetchProducts(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRetailers = async () => {
    const { data, error } = await supabase
      .from('retailers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    setRetailers(data || []);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('product_mappings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    setProducts(data || []);
  };

  const fetchStats = async () => {
    // Fetch shopping sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('shopping_sessions')
      .select('*');
    
    if (sessionsError) throw sessionsError;

    // Fetch conversions
    const { data: conversions, error: conversionsError } = await supabase
      .from('affiliate_conversions')
      .select('*');
    
    if (conversionsError) throw conversionsError;

    // Calculate stats
    const totalSessions = sessions?.length || 0;
    const totalConversions = conversions?.length || 0;
    const totalRevenue = conversions?.reduce((sum, c) => sum + (c.actual_total_cents || 0), 0) || 0;
    const totalCommission = conversions?.reduce((sum, c) => sum + (c.commission_cents || 0), 0) || 0;
    const conversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;
    const avgOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0;

    setStats({
      total_sessions: totalSessions,
      total_conversions: totalConversions,
      total_revenue_cents: totalRevenue,
      total_commission_cents: totalCommission,
      conversion_rate: conversionRate,
      avg_order_value_cents: avgOrderValue
    });
  };

  const saveRetailer = async (retailerData: Partial<RetailerData>) => {
    try {
      if (retailerData.id) {
        // Update existing
        const { error } = await supabase
          .from('retailers')
          .update(retailerData)
          .eq('id', retailerData.id);
        
        if (error) throw error;
        toast.success("Retailer updated successfully");
      } else {
        // Create new
        const { error } = await supabase
          .from('retailers')
          .insert(retailerData as any);
        
        if (error) throw error;
        toast.success("Retailer created successfully");
      }
      
      await fetchRetailers();
      setEditingRetailer(null);
      setNewRetailer({});
    } catch (error) {
      console.error('Error saving retailer:', error);
      toast.error("Failed to save retailer");
    }
  };

  const deleteRetailer = async (retailerId: string) => {
    try {
      const { error } = await supabase
        .from('retailers')
        .delete()
        .eq('id', retailerId);
      
      if (error) throw error;
      toast.success("Retailer deleted successfully");
      await fetchRetailers();
    } catch (error) {
      console.error('Error deleting retailer:', error);
      toast.error("Failed to delete retailer");
    }
  };

  if (loading) {
    return (
      <Card className="organic-md">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Loading admin panel...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-pure-white">
          🔧 Affiliate Admin Panel
        </h2>
        <p className="text-muted-foreground">
          Manage retailers, products, and track affiliate performance
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="organic-sm border-border bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-available">{stats.total_sessions}</div>
              <div className="text-sm text-muted-foreground">Shopping Sessions</div>
            </CardContent>
          </Card>
          <Card className="organic-sm border-border bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-available">{stats.total_conversions}</div>
              <div className="text-sm text-muted-foreground">Conversions</div>
            </CardContent>
          </Card>
          <Card className="organic-sm border-border bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-available">
                {formatPrice(stats.total_commission_cents)}
              </div>
              <div className="text-sm text-muted-foreground">Total Commission</div>
            </CardContent>
          </Card>
          <Card className="organic-sm border-border bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-available">
                {stats.conversion_rate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="retailers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="retailers">Retailers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="retailers" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Retailer Management
                </span>
                <Button 
                  size="sm"
                  onClick={() => setEditingRetailer({} as RetailerData)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Retailer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {retailers.map(retailer => (
                <Card key={retailer.id} className="organic-sm border-border">
                  <CardContent className="p-4">
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
                          <div className="text-sm text-muted-foreground">{retailer.base_url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={retailer.supports_api ? "default" : "secondary"}>
                          {retailer.supports_api ? "API" : "Manual"}
                        </Badge>
                        {retailer.commission_rate && (
                          <Badge variant="outline">
                            {(retailer.commission_rate * 100).toFixed(1)}% commission
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingRetailer(retailer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteRetailer(retailer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Edit/Add Retailer Form */}
              {editingRetailer && (
                <Card className="organic-sm border-available bg-available/5">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {editingRetailer.id ? 'Edit' : 'Add'} Retailer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-light-text">Name</label>
                        <Input
                          value={editingRetailer.name || ''}
                          onChange={(e) => setEditingRetailer({...editingRetailer, name: e.target.value})}
                          placeholder="Total Wine & More"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-light-text">ID</label>
                        <Input
                          value={editingRetailer.id || ''}
                          onChange={(e) => setEditingRetailer({...editingRetailer, id: e.target.value})}
                          placeholder="total-wine"
                          disabled={!!editingRetailer.id}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-light-text">Base URL</label>
                        <Input
                          value={editingRetailer.base_url || ''}
                          onChange={(e) => setEditingRetailer({...editingRetailer, base_url: e.target.value})}
                          placeholder="https://www.totalwine.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-light-text">Affiliate ID</label>
                        <Input
                          value={editingRetailer.affiliate_id || ''}
                          onChange={(e) => setEditingRetailer({...editingRetailer, affiliate_id: e.target.value})}
                          placeholder="barbook_123"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-light-text">Commission Rate (%)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editingRetailer.commission_rate || ''}
                          onChange={(e) => setEditingRetailer({...editingRetailer, commission_rate: parseFloat(e.target.value)})}
                          placeholder="5.0"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-light-text">Delivery Fee (cents)</label>
                        <Input
                          type="number"
                          value={editingRetailer.delivery_fee_cents || ''}
                          onChange={(e) => setEditingRetailer({...editingRetailer, delivery_fee_cents: parseInt(e.target.value)})}
                          placeholder="999"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => saveRetailer(editingRetailer)}
                        disabled={!editingRetailer.name || !editingRetailer.id}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingRetailer(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Mappings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {products.map(product => (
                <Card key={product.id} className="organic-sm border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-pure-white">{product.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.ingredient_id} • {product.retailer_id}
                        </div>
                        {product.size_description && (
                          <div className="text-xs text-muted-foreground">{product.size_description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-available">
                          {formatPrice(product.price_cents || 0)}
                        </div>
                        <div className="flex gap-1">
                          <Badge variant={product.in_stock ? "default" : "secondary"}>
                            {product.in_stock ? "In Stock" : "Out of Stock"}
                          </Badge>
                          <Badge variant="outline">
                            Priority: {product.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-light-text mb-3">Revenue Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="text-available font-medium">
                          {formatPrice(stats.total_revenue_cents)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Commission:</span>
                        <span className="text-available font-medium">
                          {formatPrice(stats.total_commission_cents)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Order Value:</span>
                        <span className="text-available font-medium">
                          {formatPrice(stats.avg_order_value_cents)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-light-text mb-3">Conversion Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Sessions:</span>
                        <span className="font-medium">{stats.total_sessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversions:</span>
                        <span className="font-medium">{stats.total_conversions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion Rate:</span>
                        <span className="text-available font-medium">
                          {stats.conversion_rate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}