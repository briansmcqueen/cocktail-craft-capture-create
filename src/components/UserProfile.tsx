import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, ChefHat, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { followUser, unfollowUser, isFollowing, getUserStats, getFollowing, getFollowers, type UserStats } from '@/services/followsService';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getAvatarUrl } from '@/utils/avatarUrl';
import RecipeGrid from './RecipeGrid';
import UserCard from '@/components/social/UserCard';
import UniversalRecipeCard from '@/components/UniversalRecipeCard';
import type { Cocktail, Difficulty } from '@/data/classicCocktails';
import { getRecipesLikeCounts } from '@/services/likesService';
import { getRecipesFavoriteCounts } from '@/services/favoritesService';
import { getRecipesCommentCounts } from '@/services/commentsService';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  difficulty: string | null;
  prep_time: number | null;
  ingredients: string[];
  instructions: string;
  user_id: string;
  is_public: boolean;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoriteIds } = useFavorites();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats>({ followers_count: 0, following_count: 0, recipes_count: 0 });
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([]);
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipeStats, setRecipeStats] = useState<Record<string, { likes: number; favorites: number; comments: number; rating: number }>>({});

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (!userId) return;
    
    fetchProfile();
    fetchStats();
    checkFollowStatus();
    fetchUserRecipes();
    fetchUserFavorites();
    fetchFollowingUsers();
    fetchFollowerUsers();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Fallback for unauthenticated viewers: fetch only safe public fields via RPC
      try {
        const { data: publicData } = await supabase.rpc('get_public_profiles', { user_ids: [userId] as any });
        const publicProfile = (publicData as any[] | null)?.[0];
        if (publicProfile) {
          setProfile({
            id: publicProfile.id,
            username: publicProfile.username,
            full_name: null,
            avatar_url: publicProfile.avatar_url,
            bio: null,
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        // noop, fall through to error toast
      }

      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!userId) return;
    const userStats = await getUserStats(userId);
    setStats(userStats);
  };

  const checkFollowStatus = async () => {
    if (!userId || !user) return;
    const following = await isFollowing(userId);
    setIsFollowingUser(following);
  };

  const fetchUserRecipes = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user recipes:', error);
    } else {
      setRecipes(data || []);
      
      // Fetch stats for all recipes
      if (data && data.length > 0) {
        const recipeIds = data.map(r => r.id);
        const [likeCounts, favCounts, commentCounts, ratingsResponse] = await Promise.all([
          getRecipesLikeCounts(recipeIds),
          getRecipesFavoriteCounts(recipeIds),
          getRecipesCommentCounts(recipeIds),
          supabase.rpc('get_recipe_rating_stats_batch', { p_recipe_ids: recipeIds })
        ]);
        
        const ratingsData = ratingsResponse.data as Array<{ recipe_id: string; averageRating: number; totalRatings: number }> | null;
        
        const stats: Record<string, { likes: number; favorites: number; comments: number; rating: number }> = {};
        recipeIds.forEach(id => {
          const ratingInfo = ratingsData?.find((r) => r.recipe_id === id);
          stats[id] = {
            likes: likeCounts[id] || 0,
            favorites: favCounts[id] || 0,
            comments: commentCounts[id] || 0,
            rating: ratingInfo?.averageRating || 0
          };
        });
        setRecipeStats(stats);
      }
    }
  };

  const fetchUserFavorites = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        recipe_id,
        created_at
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user favorites:', error);
      return;
    }

    // For now, we'll need to fetch recipes based on IDs
    // This is a simplified version - in a real app you'd want to join with recipes table
    const favoriteIds = data?.map(f => f.recipe_id) || [];
    setFavoriteRecipes(favoriteIds); // Simplified for now
  };

  const fetchFollowingUsers = async () => {
    if (!userId) return;

    try {
      // Get the list of users this profile is following
      const follows = await getFollowing(userId);
      
      if (follows.length === 0) {
        setFollowingUsers([]);
        return;
      }

      // Get user IDs of people they're following
      const followingIds = follows.map(f => f.following_id);

      // Fetch detailed profile info for all following users
      const { data: profiles, error } = await supabase.rpc('get_public_profiles', {
        user_ids: followingIds as any
      });

      if (error) {
        console.error('Error fetching following user profiles:', error);
        return;
      }

      setFollowingUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  const fetchFollowerUsers = async () => {
    if (!userId) return;

    try {
      // Get the list of users following this profile
      const follows = await getFollowers(userId);
      
      if (follows.length === 0) {
        setFollowerUsers([]);
        return;
      }

      // Get user IDs of followers
      const followerIds = follows.map(f => f.follower_id);

      // Fetch detailed profile info for all followers
      const { data: profiles, error } = await supabase.rpc('get_public_profiles', {
        user_ids: followerIds as any
      });

      if (error) {
        console.error('Error fetching follower user profiles:', error);
        return;
      }

      setFollowerUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching follower users:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!userId || !user) return;

    const success = isFollowingUser 
      ? await unfollowUser(userId)
      : await followUser(userId);

    if (success) {
      setIsFollowingUser(!isFollowingUser);
      fetchStats(); // Refresh stats
      toast({
        title: isFollowingUser ? "Unfollowed" : "Following",
        description: `You are ${isFollowingUser ? 'no longer following' : 'now following'} ${profile?.username || profile?.full_name || 'this user'}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">User not found</h1>
        <Button onClick={() => navigate('/')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {isOwnProfile && (
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={getAvatarUrl(profile.avatar_url) || undefined} />
              <AvatarFallback className="text-xl">
                {profile.full_name?.[0] || profile.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">{profile.full_name || 'Anonymous'}</h1>
                {profile.username && (
                  <p className="text-muted-foreground">@{profile.username}</p>
                )}
                {profile.bio && (
                  <p className="text-card-foreground mt-2">{profile.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab('recipes')}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="font-bold text-lg text-foreground">{stats.recipes_count}</div>
                  <div className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recipes</div>
                </button>
                <button 
                  onClick={() => setActiveTab('followers')}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="font-bold text-lg text-foreground">{stats.followers_count}</div>
                  <div className="text-sm text-muted-foreground hover:text-foreground transition-colors">Followers</div>
                </button>
                <button 
                  onClick={() => setActiveTab('following')}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="font-bold text-lg text-foreground">{stats.following_count}</div>
                  <div className="text-sm text-muted-foreground hover:text-foreground transition-colors">Following</div>
                </button>
              </div>

              {/* Follow Button */}
              {!isOwnProfile && user && (
                <Button
                  onClick={handleFollowToggle}
                  variant={isFollowingUser ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  {isFollowingUser ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="recipes">
            Recipes
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites
          </TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="mt-6">
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => {
                const stats = recipeStats[recipe.id] || { likes: 0, favorites: 0, comments: 0, rating: 0 };
                
                // Transform database recipe to Cocktail format
                const cocktail: Cocktail = {
                  id: recipe.id,
                  name: recipe.name,
                  notes: recipe.description || undefined,
                  image: recipe.image_url || '',
                  tags: recipe.tags || [],
                  prepTime: `${recipe.prep_time || 5} min`,
                  ingredients: recipe.ingredients,
                  steps: recipe.instructions,
                  createdBy: profile?.username || profile?.full_name || undefined,
                  creatorUsername: profile?.username || undefined,
                  creatorAvatar: profile?.avatar_url || undefined,
                  creatorUserId: userId,
                  isUserRecipe: true,
                  // Add stats to display
                  likeCount: stats.likes,
                  commentCount: stats.comments,
                  averageRating: stats.rating
                };
                
                return (
                  <UniversalRecipeCard
                    key={recipe.id}
                    recipe={cocktail}
                    hideCreator={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No recipes yet</h3>
              <p className="text-gray-500">
                {isOwnProfile ? "Start creating your first recipe!" : "This user hasn't created any recipes yet."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Favorites coming soon</h3>
            <p className="text-gray-500">
              This section will show favorited recipes.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="followers" className="mt-6">
          {followerUsers.length > 0 ? (
            <div className="space-y-4">
              {followerUsers.map((follower) => (
                <UserCard
                  key={follower.id}
                  userId={follower.id}
                  username={follower.username}
                  avatarUrl={follower.avatar_url}
                  isCurrentUser={user?.id === follower.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No followers yet</h3>
              <p className="text-gray-500">
                {isOwnProfile ? "Share your recipes to gain followers!" : "This user doesn't have any followers yet."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          {followingUsers.length > 0 ? (
            <div className="space-y-4">
              {followingUsers.map((followingUser) => (
                <UserCard
                  key={followingUser.id}
                  userId={followingUser.id}
                  username={followingUser.username}
                  avatarUrl={followingUser.avatar_url}
                  isCurrentUser={user?.id === followingUser.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Not following anyone yet</h3>
              <p className="text-gray-500">
                {isOwnProfile ? "Start following other bartenders to see them here!" : "This user isn't following anyone yet."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">Activity feed coming soon</h3>
            <p className="text-gray-500">
              This section will show recent user activity.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}