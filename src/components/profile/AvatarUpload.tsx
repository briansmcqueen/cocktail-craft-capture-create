
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const [uploading, setUploading] = useState(false);

  const initials = fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || email?.[0]?.toUpperCase() || 'U';

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;

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

      onAvatarChange(data.publicUrl);
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      });
    }
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} />
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
  );
}
