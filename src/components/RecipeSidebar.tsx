import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  Heart, 
  ChefHat, 
  BookOpen, 
  User,
  Martini
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Featured", url: "/", icon: Home },
  { title: "All Recipes", url: "/recipes", icon: Search },
  { title: "My Bar", url: "/mybar", icon: Martini },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "My Creations", url: "/recipes/mine", icon: ChefHat },
  { title: "Learn", url: "/learn", icon: BookOpen },
];

export function RecipeSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClassName = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-organic-sm transition-all duration-200";
    const activeClasses = "bg-primary/20 text-primary border border-primary/30";
    const inactiveClasses = "text-light-text hover:text-pure-white hover:bg-light-charcoal/50";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      collapsible="icon"
      variant="floating"
    >
      <SidebarContent className="bg-medium-charcoal border-r border-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-pure-white font-medium mb-2">
            {state === "collapsed" ? "" : "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {state !== "collapsed" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}