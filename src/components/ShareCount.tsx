import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { getRecipeShareStats, type ShareStats } from "@/services/shareTrackingService";

interface ShareCountProps {
  recipeId: string;
  className?: string;
  /** When provided, skips the network fetch and renders this count directly. */
  count?: number;
}

export function ShareCount({ recipeId, className = "", count }: ShareCountProps) {
  const [stats, setStats] = useState<ShareStats | null>(null);
  const [loading, setLoading] = useState(count === undefined);

  useEffect(() => {
    if (count !== undefined) return;
    const fetchStats = async () => {
      setLoading(true);
      const data = await getRecipeShareStats(recipeId);
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, [recipeId, count]);

  if (count !== undefined) {
    if (count <= 0) return null;
    return (
      <div className={`flex items-center gap-1.5 text-soft-gray ${className}`}>
        <Share2 size={14} className="text-available" />
        <span className="text-xs font-medium">
          {count} {count === 1 ? 'share' : 'shares'}
        </span>
      </div>
    );
  }

  if (loading || !stats || stats.totalShares === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1.5 text-soft-gray ${className}`}>
      <Share2 size={14} className="text-available" />
      <span className="text-xs font-medium">
        {stats.totalShares} {stats.totalShares === 1 ? 'share' : 'shares'}
      </span>
    </div>
  );
}
