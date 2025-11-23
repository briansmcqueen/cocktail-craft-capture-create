import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Users, Sparkles, Flame } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/social/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { socialService, SuggestedUser, TrendingUser } from '@/services/socialService';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '@/components/ui/search-input';
import { useSearchShortcut } from '@/hooks/useSearchShortcut';
import UniversalRecipeCard from '@/components/UniversalRecipeCard';
import { supabase } from '@/integrations/supabase/client';

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  ingredients: string[];
  instructions: string;
  user_id: string;
  created_at: string;
  tags: string[] | null;
  creator_username?: string;
  creator_avatar?: string;
}

export default function DiscoverBartenders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUser[]>([]);
  const [discoverRecipes, setDiscoverRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suggested');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useSearchShortcut(searchInputRef);

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
      const [suggested, trending, recipes] = await Promise.all([
        socialService.getSuggestedUsers(20),
        socialService.getTrendingUsers(20),
        loadDiscoverRecipes(),
      ]);
      setSuggestedUsers(suggested);
      setTrendingUsers(trending);
      setDiscoverRecipes(recipes);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscoverRecipes = async (): Promise<Recipe[]> => {
    if (!user) return [];

    try {
      // Get users the current user is following
      const { data: followingData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = followingData?.map(f => f.following_id) || [];

      // Get public recipes from users not being followed with creator info
      let query = supabase
        .from('recipes')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      // If user follows someone, exclude their recipes
      if (followingIds.length > 0) {
        query = query.not('user_id', 'in', `(${followingIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Map the data to include creator info
      return (data || []).map((recipe: any) => ({
        ...recipe,
        creator_username: recipe.profiles?.username || 'Anonymous',
        creator_avatar: recipe.profiles?.avatar_url || null,
      }));
    } catch (error) {
      console.error('Error loading discover recipes:', error);
      return [];
    }
  };

  const filterUsers = <T extends SuggestedUser | TrendingUser>(users: T[]): T[] => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      (user.full_name && user.full_name.toLowerCase().includes(query))
    );
  };

  const filterRecipes = (recipes: Recipe[]): Recipe[] => {
    if (!searchQuery.trim()) return recipes;
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      (recipe.description && recipe.description.toLowerCase().includes(query)) ||
      (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  };

  const filteredSuggestedUsers = filterUsers(suggestedUsers);
  const filteredTrendingUsers = filterUsers(trendingUsers);
  const filteredRecipes = filterRecipes(discoverRecipes);

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
            onProfileClick={() => navigate('/profile')}
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

                  <div className="mb-6">
                    <SearchInput
                      ref={searchInputRef}
                      placeholder={
                        activeTab === 'recipes' 
                          ? 'Search recipes...' 
                          : 'Search bartenders...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClear={() => setSearchQuery('')}
                      showClearButton={searchQuery.length > 0}
                      showShortcutHint
                    />
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="suggested">
                        <Sparkles size={16} className="mr-2" />
                        For You
                      </TabsTrigger>
                      <TabsTrigger value="trending">
                        <TrendingUp size={16} className="mr-2" />
                        Trending
                      </TabsTrigger>
                      <TabsTrigger value="recipes">
                        <Flame size={16} className="mr-2" />
                        Recipes
                      </TabsTrigger>
                    </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          {filteredSuggestedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'No bartenders found' : 'No suggestions yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try searching with a different name or username'
                  : 'Follow some bartenders to get personalized recommendations'}
              </p>
            </div>
          ) : (
            filteredSuggestedUsers.map((user) => (
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
          {filteredTrendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'No bartenders found' : 'No trending bartenders yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try searching with a different name or username'
                  : 'Check back soon to see who\'s gaining popularity'}
              </p>
            </div>
          ) : (
            filteredTrendingUsers.map((user) => (
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

        <TabsContent value="recipes" className="space-y-4">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Flame className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'No recipes found' : 'No new recipes to discover'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try searching with a different name or tag'
                  : 'Follow more bartenders to see recipes from the community'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <UniversalRecipeCard
                  key={recipe.id}
                  recipe={{
                    id: recipe.id,
                    name: recipe.name,
                    image: recipe.image_url || '/placeholder.svg',
                    ingredients: recipe.ingredients,
                    steps: recipe.instructions,
                    notes: recipe.description || undefined,
                    tags: recipe.tags || [],
                    isUserRecipe: true,
                    createdBy: recipe.user_id,
                    creatorUsername: recipe.creator_username,
                    creatorAvatar: recipe.creator_avatar || undefined,
                    creatorUserId: recipe.user_id,
                  }}
                />
              ))}
            </div>
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
