import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DataExport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error('Not authenticated');

      const url = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/export-account-data`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
      });

      if (!res.ok) {
        let msg = 'Export failed';
        try {
          const j = await res.json();
          msg = j.error ?? msg;
        } catch { /* ignore */ }
        if (res.status === 429) msg = 'Export limit reached. Try again tomorrow.';
        throw new Error(msg);
      }

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `barbook-export-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: 'Export ready',
        description: 'Your data has been downloaded.',
      });
    } catch (e) {
      toast({
        title: 'Could not export data',
        description: e instanceof Error ? e.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border-0 !shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold text-pure-white flex items-center gap-2">
          <Download className="h-5 w-5 text-pure-white" />
          Download your data
        </CardTitle>
        <CardDescription>
          Export a copy of your account data under your GDPR right to data portability
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-organic-md border border-border bg-medium-charcoal/40 p-4 sm:p-5 space-y-4">
          <div>
            <h3 className="font-semibold text-pure-white">Account data export</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You'll receive a ZIP archive containing your profile, recipes, comments, ratings, favorites, follows, bar inventory, preferences, and a list of files you've uploaded. Limited to 3 exports per day.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleExport}
            disabled={loading}
            className="rounded-organic-sm w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Preparing export…' : 'Download my data (ZIP)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}