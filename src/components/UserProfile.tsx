import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Heart, ChefHat, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { followUser, unfollowUser, isFollowing, getUserStats, getFollowing, getFollowers, type UserStats } from '@/services/followsService';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getAvatarUrl } from '@/utils/avatarUrl';
import UserCard from '@/components/social/UserCard';
import UniversalRecipeCard from '@/components/UniversalRecipeCard';
import type { Cocktail } from '@/data/classicCocktails';
import { classicCocktails } from '@/data/classicCocktails';
import { getRecipesFavoriteCounts } from '@/services/favoritesService';
import { getRecipesCommentCounts } from '@/services/commentsService';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';

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
  const [stats, setStats] = useState<UserStats>({ followers_count: 0, following_count: 0, recipes_count: 0, favorites_count: 0 });
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Cocktail[]>([]);
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipeStats, setRecipeStats] = useState<Record<string, { favorites: number; comments: number; rating: number }>>({});
  const [favoriteStatsMap, setFavoriteStatsMap] = useState<Record<string, { favorites: number; comments: number; rating: number }>>({});

  const isOwnProfile = user?.id === userId;
  const handleNoOp = () => {};

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
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      try {
        const { data: publicData } = await supabase.rpc('get_public_profiles', { user_ids: [userId] as any });
        const p = (publicData as any[])?.[0];
        if (p) {
          setProfile({ id: p.id, username: p.username, full_name: null, avatar_url: p.avatar_url, bio: null });
          setLoading(false);
          return;
        }
      } catch {}
      toast({ title: "Error", description: "Failed to load user profile", variant: "destructive" });
      setLoading(false);
      return;
    }
    setProfile(data);
    setLoading(false);
  };

  const fetchStats = async () => { if (userId) setStats(await getUserStats(userId)); };
  const checkFollowStatus = async () => { if (userId && user) setIsFollowingUser(await isFollowing(userId)); };

  const fetchUserRecipes = async () => {
    if (!userId) return;
    const { data, error } = await supabase.from('recipes').select('*').eq('user_id', userId).eq('is_public', true).order('created_at', { ascending: false });
    if (error) { console.error('Error fetching user recipes:', error); return; }
    setRecipes(data || []);
    if (data && data.length > 0) {
      const ids = data.map(r => r.id);
      const [favCounts, commentCounts, ratingsResponse] = await Promise.all([
        getRecipesFavoriteCounts(ids), getRecipesCommentCounts(ids),
        supabase.rpc('get_recipe_rating_stats_batch', { p_recipe_ids: ids })
      ]);
      const ratingsData = ratingsResponse.data as Array<{ recipe_id: string; averageRating: number }> | null;
      const s: Record<string, { favorites: number; comments: number; rating: number }> = {};
      ids.forEach(id => {
        const r = ratingsData?.find(x => x.recipe_id === id);
        s[id] = { favorites: favCounts[id] || 0, comments: commentCounts[id] || 0, rating: r?.averageRating || 0 };
      });
      setRecipeStats(s);
    }
  };

  const fetchUserFavorites = async () => {
    if (!userId) return;
    const query = supabase.from('favorites').select('recipe_id, created_at').eq('user_id', userId);
    if (!isOwnProfile) query.eq('is_public', true);
    const { data, error } = await query;
    if (error) { console.error('Error fetching favorites:', error); return; }
    const favIds = data?.map(f => f.recipe_id) || [];
    if (favIds.length === 0) { setFavoriteRecipes([]); return; }

    const classicIds = favIds.filter(id => !id.includes('-'));
    const userIds = favIds.filter(id => id.includes('-'));
    const result: Cocktail[] = [];

    if (classicIds.length > 0) result.push(...classicCocktails.filter(c => classicIds.includes(c.id)));
    if (userIds.length > 0) {
      const { data: userRecipes } = await supabase.from('recipes').select('*').in('id', userIds).eq('is_public', true);
      if (userRecipes) {
        result.push(...userRecipes.map(r => ({
          id: r.id, name: r.name, notes: r.description || undefined, image: r.image_url || '',
          tags: r.tags || [], prepTime: `${r.prep_time || 5} min`, ingredients: r.ingredients,
          steps: r.instructions, isUserRecipe: true,
        })));
      }
    }
    setFavoriteRecipes(result);

    const [favCounts, commentCounts, ratingsResponse] = await Promise.all([
      getRecipesFavoriteCounts(favIds), getRecipesCommentCounts(favIds),
      supabase.rpc('get_recipe_rating_stats_batch', { p_recipe_ids: favIds })
    ]);
    const ratingsData = ratingsResponse.data as Array<{ recipe_id: string; averageRating: number }> | null;
    const s: Record<string, { favorites: number; comments: number; rating: number }> = {};
    favIds.forEach(id => {
      const r = ratingsData?.find(x => x.recipe_id === id);
      s[id] = { favorites: favCounts[id] || 0, comments: commentCounts[id] || 0, rating: r?.averageRating || 0 };
    });
    setFavoriteStatsMap(s);
  };

  const fetchFollowingUsers = async () => {
    if (!userId) return;
    const follows = await getFollowing(userId);
    if (follows.length === 0) { setFollowingUsers([]); return; }
    const { data } = await supabase.rpc('get_public_profiles', { user_ids: follows.map(f => f.following_id) as any });
    setFollowingUsers(data || []);
  };

  const fetchFollowerUsers = async () => {
    if (!userId) return;
    const follows = await getFollowers(userId);
    if (follows.length === 0) { setFollowerUsers([]); return; }
    const { data } = await supabase.rpc('get_public_profiles', { user_ids: follows.map(f => f.follower_id) as any });
    setFollowerUsers(data || []);
  };

  const handleFollowToggle = async () => {
    if (!userId || !user) return;
    const success = isFollowingUser ? await unfollowUser(userId) : await followUser(userId);
    if (success) {
      setIsFollowingUser(!isFollowingUser);
      fetchStats();
      toast({ title: isFollowingUser ? "Unfollowed" : "Following", description: `You are ${isFollowingUser ? 'no longer following' : 'now following'} ${profile?.username || profile?.full_name || 'this user'}` });
    }
  };

  const navProps = {
    user, activeLibrary: "" as const, onLibrarySelect: handleNoOp, onAddRecipe: handleNoOp,
    onSignInClick: handleNoOp, onSignUpClick: handleNoOp, onProfileClick: handleNoOp,
    onMyRecipesClick: handleNoOp, onFavoritesClick: handleNoOp,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation {...navProps} />
        <div className="flex h-full">
          <div className="hidden md:block"><Sidebar active="" onSelect={handleNoOp} onAdd={handleNoOp} user={user} /></div>
          <main className="flex-1 overflow-auto lg:ml-0">
            <div className="max-w-4xl mx-auto p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-48 bg-muted rounded-organic-lg" />
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation {...navProps} />
        <div className="flex h-full">
          <div className="hidden md:block"><Sidebar active="" onSelect={handleNoOp} onAdd={handleNoOp} user={user} /></div>
          <main className="flex-1 overflow-auto lg:ml-0">
            <div className="max-w-4xl mx-auto p-6 text-center">
              <h1 className="text-2xl font-bold text-foreground">User not found</h1>
              <Button onClick={() => navigate('/')} className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" />Go Back</Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation {...navProps} />
      <div className="flex h-full">
        <div className="hidden md:block"><Sidebar active="" onSelect={handleNoOp} onAdd={handleNoOp} user={user} /></div>
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
              {isOwnProfile && (
                <Button variant="outline" onClick={() => navigate('/settings')}><Settings className="w-4 h-4 mr-2" />Settings</Button>
              )}
            </div>

            {/* Profile Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={getAvatarUrl(profile.avatar_url) || undefined} />
                    <AvatarFallback className="text-xl">{profile.full_name?.[0] || profile.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{profile.full_name || 'Anonymous'}</h1>
                      {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
                      {profile.bio && <p className="text-card-foreground mt-2">{profile.bio}</p>}
                    </div>

                    <div className="flex gap-6">
                      <button onClick={() => setActiveTab('recipes')} className="text-center hover:opacity-80 transition-opacity">
                        <div className="font-bold text-lg text-foreground">{stats.recipes_count}</div>
                        <div className="text-sm text-muted-foreground">Recipes</div>
                      </button>
                      <button onClick={() => setActiveTab('favorites')} className="text-center hover:opacity-80 transition-opacity">
                        <div className="font-bold text-lg text-foreground">{stats.favorites_count}</div>
                        <div className="text-sm text-muted-foreground">Favorites</div>
                      </button>
                      <button onClick={() => setActiveTab('followers')} className="text-center hover:opacity-80 transition-opacity">
                        <div className="font-bold text-lg text-foreground">{stats.followers_count}</div>
                        <div className="text-sm text-muted-foreground">Followers</div>
                      </button>
                      <button onClick={() => setActiveTab('following')} className="text-center hover:opacity-80 transition-opacity">
                        <div className="font-bold text-lg text-foreground">{stats.following_count}</div>
                        <div className="text-sm text-muted-foreground">Following</div>
                      </button>
                    </div>

                    {!isOwnProfile && user && (
                      <Button onClick={handleFollowToggle} variant={isFollowingUser ? "outline" : "default"} className="flex items-center gap-2">
                        <Users className="w-4 h-4" />{isFollowingUser ? 'Unfollow' : 'Follow'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Tabs - no Activity tab */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>

              <TabsContent value="recipes" className="mt-6">
                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => {
                      const s = recipeStats[recipe.id] || { favorites: 0, comments: 0, rating: 0 };
                      const cocktail: Cocktail = {
                        id: recipe.id, name: recipe.name, notes: recipe.description || undefined,
                        image: recipe.image_url || '', tags: recipe.tags || [],
                        prepTime: `${recipe.prep_time || 5} min`, ingredients: recipe.ingredients,
                        steps: recipe.instructions, createdBy: profile?.username || profile?.full_name || undefined,
                        creatorUsername: profile?.username || undefined, creatorAvatar: profile?.avatar_url || undefined,
                        creatorUserId: userId, isUserRecipe: true,
                        likeCount: s.favorites, commentCount: s.comments, averageRating: s.rating,
                      };
                      return <UniversalRecipeCard key={recipe.id} recipe={cocktail} hideCreator={true} />;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No recipes yet</h3>
                    <p className="text-muted-foreground">{isOwnProfile ? "Start creating your first recipe!" : "This user hasn't created any recipes yet."}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                {favoriteRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRecipes.map((recipe) => {
                      const s = favoriteStatsMap[recipe.id] || { favorites: 0, comments: 0, rating: 0 };
                      const cocktail: Cocktail = { ...recipe, likeCount: s.favorites, commentCount: s.comments, averageRating: s.rating };
                      return <UniversalRecipeCard key={recipe.id} recipe={cocktail} />;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No favorites yet</h3>
                    <p className="text-muted-foreground">{isOwnProfile ? "Start favoriting recipes to see them here!" : "This user hasn't favorited any recipes yet."}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followers" className="mt-6">
                {followerUsers.length > 0 ? (
                  <div className="space-y-4">
                    {followerUsers.map((f) => <UserCard key={f.id} userId={f.id} username={f.username} avatarUrl={f.avatar_url} isCurrentUser={user?.id === f.id} />)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No followers yet</h3>
                    <p className="text-muted-foreground">{isOwnProfile ? "Share your recipes to gain followers!" : "This user doesn't have any followers yet."}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="following" className="mt-6">
                {followingUsers.length > 0 ? (
                  <div className="space-y-4">
                    {followingUsers.map((f) => <UserCard key={f.id} userId={f.id} username={f.username} avatarUrl={f.avatar_url} isCurrentUser={user?.id === f.id} />)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">Not following anyone yet</h3>
                    <p className="text-muted-foreground">{isOwnProfile ? "Start following other bartenders!" : "This user isn't following anyone yet."}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
