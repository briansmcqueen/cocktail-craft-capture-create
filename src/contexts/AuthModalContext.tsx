import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  contextMessage?: string;
  openAuthModal: (mode: 'signin' | 'signup', contextMessage?: string) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [contextMessage, setContextMessage] = useState<string | undefined>(undefined);

  const openAuthModal = (newMode: 'signin' | 'signup', message?: string) => {
    setMode(newMode);
    setContextMessage(message);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    setContextMessage(undefined);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, contextMessage, openAuthModal, closeAuthModal }}>
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
