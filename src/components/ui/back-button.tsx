import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function BackButton({ onClick, children, className = '' }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`text-available hover:text-available/80 hover:bg-available/10 font-medium gap-2 px-0 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Button>
  );
}
