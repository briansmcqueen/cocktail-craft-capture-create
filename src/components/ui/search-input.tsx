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
  onEnter?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, containerClassName, className, value, showShortcutHint = false, onEnter, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnter) {
        e.preventDefault();
        onEnter();
      }
      // Call the original onKeyDown if provided
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    return (
      <div className={cn("relative", containerClassName)}>
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-soft-gray transition-colors duration-300 pointer-events-none z-10" 
          aria-hidden="true"
        />
        <Input
          ref={ref}
          type="text"
          value={value}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 bg-card border-border text-card-foreground placeholder:text-muted-foreground",
            showClearButton && hasValue ? "pr-10" : "pr-4",
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
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
