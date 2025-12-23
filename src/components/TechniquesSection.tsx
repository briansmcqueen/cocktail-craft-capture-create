
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Article, articlesService } from "@/services/articlesService";
import { articleFavoritesService } from "@/services/articleFavoritesService";
import ArticleCard from "./ArticleCard";
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
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
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
    if (article.slug) {
      navigate(`/article/${article.slug}`);
    }
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
    <section>
      <h2 className="text-pure-white mb-8 tracking-[0.08em] leading-[1.45] uppercase font-bold text-[1rem]">
        Essential Techniques
      </h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {articles.map((article) => (
              <CarouselItem key={article.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
}
