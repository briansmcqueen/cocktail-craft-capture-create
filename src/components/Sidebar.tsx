
import { Book, Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  active: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

const nav = [
  { id: "all", label: "All", icon: Book },
  { id: "classics", label: "Classics", icon: Book },
  { id: "mine", label: "My Creations", icon: Edit },
];

export default function Sidebar({ active, onSelect, onAdd }: SidebarProps) {
  return (
    <aside className="bg-sidebar border-r w-60 min-h-screen flex flex-col py-6 gap-2 sticky top-0">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Cocktail Library</h1>
        <p className="text-muted-foreground text-xs">Discover & Mix</p>
      </div>
      <nav className="flex flex-col gap-1 grow">
        {nav.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-6 py-2 rounded transition font-medium hover:bg-accent",
              active === item.id && "bg-accent text-primary"
            )}
            onClick={() => onSelect(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto px-6">
        <button
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded flex items-center gap-2 justify-center hover:bg-primary/90 transition shadow"
          onClick={onAdd}
        >
          <Plus size={18} /> <span>Add New Recipe</span>
        </button>
      </div>
    </aside>
  );
}
