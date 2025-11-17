import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Sparkles, Wine, TrendingUp, BookOpen, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => Promise<void>;
  onSkip: () => Promise<void>;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Barbook',
    description: 'Your personal bartending companion',
    icon: Sparkles,
    content: (
      <div className="space-y-4 text-center">
        <p className="text-light-text text-base leading-relaxed">
          Discover amazing cocktails you can make with the ingredients you have at home.
        </p>
        <p className="text-light-text text-sm">
          Let's get you started with a quick tour!
        </p>
      </div>
    ),
  },
  {
    id: 'mybar',
    title: 'Build Your Bar',
    description: 'Add ingredients you have at home',
    icon: Wine,
    content: (
      <div className="space-y-4">
        <p className="text-light-text text-base leading-relaxed">
          Start by adding <span className="text-forest-green font-semibold">3-5 ingredients</span> you have in your bar.
        </p>
        <div className="bg-medium-charcoal rounded-organic-md p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-forest-green"></div>
            <p className="text-sm text-light-text">Choose from common spirits like vodka, gin, or whiskey</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-forest-green"></div>
            <p className="text-sm text-light-text">Add mixers like tonic water or club soda</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-forest-green"></div>
            <p className="text-sm text-light-text">Don't forget fresh ingredients like lime or mint</p>
          </div>
        </div>
        <p className="text-xs text-soft-gray italic">
          Tip: Click on "My Bar" in the navigation to start building your inventory
        </p>
      </div>
    ),
  },
  {
    id: 'discover',
    title: 'What You Can Make',
    description: 'Instant cocktail recommendations',
    icon: TrendingUp,
    content: (
      <div className="space-y-4">
        <p className="text-light-text text-base leading-relaxed">
          Once you add ingredients, we'll show you:
        </p>
        <div className="space-y-3">
          <div className="bg-medium-charcoal rounded-organic-md p-4 border-l-4 border-forest-green">
            <p className="font-semibold text-pure-white mb-1">Cocktails You Can Make</p>
            <p className="text-sm text-light-text">Recipes using only what's in your bar</p>
          </div>
          <div className="bg-medium-charcoal rounded-organic-md p-4 border-l-4 border-golden-amber">
            <p className="font-semibold text-pure-white mb-1">One Ingredient Away</p>
            <p className="text-sm text-light-text">Almost there! Just need one more item</p>
          </div>
          <div className="bg-medium-charcoal rounded-organic-md p-4 border-l-4 border-emerald-green">
            <p className="font-semibold text-pure-white mb-1">What to Buy Next</p>
            <p className="text-sm text-light-text">Smart suggestions to unlock more recipes</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Key Features',
    description: 'Everything you need to mix like a pro',
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-medium-charcoal rounded-organic-md p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-xs font-semibold text-pure-white mb-1">Save Favorites</p>
            <p className="text-xs text-soft-gray">Bookmark recipes you love</p>
          </div>
          <div className="bg-medium-charcoal rounded-organic-md p-4 text-center">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-xs font-semibold text-pure-white mb-1">Create Recipes</p>
            <p className="text-xs text-soft-gray">Share your own cocktails</p>
          </div>
          <div className="bg-medium-charcoal rounded-organic-md p-4 text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-xs font-semibold text-pure-white mb-1">Rate & Review</p>
            <p className="text-xs text-soft-gray">Help the community</p>
          </div>
          <div className="bg-medium-charcoal rounded-organic-md p-4 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-xs font-semibold text-pure-white mb-1">Advanced Search</p>
            <p className="text-xs text-soft-gray">Filter by any criteria</p>
          </div>
        </div>
        <p className="text-center text-sm text-forest-green font-medium">
          Ready to start mixing? 🍹
        </p>
      </div>
    ),
  },
];

export default function OnboardingModal({ open, onComplete, onSkip }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = async () => {
    if (isLastStep) {
      setCompleting(true);
      try {
        await onComplete();
      } catch (error) {
        console.error('Error completing onboarding:', error);
      } finally {
        setCompleting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = async () => {
    setCompleting(true);
    try {
      await onSkip();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-xl bg-rich-charcoal border-light-charcoal"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Skip button */}
        <button
          onClick={handleSkip}
          disabled={completing}
          className="absolute top-4 right-4 text-soft-gray hover:text-light-text transition-colors p-1 rounded-full hover:bg-medium-charcoal"
          title="Skip tour"
        >
          <X size={20} />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6 mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentStep
                  ? 'w-8 bg-forest-green'
                  : index < currentStep
                  ? 'w-2 bg-forest-green/60'
                  : 'w-2 bg-light-charcoal'
              )}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-forest-green/10 border-2 border-forest-green/30 flex items-center justify-center">
            <Icon className="text-forest-green" size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-pure-white mb-2">{step.title}</h2>
          <p className="text-sm text-soft-gray mb-6">{step.description}</p>
          <div className="text-left">{step.content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep || completing}
            className="text-soft-gray hover:text-light-text disabled:opacity-30"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </Button>

          <span className="text-xs text-soft-gray">
            {currentStep + 1} of {steps.length}
          </span>

          <Button
            onClick={handleNext}
            disabled={completing}
            className="bg-forest-green hover:bg-dark-forest text-white"
          >
            {completing ? (
              'Loading...'
            ) : isLastStep ? (
              <>
                Get Started
                <Sparkles size={18} className="ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight size={20} className="ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
