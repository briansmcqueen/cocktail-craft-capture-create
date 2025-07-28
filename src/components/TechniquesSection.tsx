
import React, { useState, useEffect } from "react";
import { Article, articlesService } from "@/services/articlesService";
import { articleFavoritesService } from "@/services/articleFavoritesService";
import ArticleCard from "./ArticleCard";
import ArticleModal from "./ArticleModal";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type TechniquesSectionProps = {
  onShowAuthModal?: () => void;
};

export default function TechniquesSection({ onShowAuthModal }: TechniquesSectionProps) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
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
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleToggleFavorite = async (articleId: string) => {
    if (!user) {
      onShowAuthModal?.();
      return;
    }

    try {
      const isFavorite = await articleFavoritesService.toggleFavorite(articleId);
      if (isFavorite) {
        setFavoriteArticles(prev => [...prev, articleId]);
      } else {
        setFavoriteArticles(prev => prev.filter(id => id !== articleId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };

  const handleShareArticle = (article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-pure-white mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">Essential Techniques</h2>
        <p className="text-center text-muted-foreground">Loading articles...</p>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section>
        <h2 className="text-gray-900 mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">Essential Techniques</h2>
        <p className="text-center text-muted-foreground">No articles available yet.</p>
      </section>
    );
  }
  return (
    <>
      <section>
        <h2 className="text-pure-white mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
          Essential Techniques
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {articles.map((article) => (
              <CarouselItem key={article.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ArticleCard
                  article={article}
                  onArticleClick={handleArticleClick}
                  isFavorite={favoriteArticles.includes(article.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onShowAuthModal={onShowAuthModal}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center items-center gap-4 mt-6">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
            <CarouselNext className="relative right-0 top-0 translate-y-0 h-8 w-8 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50" />
          </div>
        </Carousel>
      </section>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={showArticleModal}
        onClose={() => setShowArticleModal(false)}
        isFavorite={selectedArticle ? favoriteArticles.includes(selectedArticle.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShareArticle}
        onShowAuthModal={onShowAuthModal}
      />
    </>
  );
}
