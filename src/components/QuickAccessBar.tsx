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
      <div className="bg-card border border-border rounded-organic-md p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Martini size={16} className="text-primary" />
            <span className="text-pure-white tracking-[0.08em] uppercase font-bold text-sm">
              My Bar
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Can make */}
          <button
            onClick={() => navigate('/mybar')}
            className="bg-medium-charcoal border border-light-charcoal rounded-organic-sm p-3 text-center hover:border-primary/40 transition-colors"
          >
            <div className="text-2xl font-bold text-primary">{canMakeCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              cocktails ready
            </div>
          </button>

          {/* One away */}
          <button
            onClick={() => navigate('/mybar')}
            className="bg-medium-charcoal border border-light-charcoal rounded-organic-sm p-3 text-center hover:border-golden-amber/40 transition-colors"
          >
            <div className="text-2xl font-bold text-golden-amber">{oneAwayCount}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              one ingredient away
            </div>
          </button>
        </div>

        {/* Top recommendation */}
        {topRecommendation && topRecommendation.unlocks > 0 && (
          <div className="flex items-center justify-between bg-medium-charcoal/50 border border-light-charcoal/50 rounded-organic-sm px-3 py-2.5 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Next bottle to buy</p>
              <p className="text-sm text-pure-white font-medium truncate">
                {topRecommendation.name}
              </p>
              <p className="text-xs text-primary">
                unlocks {topRecommendation.unlocks} more recipe{topRecommendation.unlocks !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          variant="ghost"
          className="w-full justify-center text-sm text-muted-foreground hover:text-pure-white gap-1"
          onClick={() => navigate('/mybar')}
        >
          Explore My Bar <ArrowRight size={14} />
        </Button>
      </div>
    </section>
  );
}
