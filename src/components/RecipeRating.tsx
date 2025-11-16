import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { rateRecipe, getUserRating } from "@/services/ratingsService";
import { useRecipeRating } from "@/hooks/useRecipeRatings";
import { ratingsCache } from "@/services/ratingsCache";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface RecipeRatingProps {
  recipeId: string;
  recipeName: string;
  trigger?: React.ReactNode;
}

export default function RecipeRating({ recipeId, recipeName, trigger }: RecipeRatingProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userRating, setUserRating] = useState<number>(0);
  const [aggregatedRating, setAggregatedRating] = useState({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      loadRatings();
    }
  }, [open, recipeId]);

  const loadRatings = async () => {
    try {
      const userRatingData = await getUserRating(recipeId);

      if (userRatingData) {
        setUserRating(userRatingData.rating);
        setRating(userRatingData.rating);
        setReview(userRatingData.review || "");
      }

      // Get aggregated rating from cache/service
      const cachedRating = ratingsCache.get(recipeId);
      if (cachedRating) {
        setAggregatedRating({
          averageRating: cachedRating.averageRating,
          totalRatings: cachedRating.totalRatings
        });
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "🍸 Join the Community!",
        description: "Create a free account to rate recipes and share your feedback with other bartenders!",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const success = await rateRecipe(recipeId, rating, review.trim() || undefined);

    if (success) {
      toast({
        title: "Rating Submitted",
        description: "Thank you for rating this recipe!"
      });
      
      setUserRating(rating);
      setOpen(false);
      
      // Invalidate cache to force refresh
      ratingsCache.invalidate(recipeId);
    } else {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const StarRating = ({ currentRating, onRatingChange, interactive = true }: {
    currentRating: number;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-6 w-6 transition-colors",
            star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
            interactive && "cursor-pointer hover:text-yellow-400"
          )}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Star className="h-4 w-4 mr-1" />
      {userRating > 0 ? `${userRating}/5` : "Rate"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="rating-description">
        <DialogHeader>
          <DialogTitle>Rate {recipeName}</DialogTitle>
          <p id="rating-description" className="text-sm text-muted-foreground">
            Share your rating and review for this cocktail recipe.
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {aggregatedRating.totalRatings > 0 && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StarRating currentRating={Math.round(aggregatedRating.averageRating)} interactive={false} />
                <span className="font-medium">{aggregatedRating.averageRating}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {aggregatedRating.totalRatings} rating{aggregatedRating.totalRatings !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Rating</label>
              <StarRating currentRating={rating} onRatingChange={setRating} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Review (Optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Submitting..." : userRating > 0 ? "Update Rating" : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}