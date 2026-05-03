import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/social/UserCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { followsService, Follow } from '@/services/followsService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PageSEO from '@/components/PageSEO';

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followerProfiles, setFollowerProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [followingProfiles, setFollowingProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

  useEffect(() => {
    if (username) {
      loadData();
    }
  }, [username]);

  const loadData = async () => {
    if (!username) return;

    setLoading(true);
    try {
      // Get user profile
      const { data: profileData } = await supabase
        .rpc('get_public_profile_by_username', { p_username: username });

      if (!profileData || profileData.length === 0) {
        navigate('/404');
        return;
      }

      const userProfile = profileData[0];
      setProfile(userProfile);

      // Load followers and following
      const [followersData, followingData] = await Promise.all([
        followsService.getFollowers(userProfile.id),
        followsService.getFollowing(userProfile.id),
      ]);

      setFollowers(followersData);
      setFollowing(followingData);

      // Load profiles for followers
      if (followersData.length > 0) {
        const followerIds = followersData.map(f => f.follower_id);
        const { data: profiles } = await supabase
          .rpc('get_public_profiles', { user_ids: followerIds });

        if (profiles) {
          const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
          setFollowerProfiles(profileMap);
        }
      }

      // Load profiles for following
      if (followingData.length > 0) {
        const followingIds = followingData.map(f => f.following_id);
        const { data: profiles } = await supabase
          .rpc('get_public_profiles', { user_ids: followingIds });

        if (profiles) {
          const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
          setFollowingProfiles(profileMap);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/profile/${username}`)}
          className="mb-4 rounded-organic-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-primary-foreground font-bold">
                {username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-pure-white">
              {profile.full_name || username}
            </h1>
            <p className="text-soft-gray text-sm">@{username}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'followers' | 'following')} className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="followers">
            <Users size={16} className="mr-2" />
            Followers ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following">
            <Users size={16} className="mr-2" />
            Following ({following.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="space-y-4">
          {followers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-soft-gray opacity-50" />
              <h3 className="text-xl font-semibold text-light-text mb-2">
                No followers yet
              </h3>
              <p className="text-soft-gray">
                {isOwnProfile ? 'Start sharing recipes to gain followers!' : `${username} hasn't gained any followers yet`}
              </p>
            </div>
          ) : (
            followers.map((follow) => {
              const followerProfile = followerProfiles.get(follow.follower_id);
              if (!followerProfile) return null;

              return (
                <UserCard
                  key={follow.follower_id}
                  userId={follow.follower_id}
                  username={followerProfile.username}
                  fullName={followerProfile.full_name}
                  avatarUrl={followerProfile.avatar_url}
                  bio={followerProfile.bio}
                  isCurrentUser={currentUser?.id === follow.follower_id}
                />
              );
            })
          )}
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          {following.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-soft-gray opacity-50" />
              <h3 className="text-xl font-semibold text-light-text mb-2">
                Not following anyone yet
              </h3>
              <p className="text-soft-gray">
                {isOwnProfile ? 'Discover bartenders to follow!' : `${username} isn't following anyone yet`}
              </p>
            </div>
          ) : (
            following.map((follow) => {
              const followingProfile = followingProfiles.get(follow.following_id);
              if (!followingProfile) return null;

              return (
                <UserCard
                  key={follow.following_id}
                  userId={follow.following_id}
                  username={followingProfile.username}
                  fullName={followingProfile.full_name}
                  avatarUrl={followingProfile.avatar_url}
                  bio={followingProfile.bio}
                  isCurrentUser={currentUser?.id === follow.following_id}
                />
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
