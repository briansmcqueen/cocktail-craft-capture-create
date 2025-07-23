import React from "react";
import { Heart, User, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Article } from "@/services/articlesService";
import TagBadge from "@/components/ui/tag";

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
      <div
        className="bg-card rounded-xl shadow hover:shadow-xl overflow-hidden cursor-pointer transition-all duration-200 group relative h-80 flex flex-col active:scale-95 sm:hover:scale-105 sm:active:scale-100 w-full min-w-0"
        onClick={() => onArticleClick(article)}
      >
        {article.featured_image_url && (
          <div className="h-40 w-full overflow-hidden">
            <img 
              src={article.featured_image_url} 
              alt={article.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <h2 className="font-bold text-lg mb-1 line-clamp-2" title={article.title}>
              {article.title}
            </h2>
            
            {article.excerpt && (
              <div className="text-sm text-muted-foreground mb-2 line-clamp-2" title={article.excerpt}>
                {article.excerpt}
              </div>
            )}

            <div className="flex flex-wrap gap-1 mb-2 min-h-[20px]">
              {article.tags && article.tags.slice(0, 3).map((tag) => (
                <TagBadge key={tag} className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                  {tag}
                </TagBadge>
              ))}
              {article.tags && article.tags.length > 3 && (
                <TagBadge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                  +{article.tags.length - 3}
                </TagBadge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{article.author?.full_name || 'Unknown Author'}</span>
              </div>
              
              {article.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
              )}

              {article.source_name && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>{article.source_name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="h-5 flex items-center justify-start">
            {/* Additional actions could go here */}
          </div>
        </div>
      </div>
      
      {/* Favorite button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white active:scale-95 transition-all duration-150"
          onClick={handleToggleFavorite}
        >
          <Heart 
            size={18} 
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