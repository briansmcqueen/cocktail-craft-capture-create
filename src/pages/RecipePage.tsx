import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Edit, Heart, Share, Martini, MessageCircle } from "lucide-react";
import { Cocktail } from "@/data/classicCocktails";
import { classicCocktails } from "@/data/classicCocktails";
import { getRecipeByUsernameAndName, getUserRecipesFromDB } from "@/services/recipesService";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavoritesRefactored";
import { getUserPreferences } from "@/services/userPreferencesService";
import { Button } from "@/components/ui/button";
import TagBadge from "@/components/ui/tag";
import ShareRecipe from "@/components/ShareRecipe";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/Sidebar";
import TopNavigation from "@/components/TopNavigation";
import { useToast } from "@/hooks/use-toast";
import RecipeScaling from "@/components/RecipeScaling";
import { useRecipeScaling } from "@/hooks/useRecipeScaling";
import RecipeOverallRating from "@/components/RecipeOverallRating";
import RecipeUserRating from "@/components/RecipeUserRating";
import RecipeComments from "@/components/RecipeComments";


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
  if (recipe.isUserRecipe) {
    // Custom recipe stored locally: /cocktail/custom/{recipe-name}
    return `/cocktail/custom/${slug}`;
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
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

  // Smart back navigation function  
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  

  // Load recipe
  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeName) return;

      let foundRecipe: Cocktail | null = null;

      if (username === 'custom') {
        // Custom recipe from database
        if (user) {
          const userRecipes = await getUserRecipesFromDB();
          foundRecipe = userRecipes.find(r => 
            recipeNameToSlug(r.name) === recipeName
          ) || null;
        }
      } else if (username) {
        // Database user recipe with username in URL
        foundRecipe = await getRecipeByUsernameAndName(username, recipeName);
      } else {
        // Classic recipe
        foundRecipe = classicCocktails.find(r => 
          recipeNameToSlug(r.name) === recipeName
        ) || null;
      }

      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
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

  // Initialize scaling hook - use dummy recipe to maintain hook order
  const dummyRecipe: Cocktail = {
    id: 'dummy',
    name: 'Loading',
    image: '',
    ingredients: ['1 oz placeholder'],
    steps: 'Loading...',
    default_servings: 1,
    min_servings: 1,
    max_servings: 20
  };
  
  // Always call the scaling hook to maintain hook order
  const scaling = useRecipeScaling(recipe || dummyRecipe);
  
  // Check if we have a valid recipe (not the dummy one)
  const hasValidRecipe = recipe && recipe.id !== 'dummy';
  const isUserRecipe = hasValidRecipe ? (recipe?.isUserRecipe || false) : false;
  
  const isRecipeFavorited = hasValidRecipe ? isFavorite(recipe.id) : false;

  const handleToggleFavorite = async () => {
    if (!hasValidRecipe) return;
    await toggleFavorite(recipe.id, () => setShowAuthModal(true));
  };

  const handleShare = () => {
    setShowShareModal(true);
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

  // Show loading state when no valid recipe
  if (!hasValidRecipe) {
    return (
      <div className="min-h-screen bg-rich-charcoal flex items-center justify-center">
        <div className="text-lg text-light-text">Loading...</div>
      </div>
    );
  }

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

                {/* Comments Section */}
                <div className="mb-4">
                  <RecipeComments recipeId={recipe.id} />
                </div>

                {/* Ratings Section */}
                <div className="mb-6">
                  <RecipeOverallRating recipeId={recipe.id} />
                  {user && (
                    <div className="mt-3">
                      <RecipeUserRating recipeId={recipe.id} />
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    variant="secondary"
                    className={`flex items-center gap-2 px-4 py-2 rounded-organic-sm transition-all duration-300 ${
                      isRecipeFavorited ? 'text-heart-red border-heart-red/30 bg-heart-red/10 hover:bg-heart-red/20' : 'text-pure-white hover:text-heart-red'
                    }`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart size={16} fill={isRecipeFavorited ? 'currentColor' : 'none'} />
                    {isRecipeFavorited ? 'Favorited' : 'Favorite'}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-pure-white hover:text-secondary"
                    onClick={handleShare}
                  >
                    <Share size={16} />
                    Share
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 rounded-organic-sm text-pure-white hover:text-secondary"
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
              <div className="lg:col-span-2">
                {/* Ingredients */}
                <div className="mb-6">
                   <h2 className="text-xl font-semibold text-foreground">Ingredients</h2>
                   <div className="mb-4">
                     <ul className="list-disc pl-5 text-light-text space-y-2">
                       {(hasValidRecipe && scaling?.scaledRecipe.ingredients || recipe.ingredients).map((ing, i) => (
                         <li key={i} className="leading-relaxed">{convertMeasurement(ing)}</li>
                       ))}
                     </ul>
                   </div>

                   {/* Unit Toggle */}
                   <div className="flex items-center justify-end mb-4">
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

                {/* Recipe Scaling */}
                {hasValidRecipe && scaling && (
                  <div className="mb-6">
                    <RecipeScaling scaling={scaling} />
                  </div>
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


                {/* Recipe Details */}
                {(recipe.technique || recipe.glassType || recipe.garnish || recipe.difficulty || recipe.abv || recipe.prepTime) && (
                  <div className="mb-6 p-4 bg-medium-charcoal rounded-organic-md border border-light-charcoal">
                    <h2 className="text-base font-normal text-pure-white mb-4">Recipe Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recipe.technique && (
                         <div className="flex items-center gap-2">
                           <span className="text-base text-pure-white">Technique:</span>
                           <span className="text-base text-pure-white">
                             {recipe.technique.charAt(0).toUpperCase() + recipe.technique.slice(1).toLowerCase()}
                           </span>
                         </div>
                      )}
                      {recipe.glassType && (
                         <div className="flex items-center gap-2">
                           <span className="text-base text-pure-white">Glass:</span>
                           <span className="text-base text-pure-white">
                             {recipe.glassType}
                           </span>
                         </div>
                      )}
                      {recipe.difficulty && (
                         <div className="flex items-center gap-2">
                           <span className="text-base text-pure-white">Difficulty:</span>
                           <span className="text-base text-pure-white">
                             {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1).toLowerCase()}
                           </span>
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
                             {recipe.garnish.map((garnish, index) => (
                               <span key={index} className="text-base text-pure-white">
                                 {garnish}{index < recipe.garnish.length - 1 ? ', ' : ''}
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

      <ShareRecipe 
        recipe={recipe} 
        open={showShareModal} 
        onOpenChange={setShowShareModal} 
      />
    </>
  );
}

export { recipeNameToSlug, slugToRecipeName, getRecipeUrl };