import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Article, articlesService } from "@/services/articlesService";
import { articleFavoritesService } from "@/services/articleFavoritesService";
import ArticleCard from "./ArticleCard";
import { TrendingUp, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LearnProps {
  onShowAuthModal: () => void;
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type SortOption = 'newest' | 'oldest' | 'title';

export default function Learn({ onShowAuthModal }: LearnProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterByTag, setFilterByTag] = useState<string>("all");

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
      toast({
        title: "Error loading articles",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    const slug = slugify(article.title || '');
    navigate(`/article/${slug}`);
  };

  const handleToggleFavorite = async (articleId: string) => {
    if (!user) {
      onShowAuthModal();
      return;
    }

    try {
      const isFavorite = await articleFavoritesService.toggleFavorite(articleId);
      
      if (isFavorite) {
        setFavoriteArticles(prev => [...prev, articleId]);
        toast({
          title: "Added to favorites",
          description: "Article added to your favorites.",
        });
      } else {
        setFavoriteArticles(prev => prev.filter(id => id !== articleId));
        toast({
          title: "Removed from favorites", 
          description: "Article removed from your favorites.",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get unique tags from all articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => {
      article.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [articles]);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => {
        const titleMatch = article.title?.toLowerCase().includes(query);
        const excerptMatch = article.excerpt?.toLowerCase().includes(query);
        const authorMatch = article.author?.full_name?.toLowerCase().includes(query);
        return titleMatch || excerptMatch || authorMatch;
      });
    }

    // Apply tag filter
    if (filterByTag !== "all") {
      filtered = filtered.filter(article => 
        article.tags?.includes(filterByTag)
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => 
          new Date(b.published_at || b.created_at).getTime() - 
          new Date(a.published_at || a.created_at).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) => 
          new Date(a.published_at || a.created_at).getTime() - 
          new Date(b.published_at || b.created_at).getTime()
        );
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return sorted;
  }, [articles, searchQuery, sortBy, filterByTag]);

  // Group articles by category if needed
  const featuredArticles = filteredAndSortedArticles.filter(article => article.tags?.includes('featured')).slice(0, 6);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-light-text">Loading articles...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 lg:space-y-12">
        {/* Page Header - left aligned */}
        <div className="pb-6 border-b border-border/30">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-pure-white tracking-tight mb-2">Learn</h1>
          <p className="text-base lg:text-lg text-light-text max-w-3xl">
            Master the art of cocktail making with expert techniques, tips, and insights from professional bartenders.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-soft-gray" />
            <Input
              type="text"
              placeholder="Search articles by title, content, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border rounded-organic-sm text-pure-white placeholder:text-soft-gray"
            />
          </div>
          <div className="flex gap-3">
            <Select value={filterByTag} onValueChange={setFilterByTag}>
              <SelectTrigger className="w-[140px] bg-card border-border rounded-organic-sm text-pure-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag} className="capitalize">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[140px] bg-card border-border rounded-organic-sm text-pure-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && !searchQuery && filterByTag === "all" && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl lg:text-2xl font-display font-semibold text-pure-white">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onArticleClick={handleArticleClick}
                  isFavorite={favoriteArticles.includes(article.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onShowAuthModal={onShowAuthModal}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-display font-semibold text-pure-white">
              {searchQuery || filterByTag !== "all" ? "Search Results" : "All Articles"}
            </h2>
            {filteredAndSortedArticles.length > 0 && (
              <span className="text-sm text-soft-gray">
                {filteredAndSortedArticles.length} article{filteredAndSortedArticles.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {filteredAndSortedArticles.length === 0 ? (
            <div className="text-center py-16 bg-card/30 rounded-organic-lg border border-border/50">
              <Search className="mx-auto mb-4 text-soft-gray" size={48} />
              <h3 className="text-lg font-semibold text-pure-white mb-2">
                {searchQuery || filterByTag !== "all" ? "No articles found" : "No articles yet"}
              </h3>
              <p className="text-light-text">
                {searchQuery || filterByTag !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Check back soon for cocktail techniques, tips, and expert insights."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredAndSortedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onArticleClick={handleArticleClick}
                  isFavorite={favoriteArticles.includes(article.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onShowAuthModal={onShowAuthModal}
                />
              ))}
            </div>
          )}
        </section>
      </div>

    </>
  );
}