import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  openAuthModal: (mode: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  const openAuthModal = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
