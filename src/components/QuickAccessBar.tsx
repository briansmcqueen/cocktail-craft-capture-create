import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAccessBarProps {
  count: number;
}

export default function QuickAccessBar({ count }: QuickAccessBarProps) {
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-organic-sm px-4 py-3">
      <p className="text-sm text-light-text">
        <span className="text-pure-white font-medium">🍸 You can make {count} cocktail{count !== 1 ? 's' : ''}</span>
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="text-emerald-green hover:text-emerald-green/80 gap-1"
        onClick={() => navigate('/mybar')}
      >
        Go to My Bar <ArrowRight size={14} />
      </Button>
    </div>
  );
}
