import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Target, 
  DollarSign,
  Clock,
  Calendar,
  Star,
  Gift,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMyBarData } from '@/hooks/useMyBarData';
import { supabase } from '@/integrations/supabase/client';

interface ShoppingProfile {
  userId: string;
  budgetRange: [number, number];
  preferredRetailers: string[];
  favoriteCategories: string[];
  shoppingFrequency: 'weekly' | 'monthly' | 'occasionally';
  pricePreference: 'budget' | 'mid-range' | 'premium';
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  notifications: {
    priceDrops: boolean;
    newArrivals: boolean;
    stockAlerts: boolean;
    recommendations: boolean;
  };
}

interface PersonalizedOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  originalPrice: number;
  finalPrice: number;
  items: string[];
  validUntil: string;
  category: string;
  personalizedReason: string;
}

interface ShoppingInsight {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function PersonalizedShoppingExperience() {
  const { user } = useAuth();
  const { myBarIngredients } = useMyBarData(0);
  
  const [profile, setProfile] = useState<ShoppingProfile>({
    userId: user?.id || '',
    budgetRange: [50, 200],
    preferredRetailers: ['total-wine'],
    favoriteCategories: ['spirits', 'mixers'],
    shoppingFrequency: 'monthly',
    pricePreference: 'mid-range',
    experienceLevel: 'intermediate',
    notifications: {
      priceDrops: true,
      newArrivals: false,
      stockAlerts: true,
      recommendations: true
    }
  });

