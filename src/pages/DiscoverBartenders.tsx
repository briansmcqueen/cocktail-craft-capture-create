import { useEffect, useState, useRef, useCallback } from 'react';
import { Users, Flame, Compass } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/social/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { socialService, SuggestedUser, TrendingUser } from '@/services/socialService';
import { privacyService } from '@/services/privacyService';
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

type FeedItem = 
  | { type: 'user'; data: SuggestedUser }
  | { type: 'recipe'; data: Recipe };

export default function DiscoverBartenders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  }, []);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [discoverRecipes, setDiscoverRecipes] = useState<Recipe[]>([]);
  const [unifiedFeed, setUnifiedFeed] = useState<FeedItem[]>([]);
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
      const [suggested, recipes] = await Promise.all([
        socialService.getSuggestedUsers(20),
        loadDiscoverRecipes(),
      ]);
      setSuggestedUsers(suggested);
      setDiscoverRecipes(recipes);
      
      // Create unified feed by interleaving users and recipes
      const feed: FeedItem[] = [];
      const maxLength = Math.max(suggested.length, recipes.length);
      
      for (let i = 0; i < maxLength; i++) {
        // Add a recipe
        if (i < recipes.length) {
          feed.push({ type: 'recipe', data: recipes[i] });
        }
        // Add a user every 2 items
        if (i % 2 === 0 && i / 2 < suggested.length) {
          feed.push({ type: 'user', data: suggested[Math.floor(i / 2)] });
        }
      }
      
      setUnifiedFeed(feed);
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

      // Get public recipes from users not being followed
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .neq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Fetch more initially since we'll filter

      // If user follows someone, exclude their recipes
      if (followingIds.length > 0) {
        query = query.not('user_id', 'in', `(${followingIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Apply privacy filtering and fetch creator info
      const filteredRecipes: Recipe[] = [];
      for (const recipe of data || []) {
        // Check if user is blocked
        const blocked = await privacyService.isBlockedBy(user.id, recipe.user_id);
        if (blocked) continue;

        // Check recipe visibility
        const canView = await privacyService.canViewRecipes(recipe.user_id, user.id);
        if (!canView.canView) continue;

        // Fetch creator profile info separately
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', recipe.user_id)
          .single();

        filteredRecipes.push({
          ...recipe,
          creator_username: profile?.username || 'Anonymous',
          creator_avatar: profile?.avatar_url || null,
        });

        // Stop at 20 recipes after filtering
        if (filteredRecipes.length >= 20) break;
      }

      return filteredRecipes;
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

  const filterFeed = (feed: FeedItem[]): FeedItem[] => {
    if (!searchQuery.trim()) return feed;
    
    const query = searchQuery.toLowerCase();
    return feed.filter(item => {
      if (item.type === 'user') {
        const user = item.data;
        return user.username.toLowerCase().includes(query) ||
          (user.full_name && user.full_name.toLowerCase().includes(query));
      } else {
        const recipe = item.data;
        return recipe.name.toLowerCase().includes(query) ||
          (recipe.description && recipe.description.toLowerCase().includes(query)) ||
          (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query)));
      }
    });
  };

  const filteredFeed = filterFeed(unifiedFeed);
  const filteredSuggestedUsers = filterUsers(suggestedUsers);
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
        onProfileClick={() => user && navigate(`/user/${user.id}`)}
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
            onProfileClick={() => user && navigate(`/user/${user.id}`)}
            onMyRecipesClick={() => navigate('/recipes/my-drinks')}
            onFavoritesClick={() => navigate('/favorites')}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main className="w-full h-full">
            <div className="max-w-4xl mx-auto px-5 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-6">
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
                    <div className="mb-8 flex items-center gap-2.5">
                      <Compass className="h-4 w-4 text-pure-white flex-shrink-0" />
                      <h1 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
                        Discover
                      </h1>
                    </div>

                    <div className="mb-6">
                      <SearchInput
                        ref={searchInputRef}
                        placeholder={
                          activeTab === 'recipes' 
                            ? 'Search recipes...' 
                            : activeTab === 'feed'
                            ? 'Search accounts and recipes...'
                            : 'Search accounts...'
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        showClearButton={searchQuery.length > 0}
                        showShortcutHint
                      />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="w-full mb-8">
                        <TabsTrigger value="suggested">
                          Accounts
                        </TabsTrigger>
                        <TabsTrigger value="recipes">
                          Recipes
                        </TabsTrigger>
                      </TabsList>

                       <TabsContent value="suggested" className="space-y-4">
          {filteredSuggestedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'No accounts found' : 'No suggestions yet'}
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
