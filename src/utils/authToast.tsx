import { ToastAction } from "@/components/ui/toast";

// This helper creates a toast action button that triggers the global auth modal
// It's used by accessing window.__openAuthModal which is set up in App.tsx
export function createAuthToastAction() {
  return (
    <ToastAction 
      altText="Sign up" 
      onClick={() => {
        // Access the global function that opens the auth modal
        if (window.__openAuthModal) {
          window.__openAuthModal('signup');
        }
      }}
    >
      Sign Up
    </ToastAction>
  );
}

// Extend the Window interface to include our global function
declare global {
  interface Window {
    __openAuthModal?: (mode: 'signin' | 'signup', contextMessage?: string) => void;
  }
}
