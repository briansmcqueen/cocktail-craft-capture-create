import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Martini, Home, Compass, BookOpen, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageSEO from "@/components/PageSEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-5">
      <PageSEO
        title="Page Not Found | Barbook"
        description="This page doesn't exist. Head back to the bar to discover cocktails or browse recipes."
        path="/404"
        noindex
      />
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-medium-charcoal border border-border flex items-center justify-center">
            <Martini className="h-7 w-7 text-pure-white" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-soft-gray text-xs uppercase tracking-[0.2em] font-semibold">404 — Off the menu</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-pure-white">This page is out of stock</h1>
          <p className="text-light-text text-sm">
            The page you're looking for doesn't exist, or it's been poured out. Let's get you back to the bar.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild className="rounded-organic-sm">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-organic-sm border-border">
            <Link to="/discover">
              <Compass className="h-4 w-4 mr-2" />
              Discover bartenders
            </Link>
          </Button>
        </div>
        <div className="pt-6 border-t border-border/40">
          <p className="text-soft-gray text-xs uppercase tracking-[0.2em] font-semibold mb-3">
            Or try
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-organic-sm border border-border text-light-text hover:text-pure-white hover:bg-medium-charcoal transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              All recipes
            </Link>
            <Link
              to="/mybar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-organic-sm border border-border text-light-text hover:text-pure-white hover:bg-medium-charcoal transition-colors"
            >
              <Beaker className="h-3.5 w-3.5" />
              My Bar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
