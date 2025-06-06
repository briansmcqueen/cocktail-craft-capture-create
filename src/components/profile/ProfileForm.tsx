
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface ProfileFormProps {
  profile: Profile;
  email: string | null;
  saving: boolean;
  onProfileChange: (updates: Partial<Profile>) => void;
  onSave: () => void;
}

export default function ProfileForm({ 
  profile, 
  email, 
  saving, 
  onProfileChange, 
  onSave 
}: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={profile.full_name || ''}
          onChange={(e) => onProfileChange({ full_name: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile.username || ''}
          onChange={(e) => onProfileChange({ username: e.target.value })}
          placeholder="Choose a unique username"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio || ''}
          onChange={(e) => onProfileChange({ bio: e.target.value })}
          placeholder="Tell us about yourself..."
          rows={3}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input value={email || ''} disabled />
        <p className="text-sm text-muted-foreground mt-1">
          Contact support to change your email address
        </p>
      </div>

      <Button onClick={onSave} disabled={saving} className="w-full gap-2 bg-orange-600 hover:bg-orange-700">
        <Save className="h-4 w-4" />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
