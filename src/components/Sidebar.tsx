
import { Book, Plus, Edit, Star, TrendingUp, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  active: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

const nav = [
  { id: "featured", label: "Featured", icon: Home },
  { id: "all", label: "All", icon: Book },
  { id: "classics", label: "Classics", icon: Book },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "mine", label: "My Creations", icon: Edit },
];

export default function Sidebar({ active, onSelect, onAdd }: SidebarProps) {
  return (
    <aside className="bg-black border-r border-red-500/30 w-60 min-h-screen flex flex-col py-6 gap-2 sticky top-0 neon-sidebar">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src="/lovable-uploads/0fbd9c77-fecf-48ea-8d31-580fb27e6206.png" 
            alt="Barbook" 
            className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
          />
          <h1 className="text-xl font-display font-bold tracking-wider text-red-400 neon-text">BARBOOK</h1>
        </div>
        <p className="text-red-500/70 text-xs uppercase tracking-wide">Digital Dive Bar</p>
      </div>
      <nav className="flex flex-col gap-1 grow">
        {nav.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-6 py-3 mx-3 rounded transition-all font-medium border",
              active === item.id 
                ? "bg-red-500/10 text-red-400 border-red-500/50 shadow-[inset_0_0_10px_rgba(220,38,38,0.2)]" 
                : "text-red-300/80 border-transparent hover:bg-red-500/5 hover:text-red-300 hover:border-red-500/30"
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
          className="w-full bg-red-500 text-black py-3 px-4 rounded flex items-center gap-2 justify-center hover:bg-red-400 transition-all font-semibold border border-red-400"
          onClick={onAdd}
        >
          <Plus size={18} /> <span>Add New Recipe</span>
        </button>
      </div>
    </aside>
  );
}
