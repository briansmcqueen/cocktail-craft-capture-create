
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { FavoritesProvider } from "@/hooks/useFavoritesRefactored";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthModal } from "@/contexts/AuthModalContext";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage"));
const DiscoverBartenders = lazy(() => import("./pages/DiscoverBartenders"));
const FollowersPage = lazy(() => import("./pages/FollowersPage"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));

// Optimize React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function AuthModalWrapper() {
  const { isOpen, mode, contextMessage, closeAuthModal, openAuthModal } = useAuthModal();
  
  // Expose the openAuthModal function globally so it can be accessed from toast actions
  React.useEffect(() => {
    window.__openAuthModal = openAuthModal;
    return () => {
      delete window.__openAuthModal;
    };
  }, [openAuthModal]);
  
  return <AuthModal open={isOpen} onOpenChange={closeAuthModal} initialMode={mode} contextMessage={contextMessage} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <AuthModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthModalWrapper />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/recipes" element={<Index />} />
                  <Route path="/mybar" element={<Index />} />
                  <Route path="/favorites" element={<Index />} />
                  <Route path="/recipes/my-drinks" element={<Index />} />
                  <Route path="/learn" element={<Index />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile/:username" element={<PublicProfilePage />} />
                  <Route path="/profile/:username/followers" element={<FollowersPage />} />
                  <Route path="/discover" element={<DiscoverBartenders />} />
                  <Route path="/cocktail/:recipeName" element={<RecipePage />} />
                  <Route path="/cocktail/:username/:recipeName" element={<RecipePage />} />
                  <Route path="/article/:slug" element={<ArticlePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthModalProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
