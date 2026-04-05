declare global {
  interface Window {
    __openAuthModal?: (mode: 'signin' | 'signup', contextMessage?: string) => void;
  }
}
export {};
