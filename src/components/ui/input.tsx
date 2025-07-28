
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border border-border bg-card rounded-organic-sm px-4 py-3 text-base text-light-text placeholder:text-soft-gray transition-all duration-400 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-primary focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{ transitionTimingFunction: 'var(--timing-pour)' }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
