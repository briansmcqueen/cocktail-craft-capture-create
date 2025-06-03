
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const [uploading, setUploading] = useState(false);

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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    }
    setUploading(false);
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

  const initials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar" className="cursor-pointer">
                <Button variant="outline" className="gap-2" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </span>
                </Button>
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.full_name || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, username: e.target.value } : null)}
                placeholder="Choose a unique username"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
              <p className="text-sm text-muted-foreground mt-1">
                Contact support to change your email address
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2 bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
