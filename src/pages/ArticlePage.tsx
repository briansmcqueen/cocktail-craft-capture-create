import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TopNavigation from "@/components/TopNavigation";
import Sidebar from "@/components/Sidebar";
import TagBadge from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Article, articlesService } from "@/services/articlesService";
import MarkdownPreview from '@uiw/react-markdown-preview';

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const shouldShowBackButton = useMemo(() => {
    if (window.history.length <= 1) return false;
    const currentPath = location.pathname;
    const referrer = document.referrer;
    if (referrer) {
      try {
        const refUrl = new URL(referrer);
        if (refUrl.pathname === currentPath) return false;
      } catch {}
    }
    return true;
  }, [location.pathname]);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const found = await articlesService.getArticleBySlug(slug);
      if (!found) {
        navigate('/learn');
        return;
      }
      setArticle(found);

      // SEO: title, description, canonical, JSON-LD
      document.title = `${found.title} | BARBOOK`;
      const desc = found.excerpt || found.content?.slice(0, 150) || '';
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', desc);

      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `${window.location.origin}/article/${slug}`);

      const ld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: found.title,
        datePublished: found.published_at || found.created_at,
        dateModified: found.updated_at,
        image: found.featured_image_url || undefined,
        author: found.author?.full_name || 'BARBOOK',
        description: desc,
      } as const;
      let ldScript = document.getElementById('ld-article') as HTMLScriptElement | null;
      if (!ldScript) {
        ldScript = document.createElement('script');
        ldScript.id = 'ld-article';
        ldScript.type = 'application/ld+json';
        document.head.appendChild(ldScript);
      }
      ldScript.textContent = JSON.stringify(ld);
    };
    load();
  }, [slug, navigate]);

  const handleGoBack = () => navigate(-1);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-light-text">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <TopNavigation
        user={user}
        activeLibrary="learn"
        onLibrarySelect={() => {}}
        onAddRecipe={() => navigate('/recipes/mine')}
        onSignInClick={() => navigate('/?auth=signin')}
        onSignUpClick={() => navigate('/?auth=signup')}
        onProfileClick={() => navigate('/profile')}
        onMyRecipesClick={() => navigate('/recipes/mine')}
        onFavoritesClick={() => navigate('/favorites')}
      />

      <div className="min-h-screen flex w-full bg-background">
        <div className="hidden lg:block">
          <Sidebar
            active="learn"
            onSelect={() => {}}
            onAdd={() => navigate('/recipes/mine')}
            user={user}
            onSignInClick={() => navigate('/?auth=signin')}
            onSignUpClick={() => navigate('/?auth=signup')}
            onProfileClick={() => navigate('/profile')}
            onMyRecipesClick={() => navigate('/recipes/mine')}
            onFavoritesClick={() => navigate('/favorites')}
          />
        </div>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {shouldShowBackButton && (
              <button onClick={handleGoBack} className="flex items-center gap-2 text-light-text hover:text-foreground mb-6 transition-colors">
                <ArrowLeft size={20} />
                Back
              </button>
            )}

            {/* Header */}
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-soft-gray">
                {article.published_at && <span>{new Date(article.published_at).toLocaleDateString()}</span>}
                {article.author?.full_name && <span>• By {article.author.full_name}</span>}
                <Button variant="secondary" size="sm" className="ml-auto rounded-organic-sm inline-flex items-center gap-2" onClick={() => setShareOpen(true)}>
                  <Share size={16} /> Share
                </Button>
              </div>
            </header>

            {/* Image */}
            {article.featured_image_url && (
              <img src={article.featured_image_url} alt={article.title} className="w-full h-56 md:h-80 object-cover rounded-organic-lg border border-border shadow-glass mb-6" />
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <TagBadge key={tag} className="bg-accent/20 text-secondary border border-accent/30 rounded-organic-sm">{tag}</TagBadge>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="bg-[hsl(var(--article))] text-[hsl(var(--article-foreground))] rounded-organic-lg p-4 md:p-6 border border-border">
              <article className="prose max-w-none">
                <MarkdownPreview
                  source={article.content}
                  className="!bg-transparent !text-[hsl(var(--article-foreground))]"
                  style={{ backgroundColor: 'transparent', color: 'hsl(var(--article-foreground))' }}
                  wrapperElement={{ 'data-color-mode': 'light' }}
                />
              </article>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
