import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  Heart, 
  ChefHat, 
  BookOpen, 
  Martini,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "featured", title: "Featured", url: "/", icon: Home },
  { id: "all", title: "All Recipes", url: "/recipes", icon: Search },
  { id: "mybar", title: "My Bar", url: "/mybar", icon: Martini },
  { id: "favorites", title: "Favorites", url: "/favorites", icon: Heart },
  { id: "mine", title: "My Creations", url: "/recipes/mine", icon: ChefHat },
  { id: "learn", title: "Learn", url: "/learn", icon: BookOpen },
];

export function RecipeSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <aside 
      className={cn(
        "bg-rich-charcoal border-r border-light-charcoal min-h-screen flex flex-col py-6 gap-2 sticky top-0 rounded-organic-lg transition-all duration-500 ease-out",
        isCollapsed ? "w-14" : "w-60"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Header */}
      <div className={cn(
        "transition-all duration-500 ease-out",
        isCollapsed ? "px-3 mb-4" : "px-6 mb-8"
      )}>
        <div className="flex items-center gap-0 mb-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center justify-center transition-all duration-700 ease-out hover:scale-[1.1] text-pure-white font-medium",
              isCollapsed ? "w-8 h-8 text-xl" : "w-auto h-8 text-3xl"
            )}
          >
            B
          </button>
          {!isCollapsed && (
            <span className="text-3xl font-medium text-pure-white tracking-tight animate-fade-in ml-1">
              ARBOOK
            </span>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-1 grow">
        {navigationItems.map((item, index) => (
          <NavLink
            key={item.id}
            to={item.url}
            end={item.url === "/"}
            className={cn(
              "flex items-center rounded-organic-sm transition-all font-medium duration-300",
              isCollapsed 
                ? "mx-2 px-2 py-3 justify-center" 
                : "mx-3 px-6 py-3 gap-3",
              isActive(item.url)
                ? "bg-primary/20 text-emerald border border-primary/30 transform scale-[1.02] rotate-[0.5deg]" 
                : "text-light-text hover:bg-medium-charcoal hover:text-pure-white hover:scale-[1.01] hover:rotate-[-0.3deg]"
            )}
            style={{ 
              transitionDelay: `${index * 50}ms`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="animate-fade-in transition-all duration-300">{item.title}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}