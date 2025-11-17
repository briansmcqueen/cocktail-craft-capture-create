import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, Settings, Zap, Brain, BarChart3 } from "lucide-react";
import { Article, articlesService } from "@/services/articlesService";
import { userRolesService } from "@/services/userRolesService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ArticleForm from "./ArticleForm";
import AffiliatePhase4Demo from "./affiliate/AffiliatePhase4Demo";
import AffiliateEnhancedDemo from "./affiliate/AffiliateEnhancedDemo";
import AffiliateAdminPanel from "./admin/AffiliateAdminPanel";
import { ShareAnalyticsDashboard } from "./admin/ShareAnalyticsDashboard";

export default function AdminView() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadArticles();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const adminStatus = await userRolesService.isAdmin();
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      // Load all articles (published and unpublished) for admin
      const { data: articleData, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!articleData || articleData.length === 0) {
        setArticles([]);
        return;
      }

      // Get unique author IDs
      const authorIds = [...new Set(articleData.map(article => article.author_id))];
      
      // Fetch authors
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', authorIds);

      if (profilesError) throw profilesError;

      // Map articles with author data
      const articlesWithAuthor = articleData.map(article => ({
        ...article,
        author: profilesData?.find(profile => profile.id === article.author_id) || null
      }));
      
      setArticles(articlesWithAuthor);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles.",
        variant: "destructive",
      });
    }
  };

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setShowArticleForm(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articlesService.deleteArticle(articleId);
      setArticles(articles.filter(a => a.id !== articleId));
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublished = async (article: Article) => {
    try {
      const updatedArticle = await articlesService.updateArticle(article.id, {
        is_published: !article.is_published,
        published_at: !article.is_published ? new Date().toISOString() : undefined
      });
      
      setArticles(articles.map(a => 
        a.id === article.id ? { ...a, ...updatedArticle } : a
      ));
      
      toast({
        title: "Article updated",
        description: `Article ${!article.is_published ? 'published' : 'unpublished'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Error",
        description: "Failed to update article.",
        variant: "destructive",
      });
    }
  };

  const handleSaveArticle = (savedArticle: Article) => {
    if (editingArticle) {
      setArticles(articles.map(a => 
        a.id === savedArticle.id ? savedArticle : a
      ));
    } else {
      setArticles([savedArticle, ...articles]);
    }
    setShowArticleForm(false);
    setEditingArticle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please sign in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You don't have admin access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <Edit size={16} />
            Articles
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="phase4" className="flex items-center gap-2">
            <Brain size={16} />
            Phase 4 Demo
          </TabsTrigger>
          <TabsTrigger value="enhanced" className="flex items-center gap-2">
            <Zap size={16} />
            Enhanced Demo
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings size={16} />
            Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Article Management</h2>
            <Button onClick={handleCreateArticle} className="gap-2">
              <Plus size={16} />
              New Article
            </Button>
          </div>

          <div className="grid gap-4">
            {articles.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No articles found. Create your first article!</p>
                </CardContent>
              </Card>
            ) : (
              articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{article.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By {article.author?.full_name || 'Unknown'}</span>
                          <span>Created {formatDate(article.created_at)}</span>
                          {article.published_at && (
                            <span>Published {formatDate(article.published_at)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={article.is_published ? "default" : "secondary"}>
                            {article.is_published ? "Published" : "Draft"}
                          </Badge>
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublished(article)}
                          className="gap-1"
                        >
                          {article.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                          {article.is_published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditArticle(article)}
                          className="gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {article.excerpt && (
                    <CardContent>
                      <p className="text-muted-foreground">{article.excerpt}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ShareAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="phase4" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Phase 4: AI-Powered Commerce</h2>
          </div>
          <AffiliatePhase4Demo />
        </TabsContent>

        <TabsContent value="enhanced" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Enhanced Affiliate Features</h2>
          </div>
          <AffiliateEnhancedDemo />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Affiliate Management</h2>
          </div>
          <AffiliateAdminPanel />
        </TabsContent>
      </Tabs>

      <ArticleForm
        isOpen={showArticleForm}
        onClose={() => {
          setShowArticleForm(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveArticle}
        article={editingArticle}
      />
    </div>
  );
}