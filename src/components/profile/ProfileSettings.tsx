
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AvatarUpload from './AvatarUpload';
import ProfileForm from './ProfileForm';

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

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center p-8">Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload
            avatarUrl={profile.avatar_url}
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
    </div>
  );
}
