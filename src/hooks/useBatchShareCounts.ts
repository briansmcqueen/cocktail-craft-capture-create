import { useEffect, useState } from "react";
import { getBatchRecipeShareCounts } from "@/services/shareTrackingService";

/**
 * Fetch share counts for many recipes in a single RPC, replacing N per-card
 * `get_recipe_share_stats` requests with one `get_batch_recipe_share_counts`.
 * Returns a map of recipeId -> count (0 when no shares).
 */
export function useBatchShareCounts(recipeIds: string[]): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Stable key so the effect only refires when the set of IDs actually changes.
  const key = recipeIds.join(",");

  useEffect(() => {
    const ids = recipeIds.filter(Boolean);
    if (ids.length === 0) return;

    let cancelled = false;
    getBatchRecipeShareCounts(ids).then((result) => {
      if (cancelled) return;
      setCounts((prev) => {
        const next = { ...prev };
        for (const id of ids) next[id] = result[id] ?? 0;
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return counts;
}