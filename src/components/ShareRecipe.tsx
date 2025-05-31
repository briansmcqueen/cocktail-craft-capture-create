
import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Share, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type ShareRecipeProps = {
  recipe: Cocktail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShareRecipe({ recipe, open, onOpenChange }: ShareRecipeProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/?recipe=${encodeURIComponent(recipe.name)}`;
  
  const shareText = `🍸 Check out this ${recipe.name} recipe on Mixology Maven!\n\nIngredients:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\nSteps: ${recipe.steps}\n\n${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this recipe with your friends"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again"
      });
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipe.name} Recipe - Mixology Maven`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copy text
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Recipe copied!",
          description: "Paste it anywhere to share"
        });
      } catch (err) {
        toast({
          title: "Sharing not supported",
          description: "Please copy the link manually"
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share size={20} />
            Share {recipe.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Share this delicious recipe with friends and fellow cocktail enthusiasts! 🍹
            </p>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleShareNative}
                className="w-full flex items-center gap-2"
              >
                <Share size={16} />
                Share Recipe
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              💡 Love discovering new recipes? Share your favorites to help others find great cocktails too.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
