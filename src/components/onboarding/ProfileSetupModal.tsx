import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, CheckCircle2, XCircle, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/services/imageUploadService';
import { z } from 'zod';

interface ProfileSetupModalProps {
  open: boolean;
  userId: string;
  onComplete: () => void;
}

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .refine(val => val === val.toLowerCase(), 'Username must be lowercase');

export default function ProfileSetupModal({ open, userId, onComplete }: ProfileSetupModalProps) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const checkUsernameAvailability = async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    // Validate format first
    try {
      usernameSchema.parse(value);
      setUsernameError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameError(error.errors[0].message);
        setUsernameAvailable(false);
        return;
      }
    }

    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', value)
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
        return;
      }

      setUsernameAvailable(!data);
      if (data) {
        setUsernameError('Username is already taken');
      }
    } catch (error) {
      console.error('Error in checkUsernameAvailability:', error);
      setUsernameAvailable(null);
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    const lowercase = value.toLowerCase();
    setUsername(lowercase);
    setUsernameError('');
    setUsernameAvailable(null);

    // Debounce the availability check
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(lowercase);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: "Image size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Store the file for upload
    setAvatarFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;

    try {
      setUploading(true);
      
      // Compress the image
      const compressedBlob = await compressImage(avatarFile, 400, 400, 0.8);
      
      // Generate filename
      const fileExt = avatarFile.name.split('.').pop() || 'jpg';
      const fileName = `${userId}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedBlob, { 
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. You can add one later from settings.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || usernameAvailable !== true) {
      toast({
        title: "Invalid username",
        description: "Please choose a valid and available username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Validate username one more time
      try {
        usernameSchema.parse(username);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Invalid username",
            description: error.errors[0].message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Upload avatar if one was selected
      let uploadedAvatarUrl: string | null = null;
      if (avatarFile) {
        uploadedAvatarUrl = await uploadAvatar();
      }

      // Update profile with all info
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username,
          full_name: fullName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: uploadedAvatarUrl || null,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Also update auth user metadata for consistency
      if (uploadedAvatarUrl) {
        await supabase.auth.updateUser({
          data: { avatar_url: uploadedAvatarUrl }
        });
      }

      toast({
        title: "Profile created!",
        description: "Welcome to Barbook, @" + username,
      });

      onComplete();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md bg-rich-charcoal border-light-charcoal"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-pure-white">
            Welcome to Barbook!
          </DialogTitle>
          <DialogDescription className="text-center text-light-text">
            Let's set up your profile to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="text-white" size={24} />
              </button>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
              className="text-xs"
            >
              <Camera className="h-3 w-3 mr-2" />
              {avatarUrl ? 'Change Photo' : 'Add Photo (Optional)'}
            </Button>
          </div>

          {/* Username field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Username <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={loading}
                className={`pr-10 ${usernameError ? 'border-destructive' : ''}`}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {!checking && usernameAvailable === true && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
                {!checking && usernameAvailable === false && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-sm text-destructive">{usernameError}</p>
            )}
            {usernameAvailable === true && (
              <p className="text-sm text-primary">Username is available!</p>
            )}
            <p className="text-xs text-muted-foreground">
              3-20 characters, lowercase letters, numbers, and underscores only
            </p>
          </div>

          {/* Full name field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Full Name (Optional)
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              maxLength={100}
            />
          </div>

          {/* Bio field */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">
              Bio (Optional)
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
              maxLength={200}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/200
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || uploading || !username || usernameAvailable !== true}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? 'Uploading avatar...' : 'Setting up...'}
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
