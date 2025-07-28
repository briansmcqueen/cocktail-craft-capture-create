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
        "bg-rich-charcoal border-r border-light-charcoal min-h-screen flex flex-col py-6 gap-2 sticky top-0 transition-all duration-300 rounded-organic-lg",
        isCollapsed ? "w-14" : "w-60"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="px-6 mb-8">
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-medium text-pure-white tracking-tight">BARBOOK</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-8 h-8 rounded-organic-sm bg-medium-charcoal hover:bg-light-charcoal transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-light-text" />
          ) : (
            <ChevronLeft size={16} className="text-light-text" />
          )}
        </button>
      </div>
      
      <nav className="flex flex-col gap-1 grow">
        {navigationItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.url}
            end={item.url === "/"}
            className={cn(
              "flex items-center gap-3 px-6 py-3 mx-3 rounded-organic-sm transition-all font-medium duration-300",
              isActive(item.url)
                ? "bg-primary/20 text-emerald border border-primary/30 transform scale-[1.02] rotate-[0.5deg]" 
                : "text-light-text hover:bg-medium-charcoal hover:text-pure-white hover:scale-[1.01] hover:rotate-[-0.3deg]"
            )}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}