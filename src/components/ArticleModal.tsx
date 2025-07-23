import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Share2, User, Calendar, ExternalLink, MessageCircle, Send } from "lucide-react";
import { Article } from "@/services/articlesService";
import { ArticleComment, articleCommentsService } from "@/services/articleCommentsService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type ArticleModalProps = {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (articleId: string) => void;
  onShare: (article: Article) => void;
  onShowAuthModal?: () => void;
};

export default function ArticleModal({
  article,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShare,
  onShowAuthModal
}: ArticleModalProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (article && isOpen) {
      loadComments();
    }
  }, [article, isOpen]);

  const loadComments = async () => {
    if (!article) return;
    
    setIsLoadingComments(true);
    try {
      const articleComments = await articleCommentsService.getCommentsByArticleId(article.id);
      setComments(articleComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!article || !newComment.trim()) return;
    
    if (!user) {
      onShowAuthModal?.();
      return;
    }

    setIsSubmittingComment(true);
    try {
      const comment = await articleCommentsService.addComment(article.id, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      onShowAuthModal?.();
      return;
    }
    if (article) {
      onToggleFavorite(article.id);
    }
  };

  const handleShare = () => {
    if (article) {
      onShare(article);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* Featured Image */}
          {article.featured_image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img 
                src={article.featured_image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-card-foreground">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="gap-2"
                >
                  <Heart 
                    size={16} 
                    className={`${
                      isFavorite 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-muted-foreground'
                    } transition-colors duration-200`}
                    strokeWidth={isFavorite ? 1 : 2}
                  />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Article Content */}
        <div className="space-y-6">
          <div className="prose prose-gray max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-4 text-card-foreground leading-relaxed">
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>

          {/* Source Link */}
          {article.source_url && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Source: <a 
                  href={article.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground underline"
                >
                  {article.source_name || article.source_url}
                </a>
              </p>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
            </div>

            {/* Add Comment */}
            <div className="space-y-3">
              <Textarea
                placeholder={user ? "Share your thoughts..." : "Please sign in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
                disabled={!user}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmittingComment || !user}
                  className="gap-2"
                >
                  <Send size={16} />
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {isLoadingComments ? (
                <p className="text-muted-foreground">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.user?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.user?.full_name || 'Anonymous User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}