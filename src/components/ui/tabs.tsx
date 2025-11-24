import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const [showLeftGradient, setShowLeftGradient] = React.useState(false)
  const [showRightGradient, setShowRightGradient] = React.useState(false)
  const listRef = React.useRef<HTMLDivElement>(null)

  const checkScroll = React.useCallback(() => {
    const element = listRef.current
    if (!element) return

    const { scrollLeft, scrollWidth, clientWidth } = element
    setShowLeftGradient(scrollLeft > 0)
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  React.useEffect(() => {
    const element = listRef.current
    if (!element) return

    checkScroll()

    element.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      element.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  return (
    <div className="relative">
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 md:hidden" />
      )}
      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 md:hidden" />
      )}
      <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={cn(
          "inline-flex h-auto items-center justify-start gap-6 p-0 text-muted-foreground border-b border-border overflow-x-auto scrollbar-hide md:overflow-x-visible",
          className
        )}
        {...props}
      />
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-muted-foreground/30 data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:hover:border-foreground min-h-[44px] sm:min-h-auto",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
