
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  removable?: boolean;
  onClick?: () => void;
};

export default function TagBadge({ children, removable, className, onClick, ...props }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-accent text-foreground mr-1",
        className
      )}
      {...props}
    >
      {children}
      {removable && (
        <button
          type="button"
          className="ml-1 p-0.5 rounded hover:bg-muted transition"
          onClick={onClick}
          tabIndex={-1}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
