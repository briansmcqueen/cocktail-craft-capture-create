
import { Book, Plus, Edit, Star, TrendingUp, Home, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  active: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onCloseForm?: () => void;
};

const nav = [
  { id: "featured", label: "Featured", icon: Home },
  { id: "all", label: "Recipes", icon: Book },
  { id: "ingredients", label: "My Bar", icon: ChefHat },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "mine", label: "My Creations", icon: Edit },
];

export default function Sidebar({ active, onSelect, onAdd, onCloseForm }: SidebarProps) {
  const handleNavClick = (id: string) => {
    if (onCloseForm) {
      onCloseForm();
    }
    onSelect(id);
  };

  return (
    <aside className="bg-white border-r border-gray-200 w-60 min-h-screen flex flex-col py-6 gap-2 sticky top-0">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-medium text-primary tracking-tight">BARBOOK</h1>
        </div>
      </div>
      <nav className="flex flex-col gap-1 grow">
        {nav.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-6 py-3 mx-3 rounded transition-all font-medium",
              active === item.id 
                ? "bg-accent/20 text-primary border border-primary/20" 
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
            onClick={() => handleNavClick(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto px-6">
        <button
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg flex items-center gap-2 justify-center hover:bg-primary/90 transition-all font-medium"
          onClick={onAdd}
        >
          <Plus size={18} /> <span>Add New Recipe</span>
        </button>
      </div>
    </aside>
  );
}
