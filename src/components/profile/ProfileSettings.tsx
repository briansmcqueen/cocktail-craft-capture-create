
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getAvatarUrl } from '@/utils/avatarUrl';
import AvatarUpload from './AvatarUpload';
import ProfileForm from './ProfileForm';
import UserPreferencesForm from '../UserPreferencesForm';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProfile(data || {
        id: user.id,
        username: null,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        bio: null,
      });
    }
    setLoading(false);
  };

  const handleProfileChange = (updates: Partial<Profile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleAvatarChange = (url: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const { error } = await updateProfile({
      username: profile.username || undefined,
      full_name: profile.full_name || undefined,
      bio: profile.bio || undefined,
    });

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      window.location.href = '/';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center p-8">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pure-white">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload
            avatarUrl={getAvatarUrl(profile.avatar_url)}
            fullName={profile.full_name}
            email={user?.email || null}
            userId={user?.id || ''}
            onAvatarChange={handleAvatarChange}
          />

          <ProfileForm
            profile={profile}
            email={user?.email || null}
            saving={saving}
            onProfileChange={handleProfileChange}
            onSave={handleSave}
          />
        </CardContent>
      </Card>

      <UserPreferencesForm />

      {/* Sign Out Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pure-white">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4 bg-border" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="rounded-organic-sm border-error text-error hover:bg-error/10 w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
