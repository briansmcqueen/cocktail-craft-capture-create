import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function BackButton({ onClick, children = 'Back', className }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-2 text-light-text hover:text-foreground transition-colors",
        className
      )}
    >
      <ArrowLeft size={20} />
      {children}
    </button>
  );
}
