
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Input sanitization utilities
const sanitizeInput = (input: string, maxLength: number = 100): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters  
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .slice(0, maxLength)
    .trim();
};

const validateProfileInput = (field: string, value: string): boolean => {
  switch (field) {
    case 'username':
      // Username: 3-30 chars, only letters, numbers, hyphens, and underscores
      return /^[a-zA-Z0-9_-]{3,30}$/.test(value);
    case 'full_name':
      return /^[a-zA-Z\s'-]{1,50}$/.test(value);
    case 'bio':
      return value.length <= 500;
    default:
      return true;
  }
};

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
  const handleSecureInputChange = (field: string, value: string) => {
    const sanitized = sanitizeInput(value, field === 'bio' ? 500 : 100);
    
    if (!validateProfileInput(field, sanitized)) {
      return; // Don't update if validation fails
    }
    
    onProfileChange({ [field]: sanitized });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email || ''}
          disabled
          className="bg-muted"
        />
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={profile.username || ''}
          onChange={(e) => handleSecureInputChange('username', e.target.value)}
          placeholder="Choose a username (3-30 characters)"
          maxLength={30}
          disabled={!!profile.username}
          className={profile.username ? 'bg-muted cursor-not-allowed' : ''}
        />
        {profile.username ? (
          <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Username cannot be changed once set
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            3-30 characters: letters, numbers, hyphens, and underscores only
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={profile.full_name || ''}
          onChange={(e) => handleSecureInputChange('full_name', e.target.value)}
          placeholder="Your full name"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Letters, spaces, apostrophes, and hyphens only
        </p>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio || ''}
          onChange={(e) => handleSecureInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {(profile.bio || '').length}/500 characters
        </p>
      </div>

      <Button 
        onClick={onSave} 
        disabled={saving}
        className="w-full"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
