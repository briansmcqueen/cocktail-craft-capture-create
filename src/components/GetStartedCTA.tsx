import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface GetStartedCTAProps {
  onShowAuthModal?: () => void;
}

export default function GetStartedCTA({ onShowAuthModal }: GetStartedCTAProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Authenticated users with bar set up: no CTA needed
  // This component handles both unauth and auth-without-bar states
  if (user) {
    // Could show a "Set up your bar" nudge, but Featured.tsx handles the conditional
    return null;
  }

  return (
    <section>
      <div className="rounded-organic-md border border-border bg-card p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          What's in your bar?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
          Tell us what bottles you have and we'll show you every cocktail you can make.
        </p>
        <Button
          size="lg"
          onClick={() => onShowAuthModal?.()}
          className="min-w-[200px]"
        >
          Create Free Account
        </Button>
      </div>
    </section>
  );
}
