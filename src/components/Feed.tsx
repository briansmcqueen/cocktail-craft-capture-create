import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { followsService } from '@/services/followsService';
import { useAuth } from '@/hooks/useAuth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import LikeButton from '@/components/social/LikeButton';

export default function Feed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<Map<string, any>>(new Map());
  const [commentCounts, setCommentCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (user) {
      loadFeed();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const feedRecipes = await followsService.getFollowedUsersRecipes(50);
      setRecipes(feedRecipes);

      // Fetch user profiles for recipe authors
      if (feedRecipes.length > 0) {
        const uniqueUserIds = [...new Set(feedRecipes.map(r => r.user_id))] as string[];
        const { data } = await supabase
          .rpc('get_public_profiles', { user_ids: uniqueUserIds });

        if (data) {
          const profileMap = new Map(data.map((p: any) => [p.id, p]));
          setUserProfiles(profileMap);
        }

        // Fetch comment counts for recipes
        const recipeIds = feedRecipes.map(r => r.id);
        const { data: comments } = await supabase
          .from('recipe_comments')
          .select('recipe_id')
          .in('recipe_id', recipeIds);

        if (comments) {
          const counts = new Map<string, number>();
          comments.forEach((comment: any) => {
            counts.set(comment.recipe_id, (counts.get(comment.recipe_id) || 0) + 1);
          });
          setCommentCounts(counts);
        }
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <AuthPrompt
          icon={Users}
          title="Follow Bartenders"
          description="Create a free account to follow bartenders and see their latest cocktail creations in your personalized feed."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 pb-8">
      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 mx-auto mb-4 text-soft-gray opacity-50" />
          <h3 className="text-xl font-semibold text-light-text mb-2">
            Your feed is empty
          </h3>
          <p className="text-soft-gray mb-6 max-w-md mx-auto">
            Start following bartenders to see their latest cocktail creations here. 
            Browse public profiles and discover new mixologists!
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate('/discover')}
              className="rounded-organic-sm"
            >
              Discover Bartenders
            </Button>
            <Button
              onClick={() => navigate('/recipes')}
              variant="outline"
              className="rounded-organic-sm"
            >
              Browse Recipes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {recipes.map((recipe) => {
            const author = userProfiles.get(recipe.user_id);
            
            return (
              <div
                key={recipe.id}
                className="bg-medium-charcoal border border-light-charcoal rounded-organic-lg overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => navigate(`/cocktail/${author?.username}/${recipe.name.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                {/* Author Info */}
                <div className="p-4 border-b border-light-charcoal/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                      {author?.avatar_url ? (
                        <img
                          src={author.avatar_url}
                          alt={author.username}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-primary-foreground font-bold">
                          {author?.username?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile/${author?.username}`);
                        }}
                        className="font-semibold text-pure-white hover:text-emerald transition-colors"
                      >
                        @{author?.username || 'Unknown'}
                      </button>
                      <div className="flex items-center gap-2 text-xs text-soft-gray">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(recipe.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="flex flex-col md:flex-row">
                  {recipe.image_url && (
                    <div className="md:w-1/3">
                      <img
                        src={recipe.image_url}
                        alt={recipe.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <h2 className="text-2xl font-semibold text-pure-white mb-2">
                      {recipe.name}
                    </h2>
                    {recipe.description && (
                      <p className="text-light-text mb-4">
                        {recipe.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags?.slice(0, 4).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary/10 text-emerald border border-primary/30 rounded-organic-sm text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    {recipe.difficulty && (
                        <span className={`difficulty-${recipe.difficulty} px-3 py-1 text-xs rounded-organic-sm`}>
                          {recipe.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Engagement Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-light-charcoal/30">
                      <LikeButton
                        recipeId={recipe.id}
                        showCount={true}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cocktail/${author?.username}/${recipe.name.toLowerCase().replace(/\s+/g, '-')}`);
                        }}
                        className="gap-2 rounded-organic-sm text-soft-gray hover:bg-card/50"
                      >
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">
                          {commentCounts.get(recipe.id) || 0}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
