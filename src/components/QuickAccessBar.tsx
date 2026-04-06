import { Martini, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MyBarModuleProps {
  ingredientCount: number;
  canMakeCount: number;
  oneAwayCount: number;
  topRecommendation?: {
    name: string;
    unlocks: number;
  };
}

export default function MyBarModule({
  ingredientCount,
  canMakeCount,
  oneAwayCount,
  topRecommendation,
}: MyBarModuleProps) {
  const navigate = useNavigate();

  if (ingredientCount === 0) return null;

  return (
    <section>
      <button
        onClick={() => navigate('/mybar')}
        className="w-full bg-card border border-border rounded-organic-md p-5 text-left hover:border-light-charcoal transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Martini size={16} className="text-pure-white" />
            <span className="text-pure-white tracking-[0.08em] uppercase font-bold text-sm">
              My Bar
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-baseline gap-6 mb-3">
          <div>
            <span className="text-2xl font-bold text-pure-white">{canMakeCount}</span>
            <span className="text-sm text-muted-foreground ml-1.5">ready</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-pure-white">{oneAwayCount}</span>
            <span className="text-sm text-muted-foreground ml-1.5">one away</span>
          </div>
        </div>

        {/* Recommendation */}
        {topRecommendation && topRecommendation.unlocks > 0 && (
          <p className="text-xs text-muted-foreground">
            Add <span className="text-light-text font-medium">{topRecommendation.name}</span> to unlock {topRecommendation.unlocks} more
          </p>
        )}

        {/* CTA hint */}
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          Explore My Bar <ArrowRight size={12} />
        </div>
      </button>
    </section>
  );
}
