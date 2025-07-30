import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Edit, Heart, Share, Martini } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getUserRecipes } from "@/utils/storage";
import { getRecipeByUsernameAndName } from "@/services/recipesService";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import { getUserPreferences } from "@/services/userPreferencesService";
import { Button } from "@/components/ui/button";
import TagBadge from "@/components/ui/tag";
import RecipeOverallRating from "@/components/RecipeOverallRating";
import RecipeUserRating from "@/components/RecipeUserRating";
import RecipeComments from "@/components/RecipeComments";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/Sidebar";
import TopNavigation from "@/components/TopNavigation";

// Convert recipe name to URL slug
const recipeNameToSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Convert URL slug back to recipe name
const slugToRecipeName = (slug: string): string => {
  return slug.replace(/-/g, ' ');
};

// Generate the correct URL for any recipe
const getRecipeUrl = (recipe: Cocktail): string => {
  const slug = recipeNameToSlug(recipe.name);
  if (recipe.isUserRecipe && recipe.createdBy) {
    // User recipe: /cocktail/{username}/{recipe-name}
    const usernameSlug = recipeNameToSlug(recipe.createdBy);
    return `/cocktail/${usernameSlug}/${slug}`;
  } else {
    // Classic recipe: /cocktail/{recipe-name}
    return `/cocktail/${slug}`;
  }
};

