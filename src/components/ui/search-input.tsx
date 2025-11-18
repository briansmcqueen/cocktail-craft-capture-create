import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  showClearButton?: boolean;
  containerClassName?: string;
  showShortcutHint?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, containerClassName, className, value, showShortcutHint = true, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';
    const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

    return (
      <div className={cn("relative", containerClassName)}>
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-soft-gray transition-colors duration-300 pointer-events-none z-10" 
          aria-hidden="true"
        />
        <Input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "pl-10 bg-card border-border text-card-foreground placeholder:text-muted-foreground",
            showClearButton && hasValue ? "pr-10" : showShortcutHint ? "pr-16" : "pr-4",
            "h-12 rounded-organic-md",
            "focus:border-primary focus:ring-1 focus:ring-primary/20",
            "transition-all duration-300",
            className
          )}
          aria-label={props['aria-label'] || props.placeholder || 'Search'}
          {...props}
        />
        {showClearButton && hasValue && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted z-10"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {showShortcutHint && !hasValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-soft-gray pointer-events-none z-10">
            <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-mono">
              {isMac ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-muted/50 border border-border/50 rounded text-[10px] font-mono">
              K
            </kbd>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
