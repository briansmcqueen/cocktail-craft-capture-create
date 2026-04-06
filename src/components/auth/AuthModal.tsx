
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: 'signin' | 'signup';
  contextMessage?: string;
}

export default function AuthModal({ open, onOpenChange, initialMode = 'signin', contextMessage }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'confirm'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  // Reset mode when modal opens with new initialMode
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      resetForm();
    }
  }, [open, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Password reset failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a password reset link. Please check your email inbox.",
          });
          setMode('signin');
          resetForm();
        }
      } else if (mode === 'signup') {
        const fullName = `${firstName} ${lastName}`.trim();
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setSignupEmail(email);
          setMode('confirm');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          onOpenChange(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!signupEmail) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail,
      });
      if (error) {
        toast({
          title: "Resend failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent",
          description: "We've resent the confirmation link.",
        });
      }
    } catch (error) {
      console.error('Error resending confirmation:', error);
    } finally {
      setResending(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const switchMode = () => {
    if (mode === 'reset' || mode === 'confirm') {
      setMode('signin');
    } else {
      setMode(mode === 'signin' ? 'signup' : 'signin');
    }
    resetForm();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Confirmation screen after signup
  if (mode === 'confirm') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" aria-describedby="auth-confirm-description">
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center text-pure-white">
                Check your email
              </DialogTitle>
            </DialogHeader>
            <p id="auth-confirm-description" className="text-sm text-light-text">
              We sent a confirmation link to{' '}
              <span className="font-medium text-pure-white">{signupEmail}</span>.
              <br />Click the link to activate your account.
            </p>
            <div className="flex flex-col gap-2 w-full pt-2">
              <Button
                variant="outline"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="w-full"
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Didn't get it? Resend"
                )}
              </Button>
              <Button
                onClick={() => {
                  setMode('signin');
                  resetForm();
                }}
                className="w-full"
              >
                I've confirmed → Sign In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="auth-description">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-pure-white">
            {mode === 'reset' ? 'Reset Password' : mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          {contextMessage ? (
            <p id="auth-description" className="text-sm text-light-text text-center font-medium animate-fade-in">
              {contextMessage}
            </p>
          ) : (
            <p id="auth-description" className="text-sm text-light-text text-center">
              {mode === 'reset' 
                ? 'Enter your email address and we\'ll send you a link to reset your password.' 
                : mode === 'signin' 
                ? 'Sign in to your account to access your recipes and preferences.' 
                : 'Create a new account to save recipes and track your bar inventory.'}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {mode === 'signin' && (
                <div className="text-right">
                  <Button 
                    type="button"
                    variant="link" 
                    onClick={() => setMode('reset')} 
                    className="text-xs text-soft-gray hover:text-light-text p-0 h-auto"
                  >
                    Forgot password?
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : mode === 'reset' ? 'Send Reset Link' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {mode !== 'reset' && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </Button>
          </>
        )}

        <div className="text-center">
          <Button variant="link" onClick={switchMode} className="text-soft-gray hover:text-light-text">
            {mode === 'reset'
              ? 'Back to sign in'
              : mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
