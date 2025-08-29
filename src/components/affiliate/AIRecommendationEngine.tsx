import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, ShoppingCart, Star, Zap, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAffiliateCart } from '@/hooks/useAffiliateCart';
import { useMyBarData } from '@/hooks/useMyBarData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  type: 'cocktail' | 'ingredient' | 'bundle';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  items: RecommendationItem[];
  estimatedValue: number;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationItem {
  id: string;
  name: string;
  category: string;
  price?: number;
  unlocksPotential: string[];
}

interface UserPreferences {
  favoriteSpirits: string[];
  preferredStrength: 'light' | 'medium' | 'strong';
  flavorProfile: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  budget: 'low' | 'medium' | 'high';
  occasions: string[];
}

export default function AIRecommendationEngine() {
  const { user } = useAuth();
  const { buildCartForIngredients } = useAffiliateCart();
  const { myBarIngredients } = useMyBarData(0);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
      generateRecommendations();
    }
  }, [user, myBarIngredients]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setUserPreferences({
          favoriteSpirits: data.preferred_spirit_types || [],
          preferredStrength: 'medium',
          flavorProfile: data.flavor_preferences || [],
          experienceLevel: data.difficulty_preference > 7 ? 'expert' : 
                         data.difficulty_preference > 4 ? 'intermediate' : 'beginner',
          budget: 'medium',
          occasions: []
        });
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const generateRecommendations = async () => {
    setAnalyzing(true);
    try {
      // Simulate AI analysis with sophisticated logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'cocktail',
          title: 'Discover Classic Manhattan',
          description: 'Perfect next step for whiskey enthusiasts',
          confidence: 92,
          reasoning: 'Based on your whiskey preference and missing vermouth, this unlocks 12+ cocktail recipes',
          items: [
            { id: 'sweet-vermouth', name: 'Sweet Vermouth', category: 'Fortified Wine', price: 1599, unlocksPotential: ['Manhattan', 'Negroni', 'Rob Roy'] },
            { id: 'angostura-bitters', name: 'Angostura Bitters', category: 'Bitters', price: 899, unlocksPotential: ['Old Fashioned', 'Sazerac', 'Trinidad Sour'] }
          ],
          estimatedValue: 2498,
          priority: 'high'
        },
        {
          id: '2',
          type: 'ingredient',
          title: 'Essential Citrus Upgrade',
          description: 'Fresh ingredients for professional-quality cocktails',
          confidence: 87,
          reasoning: 'Your cocktail success rate increases 340% with fresh citrus ingredients',
          items: [
            { id: 'fresh-lemon', name: 'Fresh Lemon Juice', category: 'Citrus', unlocksPotential: ['Whiskey Sour', 'Gin Fizz', 'Tom Collins'] },
            { id: 'fresh-lime', name: 'Fresh Lime Juice', category: 'Citrus', unlocksPotential: ['Margarita', 'Daiquiri', 'Gimlet'] },
            { id: 'simple-syrup', name: 'Simple Syrup', category: 'Sweetener', unlocksPotential: ['Mojito', 'Mint Julep', 'Caipirinha'] }
          ],
          estimatedValue: 1200,
          priority: 'high'
        },
        {
          id: '3',
          type: 'bundle',
          title: 'Gin Explorer Pack',
          description: 'Curated selection for gin cocktail mastery',
          confidence: 78,
          reasoning: 'Trending: Gin cocktails up 45% in popularity. This bundle unlocks 25+ recipes',
          items: [
            { id: 'gin-premium', name: 'Premium London Dry Gin', category: 'Spirits', price: 3499, unlocksPotential: ['Martini', 'Negroni', 'Aviation'] },
            { id: 'dry-vermouth', name: 'Dry Vermouth', category: 'Fortified Wine', price: 1399, unlocksPotential: ['Martini', 'Gibson', 'Vesper'] },
            { id: 'orange-bitters', name: 'Orange Bitters', category: 'Bitters', price: 1199, unlocksPotential: ['Martinez', 'Improved Gin Cocktail'] }
          ],
          estimatedValue: 6097,
          priority: 'medium'
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAcceptRecommendation = async (recommendation: Recommendation) => {
    setLoading(true);
    try {
      const ingredientIds = recommendation.items.map(item => item.id);
      const ingredientMap = new Map(); // You'd populate this with actual ingredient data
      
      await buildCartForIngredients(ingredientIds, myBarIngredients, ingredientMap);
      toast.success(`Added ${recommendation.title} to your cart!`);
    } catch (error) {
      console.error('Error adding recommendation to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-500';
    if (confidence >= 75) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="h-4 w-4 text-emerald-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      default: return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  if (analyzing) {
    return (
      <Card className="organic-md border-border bg-card">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Brain className="h-12 w-12 text-available animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-pure-white">AI Analyzing Your Bar</h3>
              <p className="text-muted-foreground">
                Examining your ingredients, preferences, and cocktail trends...
              </p>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-available rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-2 h-2 bg-available rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-2 h-2 bg-available rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-pure-white flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-available" />
          AI Bartender Assistant
        </h2>
        <p className="text-muted-foreground">
          Personalized recommendations based on your bar and preferences
        </p>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Smart Picks</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="optimization">Bar Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="organic-md border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPriorityIcon(rec.priority)}
                    <div>
                      <CardTitle className="text-pure-white text-lg">{rec.title}</CardTitle>
                      <p className="text-muted-foreground text-sm">{rec.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                      {rec.confidence}% Match
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                  <p className="text-sm text-light-text">
                    <span className="font-medium text-available">AI Reasoning:</span> {rec.reasoning}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-pure-white">Recommended Items:</h4>
                  {rec.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                      <div>
                        <div className="font-medium text-pure-white">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                        {item.unlocksPotential.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.unlocksPotential.slice(0, 3).map((cocktail) => (
                              <Badge key={cocktail} variant="secondary" className="text-xs">
                                {cocktail}
                              </Badge>
                            ))}
                            {item.unlocksPotential.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.unlocksPotential.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {item.price && (
                        <div className="text-right">
                          <div className="font-medium text-available">
                            ${(item.price / 100).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-available" />
                    <span className="text-sm text-light-text">
                      Unlocks <span className="font-medium text-available">
                        {rec.items.reduce((total, item) => total + item.unlocksPotential.length, 0)}
                      </span> cocktail recipes
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {rec.estimatedValue && (
                      <div className="text-sm text-muted-foreground">
                        Total: <span className="font-medium text-available">
                          ${(rec.estimatedValue / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <Button 
                      onClick={() => handleAcceptRecommendation(rec)}
                      disabled={loading}
                      className="gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trending">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Cocktails & Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Trending analysis coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Bar Efficiency Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Bar optimization analysis coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}