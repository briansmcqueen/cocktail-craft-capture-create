import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Users, Lock, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import UniversalRecipeCard from '@/components/UniversalRecipeCard';
import UserCard from '@/components/social/UserCard';
import FollowButton from '@/components/FollowButton';
import ReportButton from '@/components/moderation/ReportButton';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import { BackButton } from '@/components/ui/back-button';
import { publicProfileService, PublicProfile, PublicRecipe } from '@/services/publicProfileService';
import { followsService, FollowStats } from '@/services/followsService';
import PageSEO from '@/components/PageSEO';
import { useAuth } from '@/hooks/useAuth';
import { classicCocktails } from '@/data/classicCocktails';
import { getAvatarUrl } from '@/utils/avatarUrl';
import { supabase } from '@/integrations/supabase/client';
import { useBatchShareCounts } from '@/hooks/useBatchShareCounts';

interface FollowUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followerCount: 0,
    followingCount: 0,
  });
  const [followerUsers, setFollowerUsers] = useState<FollowUser[]>([]);
  const [followingUsers, setFollowingUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recipes');

  const isOwnProfile = !!(user && profile && user.user_metadata?.username === profile.username);

  useEffect(() => {
    if (username) loadProfileData();
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

      const [recipesData, favoritesData, stats, followers, following] = await Promise.all([
        publicProfileService.getUserPublicRecipes(profileData.id),
        publicProfileService.getUserPublicFavorites(profileData.id),
        followsService.getFollowStats(profileData.id),
        followsService.getFollowers(profileData.id),
        followsService.getFollowing(profileData.id),
      ]);

      setRecipes(recipesData);
      setFavoriteRecipeIds(favoritesData);
      setFollowStats(stats);

      const followerIds = followers.map((f: any) => f.follower_id);
      const followingIds = following.map((f: any) => f.following_id);

      const [followerProfiles, followingProfiles] = await Promise.all([
        followerIds.length
          ? supabase.rpc('get_public_profiles', { user_ids: followerIds as any })
          : Promise.resolve({ data: [] as any[] }),
        followingIds.length
          ? supabase.rpc('get_public_profiles', { user_ids: followingIds as any })
          : Promise.resolve({ data: [] as any[] }),
      ]);

      setFollowerUsers((followerProfiles.data as FollowUser[]) || []);
      setFollowingUsers((followingProfiles.data as FollowUser[]) || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase();
    }
    return profile?.username?.[0]?.toUpperCase() || 'U';
  };

  const favoriteRecipes = classicCocktails.filter((c) => favoriteRecipeIds.includes(c.id));
  const recipesShareCounts = useBatchShareCounts(recipes.map((r) => r.id));
  const favoritesShareCounts = useBatchShareCounts(favoriteRecipes.map((r) => r.id));
  const fullAvatarUrl = getAvatarUrl(profile?.avatar_url);

  if (loading) return <LoadingSpinner />;
  if (!profile) return null;

  const handleNoOp = () => {};

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      <PageSEO
        title={`${profile.full_name || profile.username} (@${profile.username}) | Barbook`}
        description={
          profile.bio?.slice(0, 160) ||
          `Cocktail recipes and bartending profile for @${profile.username} on Barbook.`
        }
        path={`/profile/${profile.username}`}
        image={profile.avatar_url || undefined}
        type="profile"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: profile.full_name || profile.username,
            alternateName: profile.username,
            description: profile.bio || undefined,
            image: profile.avatar_url || undefined,
            url: `https://barbook.io/profile/${profile.username}`,
          },
        }}
      />
      <TopNavigation
        user={user}
        activeLibrary=""
        onLibrarySelect={handleNoOp}
        onAddRecipe={() => navigate('/')}
        onSignInClick={handleNoOp}
        onSignUpClick={handleNoOp}
        onProfileClick={() => user && navigate(`/user/${user.id}`)}
        onMyRecipesClick={() => navigate('/recipes/my-drinks')}
        onFavoritesClick={() => navigate('/favorites')}
      />

      <div className="flex h-full">
        <div className="hidden md:block">
          <Sidebar
            active=""
            onSelect={(library) => {
              if (library === 'featured') navigate('/');
              else if (library === 'all') navigate('/recipes');
              else if (library === 'ingredients') navigate('/mybar');
              else if (library === 'favorites') navigate('/favorites');
              else if (library === 'mine') navigate('/recipes/my-drinks');
              else if (library === 'learn') navigate('/learn');
            }}
            onAdd={() => navigate('/')}
            onCloseForm={handleNoOp}
            user={user}
            onSignInClick={handleNoOp}
            onSignUpClick={handleNoOp}
            onProfileClick={() => user && navigate(`/user/${user.id}`)}
            onMyRecipesClick={() => navigate('/recipes/my-drinks')}
            onFavoritesClick={() => navigate('/favorites')}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main id="main-content" className="w-full h-full">
            <div className="max-w-4xl mx-auto px-5 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-6 space-y-6">
              <BackButton onClick={() => navigate(-1)}>Back</BackButton>

              {/* Profile Card */}
              <Card className="bg-card border-border">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className="w-20 h-20 md:w-24 md:h-24">
                      <AvatarImage src={fullAvatarUrl || undefined} alt={profile.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">
                          {profile.full_name || profile.username}
                        </h1>
                        {profile.username && (
                          <p className="text-muted-foreground">@{profile.username}</p>
                        )}
                        {profile.bio && (
                          <p className="text-card-foreground mt-2">{profile.bio}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 sm:gap-4">
                        <button
                          onClick={() => setActiveTab('recipes')}
                          className="text-center hover:opacity-80 transition-opacity"
                        >
                          <div className="font-bold text-base sm:text-lg text-foreground">
                            {recipes.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Recipes</div>
                        </button>
                        <button
                          onClick={() => setActiveTab('favorites')}
                          className="text-center hover:opacity-80 transition-opacity"
                        >
                          <div className="font-bold text-base sm:text-lg text-foreground">
                            {favoriteRecipes.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Favorites</div>
                        </button>
                        <button
                          onClick={() => setActiveTab('followers')}
                          className="text-center hover:opacity-80 transition-opacity"
                        >
                          <div className="font-bold text-base sm:text-lg text-foreground">
                            {followStats.followerCount}
                          </div>
                          <div className="text-xs text-muted-foreground">Followers</div>
                        </button>
                        <button
                          onClick={() => setActiveTab('following')}
                          className="text-center hover:opacity-80 transition-opacity"
                        >
                          <div className="font-bold text-base sm:text-lg text-foreground">
                            {followStats.followingCount}
                          </div>
                          <div className="text-xs text-muted-foreground">Following</div>
                        </button>
                      </div>

                      {!isOwnProfile && (
                        <div className="flex items-center gap-2">
                          <FollowButton
                            userId={profile.id}
                            username={profile.username}
                            onFollowChange={loadProfileData}
                          />
                          <ReportButton
                            targetType="profile"
                            targetId={profile.id}
                            targetOwnerId={profile.id}
                            targetLabel={profile.username || profile.full_name || undefined}
                            variant="icon"
                            className="text-soft-gray hover:text-pure-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="recipes">Recipes</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="followers">Followers</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>

                <TabsContent value="recipes" className="mt-6">
                  {recipes.length === 0 ? (
                    <div className="text-center py-16">
                      <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {isOwnProfile ? 'No recipes yet' : 'No accessible recipes'}
                      </h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? 'Start sharing your cocktail creations with the community!'
                          : `This user's recipes may be private or followers-only`}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map((recipe, idx) => (
                        <UniversalRecipeCard
                          key={recipe.id}
                          recipe={{
                            id: recipe.id,
                            name: recipe.name,
                            image: recipe.image_url || '/placeholder.svg',
                            ingredients: [],
                            steps: '',
                            tags: recipe.tags || [],
                            notes: recipe.description || undefined,
                            isUserRecipe: true,
                            createdBy: profile.id,
                            creatorUsername: profile.username,
                            creatorUserId: profile.id,
                            creatorAvatar: profile.avatar_url || undefined,
                          }}
                          hideCreator
                          priority={idx === 0}
                          shareCount={recipesShareCounts[recipe.id] ?? 0}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="favorites" className="mt-6">
                  {favoriteRecipes.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No public favorites yet
                      </h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? 'Mark your favorite cocktails as public to share them here!'
                          : `${profile.username} hasn't made any favorites public yet.`}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteRecipes.map((recipe, idx) => (
                        <UniversalRecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          priority={idx === 0}
                          shareCount={favoritesShareCounts[recipe.id] ?? 0}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="followers" className="mt-6">
                  {followerUsers.length === 0 ? (
                    <div className="text-center py-16">
                      <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No followers yet
                      </h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? 'Share your recipes to gain followers!'
                          : `${profile.username} doesn't have any followers yet.`}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {followerUsers.map((f) => (
                        <UserCard
                          key={f.id}
                          userId={f.id}
                          username={f.username}
                          avatarUrl={f.avatar_url}
                          isCurrentUser={user?.id === f.id}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                  {followingUsers.length === 0 ? (
                    <div className="text-center py-16">
                      <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Not following anyone yet
                      </h3>
                      <p className="text-muted-foreground">
                        {isOwnProfile
                          ? 'Discover bartenders to follow!'
                          : `${profile.username} isn't following anyone yet.`}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {followingUsers.map((f) => (
                        <UserCard
                          key={f.id}
                          userId={f.id}
                          username={f.username}
                          avatarUrl={f.avatar_url}
                          isCurrentUser={user?.id === f.id}
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
