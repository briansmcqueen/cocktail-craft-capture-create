import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CommunityCallToActionProps = {
  isAuthenticated: boolean;
  onShowAuthModal?: () => void;
  onShowForm?: () => void;
};

export default function CommunityCallToAction({
  isAuthenticated,
  onShowAuthModal,
  onShowForm,
}: CommunityCallToActionProps) {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      onShowAuthModal?.();
      return;
    }
    onShowForm?.();
  };

  const handleDiscoverClick = () => {
    navigate('/discover');
  };

  return (
    <section className="mb-8 md:mb-12">
      <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 p-8 md:p-12 text-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">
            Ready to Share Your Creations?
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
            Join our community of passionate bartenders and drink enthusiasts. 
            Share your unique recipes, discover new techniques, and connect with fellow creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleCreateClick}
              className="w-full sm:w-auto min-w-[200px] text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2" size={20} />
              Create Recipe
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleDiscoverClick}
              className="w-full sm:w-auto min-w-[200px] text-base font-medium border-2 hover:bg-accent/10 transition-all duration-300"
            >
              <Users className="mr-2" size={20} />
              Discover More
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              Join <span className="font-bold text-foreground">1,000+ bartenders</span> sharing{" "}
              <span className="font-bold text-foreground">5,000+ recipes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
