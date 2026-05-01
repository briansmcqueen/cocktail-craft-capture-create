
import React from "react";
import { Book, Heart, Edit, LucideIcon } from "lucide-react";
import type { LibraryKey } from "@/types/library";

type LibraryHeaderProps = {
  library: LibraryKey;
};

function getLibraryConfig(library: LibraryKey): { title: string; icon: LucideIcon } | null {
  switch (library) {
    case "all": return { title: "Recipes", icon: Book };
    case "classics": return { title: "Classic Collection", icon: Book };
    case "favorites": return { title: "Favorites", icon: Heart };
    case "mine": return { title: "My Drinks", icon: Edit };
    default: return null;
  }
}

export default function LibraryHeader({ library }: LibraryHeaderProps) {
  const config = getLibraryConfig(library);
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2.5 mb-6">
      <Icon className="h-4 w-4 text-pure-white flex-shrink-0" />
      <h2 className="text-pure-white tracking-[0.08em] leading-[1.45] uppercase font-bold text-sm md:text-[1rem]">
        {config.title}
      </h2>
    </div>
  );
}
