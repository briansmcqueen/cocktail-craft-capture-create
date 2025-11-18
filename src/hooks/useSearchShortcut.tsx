import { useEffect, RefObject } from 'react';

/**
 * Custom hook to add keyboard shortcuts for focusing search inputs
 * Supports Cmd+K (Mac), Ctrl+K (Windows/Linux), and / key
 * 
 * @param inputRef - React ref to the input element to focus
 * @param enabled - Whether the shortcut is enabled (default: true)
 */
export function useSearchShortcut(
  inputRef: RefObject<HTMLInputElement>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key === 'k';
      
      // Check for / key (but not when typing in an input/textarea)
      const isSlash = e.key === '/' && 
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);

      if (isCmdK || isSlash) {
        e.preventDefault();
        inputRef.current?.focus();
        
        // Optional: select existing text when focusing
        if (inputRef.current?.value) {
          inputRef.current.select();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef, enabled]);
}
