import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, ChefHat, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { followUser, unfollowUser, isFollowing, getUserStats, type UserStats } from '@/services/followsService';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import RecipeGrid from './RecipeGrid';

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
  const [activeTab, setActiveTab] = useState('creations');

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (!userId) return;
    
    fetchProfile();
    fetchStats();
    checkFollowStatus();
    fetchUserRecipes();
    fetchUserFavorites();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
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
        <h1 className="text-2xl font-bold text-gray-600">User not found</h1>
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
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {isOwnProfile && (
          <Button variant="outline" onClick={() => navigate('/profile/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-xl">
                {profile.full_name?.[0] || profile.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name || 'Anonymous'}</h1>
                {profile.username && (
                  <p className="text-gray-600">@{profile.username}</p>
                )}
                {profile.bio && (
                  <p className="text-gray-700 mt-2">{profile.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.recipes_count}</div>
                  <div className="text-sm text-gray-600">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.followers_count}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{stats.following_count}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creations" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Creations
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="creations" className="mt-6">
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => navigate(`/recipe/${recipe.id}`)}>
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    {recipe.image_url ? (
                      <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{recipe.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{recipe.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No recipes yet</h3>
              <p className="text-gray-500">
                {isOwnProfile ? "Start creating your first recipe!" : "This user hasn't created any recipes yet."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Favorites coming soon</h3>
            <p className="text-gray-500">
              This section will show favorited recipes.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto text-gray-400 mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-600">Activity feed coming soon</h3>
            <p className="text-gray-500">
              This section will show recent user activity.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}