  const [personalizedOffers, setPersonalizedOffers] = useState<PersonalizedOffer[]>([]);
  const [shoppingInsights, setShoppingInsights] = useState<ShoppingInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadShoppingProfile();
      generatePersonalizedOffers();
      calculateShoppingInsights();
    }
  }, [user]);

  const loadShoppingProfile = async () => {
    try {
      // Load from user preferences in the database
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(prev => ({
          ...prev,
          favoriteCategories: data.preferred_spirit_types || prev.favoriteCategories,
          experienceLevel: data.difficulty_preference > 7 ? 'expert' : 
                         data.difficulty_preference > 4 ? 'intermediate' : 'beginner'
        }));
      }
    } catch (error) {
      console.error('Error loading shopping profile:', error);
    }
  };

  const generatePersonalizedOffers = async () => {
    // Simulate AI-generated personalized offers
    const offers: PersonalizedOffer[] = [
      {
        id: '1',
        title: 'Whiskey Lover\'s Bundle',
        description: 'Complete your whiskey collection with these premium selections',
        discount: 25,
        originalPrice: 12999,
        finalPrice: 9749,
        items: ['Premium Bourbon', 'Single Malt Scotch', 'Rye Whiskey'],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'spirits',
        personalizedReason: 'Based on your whiskey purchases and high-end preference'
      },
      {
        id: '2',
        title: 'Craft Cocktail Starter Kit',
        description: 'Essential tools and ingredients for the aspiring mixologist',
        discount: 15,
        originalPrice: 7999,
        finalPrice: 6799,
        items: ['Premium Jigger', 'Cocktail Shaker', 'Bitters Set'],
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'tools',
        personalizedReason: 'Perfect for your intermediate skill level and tool collection'
      },
      {
        id: '3',
        title: 'Seasonal Citrus Collection',
        description: 'Fresh seasonal ingredients for spring cocktails',
        discount: 20,
        originalPrice: 4999,
        finalPrice: 3999,
        items: ['Blood Orange Liqueur', 'Meyer Lemon Syrup', 'Grapefruit Bitters'],
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'mixers',
        personalizedReason: 'Trending ingredients that complement your gin collection'
      }
    ];

    setPersonalizedOffers(offers);
  };

  const calculateShoppingInsights = () => {
    const insights: ShoppingInsight[] = [
      {
        title: 'Monthly Spending',
        value: '$127',
        change: -12,
        icon: <DollarSign className="h-4 w-4" />,
        color: 'text-emerald-500'
      },
      {
        title: 'Cocktails Unlocked',
        value: '47',
        change: 23,
        icon: <Star className="h-4 w-4" />,
        color: 'text-blue-500'
      },
      {
        title: 'Bar Completion',
        value: '73%',
        change: 8,
        icon: <Target className="h-4 w-4" />,
        color: 'text-purple-500'
      },
      {
        title: 'Savings Earned',
        value: '$43',
        change: 156,
        icon: <Gift className="h-4 w-4" />,
        color: 'text-yellow-500'
      }
    ];

    setShoppingInsights(insights);
  };

  const updateProfile = async (updates: Partial<ShoppingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    
    // Save to database
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          preferred_spirit_types: updates.favoriteCategories || profile.favoriteCategories,
          difficulty_preference: updates.experienceLevel === 'expert' ? 8 : 
                                updates.experienceLevel === 'intermediate' ? 5 : 2,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-pure-white flex items-center justify-center gap-2">
          <User className="h-6 w-6 text-available" />
          Your Personal Bar Experience
        </h2>
        <p className="text-muted-foreground">
          Tailored shopping insights and recommendations just for you
        </p>
      </div>

      {/* Shopping Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {shoppingInsights.map((insight, index) => (
          <Card key={index} className="organic-sm border-border bg-card">
            <CardContent className="p-4 text-center">
              <div className={`${insight.color} mb-2`}>
                {insight.icon}
              </div>
              <div className="text-2xl font-bold text-pure-white">{insight.value}</div>
              <div className="text-sm text-muted-foreground">{insight.title}</div>
              <div className={`text-xs flex items-center justify-center gap-1 mt-1 ${
                insight.change > 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                <TrendingUp className="h-3 w-3" />
                {insight.change > 0 ? '+' : ''}{insight.change}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="offers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="offers">Personal Offers</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="insights">Shopping Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-4">
          {personalizedOffers.map((offer) => (
            <Card key={offer.id} className="organic-md border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-pure-white">{offer.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{offer.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-available/20 text-available">
                    {offer.discount}% OFF
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                  <p className="text-sm text-light-text">
                    <span className="font-medium text-available">Why this offer:</span> {offer.personalizedReason}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-pure-white">Includes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {offer.items.map((item, idx) => (
                      <Badge key={idx} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(offer.originalPrice)}
                    </div>
                    <div className="text-xl font-bold text-available">
                      {formatPrice(offer.finalPrice)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expires in 3 days
                      </div>
                    </div>
                    <Button className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Claim Offer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white">Shopping Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-text">
                  Monthly Budget Range
                </label>
                <Slider
                  value={profile.budgetRange}
                  onValueChange={(value) => updateProfile({ budgetRange: value as [number, number] })}
                  min={25}
                  max={500}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${profile.budgetRange[0]}</span>
                  <span>${profile.budgetRange[1]}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-light-text">
                  Experience Level
                </label>
                <div className="flex gap-2">
                  {['beginner', 'intermediate', 'expert'].map((level) => (
                    <Button
                      key={level}
                      variant={profile.experienceLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateProfile({ experienceLevel: level as any })}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-light-text">
                  Notification Preferences
                </label>
                <div className="space-y-3">
                  {Object.entries(profile.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-light-text capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            notifications: { ...profile.notifications, [key]: checked }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="organic-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-pure-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Shopping Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-pure-white">Recent Activity</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• Added 3 new spirits this month</div>
                      <div>• Completed "Classic Cocktails" collection</div>
                      <div>• Saved $23 with smart shopping</div>
                      <div>• Discovered 8 new cocktail recipes</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-pure-white">Recommendations</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• Consider premium gin for better cocktails</div>
                      <div>• Add orange bitters to expand recipe options</div>
                      <div>• Try seasonal ingredients for variety</div>
                      <div>• Join our tasting events for learning</div>
                    </div>
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