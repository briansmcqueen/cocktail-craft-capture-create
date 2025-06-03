
import React, { useState } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Share, Copy, Check, Facebook, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Custom X (Twitter) Icon Component
const XIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Instagram Icon Component
const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

type ShareRecipeProps = {
  recipe: Cocktail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShareRecipe({ recipe, open, onOpenChange }: ShareRecipeProps) {
  const [copied, setCopied] = useState(false);

  // Early return if recipe is null
  if (!recipe) {
    return null;
  }

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
      name: "X",
      icon: XIcon,
      color: "text-gray-900",
      hoverColor: "hover:bg-gray-100 hover:text-black",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🍸 Check out this ${recipe.name} recipe on Barbook!`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Instagram", 
      icon: InstagramIcon,
      color: "text-pink-600",
      hoverColor: "hover:bg-pink-50 hover:text-pink-700",
      url: `https://www.instagram.com/`, // Instagram doesn't support direct sharing with text, opens Instagram
    },
    {
      name: "Facebook", 
      icon: Facebook,
      color: "text-blue-600",
      hoverColor: "hover:bg-blue-50 hover:text-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-gray-600",
      hoverColor: "hover:bg-gray-50 hover:text-gray-700",
      url: `mailto:?subject=${encodeURIComponent(`${recipe.name} Recipe from Barbook`)}&body=${encodeURIComponent(shareText)}`,
    },
    {
      name: "SMS",
      icon: MessageSquare,
      color: "text-green-600",
      hoverColor: "hover:bg-green-50 hover:text-green-700",
      url: `sms:?body=${encodeURIComponent(shareText)}`,
    }
  ];

  const handleSocialShare = (url: string, platform: string) => {
    if (platform === "Instagram") {
      // For Instagram, just open the app/website since they don't support direct sharing
      window.open(url, '_blank');
      toast({
        title: "Opening Instagram",
        description: "Share this recipe on your Instagram story or post!"
      });
    } else {
      window.open(url, '_blank', 'width=600,height=400');
      toast({
        title: `Shared to ${platform}!`,
        description: "Thanks for sharing this recipe"
      });
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
          {/* Social sharing options - Modernized */}
          <div className="grid grid-cols-1 gap-2">
            {socialShares.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                onClick={() => handleSocialShare(social.url, social.name)}
                className={`flex items-center gap-3 h-12 justify-start border border-gray-200 bg-white transition-all duration-200 ${social.hoverColor}`}
              >
                <social.icon size={20} className={social.color} />
                <span className="text-sm font-medium text-gray-900">Share on {social.name}</span>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Copy link option - Modernized */}
          <div className="space-y-3">
            <Button 
              variant="outline"
              onClick={handleCopyLink}
              className={`w-full flex items-center gap-3 h-12 border border-gray-200 bg-white transition-all duration-200 ${
                copied 
                  ? 'border-green-200 bg-green-50 text-green-700' 
                  : 'hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} className="text-gray-600" />}
              <span className="font-medium">
                {copied ? "Link Copied!" : "Copy Link"}
              </span>
            </Button>
            
            {/* Link preview */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
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
            <p className="text-xs text-gray-500 text-center">
              💡 Love discovering new recipes? Share your favorites to help others find great cocktails too.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
