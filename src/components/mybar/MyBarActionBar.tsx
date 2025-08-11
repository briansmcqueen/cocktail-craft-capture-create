import React from "react";
import { Button } from "@/components/ui/button";

interface MyBarActionBarProps {
  canMakeCount: number;
  oneAwayCount: number;
  shoppingCount?: number;
  onOpenCanMake: () => void;
  onOpenOneAway: () => void;
  onOpenShopping?: () => void;
}

export default function MyBarActionBar({
  canMakeCount,
  oneAwayCount,
  shoppingCount,
  onOpenCanMake,
  onOpenOneAway,
  onOpenShopping,
}: MyBarActionBarProps) {
  if (canMakeCount === 0 && oneAwayCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 pt-2 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-card/90 backdrop-blur border border-border rounded-organic-pill shadow-glass px-3 py-2 flex items-center gap-2 pointer-events-auto">
        <div className="flex-1 text-sm text-light-text">
          <span className="text-pure-white font-medium">You can make</span> {canMakeCount}
          {" "}cocktail{canMakeCount !== 1 ? "s" : ""}
          {oneAwayCount > 0 && (
            <span className="ml-2">• {oneAwayCount} one away</span>
          )}
        </div>
        <Button size="sm" className="rounded-organic-sm" onClick={onOpenCanMake}>
          View
        </Button>
        {oneAwayCount > 0 && (
          <Button variant="secondary" size="sm" className="rounded-organic-sm" onClick={onOpenOneAway}>
            +1 Away
          </Button>
        )}
        {onOpenShopping && (
          <Button variant="outline" size="sm" className="rounded-organic-sm" onClick={onOpenShopping}>
            List{typeof shoppingCount === 'number' ? ` (${shoppingCount})` : ''}
          </Button>
        )}
      </div>
    </div>
  );
}
