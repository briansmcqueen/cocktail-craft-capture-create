import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DangerZone({ username }: { username: string | null }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const expected = (username ?? user?.email ?? '').trim();
  const canSubmit = !!expected && confirmText.trim() === expected && !submitting;

  const handleDelete = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: {},
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || 'Failed to schedule deletion');
      }
      toast({
        title: 'Account scheduled for deletion',
        description: 'You have 7 days to cancel by signing back in.',
      });
      await signOut();
      navigate('/account-deleted', { replace: true });
    } catch (e: any) {
      toast({
        title: 'Could not delete account',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-transparent border-0 !shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold text-pure-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-pure-white" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-organic-md border border-destructive/40 bg-destructive/5 p-4 sm:p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-pure-white">Delete account</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Removes your profile, recipes, comments, ratings, favorites, follows, bar inventory, and uploaded images. You have 7 days to cancel by signing back in. After that, deletion is permanent and cannot be reversed.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(true)}
            className="rounded-organic-sm w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete my account
          </Button>
        </div>

        <AlertDialog open={open} onOpenChange={(o) => { if (!submitting) setOpen(o); }}>
          <AlertDialogContent className="max-h-[90dvh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your BARBOOK account?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2 text-left">
                <span className="block">This will schedule permanent deletion of:</span>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Your profile, username, and avatar</li>
                  <li>All recipes, ratings, and comments you posted</li>
                  <li>Your favorites, follows, and bar inventory</li>
                  <li>All images you uploaded</li>
                </ul>
                <span className="block pt-2">
                  You have 7 days to cancel by signing back in. After that the data cannot be recovered.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-foreground text-sm">
                Type <strong>{expected || 'your username'}</strong> below to confirm.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="deleteConfirm">Confirmation</Label>
              <Input
                id="deleteConfirm"
                type="text"
                autoComplete="off"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={expected}
                className="bg-medium-charcoal border-border text-pure-white rounded-organic-sm"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={submitting} className="rounded-organic-sm">
                Keep my account
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={!canSubmit}
                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                className="rounded-organic-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {submitting ? 'Scheduling…' : 'Delete account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}