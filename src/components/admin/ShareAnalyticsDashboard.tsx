import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Share2, 
  Activity,
  Clock,
  Award
} from "lucide-react";
import {
  getTopSharedRecipes,
  getPlatformStats,
  getShareVelocity,
  getTimeRangeStats,
  getHourlyDistribution,
  type TopSharedRecipe,
  type PlatformStats,
  type ShareVelocity,
  type TimeRangeStats,
} from "@/services/shareAnalyticsService";
import LoadingSpinner from "@/components/LoadingSpinner";

const COLORS = ['#065F46', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#84CC16', '#EC4899', '#8B5CF6'];

export function ShareAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  
  // State for all analytics data
  const [topRecipes, setTopRecipes] = useState<TopSharedRecipe[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [shareVelocity, setShareVelocity] = useState<ShareVelocity[]>([]);
  const [timeRangeStats, setTimeRangeStats] = useState<TimeRangeStats | null>(null);
  const [hourlyDistribution, setHourlyDistribution] = useState<{ hour: number; share_count: number }[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [recipes, platforms, velocity, stats, hourly] = await Promise.all([
        getTopSharedRecipes(10),
        getPlatformStats(),
        getShareVelocity(timeRange),
        getTimeRangeStats(timeRange),
        getHourlyDistribution(),
      ]);

      setTopRecipes(recipes);
      setPlatformStats(platforms);
      setShareVelocity(velocity);
      setTimeRangeStats(stats);
      setHourlyDistribution(hourly);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Share Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track recipe sharing performance and user engagement</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <Badge
          variant={timeRange === 7 ? "default" : "outline"}
          className="cursor-pointer rounded-organic-sm"
          onClick={() => setTimeRange(7)}
        >
          Last 7 Days
        </Badge>
        <Badge
          variant={timeRange === 30 ? "default" : "outline"}
          className="cursor-pointer rounded-organic-sm"
          onClick={() => setTimeRange(30)}
        >
          Last 30 Days
        </Badge>
        <Badge
          variant={timeRange === 90 ? "default" : "outline"}
          className="cursor-pointer rounded-organic-sm"
          onClick={() => setTimeRange(90)}
        >
          Last 90 Days
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border rounded-organic-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-available" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{timeRangeStats?.total_shares || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-organic-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-available" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{timeRangeStats?.unique_users || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active sharers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-organic-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Recipes Shared</CardTitle>
            <Award className="h-4 w-4 text-available" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{timeRangeStats?.unique_recipes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Different recipes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-organic-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Avg per Recipe</CardTitle>
            <TrendingUp className="h-4 w-4 text-available" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {timeRangeStats?.average_shares_per_recipe.toFixed(1) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Shares per recipe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="velocity" className="space-y-4">
        <TabsList className="bg-card border border-border rounded-organic-md">
          <TabsTrigger value="velocity" className="rounded-organic-sm">Share Velocity</TabsTrigger>
          <TabsTrigger value="platforms" className="rounded-organic-sm">Platform Stats</TabsTrigger>
          <TabsTrigger value="recipes" className="rounded-organic-sm">Top Recipes</TabsTrigger>
          <TabsTrigger value="timing" className="rounded-organic-sm">Peak Times</TabsTrigger>
        </TabsList>

        {/* Share Velocity Over Time */}
        <TabsContent value="velocity" className="space-y-4">
          <Card className="bg-card border-border rounded-organic-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-available" />
                Share Velocity Trend
              </CardTitle>
              <CardDescription>Daily share activity over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shareVelocity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#D1D5DB"
                    tick={{ fill: '#D1D5DB', fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#D1D5DB"
                    tick={{ fill: '#D1D5DB', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#D1D5DB'
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                  <Line 
                    type="monotone" 
                    dataKey="share_count" 
                    stroke="#065F46" 
                    strokeWidth={2}
                    name="Shares"
                    dot={{ fill: '#10B981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Distribution */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border rounded-organic-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Platform Distribution</CardTitle>
                <CardDescription>Share count by social platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={platformStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ platform, percentage }) => `${platform}: ${percentage.toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="share_count"
                    >
                      {platformStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#374151', 
                        border: '1px solid #4B5563',
                        borderRadius: '8px',
                        color: '#D1D5DB'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-organic-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Platform Rankings</CardTitle>
                <CardDescription>Most popular sharing channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformStats.map((platform, index) => (
                    <div key={platform.platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          className="rounded-organic-sm font-bold min-w-[30px] justify-center"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {index + 1}
                        </Badge>
                        <span className="text-foreground font-medium capitalize">
                          {platform.platform.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {platform.share_count} shares
                        </span>
                        <Badge variant="outline" className="rounded-organic-sm">
                          {platform.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Shared Recipes */}
        <TabsContent value="recipes" className="space-y-4">
          <Card className="bg-card border-border rounded-organic-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Award className="h-5 w-5 text-available" />
                Top Shared Recipes
              </CardTitle>
              <CardDescription>Most viral cocktail recipes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRecipes.map((recipe, index) => (
                  <div key={recipe.recipe_id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge 
                          className="rounded-full h-8 w-8 flex items-center justify-center text-base font-bold"
                          style={{ 
                            backgroundColor: index < 3 ? COLORS[index] : '#6B7280' 
                          }}
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-semibold text-foreground">{recipe.recipe_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {recipe.recent_shares} shares this week
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-available">{recipe.total_shares}</div>
                        <div className="text-xs text-muted-foreground">total shares</div>
                      </div>
                    </div>
                    {index < topRecipes.length - 1 && <Separator className="mt-4 bg-border" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peak Sharing Times */}
        <TabsContent value="timing" className="space-y-4">
          <Card className="bg-card border-border rounded-organic-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-available" />
                Peak Sharing Times
              </CardTitle>
              <CardDescription>When users share the most (by hour of day)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#D1D5DB"
                    tick={{ fill: '#D1D5DB', fontSize: 12 }}
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis 
                    stroke="#D1D5DB"
                    tick={{ fill: '#D1D5DB', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      color: '#D1D5DB'
                    }}
                    labelFormatter={(hour) => `${hour}:00 - ${hour + 1}:00`}
                  />
                  <Bar 
                    dataKey="share_count" 
                    fill="#065F46" 
                    name="Shares"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
