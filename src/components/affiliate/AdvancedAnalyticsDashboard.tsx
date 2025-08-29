import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  Download,
  Filter,
  Eye,
  MousePointer,
  ShoppingCart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    byPeriod: { period: string; amount: number }[];
  };
  conversions: {
    rate: number;
    total: number;
    bySource: { source: string; conversions: number }[];
  };
  userBehavior: {
    avgSessionDuration: number;
    bounceRate: number;
    topPages: { page: string; views: number }[];
  };
  productPerformance: {
    topSellers: { product: string; sales: number; revenue: number }[];
    categoryBreakdown: { category: string; percentage: number }[];
  };
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function AdvancedAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate comprehensive analytics data
      const mockData: AnalyticsData = {
        revenue: {
          total: 45687,
          growth: 23.4,
          byPeriod: [
            { period: 'Week 1', amount: 8945 },
            { period: 'Week 2', amount: 11234 },
            { period: 'Week 3', amount: 12678 },
            { period: 'Week 4', amount: 12830 }
          ]
        },
        conversions: {
          rate: 8.7,
          total: 127,
          bySource: [
            { source: 'Direct', conversions: 45 },
            { source: 'Recipe Recommendations', conversions: 38 },
            { source: 'Social Media', conversions: 24 },
            { source: 'Email Campaign', conversions: 20 }
          ]
        },
        userBehavior: {
          avgSessionDuration: 342,
          bounceRate: 24.3,
          topPages: [
            { page: '/mybar', views: 2847 },
            { page: '/recipes', views: 2156 },
            { page: '/affiliate-shopping', views: 1923 },
            { page: '/cocktail/old-fashioned', views: 1678 }
          ]
        },
        productPerformance: {
          topSellers: [
            { product: 'Premium Bourbon Bundle', sales: 23, revenue: 1587 },
            { product: 'Gin Essentials Kit', sales: 19, revenue: 1234 },
            { product: 'Cocktail Tool Set', sales: 17, revenue: 978 },
            { product: 'Bitters Collection', sales: 15, revenue: 756 }
          ],
          categoryBreakdown: [
            { category: 'Spirits', percentage: 45.2 },
            { category: 'Tools & Accessories', percentage: 28.7 },
            { category: 'Mixers & Syrups', percentage: 16.8 },
            { category: 'Bitters & Aromatics', percentage: 9.3 }
          ]
        }
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${(amount / 100).toFixed(2)}`;
  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  const metricCards: MetricCard[] = analytics ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.revenue.total),
      change: analytics.revenue.growth,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-emerald-500'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversions.rate}%`,
      change: 12.5,
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-500'
    },
    {
      title: 'Avg Session Time',
      value: formatDuration(analytics.userBehavior.avgSessionDuration),
      change: -5.2,
      icon: <Eye className="h-5 w-5" />,
      color: 'text-purple-500'
    },
    {
      title: 'Total Conversions',
      value: analytics.conversions.total.toString(),
      change: 18.9,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'text-orange-500'
    }
  ] : [];

  if (loading || !analytics) {
    return (
      <Card className="organic-md border-border bg-card">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-available animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-pure-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-available" />
            Advanced Analytics
          </h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your affiliate performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card key={index} className="organic-sm border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                <div className={`text-xs flex items-center gap-1 ${
                  metric.change > 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-pure-white">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Analytics
                </span>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">
                  +{analytics.revenue.growth}% vs last period
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Revenue by Week</h4>
                  <div className="space-y-3">
                    {analytics.revenue.byPeriod.map((period, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-light-text">{period.period}</span>
                        <span className="font-medium text-available">
                          {formatCurrency(period.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Key Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Average Order Value</div>
                      <div className="text-lg font-bold text-available">$127.45</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Revenue per User</div>
                      <div className="text-lg font-bold text-available">$89.23</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Customer Lifetime Value</div>
                      <div className="text-lg font-bold text-available">$342.18</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conversion Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Conversions by Source</h4>
                  <div className="space-y-3">
                    {analytics.conversions.bySource.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-light-text">{source.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {((source.conversions / analytics.conversions.total) * 100).toFixed(1)}%
                          </span>
                          <span className="font-medium text-available">
                            {source.conversions}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Funnel Analysis</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Page Views</div>
                      <div className="text-lg font-bold text-pure-white">12,456</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Product Views</div>
                      <div className="text-lg font-bold text-pure-white">3,287</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Add to Cart</div>
                      <div className="text-lg font-bold text-pure-white">1,456</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Purchases</div>
                      <div className="text-lg font-bold text-available">{analytics.conversions.total}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Behavior
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Top Pages</h4>
                  <div className="space-y-3">
                    {analytics.userBehavior.topPages.map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-light-text font-mono text-sm">{page.page}</span>
                        <span className="font-medium text-available">{page.views}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Engagement Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Bounce Rate</div>
                      <div className="text-lg font-bold text-pure-white">{analytics.userBehavior.bounceRate}%</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Pages per Session</div>
                      <div className="text-lg font-bold text-pure-white">3.7</div>
                    </div>
                    <div className="p-3 bg-card border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Return Visitor Rate</div>
                      <div className="text-lg font-bold text-available">67.2%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Product Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Top Sellers</h4>
                  <div className="space-y-3">
                    {analytics.productPerformance.topSellers.map((product, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-light-text font-medium">{product.product}</span>
                          <Badge variant="secondary">{product.sales} sales</Badge>
                        </div>
                        <div className="text-sm text-available font-medium">
                          {formatCurrency(product.revenue)} revenue
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-pure-white mb-3">Category Breakdown</h4>
                  <div className="space-y-3">
                    {analytics.productPerformance.categoryBreakdown.map((category, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-light-text">{category.category}</span>
                          <span className="font-medium text-available">{category.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}