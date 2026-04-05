import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Edit, Heart, Share, Martini, User } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getRecipeByUsernameAndName, getUserRecipesFromDB, getRecipeById } from "@/services/recipesService";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { getUserPreferences, updateUserPreferences } from "@/services/userPreferencesService";
import { Button } from "@/components/ui/button";
import TagBadge from "@/components/ui/tag";
import ShareRecipe from "@/components/ShareRecipe";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/Sidebar";
import TopNavigation from "@/components/TopNavigation";
import { useToast } from "@/hooks/use-toast";
import RecipeScaling from "@/components/RecipeScaling";
import { useRecipeScaling } from "@/hooks/useRecipeScaling";
import RecipeRatingStars from "@/components/ratings/RecipeRatingStars";
import RecipeRatingInput from "@/components/ratings/RecipeRatingInput";
import RecipeComments from "@/components/RecipeComments";


import { recipeNameToSlug, slugToRecipeName, getRecipeUrl } from "@/utils/slugUtils";

export default function RecipePage() {
  const { recipeName, username, recipeId } = useParams<{ recipeName?: string; username?: string; recipeId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [recipe, setRecipe] = useState<Cocktail | null>(null);
  const [isMetric, setIsMetric] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

  const shouldShowBackButton = useMemo(() => {
    return window.history.length > 1;
  }, []);

  const handleGoBack = useCallback(() => { navigate(-1); }, [navigate]);

  useEffect(() => {
    const loadRecipe = async () => {
      let foundRecipe: Cocktail | null = null;
      if (recipeId) {
        foundRecipe = await getRecipeById(recipeId);
      } else if (recipeName) {
        if (username === 'custom') {
          if (user) {
            const userRecipes = await getUserRecipesFromDB();
            foundRecipe = userRecipes.find(r => recipeNameToSlug(r.name) === recipeName) || null;
          }
        } else if (username) {
          foundRecipe = await getRecipeByUsernameAndName(username, recipeName);
        } else {
          foundRecipe = classicCocktails.find(r => recipeNameToSlug(r.name) === recipeName) || null;
        }
      }
      if (foundRecipe) setRecipe(foundRecipe);
      else navigate('/');
    };
    loadRecipe();

    const loadUserPreferences = async () => {
      if (user) {
        const preferences = await getUserPreferences();
        if (preferences?.preferred_unit) setIsMetric(preferences.preferred_unit === 'ml');
      }
    };
    loadUserPreferences();
  }, [recipeName, username, recipeId, user, navigate]);

  const dummyRecipe: Cocktail = {
    id: 'dummy', name: 'Loading', image: '',
    ingredients: ['1 oz placeholder'], steps: 'Loading...',
    default_servings: 1, min_servings: 1, max_servings: 20
  };
  const scaling = useRecipeScaling(recipe || dummyRecipe);
  const hasValidRecipe = recipe && recipe.id !== 'dummy';
  const isUserRecipe = hasValidRecipe ? (recipe?.isUserRecipe || false) : false;
  const isRecipeFavorited = hasValidRecipe ? isFavorite(recipe.id) : false;

  const handleToggleFavorite = async () => {
    if (!hasValidRecipe) return;
    await toggleFavorite(recipe.id, () => {
      if (window.__openAuthModal) window.__openAuthModal('signup', "Love this drink? Save it to your favorites!");
    });
  };

  const handleShare = () => setShowShareModal(true);

  const handleEdit = () => {
    navigate('/recipes/my-drinks', { state: { editingRecipe: recipe, showForm: true } });
  };

  const handleRiff = () => {
    if (!user) { setShowAuthModal(true); return; }
    navigate('/recipes/my-drinks', { state: { editingRecipe: { ...recipe, id: undefined, name: `${recipe.name} (Remix)` }, showForm: true } });
  };

  const parseFraction = (frac: string): number => {
    const parts = frac.trim().split(/\s+/);
    let total = 0;
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, den] = part.split('/').map(Number);
        if (!isNaN(num) && !isNaN(den) && den !== 0) total += num / den;
      } else {
        const num = Number(part);
        if (!isNaN(num)) total += num;
      }
    }
    return total;
  };

  const convertMeasurement = (ingredient: string) => {
    if (isMetric) {
      return ingredient
        .replace(/(\d+(?:\.\d+)?)\s*oz/gi, (_, num) => `${Math.round(parseFloat(num) * 30)}ml`)
        .replace(/(\d+(?:\s+\d+)?\/\d+)\s*oz/gi, (_, frac) => `${Math.round(parseFraction(frac) * 30)}ml`)
        .replace(/(\d+)\s*tsp/gi, (_, num) => `${Math.round(parseFloat(num) * 5)}ml`)
        .replace(/(\d+)\s*tbsp/gi, (_, num) => `${Math.round(parseFloat(num) * 15)}ml`);
    }
    return ingredient.replace(/(\d+(?:\.\d+)?)\s*ml/gi, (_, num) => {
      const oz = parseFloat(num) / 30;
      return oz >= 1 ? `${oz.toFixed(1).replace(/\.0$/, '')} oz` : `${oz.toFixed(2)} oz`;
    });
  };

  if (!hasValidRecipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-light-text">Loading...</div>
      </div>
    );
  }

  const scrollToRatings = () => {
    const el = document.getElementById('ratings-section') || document.getElementById('ratings-section-mobile');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <TopNavigation
        user={user} activeLibrary="recipe" onLibrarySelect={() => {}}
        onAddRecipe={() => navigate('/recipes/my-drinks')}
        onSignInClick={() => setShowAuthModal(true)} onSignUpClick={() => setShowAuthModal(true)}
        onProfileClick={() => user && navigate(`/user/${user.id}`)}
        onMyRecipesClick={() => navigate('/recipes/my-drinks')} onFavoritesClick={() => navigate('/favorites')}
      />
      
      <div className="min-h-screen flex w-full bg-background">
        <div className="hidden md:block">
          <Sidebar active="recipe" onSelect={() => {}} onAdd={() => navigate('/recipes/my-drinks')}
            user={user} onSignInClick={() => setShowAuthModal(true)} onSignUpClick={() => setShowAuthModal(true)}
            onProfileClick={() => user && navigate(`/user/${user.id}`)}
            onMyRecipesClick={() => navigate('/recipes/my-drinks')} onFavoritesClick={() => navigate('/favorites')}
          />
        </div>
        
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {shouldShowBackButton && <BackButton onClick={handleGoBack} className="mb-6" />}

            {/* Recipe header */}
            <div className="mb-8 flex flex-col items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{recipe.name}</h1>
              
              {recipe.origin && <TagBadge className="mb-2">{recipe.origin}</TagBadge>}

              {/* Aggregate rating stars - clickable anchor */}
              <button onClick={scrollToRatings} className="hover:opacity-80 transition-opacity cursor-pointer mb-3">
                <RecipeRatingStars recipeId={recipe.id} />
              </button>
              
              {/* Created By */}
              {recipe.isUserRecipe && (recipe.creatorUsername || recipe.createdBy) && (
                <div className="flex items-center gap-3 mb-3">
                  {recipe.creatorUsername ? (
                    <button
                      onClick={() => navigate(`/profile/${recipe.creatorUsername}`)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      {recipe.creatorAvatar ? (
                        <img src={recipe.creatorAvatar} alt={recipe.creatorUsername}
                          className="w-6 h-6 rounded-full object-cover border border-border group-hover:border-primary transition-colors" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <User size={14} className="text-muted-foreground group-hover:text-primary" />
                        </div>
                      )}
                      <span>Created by <span className="text-foreground group-hover:text-primary font-medium">@{recipe.creatorUsername}</span></span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                      <span>Created by {recipe.createdBy}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Left column - Image, action buttons, ratings & comments (desktop) */}
              <div className="md:col-span-2">
                <img
                  src={recipe.image} alt={recipe.name}
                  className="w-full aspect-square object-cover rounded-organic-lg border border-border shadow-glass"
                />
                {recipe.photo_credit && (
                  <div className="flex items-center gap-1.5 mt-2 mb-4">
                    <span className="text-xs text-muted-foreground">📷</span>
                    {recipe.photo_credit.url ? (
                      <a
                        href={recipe.photo_credit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {recipe.photo_credit.name}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">{recipe.photo_credit.name}</span>
                    )}
                  </div>
                )}
                {!recipe.photo_credit && <div className="mb-6" />}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    variant="secondary"
                    className={`flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 hover:scale-[1.02] ${
                      isRecipeFavorited ? 'text-heart-red border-heart-red/30 bg-heart-red/10 hover:bg-heart-red/20' : 'text-pure-white hover:text-heart-red'
                    }`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart size={16} fill={isRecipeFavorited ? 'currentColor' : 'none'} />
                    {isRecipeFavorited ? 'Favorited' : 'Favorite'}
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-pure-white hover:text-secondary" onClick={handleShare}>
                    <Share size={16} /> Share
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-pure-white hover:text-secondary" onClick={handleRiff}>
                    <Martini size={16} /> Riff
                  </Button>
                  {isUserRecipe && (
                    <Button variant="outline" className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-light-text hover:text-foreground" onClick={handleEdit}>
                      <Edit size={16} /> Edit
                    </Button>
                  )}
                </div>

              </div>

              {/* Right column - Recipe content */}
              <div className="md:col-span-3">
                {/* Ingredients */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Ingredients</h2>
                  <ul className="list-disc pl-5 text-light-text space-y-2 mb-4">
                    {(hasValidRecipe && scaling?.scaledRecipe.ingredients || recipe.ingredients).map((ing, i) => (
                      <li key={i} className="leading-relaxed">{convertMeasurement(ing)}</li>
                    ))}
                  </ul>

                  {/* Unit Toggle */}
                  <div className="flex items-center justify-start mb-4">
                    <div className="relative">
                      <div className="toggle-button-cover"><div className="button-cover">
                        <div className="button custom-toggle">
                          <input type="checkbox" className="checkbox" checked={isMetric}
                            onChange={async (e) => {
                              const newIsMetric = e.target.checked;
                              setIsMetric(newIsMetric);
                              if (user) await updateUserPreferences({ preferred_unit: newIsMetric ? 'ml' : 'oz' });
                            }}
                          />
                          <div className="knobs"><span>{isMetric ? 'ML' : 'OZ'}</span></div>
                          <div className="layer"></div>
                        </div>
                      </div></div>
                    </div>
                  </div>
                </div>

                {/* Scaling */}
                {hasValidRecipe && scaling && (
                  <div className="mb-6"><RecipeScaling scaling={scaling} /></div>
                )}

                {/* Instructions */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Instructions</h2>
                  <p className="text-light-text whitespace-pre-line leading-relaxed">{recipe.steps}</p>
                </div>

                {/* Notes */}
                {recipe.notes && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Notes</h2>
                    <p className="text-pure-white leading-relaxed">{recipe.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Full-width sections below the grid */}
            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-6 mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => <TagBadge key={tag}>{tag}</TagBadge>)}
                </div>
              </div>
            )}

            {/* Recipe Details */}
            {(recipe.technique || recipe.glassType || recipe.garnish || recipe.difficulty || recipe.abv || recipe.prepTime) && (
              <div className="mb-6 p-4 bg-medium-charcoal rounded-organic-md border border-light-charcoal">
                <h2 className="text-base font-normal text-pure-white mb-4">Recipe Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {recipe.technique && (
                    <div className="flex items-center gap-2">
                      <span className="text-base text-pure-white">Technique:</span>
                      <span className="text-base text-pure-white">{recipe.technique.charAt(0).toUpperCase() + recipe.technique.slice(1).toLowerCase()}</span>
                    </div>
                  )}
                  {recipe.glassType && (
                    <div className="flex items-center gap-2">
                      <span className="text-base text-pure-white">Glass:</span>
                      <span className="text-base text-pure-white">{recipe.glassType}</span>
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className="flex items-center gap-2">
                      <span className="text-base text-pure-white">Difficulty:</span>
                      <span className="text-base text-pure-white">{recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1).toLowerCase()}</span>
                    </div>
                  )}
                  {recipe.abv && (
                    <div className="flex items-center gap-2">
                      <span className="text-base text-pure-white">ABV:</span>
                      <span className="text-base text-pure-white">{recipe.abv}</span>
                    </div>
                  )}
                  {recipe.prepTime && (
                    <div className="flex items-center gap-2">
                      <span className="text-base text-pure-white">Prep time:</span>
                      <span className="text-base text-pure-white">{recipe.prepTime}</span>
                    </div>
                  )}
                  {recipe.garnish && recipe.garnish.length > 0 && (
                    <div className="flex items-start gap-2 sm:col-span-2">
                      <span className="text-base text-pure-white">Garnish:</span>
                      <div className="flex flex-wrap gap-1">
                        {recipe.garnish.map((g, i) => (
                          <span key={i} className="text-base text-pure-white">{g}{i < recipe.garnish.length - 1 ? ', ' : ''}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rating & Comments - full width */}
            <div id="ratings-section" className="mt-4">
              <div className="mb-6 pt-4 border-t border-border">
                <RecipeRatingStars recipeId={recipe.id} size={20} />
                <div className="mt-3">
                  <RecipeRatingInput recipeId={recipe.id} />
                </div>
              </div>
              <div className="mb-6 pt-4 border-t border-border">
                <RecipeComments recipeId={recipe.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} initialMode="signin" />
      <ShareRecipe recipe={recipe} open={showShareModal} onOpenChange={setShowShareModal} />
    </>
  );
}
