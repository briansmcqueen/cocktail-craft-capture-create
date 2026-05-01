import { Book, Plus, Edit, Heart, Compass, Home, Martini, User, LogIn, Users, PanelLeftClose, PanelLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { memo } from "react";
import UserProfileDisplay from "@/components/auth/UserProfileDisplay";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarProps = {
  active: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onCloseForm?: () => void;
  user?: SupabaseUser | null;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  onProfileClick?: () => void;
  onMyRecipesClick?: () => void;
  onFavoritesClick?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const nav = [
  { id: "featured", label: "Featured", icon: Home, path: "/" },
  { id: "all", label: "Recipes", icon: Book, path: "/recipes" },
  { id: "discover", label: "Discover", icon: Compass, path: "/discover" },
  { id: "ingredients", label: "My Bar", icon: Martini, path: "/mybar" },
  { id: "favorites", label: "Favorites", icon: Heart, path: "/favorites" },
  { id: "mine", label: "My Drinks", icon: Edit, path: "/recipes/my-drinks" },
];

const Sidebar = memo(function Sidebar({ active, onSelect, onAdd, onCloseForm, user, onSignInClick, onSignUpClick, onProfileClick, onMyRecipesClick, onFavoritesClick, collapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn(
      "bg-rich-charcoal border-r border-light-charcoal h-screen flex flex-col pt-6 pb-0 gap-2 sticky top-0 overflow-visible transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Header */}
      <div className={cn("flex-shrink-0 mb-8", collapsed ? "px-3" : "px-6")}>
        <div className="flex items-center justify-between gap-2">
          {!collapsed && (
            <Link to="/" className="text-3xl font-medium text-pure-white tracking-tight">BARBOOK</Link>
          )}
          <div className={cn("flex items-center gap-1", collapsed && "w-full justify-center")}>
            {user && !collapsed && <NotificationsDropdown />}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="h-8 w-8 hover:bg-medium-charcoal text-muted-foreground hover:text-pure-white"
              >
                {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
              </Button>
            )}
          </div>
        </div>
        {user && collapsed && (
          <div className="flex justify-center mt-2">
            <NotificationsDropdown />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex flex-col gap-1 flex-1 overflow-y-auto min-h-0", collapsed ? "px-2" : "px-3")}>
        {nav.map((item) => {
          const isActive = location.pathname === item.path;
          const linkContent = (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-organic-sm transition-all font-medium duration-300",
                collapsed ? "justify-center px-2 py-3" : "px-3 py-3",
                isActive
                  ? "bg-primary/20 text-emerald border border-primary/30"
                  : "text-light-text hover:bg-medium-charcoal hover:text-pure-white"
              )}
              onClick={() => {
                if (onCloseForm) onCloseForm();
              }}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="bg-card border-border">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Footer */}
      <div className={cn("space-y-2", collapsed ? "px-2" : "px-6")}>
        {/* Add Recipe */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                className="w-full bg-primary text-primary-foreground py-3 rounded-organic-sm flex items-center justify-center hover:bg-primary/90 transition-all font-medium duration-300"
                onClick={onAdd}
              >
                <Plus size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-card border-border">
              Add New Recipe
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-organic-sm flex items-center gap-2 justify-center hover:bg-primary/90 transition-all font-medium duration-300"
            onClick={onAdd}
          >
            <Plus size={18} /> <span>Add New Recipe</span>
          </button>
        )}

        {/* Auth section */}
        <div className="border-t border-light-charcoal pt-3">
          {user ? (
            collapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={onProfileClick}
                    className="w-full flex items-center justify-center py-2 rounded-organic-sm hover:bg-medium-charcoal transition-colors"
                  >
                    <User size={20} className="text-light-text" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-card border-border">
                  View Profile
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="space-y-3">
                <UserProfileDisplay
                  user={user}
                  avatarSize="md"
                  onAvatarClick={onProfileClick}
                />
                <Button
                  onClick={onProfileClick}
                  variant="outline"
                  className="w-full rounded-organic-sm border-border hover:bg-medium-charcoal"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            )
          ) : (
            collapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={onSignInClick}
                    className="w-full flex items-center justify-center py-2 rounded-organic-sm hover:bg-medium-charcoal transition-colors"
                  >
                    <LogIn size={20} className="text-light-text" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-card border-border">
                  Sign In
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={onSignUpClick}
                  variant="secondary"
                  className="w-full gap-2 rounded-organic-sm text-pure-white transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  Create Account
                </Button>
                <Button
                  onClick={onSignInClick}
                  className="w-full gap-2 rounded-organic-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </div>
            )
          )}
        </div>

        {/* Legal links */}
        {!collapsed && (
          <div className="flex h-3 items-start overflow-hidden text-xs leading-[12px] text-soft-gray pt-0 gap-[12px] py-[10px] my-[12px]">
            <Link to="/terms" className="block h-3 py-0 leading-[12px] hover:text-light-text transition-colors">Terms</Link>
            <Link to="/privacy" className="block h-3 py-0 leading-[12px] hover:text-light-text transition-colors">Privacy</Link>
          </div>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
