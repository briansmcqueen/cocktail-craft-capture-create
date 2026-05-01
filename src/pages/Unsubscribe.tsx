import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Mail, CheckCircle2, AlertTriangle, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type Status =
  | "validating"
  | "valid"
  | "already_unsubscribed"
  | "invalid"
  | "submitting"
  | "success"
  | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("validating");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    document.title = "Email Preferences — Barbook";
    if (!token) {
      setStatus("invalid");
      setErrorMsg("This unsubscribe link is missing its token.");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
          setErrorMsg(data?.error || "This link is invalid or has expired.");
          return;
        }
        if (data?.valid === true) {
          setStatus("valid");
        } else if (data?.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else {
          setStatus("invalid");
          setErrorMsg("This link is invalid or has expired.");
        }
      } catch (e) {
        setStatus("error");
        setErrorMsg("We couldn't reach the server. Please try again.");
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } }
      );
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center space-y-6">
        <Link
          to="/"
          className="inline-block text-sm font-bold tracking-[0.25em] text-primary hover:text-secondary transition-colors"
          aria-label="Barbook home"
        >
          BARBOOK
        </Link>

        <div className="bg-card border border-border rounded-organic-md p-8 space-y-5">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              {status === "validating" || status === "submitting" ? (
                <Loader2 className="h-7 w-7 text-pure-white animate-spin" />
              ) : status === "success" || status === "already_unsubscribed" ? (
                <CheckCircle2 className="h-7 w-7 text-secondary" />
              ) : status === "invalid" || status === "error" ? (
                <AlertTriangle className="h-7 w-7 text-destructive" />
              ) : (
                <Mail className="h-7 w-7 text-pure-white" />
              )}
            </div>
          </div>

          {status === "validating" && (
            <>
              <h1 className="text-xl font-semibold text-pure-white">
                Checking your link…
              </h1>
              <p className="text-sm text-muted-foreground">
                One moment while we validate your unsubscribe link.
              </p>
            </>
          )}

          {status === "valid" && (
            <>
              <h1 className="text-xl font-semibold text-pure-white">
                Unsubscribe from app emails
              </h1>
              <p className="text-sm text-card-foreground">
                You'll stop receiving notification and confirmation emails from
                Barbook. Account‑critical emails (like password resets) will
                still be delivered.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button onClick={handleConfirm} className="w-full sm:w-auto">
                  Confirm Unsubscribe
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/">Keep me subscribed</Link>
                </Button>
              </div>
            </>
          )}

          {status === "submitting" && (
            <>
              <h1 className="text-xl font-semibold text-pure-white">
                Updating preferences…
              </h1>
              <p className="text-sm text-muted-foreground">
                Hang tight while we update your email settings.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-xl font-semibold text-pure-white">
                You've been unsubscribed
              </h1>
              <p className="text-sm text-card-foreground">
                You won't receive further app emails from Barbook. Changed your
                mind? You can re‑enable emails from your account settings any
                time.
              </p>
              <div className="flex justify-center pt-2">
                <Button asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" /> Back to Barbook
                  </Link>
                </Button>
              </div>
            </>
          )}

          {status === "already_unsubscribed" && (
            <>
              <h1 className="text-xl font-semibold text-pure-white">
                Already unsubscribed
              </h1>
              <p className="text-sm text-card-foreground">
                This email is already on our suppression list — no further
                action needed.
              </p>
              <div className="flex justify-center pt-2">
                <Button asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" /> Back to Barbook
                  </Link>
                </Button>
              </div>
            </>
          )}

          {(status === "invalid" || status === "error") && (
            <>
              <h1 className="text-xl font-semibold text-pure-white">
                We couldn't process that link
              </h1>
              <p className="text-sm text-card-foreground">
                {errorMsg ||
                  "This unsubscribe link is invalid or has expired."}
              </p>
              <div className="flex justify-center pt-2">
                <Button asChild variant="outline">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" /> Back to Barbook
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Need help? Contact{" "}
          <a
            href="mailto:hello@barbook.io"
            className="text-secondary hover:underline"
          >
            hello@barbook.io
          </a>
        </p>
      </div>
    </main>
  );
}
