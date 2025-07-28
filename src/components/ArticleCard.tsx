import React from "react";
import { Heart, User, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Article } from "@/services/articlesService";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Article;
  onArticleClick: (article: Article) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (articleId: string) => void;
  onShowAuthModal?: () => void;
};

export default function ArticleCard({ 
  article, 
  onArticleClick, 
  isFavorite = false,
  onToggleFavorite,
  onShowAuthModal
}: ArticleCardProps) {
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(article.id);
    } else if (onShowAuthModal) {
      onShowAuthModal();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border rounded-organic-md group overflow-hidden"
      onClick={() => onArticleClick(article)}
    >
      <CardContent className="p-0">
        {/* Hero image */}
        {article.featured_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-pure-white line-clamp-1 mb-2">
            {article.title}
          </h3>
          
          {/* Article excerpt */}
          <p className="text-sm text-light-text line-clamp-3 mb-3">
            {article.excerpt || "Discover tips, techniques, and insights from the world of cocktail making."}
          </p>

          {/* Published date */}
          <div className="flex items-center gap-1 mb-3">
            <Calendar size={14} className="text-soft-gray" />
            <span className="text-xs text-soft-gray">
              {formatDate(article.created_at)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="default"
              size="sm"
              onClick={() => onArticleClick(article)}
              className="flex-1 mr-2 rounded-organic-sm"
            >
              Read Article
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                "h-8 w-8 p-0 rounded-organic-sm",
                isFavorite && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}