export default function RecipePage() {
  const { recipeName, username } = useParams<{ recipeName: string; username?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [recipe, setRecipe] = useState<Cocktail | null>(null);
  const [isMetric, setIsMetric] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Smart back navigation function
  const handleGoBack = useCallback(() => {
    // Check if we have meaningful navigation history
    const hasHistory = window.history.length > 1;
    
    if (hasHistory) {
      // Try to use React Router's navigate first (more reliable in SPAs)
      try {
        navigate(-1);
        return;
      } catch (error) {
        console.log('React Router navigate failed, trying browser history:', error);
      }
    }
    
    // Fallback logic based on recipe type and user state
    const userRecipes = getUserRecipes();
    const isUserRecipe = userRecipes.some(r => r.id === recipe?.id);
    
    if (isUserRecipe) {
      // User's own recipe - go to My Creations
      navigate('/recipes/mine');
    } else if (user) {
      // Authenticated user viewing classic recipe - go to all recipes
      navigate('/recipes');  
    } else {
      // Unauthenticated user - go to featured page
      navigate('/');
    }
  }, [navigate, recipe?.id, user]);
  

  // Load recipe
  useEffect(() => {
    if (!recipeName) return;

    const loadRecipe = async () => {
      let foundRecipe: Cocktail | null = null;

      if (username) {
        // User recipe with username in URL
        foundRecipe = await getRecipeByUsernameAndName(username, recipeName);
      } else {
        // Classic recipe or user recipe with old URL format
        const allRecipes = [...classicCocktails, ...getUserRecipes()];
        foundRecipe = allRecipes.find(r => 
          recipeNameToSlug(r.name) === recipeName
        ) || null;
      }

      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        // Recipe not found, redirect to home
        navigate('/');
      }
    };

    loadRecipe();

    // Load user preferences
    const loadUserPreferences = async () => {
      if (user) {
        const preferences = await getUserPreferences();
        if (preferences?.preferred_unit) {
          setIsMetric(preferences.preferred_unit === 'ml');
        }
      }
    };
    loadUserPreferences();
  }, [recipeName, username, user, navigate]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-rich-charcoal flex items-center justify-center">
        <div className="text-lg text-light-text">Loading...</div>
      </div>
    );
  }

  const userRecipes = getUserRecipes();
  const isUserRecipe = userRecipes.some(r => r.id === recipe.id);
  const isRecipeFavorited = isFavorite(recipe.id);

  const handleToggleFavorite = async () => {
    await toggleFavorite(recipe.id, () => setShowAuthModal(true));
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.name,
          text: `Check out this ${recipe.name} recipe!`,
          url: url,
        });
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        alert('Recipe link copied to clipboard!');
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Recipe link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
      // Final fallback - show prompt
      prompt('Copy this link to share the recipe:', url);
    }
  };

  const handleEdit = () => {
    // Navigate to main app with editing state
    navigate('/recipes/mine', { 
      state: { 
        editingRecipe: recipe,
        showForm: true
      } 
    });
  };

  const handleRiff = () => {
    // Navigate to main app with remix state
    const remixedRecipe = { 
      ...recipe, 
      id: undefined,
      name: `${recipe.name} (Remix)`
    };
    
    navigate('/recipes/mine', { 
      state: { 
        editingRecipe: remixedRecipe,
        showForm: true
      } 
    });
  };

  // Convert measurements based on toggle
  const convertMeasurement = (ingredient: string) => {
    if (!isMetric) return ingredient;
    
    return ingredient
      .replace(/(\d+(?:\.\d+)?)\s*oz/g, (match, num) => `${Math.round(parseFloat(num) * 30)}ml`)
      .replace(/(\d+(?:\/\d+)?)\s*oz/g, (match, frac) => {
        const decimal = frac.includes('/') ? eval(frac) : parseFloat(frac);
        return `${Math.round(decimal * 30)}ml`;
      })
      .replace(/(\d+)\s*dash/g, '$1 dash')
      .replace(/(\d+)\s*tsp/g, (match, num) => `${Math.round(parseFloat(num) * 5)}ml`)
      .replace(/(\d+)\s*tbsp/g, (match, num) => `${Math.round(parseFloat(num) * 15)}ml`);
  };

  return (
    <>
      {/* Top Navigation for Mobile/Tablet */}
      <TopNavigation
        user={user}
        activeLibrary="recipe"
        onLibrarySelect={() => {}}
        onAddRecipe={() => navigate('/recipes/mine')}
        onSignInClick={() => setShowAuthModal(true)}
        onSignUpClick={() => setShowAuthModal(true)}
        onProfileClick={() => navigate('/profile')}
        onMyRecipesClick={() => navigate('/recipes/mine')}
        onFavoritesClick={() => navigate('/favorites')}
      />
      
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar 
            active="recipe" 
            onSelect={() => {}} 
            onAdd={() => navigate('/recipes/mine')}
            user={user}
            onSignInClick={() => setShowAuthModal(true)}
            onSignUpClick={() => setShowAuthModal(true)}
            onProfileClick={() => navigate('/profile')}
            onMyRecipesClick={() => navigate('/recipes/mine')}
            onFavoritesClick={() => navigate('/favorites')}
          />
        </div>
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Back button */}
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-light-text hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {/* Recipe header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{recipe.name}</h1>
              {recipe.origin && (
                <TagBadge className="bg-accent/20 text-secondary border border-accent/30 rounded-organic-sm">
                  {recipe.origin}
                </TagBadge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Image and ratings */}
              <div className="lg:col-span-1">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-64 md:h-80 object-cover rounded-organic-lg border border-border shadow-glass mb-6"
                />
                
                {/* Overall Ratings - moved out of container */}
                <RecipeOverallRating recipeId={recipe.id} />
                
                {/* Comments - moved underneath ratings */}
                <div className="mt-6 mb-6">
                  <RecipeComments recipeId={recipe.id} />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    variant="secondary"
                    className={`flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 ${
                      isRecipeFavorited ? 'text-heart-red border-heart-red/30 bg-heart-red/10 hover:bg-heart-red/20' : 'text-soft-gray hover:text-heart-red'
                    }`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart size={16} fill={isRecipeFavorited ? 'currentColor' : 'none'} />
                    {isRecipeFavorited ? 'Favorited' : 'Favorite'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-soft-gray hover:text-secondary"
                    onClick={handleShare}
                  >
                    <Share size={16} />
                    Share
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-soft-gray hover:text-secondary"
                    onClick={handleRiff}
                  >
                    <Martini size={16} />
                    Riff
                  </Button>

                  {isUserRecipe && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-light-text hover:text-foreground"
                      onClick={handleEdit}
                    >
                      <Edit size={16} />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Right column - Recipe details */}
              <div className="lg:col-span-2">
                {/* Ingredients */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Ingredients</h2>
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="toggle-button-cover">
                          <div className="button-cover">
                            <div className="button custom-toggle">
                              <input 
                                type="checkbox" 
                                className="checkbox" 
                                checked={isMetric}
                                onChange={(e) => setIsMetric(e.target.checked)}
                              />
                              <div className="knobs">
                                <span>{isMetric ? 'ML' : 'OZ'}</span>
                              </div>
                              <div className="layer"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 text-light-text space-y-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="leading-relaxed">{convertMeasurement(ing)}</li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Instructions</h2>
                  <p className="text-light-text whitespace-pre-line leading-relaxed">{recipe.steps}</p>
                </div>

                {/* Notes */}
                {recipe.notes && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Notes</h2>
                    <p className="text-soft-gray leading-relaxed">{recipe.notes}</p>
                  </div>
                )}

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map(tag => (
                        <TagBadge key={tag} className="bg-accent/20 text-secondary border border-accent/30 rounded-organic-sm">
                          {tag}
                        </TagBadge>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Rating */}
                <div className="mb-6">
                  <RecipeUserRating recipeId={recipe.id} />
                </div>

                {/* Recipe Details */}
                {(recipe.technique || recipe.glassType || recipe.garnish || recipe.difficulty || recipe.abv || recipe.prepTime) && (
                  <div className="mb-6 p-4 bg-medium-charcoal rounded-organic-md border border-light-charcoal">
                    <h2 className="text-xl font-semibold text-pure-white mb-4">Recipe Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recipe.technique && (
                        <div className="flex items-center gap-2">
                          <span className="text-pure-white">Technique:</span>
                          <span className={`technique-badge technique-${recipe.technique} px-2 py-1 text-xs font-medium rounded-organic-sm uppercase tracking-wide`}>
                            {recipe.technique}
                          </span>
                        </div>
                      )}
                      {recipe.glassType && (
                        <div className="flex items-center gap-2">
                          <span className="text-pure-white">Glass:</span>
                          <span className="glass-indicator px-2 py-1 text-xs font-medium rounded-organic-sm">
                            {recipe.glassType}
                          </span>
                        </div>
                      )}
                      {recipe.difficulty && (
                        <div className="flex items-center gap-2">
                          <span className="text-pure-white">Difficulty:</span>
                          <div className="flex items-center gap-2">
                            <span className={`difficulty-${recipe.difficulty} px-2 py-1 text-xs font-medium rounded-organic-sm`}>
                              {recipe.difficulty}
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((level) => {
                                const difficultyLevel = recipe.difficulty === 'easy' ? 1 : recipe.difficulty === 'medium' ? 3 : 5;
                                const isActive = level <= difficultyLevel;
                                const barColor = difficultyLevel === 1 ? 'bg-green-400' : 
                                               difficultyLevel === 3 ? 'bg-golden-amber' : 'bg-red-500';
                                return (
                                  <div
                                    key={level}
                                    className={`w-2 h-4 rounded-sm ${
                                      isActive ? barColor : 'bg-soft-gray/30'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      {recipe.abv && (
                        <div className="flex items-center gap-2">
                          <span className="text-pure-white">ABV:</span>
                          <span className="text-emerald font-medium">{recipe.abv}</span>
                        </div>
                      )}
                      {recipe.prepTime && (
                        <div className="flex items-center gap-2">
                          <span className="text-pure-white">Prep Time:</span>
                          <span className="text-light-text">{recipe.prepTime}</span>
                        </div>
                      )}
                      {recipe.garnish && recipe.garnish.length > 0 && (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <span className="text-pure-white">Garnish:</span>
                          <div className="flex flex-wrap gap-1">
                            {recipe.garnish.map((garnish, index) => (
                              <span key={index} className="text-light-text bg-light-charcoal px-2 py-1 rounded-organic-sm">
                                {garnish}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
      
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        initialMode="signin"
      />
    </>
  );
}

export { recipeNameToSlug, slugToRecipeName, getRecipeUrl };