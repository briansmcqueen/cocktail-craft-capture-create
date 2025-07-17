import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MessageCircle, Edit2, Trash2, Camera, X, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getRecipeComments, addComment, updateComment, deleteComment, type RecipeComment } from '@/services/commentsService';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface RecipeCommentsProps {
  recipeId: string;
}

const categoryLabels = {
  general: 'General',
  variation: 'Variation',
  substitution: 'Substitution', 
  technique: 'Technique',
  presentation: 'Presentation'
};

const categoryColors = {
  general: 'default',
  variation: 'secondary',
  substitution: 'outline',
  technique: 'destructive',
  presentation: 'default'
} as const;

export default function RecipeComments({ recipeId }: RecipeCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [category, setCategory] = useState<'general' | 'variation' | 'substitution' | 'technique' | 'presentation'>('general');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<'general' | 'variation' | 'substitution' | 'technique' | 'presentation'>('general');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await getRecipeComments(recipeId);
    setComments(data);
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `comment-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('recipes')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    let photoUrl = null;
    if (selectedImage) {
      photoUrl = await uploadImage(selectedImage);
      if (!photoUrl) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
        return;
      }
    }

    const success = await addComment(
      recipeId,
      newComment.trim(),
      category,
      photoUrl
    );

    if (success) {
      setNewComment('');
      setCategory('general');
      setSelectedImage(null);
      await fetchComments();
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    const success = await updateComment(
      commentId,
      editContent.trim(),
      editCategory
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

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
            {comment.category !== 'general' && (
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2 py-1 rounded-full">
                {categoryLabels[comment.category]}
              </span>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="space-y-3">
              <Select value={editCategory} onValueChange={(value: any) => setEditCategory(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="variation">Variation</SelectItem>
                  <SelectItem value="substitution">Substitution</SelectItem>
                  <SelectItem value="technique">Technique</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                </SelectContent>
              </Select>
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
              {comment.photo_url && (
                <img 
                  src={comment.photo_url} 
                  alt="Comment attachment" 
                  className="rounded-lg max-w-sm max-h-64 object-cover"
                />
              )}
              {user?.id === comment.user_id && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                      setEditCategory(comment.category);
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
          <CardTitle>Comments</CardTitle>
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
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="variation">Variation</SelectItem>
                  <SelectItem value="substitution">Substitution</SelectItem>
                  <SelectItem value="technique">Technique</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Leave a comment..."
                className="min-h-[100px]"
              />

              {selectedImage && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedImage.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim() || uploading}
              >
                {uploading ? 'Uploading...' : 'Post Comment'}
              </Button>
              
              {/* Image Upload */}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="comment-image"
              />
              <label
                htmlFor="comment-image"
                className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Camera className="w-4 h-4" />
                Add Photo
              </label>
            </div>
          </div>
        )}

        {/* Comments Display */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(renderComment)}
          </div>
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