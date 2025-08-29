import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  Package, 
  User, 
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import AIRecommendationEngine from './AIRecommendationEngine';
import RealTimeInventoryTracker from './RealTimeInventoryTracker';
import PersonalizedShoppingExperience from './PersonalizedShoppingExperience';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';

export default function AffiliatePhase4Demo() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'ai-recommendations',
      title: 'AI Recommendation Engine',
      description: 'Machine learning-powered cocktail and ingredient suggestions',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      capabilities: [
        'Behavioral Pattern Analysis',
        'Predictive Purchase Intent',
        'Smart Bundle Creation',
        'Cocktail Recipe Matching',
        'Price Optimization'
      ]
    },
    {
      id: 'inventory-tracking',
      title: 'Real-Time Inventory',
      description: 'Live stock levels and price monitoring across all retailers',
      icon: <Package className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-500',
      capabilities: [
        'Live Stock Monitoring',
        'Price Drop Alerts',
        'Availability Tracking',
        'Demand Forecasting',
        'Automated Restocking'
      ]
    },
    {
      id: 'personalized-shopping',
      title: 'Personalized Experience',
      description: 'Tailored shopping journey based on individual preferences',
      icon: <User className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      capabilities: [
        'Custom Shopping Profiles',
        'Personalized Offers',
        'Budget Optimization',
        'Preference Learning',
        'Smart Notifications'
      ]
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive insights and performance optimization',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-orange-500 to-red-500',
      capabilities: [
        'Revenue Attribution',
        'Conversion Funnels',
        'Customer Lifetime Value',
        'Cohort Analysis',
        'Predictive Modeling'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-available animate-pulse" />
          <h1 className="text-4xl font-serif font-bold text-pure-white">
            Phase 4: AI-Powered Commerce
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced artificial intelligence, real-time data processing, and personalized experiences 
          that revolutionize how users discover, purchase, and enjoy cocktail ingredients.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-available/20 text-available px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Machine Learning
          </Badge>
          <Badge variant="secondary" className="bg-available/20 text-available px-3 py-1">
            <Target className="h-3 w-3 mr-1" />
            Real-Time Data
          </Badge>
          <Badge variant="secondary" className="bg-available/20 text-available px-3 py-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            Predictive Analytics
          </Badge>
        </div>
      </div>

      {/* Feature Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.id}
            className={`organic-md border-border bg-card cursor-pointer transition-all duration-300 hover:scale-105 ${
              activeFeature === feature.id ? 'ring-2 ring-available' : ''
            }`}
            onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-pure-white">{feature.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                  activeFeature === feature.id ? 'rotate-90' : ''
                }`} />
              </div>
            </CardHeader>
            
            <CardContent className={`transition-all duration-300 ${
              activeFeature === feature.id ? 'pb-6' : 'pb-0 max-h-0 overflow-hidden'
            }`}>
              <div className="space-y-3">
                <h4 className="font-medium text-pure-white">Key Capabilities:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {feature.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-light-text">
                      <div className="w-1.5 h-1.5 bg-available rounded-full" />
                      {capability}
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Could trigger a detailed view or demo
                  }}
                >
                  Explore Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Demonstrations */}
      <Tabs defaultValue="ai-recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-recommendations" className="text-xs">AI Engine</TabsTrigger>
          <TabsTrigger value="inventory-tracking" className="text-xs">Live Inventory</TabsTrigger>
          <TabsTrigger value="personalized-shopping" className="text-xs">Personalization</TabsTrigger>
          <TabsTrigger value="advanced-analytics" className="text-xs">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-recommendations">
          <AIRecommendationEngine />
        </TabsContent>

        <TabsContent value="inventory-tracking">
          <RealTimeInventoryTracker />
        </TabsContent>

        <TabsContent value="personalized-shopping">
          <PersonalizedShoppingExperience />
        </TabsContent>

        <TabsContent value="advanced-analytics">
          <AdvancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>

      {/* Integration Overview */}
      <Card className="organic-md border-border bg-card">
        <CardHeader>
          <CardTitle className="text-pure-white text-center flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-available" />
            Phase 4 Integration Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-available/20 rounded-lg flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-available" />
              </div>
              <h3 className="font-medium text-pure-white">Smart Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                AI learns user preferences and predicts optimal purchase timing and product combinations
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-available/20 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-available" />
              </div>
              <h3 className="font-medium text-pure-white">Real-Time Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Dynamic pricing, inventory alerts, and instant availability updates across all retailers
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-available/20 rounded-lg flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-available" />
              </div>
              <h3 className="font-medium text-pure-white">Personalized Experience</h3>
              <p className="text-sm text-muted-foreground">
                Every interaction is tailored to individual preferences, budget, and cocktail journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}