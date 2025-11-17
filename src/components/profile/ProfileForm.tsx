
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useCallback } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { checkUsernameAvailability } from '@/services/usernameService';

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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
  const [usernameInput, setUsernameInput] = useState(profile.username || '');
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });

  const debouncedUsername = useDebounce(usernameInput, 500);

  // Check username availability when debounced value changes
  useEffect(() => {
    // Only check if username field is editable (not already set)
    if (profile.username) return;
    
    if (!debouncedUsername) {
      setUsernameStatus({ checking: false, available: null, message: '' });
      return;
    }

    const checkAvailability = async () => {
      setUsernameStatus({ checking: true, available: null, message: '' });
      
      const result = await checkUsernameAvailability(debouncedUsername);
      
      setUsernameStatus({
        checking: false,
        available: result.available,
        message: result.message
      });
    };

    checkAvailability();
  }, [debouncedUsername, profile.username]);

  const handleUsernameChange = (value: string) => {
    const sanitized = sanitizeInput(value, 30);
    setUsernameInput(sanitized);
    
    // Update parent state immediately for form validation
    if (validateProfileInput('username', sanitized)) {
      onProfileChange({ username: sanitized });
    }
  };

  const handleSecureInputChange = (field: string, value: string) => {
    const sanitized = sanitizeInput(value, field === 'bio' ? 500 : 100);
    
    if (!validateProfileInput(field, sanitized)) {
      return; // Don't update if validation fails
    }
    
    onProfileChange({ [field]: sanitized });
  };

  const getUsernameIcon = () => {
    if (profile.username) return null;
    if (usernameStatus.checking) {
      return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    }
    if (usernameStatus.available === true) {
      return <Check className="w-4 h-4 text-emerald-green" />;
    }
    if (usernameStatus.available === false) {
      return <X className="w-4 h-4 text-error-red" />;
    }
    return null;
  };

  const getUsernameHelperText = () => {
    if (profile.username) {
      return (
        <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Username cannot be changed once set
        </p>
      );
    }

    if (usernameStatus.checking) {
      return <p className="text-xs text-muted-foreground mt-1">Checking availability...</p>;
    }

    if (usernameStatus.available === true) {
      return <p className="text-xs text-emerald-green mt-1 flex items-center gap-1">
        <Check className="w-3 h-3" />
        {usernameStatus.message}
      </p>;
    }

    if (usernameStatus.available === false) {
      return <p className="text-xs text-error-red mt-1 flex items-center gap-1">
        <X className="w-3 h-3" />
        {usernameStatus.message}
      </p>;
    }

    return (
      <p className="text-xs text-muted-foreground mt-1">
        3-30 characters: letters, numbers, hyphens, and underscores only
      </p>
    );
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
        <div className="relative">
          <Input
            id="username"
            value={usernameInput}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="Choose a username (3-30 characters)"
            maxLength={30}
            disabled={!!profile.username}
            className={profile.username ? 'bg-muted cursor-not-allowed pr-10' : 'pr-10'}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getUsernameIcon()}
          </div>
        </div>
        {getUsernameHelperText()}
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
