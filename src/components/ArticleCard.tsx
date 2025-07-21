import React from "react";
import { Heart, User, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article } from "@/services/articlesService";

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
    <div className="relative group">
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-card"
        onClick={() => onArticleClick(article)}
      >
        {article.featured_image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img 
              src={article.featured_image_url} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-card-foreground line-clamp-2">
              {article.title}
            </h3>
            
            {article.excerpt && (
              <p className="text-muted-foreground line-clamp-3">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author?.full_name || 'Unknown Author'}</span>
              </div>
              
              {article.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
              )}

              {article.source_name && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>{article.source_name}</span>
                </div>
              )}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Favorite button */}
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform duration-200"
          onClick={handleToggleFavorite}
        >
          <Heart 
            size={20} 
            className={`${
              isFavorite 
                ? 'text-red-500 fill-red-500' 
                : 'text-muted-foreground hover:text-red-500'
            } transition-colors duration-200`}
            strokeWidth={isFavorite ? 1 : 2}
          />
        </Button>
      </div>
    </div>
  );
}