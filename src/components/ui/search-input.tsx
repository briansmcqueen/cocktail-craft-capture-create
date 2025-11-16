import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  showClearButton?: boolean;
  containerClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, containerClassName, className, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';

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
            "pl-10 pr-10 h-12 bg-secondary-surface border-border text-pure-white placeholder:text-soft-gray",
            "rounded-organic-md",
            "focus:border-available focus:ring-1 focus:ring-available/20",
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
