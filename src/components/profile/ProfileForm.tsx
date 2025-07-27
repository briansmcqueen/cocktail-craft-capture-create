
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email || ''}
          disabled
          className="bg-gray-50"
        />
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile.username || ''}
          onChange={(e) => onProfileChange({ username: e.target.value })}
          placeholder="Choose a username"
        />
      </div>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={profile.full_name || ''}
          onChange={(e) => onProfileChange({ full_name: e.target.value })}
          placeholder="Your full name"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio || ''}
          onChange={(e) => onProfileChange({ bio: e.target.value })}
          placeholder="Tell us about yourself"
          rows={3}
        />
      </div>

      <Button 
        onClick={onSave} 
        disabled={saving}
        className=""
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
