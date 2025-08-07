import { useState, useEffect } from 'react';
import { getRecipeComments, type RecipeComment } from '@/services/commentsService';

interface CommentsCache {
  [recipeId: string]: {
    data: RecipeComment[];
    timestamp: number;
  };
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
const commentsCache: CommentsCache = {};

export function useOptimizedComments(recipeId: string) {
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    const fetchComments = async () => {
      // Check cache first
      const cached = commentsCache[recipeId];
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setComments(cached.data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getRecipeComments(recipeId);
        
        // Update cache
        commentsCache[recipeId] = {
          data,
          timestamp: now
        };
        
        setComments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [recipeId]);

  const invalidateCache = () => {
    delete commentsCache[recipeId];
  };

  const addOptimisticComment = (comment: Omit<RecipeComment, 'id' | 'created_at' | 'updated_at'>) => {
    const optimisticComment: RecipeComment = {
      ...comment,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setComments(prev => [optimisticComment, ...prev]);
    invalidateCache(); // Invalidate cache since we added a comment
  };

  return {
    comments,
    loading,
    error,
    invalidateCache,
    addOptimisticComment
  };
}