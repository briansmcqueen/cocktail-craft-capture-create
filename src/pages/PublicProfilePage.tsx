import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, BookOpen, Heart, ArrowLeft, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import RecipeCard from '@/components/RecipeCard';
import FollowButton from '@/components/FollowButton';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import { BackButton } from '@/components/ui/back-button';
import { publicProfileService, PublicProfile, PublicRecipe } from '@/services/publicProfileService';
import { followsService, FollowStats } from '@/services/followsService';
import { privacyService } from '@/services/privacyService';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { classicCocktails } from '@/data/classicCocktails';
import { getAvatarUrl } from '@/utils/avatarUrl';

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);
  const [followStats, setFollowStats] = useState<FollowStats>({ followerCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');

  const isOwnProfile = user && profile && user.user_metadata?.username === profile.username;

  useEffect(() => {
    if (username) {
      loadProfileData();
    }
  }, [username]);

  const loadProfileData = async () => {
    if (!username) return;
    
    setLoading(true);
    try {
      const profileData = await publicProfileService.getProfileByUsername(username);
      
      if (!profileData) {
        navigate('/404');
        return;
      }

      setProfile(profileData);

      // Load recipes
      const recipesData = await publicProfileService.getUserPublicRecipes(profileData.id);
      setRecipes(recipesData);

      // Load public favorites
      const favoritesData = await publicProfileService.getUserPublicFavorites(profileData.id);
      setFavoriteRecipeIds(favoritesData);

      // Load follow stats
      const stats = await followsService.getFollowStats(profileData.id);
      setFollowStats(stats);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return profile?.username?.[0]?.toUpperCase() || 'U';
  };

  // Get favorite recipes that are public (classic cocktails)
  const favoriteRecipes = classicCocktails.filter(cocktail => 
    favoriteRecipeIds.includes(cocktail.id)
  );

  const fullAvatarUrl = getAvatarUrl(profile?.avatar_url);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return null;
  }

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
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main className="w-full h-full">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-6">
              {/* Back Button */}
              <BackButton onClick={() => navigate(-1)}>
                Back
              </BackButton>

              {/* Header */}
              <div className="bg-rich-charcoal border border-light-charcoal rounded-organic-md mb-6 mt-4">
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary/20">
                      <AvatarImage src={fullAvatarUrl || undefined} alt={profile.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-semibold text-pure-white">
                          {profile.full_name || profile.username}
                        </h1>
                        <FollowButton 
                          userId={profile.id} 
                          username={profile.username}
                          onFollowChange={loadProfileData}
                        />
                      </div>
                      <p className="text-lg text-soft-gray mb-3">@{profile.username}</p>
                      
                      {profile.bio && (
                        <p className="text-light-text mb-4 max-w-2xl">{profile.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-soft-gray">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{recipes.length} Public Recipe{recipes.length !== 1 ? 's' : ''}</span>
                        </div>
                        {favoriteRecipes.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span>{favoriteRecipes.length} Public Favorite{favoriteRecipes.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <button 
                          onClick={() => navigate(`/profile/${username}/followers`)}
                          className="flex items-center gap-2 hover:text-pure-white transition-colors"
                        >
                          <Users className="h-4 w-4" />
                          <span>{followStats.followerCount} Follower{followStats.followerCount !== 1 ? 's' : ''}</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/profile/${username}/followers`)}
                          className="flex items-center gap-2 hover:text-pure-white transition-colors"
                        >
                          <Users className="h-4 w-4" />
                          <span>{followStats.followingCount} Following</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 bg-medium-charcoal border border-light-charcoal rounded-organic-md">
                  <TabsTrigger 
                    value="recipes" 
                    className="rounded-organic-sm data-[state=active]:bg-primary/20 data-[state=active]:text-emerald"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Recipes ({recipes.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="favorites" 
                    className="rounded-organic-sm data-[state=active]:bg-primary/20 data-[state=active]:text-emerald"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites ({favoriteRecipes.length})
                  </TabsTrigger>
                </TabsList>

                {/* Recipes Tab */}
                <TabsContent value="recipes" className="mt-0">
                  {recipes.length === 0 ? (
                    <div className="text-center py-16">
                      <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {isOwnProfile ? 'No recipes yet' : 'No accessible recipes'}
                      </h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile 
                          ? "Start sharing your cocktail creations with the community!"
                          : `This user's recipes may be private or followers-only`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="bg-medium-charcoal border border-light-charcoal rounded-organic-md p-4 hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => navigate(`/cocktail/${profile.username}/${recipe.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          {recipe.image_url && (
                            <img
                              src={recipe.image_url}
                              alt={recipe.name}
                              className="w-full h-48 object-cover rounded-organic-sm mb-4"
                            />
                          )}
                          <h3 className="text-xl font-semibold text-pure-white mb-2">
                            {recipe.name}
                          </h3>
                          {recipe.description && (
                            <p className="text-light-text text-sm mb-3 line-clamp-2">
                              {recipe.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-soft-gray">
                            {recipe.difficulty && (
                              <span className="px-2 py-1 bg-primary/10 text-emerald rounded-organic-sm">
                                {recipe.difficulty}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(recipe.created_at), 'MMM yyyy')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="mt-0">
                  {favoriteRecipes.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart className="h-16 w-16 mx-auto mb-4 text-soft-gray opacity-50" />
                      <h3 className="text-xl font-semibold text-light-text mb-2">
                        No public favorites yet
                      </h3>
                      <p className="text-soft-gray">
                        {isOwnProfile 
                          ? "Mark your favorite cocktails as public to share them here!"
                          : `${profile.username} hasn't made any favorites public yet.`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteRecipes.map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onSelect={() => navigate(`/cocktail/${recipe.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
