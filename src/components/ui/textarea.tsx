
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full border border-border bg-card rounded-organic-sm px-4 py-3 text-base text-light-text placeholder:text-soft-gray transition-all duration-400 focus-visible:outline-none focus-visible:border-primary focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{ transitionTimingFunction: 'var(--timing-pour)' }}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
