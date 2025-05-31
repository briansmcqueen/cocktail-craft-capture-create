
import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Share, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipe.name} Recipe - Mixology Maven`,
          text: `Check out this delicious ${recipe.name} recipe!`,
          url: shareUrl,
        });
        toast({
          title: "Recipe shared!",
          description: "Thanks for sharing this recipe"
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          // Fallback to copy text
          try {
            await navigator.clipboard.writeText(shareText);
            toast({
              title: "Recipe details copied!",
              description: "Paste it anywhere to share"
            });
          } catch (clipboardErr) {
            toast({
              title: "Sharing failed",
              description: "Please try copying the link instead",
              variant: "destructive"
            });
          }
        }
      }
    } else {
      // Fallback to copy text
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Recipe details copied!",
          description: "Paste it anywhere to share"
        });
      } catch (err) {
        toast({
          title: "Sharing not supported",
          description: "Please copy the link manually",
          variant: "destructive"
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
          <DialogDescription>
            Share this delicious recipe with friends and fellow cocktail enthusiasts! 🍹
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleShareNative}
              className="w-full flex items-center gap-2"
            >
              <Share size={16} />
              {navigator.share ? 'Share Recipe' : 'Copy Recipe Details'}
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
