import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageSEO from '@/components/PageSEO';
import { CheckCircle2, Clock } from 'lucide-react';

export default function AccountDeleted() {
  return (
    <>
      <PageSEO
        title="Account scheduled for deletion · BARBOOK"
        description="Your BARBOOK account has been scheduled for deletion."
      />
      <main className="min-h-dvh flex items-center justify-center px-5 py-12 bg-background">
        <Card className="max-w-lg w-full bg-medium-charcoal border-border rounded-organic-md">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              <h1 className="text-xl font-semibold text-pure-white">
                Account scheduled for deletion
              </h1>
            </div>

            <p className="text-light-text">
              Your BARBOOK account and all associated data will be permanently
              removed in <strong>7 days</strong>.
            </p>

            <div className="rounded-organic-sm border border-border bg-rich-charcoal p-4 flex gap-3">
              <Clock className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-light-text space-y-1">
                <p className="font-medium text-pure-white">Changed your mind?</p>
                <p>
                  Sign back in within 7 days and choose <strong>Cancel deletion</strong>{' '}
                  from the banner. After that, your data cannot be recovered.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Backup snapshots are retained up to 30 days and are overwritten on
              their normal rotation. See our{' '}
              <Link to="/privacy" className="underline hover:text-pure-white">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>

            <div className="pt-2">
              <Button asChild variant="outline" className="rounded-organic-sm border-border">
                <Link to="/">Back to BARBOOK</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}