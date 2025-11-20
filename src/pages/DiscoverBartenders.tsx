import { useEffect, useState } from 'react';
import { TrendingUp, Users, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/social/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { socialService, SuggestedUser, TrendingUser } from '@/services/socialService';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/auth/AuthPrompt';

export default function DiscoverBartenders() {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suggested');

  useEffect(() => {
    if (user) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [suggested, trending] = await Promise.all([
        socialService.getSuggestedUsers(20),
        socialService.getTrendingUsers(20),
      ]);
      setSuggestedUsers(suggested);
      setTrendingUsers(trending);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <AuthPrompt
            icon={Users}
            title="Discover Bartenders"
            description="Create a free account to discover talented bartenders and follow their cocktail creations."
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-pure-white mb-2">
          Discover Bartenders
        </h1>
        <p className="text-light-text">
          Find talented bartenders to follow and get inspired by their creations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-medium-charcoal rounded-organic-md">
          <TabsTrigger 
            value="suggested" 
            className="rounded-organic-sm data-[state=active]:bg-primary"
          >
            <Sparkles size={16} className="mr-2" />
            For You
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="rounded-organic-sm data-[state=active]:bg-primary"
          >
            <TrendingUp size={16} className="mr-2" />
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          {suggestedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-soft-gray opacity-50" />
              <h3 className="text-xl font-semibold text-light-text mb-2">
                No suggestions yet
              </h3>
              <p className="text-soft-gray">
                Follow some bartenders to get personalized recommendations
              </p>
            </div>
          ) : (
            suggestedUsers.map((user) => (
              <UserCard
                key={user.user_id}
                userId={user.user_id}
                username={user.username}
                fullName={user.full_name}
                avatarUrl={user.avatar_url}
                bio={user.bio}
                recipeCount={user.recipe_count}
                followerCount={user.follower_count}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          {trendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-soft-gray opacity-50" />
              <h3 className="text-xl font-semibold text-light-text mb-2">
                No trending bartenders yet
              </h3>
              <p className="text-soft-gray">
                Check back soon to see who's gaining popularity
              </p>
            </div>
          ) : (
            trendingUsers.map((user) => (
              <UserCard
                key={user.user_id}
                userId={user.user_id}
                username={user.username}
                fullName={user.full_name}
                avatarUrl={user.avatar_url}
                bio={user.bio}
                recipeCount={user.recipe_count}
                followerCount={user.total_follower_count}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
