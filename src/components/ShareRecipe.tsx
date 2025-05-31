
import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Share, Copy, Check, Twitter, Facebook, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

type ShareRecipeProps = {
  recipe: Cocktail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShareRecipe({ recipe, open, onOpenChange }: ShareRecipeProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/?recipe=${encodeURIComponent(recipe.name)}`;
  
  const shareText = `🍸 Check out this ${recipe.name} recipe on Barbook!\n\nIngredients:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\nSteps: ${recipe.steps}\n\n${shareUrl}`;

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

  const socialShares = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-blue-500",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🍸 Check out this ${recipe.name} recipe on Barbook!`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook", 
      icon: Facebook,
      color: "text-blue-600",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-gray-600",
      url: `mailto:?subject=${encodeURIComponent(`${recipe.name} Recipe from Barbook`)}&body=${encodeURIComponent(shareText)}`,
    },
    {
      name: "SMS",
      icon: MessageSquare,
      color: "text-green-600",
      url: `sms:?body=${encodeURIComponent(shareText)}`,
    }
  ];

  const handleSocialShare = (url: string, platform: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    toast({
      title: `Shared to ${platform}!`,
      description: "Thanks for sharing this recipe"
    });
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
          {/* Social sharing options */}
          <div className="grid grid-cols-2 gap-3">
            {socialShares.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                onClick={() => handleSocialShare(social.url, social.name)}
                className="flex items-center gap-2 h-12 justify-start border-gray-200 hover:bg-gray-50"
              >
                <social.icon size={18} className={social.color} />
                <span className="text-sm">{social.name}</span>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Copy link option */}
          <div className="space-y-2">
            <Button 
              variant="outline"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2 border-gray-200 hover:bg-gray-50"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? "Link Copied!" : "Copy Link"}
            </Button>
            
            {/* Link preview */}
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-start gap-3">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                    {recipe.name} Recipe
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                    Discover this delicious {recipe.name} recipe on Barbook - your digital cocktail companion
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ExternalLink size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-mono">
                      barbook.app
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              💡 Love discovering new recipes? Share your favorites to help others find great cocktails too.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
