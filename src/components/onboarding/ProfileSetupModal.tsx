import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, CheckCircle2, XCircle, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { compressImage } from '@/services/imageUploadService';
import ImageCropModal from '@/components/profile/ImageCropModal';
import { z } from 'zod';

interface ProfileSetupModalProps {
  open: boolean;
  userId: string;
  onComplete: () => void;
}

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be 30 characters or less')
  .regex(/^[a-z0-9_-]+$/, 'Lowercase letters, numbers, underscores, and hyphens only')
  .refine(val => !val.startsWith('-') && !val.endsWith('-'), 'Cannot start or end with a hyphen');

export default function ProfileSetupModal({ open, userId, onComplete }: ProfileSetupModalProps) {
  const { refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
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

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkUsernameAvailability(lowercase);
    }, 500);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: "Image size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    setTempImageUrl(tempUrl);
    setShowCropModal(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setAvatarBlob(croppedBlob);
    const previewUrl = URL.createObjectURL(croppedBlob);
    if (avatarUrl) {
      URL.revokeObjectURL(avatarUrl);
    }
    setAvatarUrl(previewUrl);
    setShowCropModal(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarBlob) return null;

    try {
      setUploading(true);
      const compressedBlob = await compressImage(
        new File([avatarBlob], 'avatar.jpg', { type: 'image/jpeg' }),
        400, 400, 0.85
      );
      const fileName = `${userId}/avatar.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedBlob, { 
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

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

      let uploadedAvatarUrl: string | null = null;
      if (avatarBlob) {
        uploadedAvatarUrl = await uploadAvatar();
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: username,
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

      if (uploadedAvatarUrl) {
        await supabase.auth.updateUser({
          data: { avatar_url: uploadedAvatarUrl }
        });
        await refreshUser();
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
        className="sm:max-w-md bg-rich-charcoal border-light-charcoal [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-pure-white font-semibold">
            Choose a username
          </DialogTitle>
          <DialogDescription className="text-center text-light-text">
            This is how other bartenders will find you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Avatar - compact inline */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
              className="relative group"
            >
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  <User size={24} />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={16} />
              </div>
            </button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Username field */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</div>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={loading}
                className={`pl-7 pr-10 ${usernameError ? 'border-destructive' : ''}`}
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
              3–30 characters, lowercase letters, numbers, underscores, and hyphens
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
                {uploading ? 'Uploading...' : 'Setting up...'}
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>

      {tempImageUrl && (
        <ImageCropModal
          open={showCropModal}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </Dialog>
  );
}
