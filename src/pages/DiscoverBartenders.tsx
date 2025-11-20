import { useEffect, useState } from 'react';
import { TrendingUp, Users, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/social/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { socialService, SuggestedUser, TrendingUser } from '@/services/socialService';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function DiscoverBartenders() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      {/* Top Navigation for Mobile Only */}
      <TopNavigation
        user={user}
        activeLibrary=""
        onLibrarySelect={() => {}}
        onAddRecipe={() => navigate('/')}
        onSignInClick={() => {}}
        onSignUpClick={() => {}}
        onProfileClick={() => {}}
        onMyRecipesClick={() => navigate('/recipes/my-drinks')}
        onFavoritesClick={() => navigate('/favorites')}
      />
      
      <div className="flex h-full">
        {/* Sidebar - Visible on tablet and desktop */}
        <div className="hidden md:block">
          <Sidebar
            active=""
            onSelect={(library) => {
              if (library === 'featured') navigate('/');
              else if (library === 'all') navigate('/recipes');
              else if (library === 'ingredients') navigate('/mybar');
              else if (library === 'feed') navigate('/feed');
              else if (library === 'favorites') navigate('/favorites');
              else if (library === 'mine') navigate('/recipes/my-drinks');
              else if (library === 'learn') navigate('/learn');
            }}
            onAdd={() => navigate('/')}
            onCloseForm={() => {}}
            user={user}
            onSignInClick={() => {}}
            onSignUpClick={() => {}}
            onProfileClick={() => {}}
            onMyRecipesClick={() => navigate('/recipes/my-drinks')}
            onFavoritesClick={() => navigate('/favorites')}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main className="w-full h-full">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-6">
              {!user ? (
                <div className="flex items-center justify-center py-16">
                  <AuthPrompt
                    icon={Users}
                    title="Discover Bartenders"
                    description="Create a free account to discover talented bartenders and follow their cocktail creations."
                  />
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-foreground mb-2">
                      Discover Bartenders
                    </h1>
                    <p className="text-muted-foreground">
                      Find talented bartenders to follow and get inspired by their creations
                    </p>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="suggested">
                        <Sparkles size={16} className="mr-2" />
                        For You
                      </TabsTrigger>
                      <TabsTrigger value="trending">
                        <TrendingUp size={16} className="mr-2" />
                        Trending
                      </TabsTrigger>
                    </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          {suggestedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No suggestions yet
              </h3>
              <p className="text-muted-foreground">
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
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No trending bartenders yet
              </h3>
              <p className="text-muted-foreground">
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
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
