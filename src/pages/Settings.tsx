import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import TopNavigation from '@/components/TopNavigation';
import Sidebar from '@/components/Sidebar';
import ProfileSettings from '@/components/profile/ProfileSettings';
import PrivacySettings from '@/components/profile/PrivacySettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Lock, Mail, Shield, AlertTriangle, Settings as Settings2 } from 'lucide-react';

export default function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    });

    if (error) {
      toast({
        title: "Failed to change password",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }

    setChangingPassword(false);
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      toast({
        title: "Failed to send reset email",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.newEmail || !emailData.password) {
      toast({
        title: "Missing information",
        description: "Please provide both new email and password.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (emailData.newEmail === user?.email) {
      toast({
        title: "Same email",
        description: "The new email is the same as your current email.",
        variant: "destructive",
      });
      return;
    }

    setChangingEmail(true);

    try {
      // First, re-authenticate the user to verify their password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: emailData.password,
      });

      if (signInError) {
        toast({
          title: "Authentication failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setChangingEmail(false);
        return;
      }

      // If authentication successful, update the email
      const { error: updateError } = await supabase.auth.updateUser({
        email: emailData.newEmail,
      }, {
        emailRedirectTo: `${window.location.origin}/settings`,
      });

      if (updateError) {
        toast({
          title: "Failed to change email",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        setEmailVerificationSent(true);
        toast({
          title: "Verification email sent",
          description: `We've sent a verification email to ${emailData.newEmail}. Please check your inbox and click the link to confirm your new email address.`,
        });
        setEmailData({ newEmail: '', password: '' });
        setShowEmailChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setChangingEmail(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      <TopNavigation
        user={user}
        activeLibrary=""
        onLibrarySelect={() => {}}
        onAddRecipe={() => navigate('/')}
        onSignInClick={() => {}}
        onSignUpClick={() => {}}
        onProfileClick={() => navigate(`/user/${user.id}`)}
        onMyRecipesClick={() => navigate('/recipes/my-drinks')}
        onFavoritesClick={() => navigate('/favorites')}
      />
      
      <div className="flex h-full">
        <div className="hidden md:block">
          <Sidebar
            active=""
            onSelect={(library) => {
              if (library === 'featured') navigate('/');
              else if (library === 'all') navigate('/recipes');
              else if (library === 'ingredients') navigate('/mybar');
              else if (library === 'feed') navigate('/feed');
              else if (library === 'discover') navigate('/discover');
              else if (library === 'favorites') navigate('/favorites');
              else if (library === 'mine') navigate('/recipes/my-drinks');
              else if (library === 'learn') navigate('/learn');
            }}
            onAdd={() => navigate('/')}
            onCloseForm={() => {}}
            user={user}
            onSignInClick={() => {}}
            onSignUpClick={() => {}}
            onProfileClick={() => navigate(`/user/${user.id}`)}
            onMyRecipesClick={() => navigate('/recipes/my-drinks')}
            onFavoritesClick={() => navigate('/favorites')}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <main id="main-content" className="w-full h-full">
            <div className="max-w-4xl mx-auto px-5 sm:px-4 lg:px-6 py-6 lg:py-8 pb-24 md:pb-6">
              <div className="mb-8 flex items-center gap-2.5">
                <Settings2 className="h-4 w-4 text-pure-white flex-shrink-0" />
                <h1 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
                  Settings
                </h1>
              </div>

              <div className="space-y-6">
                {/* Profile Settings */}
                <ProfileSettings />

                {/* Privacy Settings */}
                <PrivacySettings />

                {/* Password & Security */}
                <Card className="bg-transparent border-0 !shadow-none">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-semibold text-pure-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-pure-white" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>
                      Update your email and password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-0">
                    {/* Email Change Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            id="email"
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="bg-medium-charcoal border-border text-light-text"
                          />
                          {!showEmailChange && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowEmailChange(true)}
                              className="rounded-organic-sm border-border w-full sm:w-auto whitespace-nowrap"
                            >
                              Change Email
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Email Verification Alert */}
                      {emailVerificationSent && (
                        <Alert className="bg-primary/10 border-primary/30">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-foreground">
                            <strong>Verification pending:</strong> Check your inbox at your new email address and click the verification link to complete the change.
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Email Change Form */}
                      {showEmailChange && (
                        <form onSubmit={handleEmailChange} className="space-y-4 p-4 border border-border rounded-organic-md bg-medium-charcoal/50">
                          <div className="space-y-2">
                            <Label htmlFor="newEmail">
                              New Email Address
                            </Label>
                            <Input
                              id="newEmail"
                              type="email"
                              value={emailData.newEmail}
                              onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                              placeholder="Enter new email address"
                              className="bg-medium-charcoal border-border text-pure-white rounded-organic-sm"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emailChangePassword" className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Current Password
                            </Label>
                            <Input
                              id="emailChangePassword"
                              type="password"
                              value={emailData.password}
                              onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Confirm with your current password"
                              className="bg-medium-charcoal border-border text-pure-white rounded-organic-sm"
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              For security, please enter your current password to confirm this change
                            </p>
                          </div>

                          <Alert className="bg-amber-500/10 border-amber-500/30">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <AlertDescription className="text-foreground text-sm">
                              You will receive a verification email at your new address. You must click the verification link to complete the email change.
                            </AlertDescription>
                          </Alert>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              type="submit"
                              disabled={changingEmail || !emailData.newEmail || !emailData.password}
                              className="rounded-organic-sm w-full sm:w-auto"
                            >
                              {changingEmail ? 'Verifying...' : 'Change Email'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setShowEmailChange(false);
                                setEmailData({ newEmail: '', password: '' });
                              }}
                              className="rounded-organic-sm border-border w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>

                    <Separator className="bg-border" />

                    {/* Change Password Form */}
                    {!showPasswordChange ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">Password</h3>
                          <p className="text-sm text-muted-foreground">Update your password or send a reset email</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPasswordChange(true)}
                          className="rounded-organic-sm border-border w-full sm:w-auto"
                        >
                          Change Password
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handlePasswordChange} className="space-y-4 p-4 border border-border rounded-organic-md bg-medium-charcoal/50">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                            className="bg-medium-charcoal border-border text-pure-white rounded-organic-sm"
                            required
                            minLength={6}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                            className="bg-medium-charcoal border-border text-pure-white rounded-organic-sm"
                            required
                            minLength={6}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="submit"
                            disabled={changingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            className="rounded-organic-sm w-full sm:w-auto"
                          >
                            {changingPassword ? 'Changing Password...' : 'Change Password'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleSendPasswordReset}
                            className="rounded-organic-sm border-border w-full sm:w-auto"
                          >
                            Send Reset Email
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setShowPasswordChange(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              });
                            }}
                            className="rounded-organic-sm w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
