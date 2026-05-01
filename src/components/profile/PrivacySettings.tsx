import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Users, Lock, Info, Ban, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { blockedUsersService, type BlockedUser } from '@/services/blockedUsersService';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPrivacySettings();
      fetchBlockedUsers();
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

  const fetchBlockedUsers = async () => {
    const users = await blockedUsersService.getBlockedUsers();
    setBlockedUsers(users);
  };

  const handleSearchUsers = async (search: string) => {
    if (!search.trim() || search.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .ilike('username', `%${search}%`)
        .limit(5);

      if (error) throw error;

      // Filter out already blocked users and current user
      const filtered = data?.filter(p => 
        p.id !== user?.id && 
        !blockedUsers.some(b => b.blocked_id === p.id)
      ) || [];

      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleBlockUser = async (userId: string) => {
    const success = await blockedUsersService.blockUser(userId);
    if (success) {
      toast({
        title: "User blocked",
        description: "This user can no longer see your content or follow you.",
      });
      fetchBlockedUsers();
      setSearchUsername('');
      setSearchResults([]);
    } else {
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    const success = await blockedUsersService.unblockUser(userId);
    if (success) {
      toast({
        title: "User unblocked",
        description: "This user can now see your public content.",
      });
      fetchBlockedUsers();
    } else {
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
    }
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
      <Card className="bg-transparent border-0 shadow-none">
        <CardContent className="p-8">
          <div className="flex justify-center">Loading privacy settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-pure-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-pure-white" />
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
                className="w-full rounded-organic-sm bg-medium-charcoal border-border text-pure-white text-left"
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
                className="w-full rounded-organic-sm bg-medium-charcoal border-border text-pure-white text-left"
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
                className="w-full rounded-organic-sm bg-medium-charcoal border-border text-pure-white text-left"
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

        {/* Blocked Users */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Ban className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-3">
              <div>
                <Label className="text-base font-semibold text-foreground">Blocked Users</Label>
                <p className="text-sm text-muted-foreground">
                  Blocked users cannot view your content or follow you
                </p>
              </div>

              {/* Search to block users */}
              <div className="space-y-3">
                <Input
                  placeholder="Search username to block..."
                  value={searchUsername}
                  onChange={(e) => {
                    setSearchUsername(e.target.value);
                    handleSearchUsers(e.target.value);
                  }}
                  className="bg-medium-charcoal border-border rounded-organic-sm text-pure-white"
                />

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 p-3 bg-medium-charcoal/50 rounded-organic-md border border-border">
                    {searchResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={result.avatar_url || undefined} />
                            <AvatarFallback>{result.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-foreground">@{result.username}</p>
                            {result.full_name && (
                              <p className="text-xs text-muted-foreground">{result.full_name}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBlockUser(result.id)}
                          className="rounded-organic-sm"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Block
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* List of blocked users */}
              {blockedUsers.length > 0 ? (
                <div className="space-y-2">
                  {blockedUsers.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3 bg-medium-charcoal/50 rounded-organic-md border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={block.blocked_profile?.avatar_url || undefined} />
                          <AvatarFallback>
                            {block.blocked_profile?.username?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            @{block.blocked_profile?.username || 'Unknown'}
                          </p>
                          {block.blocked_profile?.full_name && (
                            <p className="text-xs text-muted-foreground">
                              {block.blocked_profile.full_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnblockUser(block.blocked_id)}
                        className="rounded-organic-sm border-border"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No blocked users
                </p>
              )}
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
