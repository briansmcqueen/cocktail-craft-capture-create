import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { addComment, updateComment, deleteComment } from '@/services/commentsService';
import { useOptimizedComments } from '@/hooks/useOptimizedComments';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import type { RecipeComment } from '@/services/commentsService';

interface RecipeCommentsProps {
  recipeId: string;
}

const INITIAL_SHOW = 3;

export default function RecipeComments({ recipeId }: RecipeCommentsProps) {
  const { user } = useAuth();
  const { comments, loading, invalidateCache, addOptimisticComment, optimisticDeleteComment } = useOptimizedComments(recipeId);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) {
      if (!user && window.__openAuthModal) {
        window.__openAuthModal('signup', "Join the conversation and share your cocktail experiences!");
      }
      return;
    }

    const text = newComment.trim();
    addOptimisticComment({
      recipe_id: recipeId,
      user_id: user.id,
      content: text,
      category: 'general',
      photo_url: undefined,
      user: {
        id: user.id,
        username: user.user_metadata?.username || null,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
    });
    setNewComment('');
    toast({ title: "Comment added" });

    try {
      await addComment(recipeId, text, 'general', null);
    } catch {
      invalidateCache();
      toast({ title: "Error", description: "Failed to save comment.", variant: "destructive" });
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    const success = await updateComment(commentId, editContent.trim(), 'general');
    if (success) {
      setEditingComment(null);
      setEditContent('');
      invalidateCache();
      toast({ title: "Comment updated" });
    }
  };

  const handleDelete = async (commentId: string) => {
    optimisticDeleteComment(commentId);
    toast({ title: "Comment deleted" });
    try {
      const success = await deleteComment(commentId);
      if (!success) {
        invalidateCache();
        toast({ title: "Error", description: "Failed to delete comment.", variant: "destructive" });
      }
    } catch {
      invalidateCache();
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, INITIAL_SHOW);
  const hasMore = comments.length > INITIAL_SHOW;

  const renderComment = (comment: RecipeComment) => (
    <div key={comment.id} className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
      <Avatar className="w-7 h-7 flex-shrink-0">
        <AvatarImage src={comment.user?.avatar_url || undefined} />
        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
          {comment.user?.full_name?.[0] || comment.user?.username?.[0] || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {comment.user?.username && (
            <span className="text-sm font-medium text-foreground">@{comment.user.username}</span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </span>
        </div>

        {editingComment === comment.id ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[60px] bg-input border-border rounded-organic-sm text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleEdit(comment.id)} className="rounded-organic-sm text-xs">Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditingComment(null); setEditContent(''); }} className="text-xs">Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-card-foreground mt-0.5 break-words">{comment.content}</p>
            {user?.id === comment.user_id && (
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">Delete Comment</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(comment.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-muted-foreground" />
          <span className="text-lg font-semibold text-foreground">Comments</span>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded-organic-sm w-3/4" />
          <div className="h-4 bg-muted rounded-organic-sm w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={18} className="text-muted-foreground" />
        <span className="text-lg font-semibold text-foreground">
          Comments {comments.length > 0 && `(${comments.length})`}
        </span>
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <div>
          {visibleComments.map(renderComment)}
          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-primary hover:text-primary/80 mt-2"
            >
              Show all {comments.length} comments
            </button>
          )}
          {showAll && hasMore && (
            <button
              onClick={() => setShowAll(false)}
              className="text-sm text-primary hover:text-primary/80 mt-2"
            >
              Show less
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
      )}

      {/* Add comment */}
      {user ? (
        <div className="flex gap-2 items-start pt-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[60px] bg-input border-border rounded-organic-sm text-sm flex-1"
          />
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            size="sm"
            className="rounded-organic-sm mt-1"
          >
            Post
          </Button>
        </div>
      ) : (
        <button
          onClick={() => window.__openAuthModal?.('signup', "Sign in to join the conversation!")}
          className="text-sm text-primary hover:text-primary/80"
        >
          Sign in to comment
        </button>
      )}
    </div>
  );
}
