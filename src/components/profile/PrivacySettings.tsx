import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Users, Lock, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type ProfileVisibility = 'public' | 'followers' | 'private';
type RecipeVisibility = 'public' | 'followers' | 'private';
type AllowFollows = 'everyone' | 'approval' | 'none';

interface PrivacySettings {
  profile_visibility: ProfileVisibility;
  recipe_visibility: RecipeVisibility;
  allow_follows: AllowFollows;
}

export default function PrivacySettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    recipe_visibility: 'public',
    allow_follows: 'everyone',
  });

  useEffect(() => {
    if (user) {
      fetchPrivacySettings();
    }
  }, [user]);

  const fetchPrivacySettings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('profile_visibility, recipe_visibility, allow_follows')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching privacy settings:', error);
      toast({
        title: "Error loading privacy settings",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setSettings({
        profile_visibility: (data.profile_visibility as ProfileVisibility) || 'public',
        recipe_visibility: (data.recipe_visibility as RecipeVisibility) || 'public',
        allow_follows: (data.allow_follows as AllowFollows) || 'everyone',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        profile_visibility: settings.profile_visibility,
        recipe_visibility: settings.recipe_visibility,
        allow_follows: settings.allow_follows,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Failed to save privacy settings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="flex justify-center">Loading privacy settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-pure-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Visibility
        </CardTitle>
        <CardDescription>
          Control who can see your profile, recipes, and follow you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-primary/10 border-primary/30">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground text-sm">
            These settings control your privacy across Barbook. Changes take effect immediately.
          </AlertDescription>
        </Alert>

        {/* Profile Visibility */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="profile-visibility" className="text-base font-semibold text-foreground">
                Profile Visibility
              </Label>
              <p className="text-sm text-muted-foreground">
                Control who can view your profile information, bio, and activity
              </p>
              <Select
                value={settings.profile_visibility}
                onValueChange={(value) => setSettings(prev => ({ ...prev, profile_visibility: value as ProfileVisibility }))}
              >
                <SelectTrigger 
                  id="profile-visibility"
                  className="w-full rounded-organic-sm bg-medium-charcoal border-border text-pure-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-medium-charcoal border-border">
                  <SelectItem value="public" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-xs text-muted-foreground">Anyone can view your profile</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="followers" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Followers Only</div>
                        <div className="text-xs text-muted-foreground">Only your followers can view</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-xs text-muted-foreground">Only you can view your profile</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Recipe Visibility */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="recipe-visibility" className="text-base font-semibold text-foreground">
                Recipe Visibility
              </Label>
              <p className="text-sm text-muted-foreground">
                Control who can view and discover your cocktail recipes
              </p>
              <Select
                value={settings.recipe_visibility}
                onValueChange={(value) => setSettings(prev => ({ ...prev, recipe_visibility: value as RecipeVisibility }))}
              >
                <SelectTrigger 
                  id="recipe-visibility"
                  className="w-full rounded-organic-sm bg-medium-charcoal border-border text-pure-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-medium-charcoal border-border">
                  <SelectItem value="public" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-xs text-muted-foreground">Anyone can view your recipes</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="followers" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Followers Only</div>
                        <div className="text-xs text-muted-foreground">Only followers can view recipes</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-xs text-muted-foreground">Only you can view your recipes</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Follow Settings */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-2">
              <Label htmlFor="allow-follows" className="text-base font-semibold text-foreground">
                Who Can Follow You
              </Label>
              <p className="text-sm text-muted-foreground">
                Control who can follow your account and see your updates
              </p>
              <Select
                value={settings.allow_follows}
                onValueChange={(value) => setSettings(prev => ({ ...prev, allow_follows: value as AllowFollows }))}
              >
                <SelectTrigger 
                  id="allow-follows"
                  className="w-full rounded-organic-sm bg-medium-charcoal border-border text-pure-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-medium-charcoal border-border">
                  <SelectItem value="everyone" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Everyone</div>
                        <div className="text-xs text-muted-foreground">Anyone can follow you</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="approval" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Approval Required</div>
                        <div className="text-xs text-muted-foreground">You approve follow requests</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="none" className="text-pure-white hover:bg-light-charcoal">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <div>
                        <div className="font-medium">No One</div>
                        <div className="text-xs text-muted-foreground">Cannot be followed</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-organic-sm"
          >
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
