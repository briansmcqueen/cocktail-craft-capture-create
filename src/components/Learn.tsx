import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Article, articlesService } from "@/services/articlesService";
import { articleFavoritesService } from "@/services/articleFavoritesService";
import ArticleCard from "./ArticleCard";
import { BookOpen, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LearnProps {
  onShowAuthModal: () => void;
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function Learn({ onShowAuthModal }: LearnProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
    if (user) {
      loadFavoriteArticles();
    }
  }, [user]);

  const loadArticles = async () => {
    try {
      const publishedArticles = await articlesService.getPublishedArticles();
      setArticles(publishedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error loading articles",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteArticles = async () => {
    if (!user) return;
    
    try {
      const favorites = await articleFavoritesService.getFavoriteArticles();
      setFavoriteArticles(favorites);
    } catch (error) {
      console.error('Error loading favorite articles:', error);
    }
  };

  const handleArticleClick = (article: Article) => {
    const slug = slugify(article.title || '');
    navigate(`/article/${slug}`);
  };

  const handleToggleFavorite = async (articleId: string) => {
    if (!user) {
      onShowAuthModal();
      return;
    }

    try {
      const isFavorite = await articleFavoritesService.toggleFavorite(articleId);
      
      if (isFavorite) {
        setFavoriteArticles(prev => [...prev, articleId]);
        toast({
          title: "Added to favorites",
          description: "Article added to your favorites.",
        });
      } else {
        setFavoriteArticles(prev => prev.filter(id => id !== articleId));
        toast({
          title: "Removed from favorites", 
          description: "Article removed from your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Group articles by category if needed
  const featuredArticles = articles.filter(article => article.tags?.includes('featured')).slice(0, 6);
  const recentArticles = articles.slice(0, 12);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading articles...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl lg:text-5xl font-bold text-pure-white">Learn</h1>
          </div>
          <p className="text-lg text-light-text max-w-2xl mx-auto">
            Master the art of cocktail making with expert techniques, tips, and insights from professional bartenders.
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-pure-white">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onArticleClick={handleArticleClick}
                  isFavorite={favoriteArticles.includes(article.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onShowAuthModal={onShowAuthModal}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-2xl font-bold text-pure-white mb-8">All Articles</h2>
          {recentArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-xl font-medium text-pure-white mb-2">No articles yet</h3>
              <p className="text-light-text">
                Check back soon for cocktail techniques, tips, and expert insights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onArticleClick={handleArticleClick}
                  isFavorite={favoriteArticles.includes(article.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onShowAuthModal={onShowAuthModal}
                />
              ))}
            </div>
          )}
        </section>
      </div>

    </>
  );
}