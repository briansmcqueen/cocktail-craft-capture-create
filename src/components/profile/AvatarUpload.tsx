
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { compressImage } from '@/services/imageUploadService';
import ImageCropModal from '@/components/profile/ImageCropModal';

interface AvatarUploadProps {
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
  userId: string;
  onAvatarChange: (url: string) => void;
}

export default function AvatarUpload({ 
  avatarUrl, 
  fullName, 
  email, 
  userId, 
  onAvatarChange 
}: AvatarUploadProps) {
  const { refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || email?.[0]?.toUpperCase() || 'U';

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Create temporary URL for cropping
    const tempUrl = URL.createObjectURL(file);
    setTempImageUrl(tempUrl);
    setShowCropModal(true);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropModal(false);
    setUploading(true);

    try {
      // Compress the cropped image to WebP (with JPEG fallback)
      const compressedBlob = await compressImage(
        new File([croppedBlob], 'avatar', { type: 'image/jpeg' }),
        400,
        400,
        0.85
      );

      const fileExt = compressedBlob.type === 'image/webp' ? 'webp' : 'jpg';
      const fileName = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedBlob, {
          upsert: true,
          contentType: compressedBlob.type,
        });

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

        const publicUrl = data.publicUrl;

        // Update profile table with new avatar URL
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

        if (profileError) {
          console.error('Profile update error:', profileError);
          toast({
            title: "Warning",
            description: "Avatar uploaded but profile update failed. Please refresh the page.",
            variant: "destructive",
          });
        }

        // Update auth user metadata to ensure avatar shows everywhere
        const { error: authError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        });

        if (authError) {
          console.error('Auth update error:', authError);
          toast({
            title: "Warning",
            description: "Avatar uploaded but user metadata update failed.",
            variant: "destructive",
          });
        }

        // Refresh user session to get updated metadata
        await refreshUser();

        onAvatarChange(publicUrl);
        
        toast({
          title: "Avatar uploaded",
          description: "Your profile picture has been updated.",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clean up temp URL
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
        setTempImageUrl(null);
      }
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    
    // Clean up temp URL
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage 
              src={avatarUrl || undefined} 
              alt="Profile picture"
            />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
          >
            <Camera className="text-white" size={28} />
          </button>
        </div>
        
        <div className="flex-1">
          <Label htmlFor="avatar" className="cursor-pointer">
            <Button 
              variant="outline" 
              className="gap-2 rounded-organic-sm" 
              disabled={uploading} 
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Change Photo'}
              </span>
            </Button>
          </Label>
          <Input
            ref={fileInputRef}
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG, or WEBP (max 10MB)
          </p>
        </div>
      </div>

      {/* Image Crop Modal */}
      {tempImageUrl && (
        <ImageCropModal
          open={showCropModal}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
