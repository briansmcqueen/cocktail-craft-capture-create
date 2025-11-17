import React, { useState, useEffect } from "react";
import { Cocktail } from "@/data/classicCocktails";
import { Share, Copy, Check, Facebook, ExternalLink } from "lucide-react";
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

// Custom Pinterest Icon Component
const PinterestIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
);

// Custom TikTok Icon Component
const TikTokIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom Instagram Icon Component
const InstagramIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Custom WhatsApp Icon Component  
const WhatsAppIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

type ShareRecipeProps = {
  recipe: Cocktail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShareRecipe({ recipe, open, onOpenChange }: ShareRecipeProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Early return if recipe is null
  if (!recipe) {
    return null;
  }

  const shareUrl = `${window.location.origin}/?recipe=${encodeURIComponent(recipe.name)}`;
  
  const shareText = `🍸 Check out this ${recipe.name} recipe on Barbook!\n\nIngredients:\n${recipe.ingredients.map(ing => `• ${ing}`).join('\n')}\n\nSteps: ${recipe.steps}\n\n${shareUrl}`;
  
  // Shortened text for Twitter (X) character limit
  const shortShareText = `🍸 ${recipe.name} recipe on Barbook! ${shareUrl}`;
  
  // Check if user is on mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Check if native share is supported
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  // Handle native share
  const handleNativeShare = async () => {
    if (!canNativeShare) {
      setShowModal(true);
      return;
    }

    try {
      await navigator.share({
        title: `${recipe.name} Recipe`,
        text: `🍸 Check out this ${recipe.name} recipe on Barbook!`,
        url: shareUrl,
      });
      
      toast({
        title: "Thanks for sharing!",
        description: "Recipe shared successfully"
      });
      onOpenChange(false);
    } catch (err: any) {
      // User cancelled or share failed
      if (err.name !== 'AbortError') {
        // If share fails for any reason other than user cancellation, show modal
        setShowModal(true);
      }
    }
  };

  // Trigger native share when modal opens on supported devices
  React.useEffect(() => {
    if (open && canNativeShare && !showModal) {
      handleNativeShare();
    } else if (open && !canNativeShare) {
      setShowModal(true);
    }
  }, [open]);

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    onOpenChange(false);
  };

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
      name: "Copy Link",
      icon: copied ? Check : Copy,
      action: handleCopyLink,
      color: copied ? "text-emerald-green" : "text-white",
      isPrimary: true,
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      url: isMobile 
        ? `whatsapp://send?text=${encodeURIComponent(shareText)}`
        : `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      color: "text-white",
    },
    {
      name: "X",
      icon: XIcon,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortShareText)}`,
      color: "text-white",
    },
    {
      name: "Facebook", 
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "text-white",
    },
    {
      name: "Pinterest",
      icon: PinterestIcon,
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(recipe.image || '')}&description=${encodeURIComponent(`${recipe.name} - ${recipe.ingredients.slice(0, 3).join(', ')}...`)}`,
      color: "text-white",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      url: `https://www.tiktok.com/`,
      color: "text-white",
      note: "Copy link & share on TikTok"
    },
    {
      name: "Instagram", 
      icon: InstagramIcon,
      url: `https://www.instagram.com/`,
      color: "text-white",
      note: "Copy link & share on Instagram"
    },
  ];

  const handleSocialShare = (social: typeof socialShares[0]) => {
    // If it's a custom action (like copy link), execute it
    if (social.action) {
      social.action();
      return;
    }

    // Otherwise open the URL
    if (social.url) {
      if (social.name === "Instagram" || social.name === "TikTok") {
        // For Instagram and TikTok, copy link first then open app
        navigator.clipboard.writeText(shareUrl);
        window.open(social.url, '_blank');
        toast({
          title: `Opening ${social.name}`,
          description: social.note || `Share this recipe on ${social.name}!`,
        });
      } else if (social.name === "WhatsApp" && isMobile) {
        // On mobile, use the whatsapp:// protocol for better UX
        window.location.href = social.url;
        toast({
          title: "Opening WhatsApp",
          description: "Share this recipe with your friends!",
        });
      } else {
        // Standard social share
        window.open(social.url, '_blank', 'width=600,height=400');
        toast({
          title: `Sharing to ${social.name}`,
          description: "Thanks for sharing this recipe!",
        });
      }
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto bg-card border-border sm:w-full rounded-[16px_32px_24px_40px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-white text-lg">
            <Share size={18} />
            Share {recipe.name}
          </DialogTitle>
          <DialogDescription className="text-light-text text-xs sm:text-sm">
            Share this recipe with friends! 🍹
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Social sharing options - Organic design */}
          <div className="grid grid-cols-2 gap-2">
            {socialShares.map((social) => (
              <Button
                key={social.name}
                variant="outline"
                onClick={() => handleSocialShare(social)}
                className={`flex items-center gap-1.5 h-10 justify-center border-border-gray bg-medium-charcoal transition-all duration-300 hover:bg-light-charcoal active:scale-95 rounded-[8px_16px_12px_20px] ${
                  social.isPrimary && copied ? 'border-available bg-available/20' : ''
                }`}
              >
                <social.icon size={16} className={social.color} />
                <span className="text-xs sm:text-sm font-medium text-white truncate">
                  {social.isPrimary && copied ? "Copied!" : social.name}
                </span>
              </Button>
            ))}
          </div>

          <Separator className="bg-border-gray my-2" />
            
          {/* Link preview - Organic design */}
          <div className="bg-medium-charcoal rounded-[12px_24px_18px_30px] p-2.5 border border-border-gray">
            <div className="flex items-center gap-2">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-10 h-10 object-cover rounded-[6px_12px_9px_15px] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-white line-clamp-1">
                  {recipe.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-light-text line-clamp-1">
                  Share on Barbook
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
