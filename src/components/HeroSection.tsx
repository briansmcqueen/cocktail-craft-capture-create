import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Users, BookOpen } from "lucide-react";

type HeroSectionProps = {
  isAuthenticated: boolean;
};

export default function HeroSection({ 
  isAuthenticated 
}: HeroSectionProps) {
  const navigate = useNavigate();

  const handleDiscoverClick = () => {
    navigate('/discover');
  };

  const handleStartCreating = () => {
    navigate('/mybar');
  };

  return (
    <section className="relative overflow-hidden rounded-organic-xl bg-gradient-to-br from-rich-charcoal via-medium-charcoal to-primary/10 border border-primary/20 p-8 md:p-16 mb-8 md:mb-12 animate-fade-in">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Decorative organic shapes */}
      <div className="absolute top-10 right-20 w-32 h-32 border-2 border-primary/30 rounded-organic-lg rotate-12 opacity-50" />
      <div className="absolute bottom-10 left-20 w-24 h-24 border-2 border-accent/30 rounded-organic-md -rotate-12 opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-primary mb-6 animate-scale-in">
          <Sparkles size={16} />
          <span className="text-sm font-medium">Join Our Growing Community</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-pure-white mb-6 leading-[1.1] tracking-tight">
          Where Bartenders &{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Drink Enthusiasts
          </span>{" "}
          Connect
        </h1>
        
        <p className="text-lg md:text-xl text-light-text mb-10 leading-relaxed max-w-2xl mx-auto">
          Join a vibrant community of passionate creators sharing recipes, techniques, and stories. 
          Build real connections through our shared love of craft cocktails and creativity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            onClick={handleDiscoverClick}
            className="w-full sm:w-auto min-w-[220px] text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-organic-md group"
          >
            <Users className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
            Discover Bartenders
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleStartCreating}
            className="w-full sm:w-auto min-w-[220px] text-base font-semibold border-2 border-primary/40 hover:bg-primary/10 hover:border-primary/60 hover:scale-105 transition-all duration-300 rounded-organic-md group"
          >
            <BookOpen className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
            {isAuthenticated ? 'My Bar' : 'Start Creating'}
          </Button>
        </div>

        {/* Community stats with animations */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm">
          {[
            { value: "1,000+", label: "Bartenders", delay: "0ms" },
            { value: "5,000+", label: "Recipes", delay: "100ms" },
            { value: "10,000+", label: "Community Members", delay: "200ms" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center animate-fade-in hover:scale-110 transition-transform duration-300"
              style={{ animationDelay: stat.delay }}
            >
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                {stat.value}
              </span>
              <span className="text-soft-gray uppercase tracking-wider text-xs font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
