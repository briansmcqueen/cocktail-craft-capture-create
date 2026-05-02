import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DeletionPendingBanner() {
  const { user } = useAuth();
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setScheduledFor(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('deletion_scheduled_for')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      setScheduledFor((data as any)?.deletion_scheduled_for ?? null);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!user || !scheduledFor) return null;

  const when = new Date(scheduledFor);
  const formatted = when.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  const handleCancel = async () => {
    setWorking(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-account/cancel', {
        body: {},
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || 'Failed to cancel');
      }
      setScheduledFor(null);
      toast({
        title: 'Deletion cancelled',
        description: 'Your account is safe. Welcome back.',
      });
    } catch (e: any) {
      toast({
        title: 'Could not cancel deletion',
        description: e?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="w-full bg-destructive/15 border-b border-destructive/40">
      <div className="max-w-6xl mx-auto px-5 py-2.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-start gap-2.5 flex-1">
          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-pure-white">
            Your account is scheduled for permanent deletion on{' '}
            <strong>{formatted}</strong>.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={working}
          className="rounded-organic-sm border-border whitespace-nowrap"
        >
          {working ? 'Cancelling…' : 'Cancel deletion'}
        </Button>
      </div>
    </div>
  );
}