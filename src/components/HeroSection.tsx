import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type HeroSectionProps = {
  onNavigateToDiscover?: () => void;
  onNavigateToMyBar?: () => void;
  isAuthenticated: boolean;
};

export default function HeroSection({ 
  onNavigateToDiscover, 
  onNavigateToMyBar,
  isAuthenticated 
}: HeroSectionProps) {
  const navigate = useNavigate();

  const handleDiscoverClick = () => {
    navigate('/discover');
  };

  const handleStartCreating = () => {
    onNavigateToMyBar?.();
  };

  return (
    <section className="relative overflow-hidden rounded-lg md:rounded-2xl bg-gradient-to-br from-background via-background to-primary/5 border border-border/40 p-8 md:p-12 mb-8 md:mb-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight tracking-tight">
          Where Bartenders & Drink Enthusiasts Connect
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
          Join a vibrant community of passionate creators sharing recipes, techniques, and stories. 
          Build real connections through our shared love of craft cocktails and creativity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={handleDiscoverClick}
            className="w-full sm:w-auto min-w-[200px] text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Discover Bartenders
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleStartCreating}
            className="w-full sm:w-auto min-w-[200px] text-base font-medium border-2 hover:bg-accent/10 transition-all duration-300"
          >
            {isAuthenticated ? 'My Bar' : 'Start Creating'}
          </Button>
        </div>

        {/* Community stats */}
        <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-foreground mb-1">1,000+</span>
            <span>Bartenders</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-foreground mb-1">5,000+</span>
            <span>Recipes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-foreground mb-1">10,000+</span>
            <span>Community Members</span>
          </div>
        </div>
      </div>
    </section>
  );
}
