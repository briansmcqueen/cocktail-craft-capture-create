import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Lightbulb, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getRecipeComments, addComment, updateComment, deleteComment, type RecipeComment } from '@/services/commentsService';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface RecipeCommentsProps {
  recipeId: string;
}

export default function RecipeComments({ recipeId }: RecipeCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'comment' | 'tip'>('comment');
  const [tipType, setTipType] = useState<'variation' | 'substitution' | 'technique'>('variation');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await getRecipeComments(recipeId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    const success = await addComment(
      recipeId,
      newComment.trim(),
      commentType,
      commentType === 'tip' ? tipType : undefined
    );

    if (success) {
      setNewComment('');
      setCommentType('comment');
      setTipType('variation');
      await fetchComments();
      toast({
        title: "Success",
        description: `${commentType === 'tip' ? 'Tip' : 'Comment'} added successfully`,
      });
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    const comment = comments.find(c => c.id === commentId);
    const success = await updateComment(
      commentId,
      editContent.trim(),
      comment?.comment_type === 'tip' ? comment.tip_type : undefined
    );

    if (success) {
      setEditingComment(null);
      setEditContent('');
      await fetchComments();
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const success = await deleteComment(commentId);
    if (success) {
      await fetchComments();
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    }
  };

  const allComments = comments;
  const tips = comments.filter(c => c.comment_type === 'tip');
  const regularComments = comments.filter(c => c.comment_type === 'comment');

  const renderComment = (comment: RecipeComment) => (
    <div key={comment.id} className="space-y-3 border-b border-gray-100 pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user?.avatar_url || undefined} />
          <AvatarFallback>
            {comment.user?.full_name?.[0] || comment.user?.username?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {comment.user?.full_name || comment.user?.username || 'Anonymous'}
            </span>
            {comment.user?.username && (
              <span className="text-xs text-gray-500">@{comment.user.username}</span>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.comment_type === 'tip' && (
              <Badge variant="secondary" className="text-xs">
                <Lightbulb className="w-3 h-3 mr-1" />
                {comment.tip_type}
              </Badge>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700">{comment.content}</p>
              {user?.id === comment.user_id && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comments & Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments & Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={commentType === 'comment' ? 'default' : 'outline'}
                onClick={() => setCommentType('comment')}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Comment
              </Button>
              <Button
                size="sm"
                variant={commentType === 'tip' ? 'default' : 'outline'}
                onClick={() => setCommentType('tip')}
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                Add Tip
              </Button>
            </div>

            {commentType === 'tip' && (
              <Select value={tipType} onValueChange={(value: any) => setTipType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="variation">Variation</SelectItem>
                  <SelectItem value="substitution">Substitution</SelectItem>
                  <SelectItem value="technique">Technique Note</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                commentType === 'tip'
                  ? 'Share a helpful tip or variation...'
                  : 'Leave a comment...'
              }
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              {commentType === 'tip' ? 'Add Tip' : 'Post Comment'}
            </Button>
          </div>
        )}

        {/* Comments Display */}
        {comments.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({allComments.length})</TabsTrigger>
              <TabsTrigger value="tips">Tips ({tips.length})</TabsTrigger>
              <TabsTrigger value="comments">Comments ({regularComments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {allComments.map(renderComment)}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="mt-4">
              <div className="space-y-4">
                {tips.length > 0 ? (
                  tips.map(renderComment)
                ) : (
                  <p className="text-gray-500 text-center py-8">No tips yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <div className="space-y-4">
                {regularComments.length > 0 ? (
                  regularComments.map(renderComment)
                ) : (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}