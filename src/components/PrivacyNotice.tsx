import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "barbook.privacyNoticeDismissed";

/**
 * Lightweight bottom-right notice explaining that Barbook uses privacy-friendly
 * analytics + local storage. Not a true GDPR cookie banner — Plausible is
 * cookieless and we only store small UI/auth preferences locally — but it
 * clearly discloses it and links to the Privacy page. Dismissed forever per
 * browser via localStorage.
 */
export default function PrivacyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Slight delay so it doesn't compete with first paint / auth modals.
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage blocked — fail silently, just never show.
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] bg-medium-charcoal border border-border-gray rounded-organic-md shadow-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-pure-white font-semibold mb-1">
            We respect your privacy
          </p>
          <p className="text-xs text-light-text leading-relaxed">
            Barbook uses cookieless analytics and stores small preferences (like
            your bar inventory) locally on your device. No tracking cookies, no
            ads. Read more in our{" "}
            <Link
              to="/privacy"
              className="text-emerald hover:underline font-medium"
              onClick={dismiss}
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3">
            <Button
              size="sm"
              onClick={dismiss}
              className="bg-deep-forest hover:bg-dark-forest text-pure-white h-8"
            >
              Got it
            </Button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss privacy notice"
          className="text-soft-gray hover:text-pure-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
