
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { FavoritesProvider } from "@/hooks/useFavoritesRefactored";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RecipePage = lazy(() => import("./pages/RecipePage"));

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/recipes" element={<Index />} />
                <Route path="/mybar" element={<Index />} />
                <Route path="/favorites" element={<Index />} />
                <Route path="/recipes/mine" element={<Index />} />
                <Route path="/learn" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/cocktail/:recipeName" element={<RecipePage />} />
                <Route path="/cocktail/:username/:recipeName" element={<RecipePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
