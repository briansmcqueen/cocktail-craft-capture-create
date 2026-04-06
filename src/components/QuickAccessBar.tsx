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
}: MyBarModuleProps) {
  const navigate = useNavigate();

  if (ingredientCount === 0) return null;

  return (
    <section>
      <div className="bg-card border border-border rounded-organic-md p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Martini size={16} className="text-pure-white" />
          <span className="text-pure-white tracking-[0.08em] uppercase font-bold text-sm">
            My Bar
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-light-text mb-4">
          You have <span className="text-pure-white font-semibold">{ingredientCount}</span> ingredient{ingredientCount !== 1 ? 's' : ''} and can make <span className="text-pure-white font-semibold">{canMakeCount}</span> cocktail{canMakeCount !== 1 ? 's' : ''}.
        </p>

        {/* CTA */}
        <Button
          className="w-full rounded-organic-sm"
          onClick={() => navigate('/mybar')}
        >
          Explore My Bar <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
    </section>
  );
}
