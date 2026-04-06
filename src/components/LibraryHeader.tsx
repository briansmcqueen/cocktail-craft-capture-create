
import React from "react";
import { Home, Book, Heart, Edit, Rss, GraduationCap, LucideIcon } from "lucide-react";

type Library = "featured" | "all" | "classics" | "favorites" | "mine" | "ingredients" | "feed" | "learn";

type LibraryHeaderProps = {
  library: Library;
};

function getLibraryConfig(library: Library): { title: string; icon: LucideIcon } | null {
  switch (library) {
    case "featured": return null; // Has its own section headings
    case "all": return { title: "Recipes", icon: Book };
    case "classics": return { title: "Classic Collection", icon: Book };
    case "favorites": return { title: "Favorites", icon: Heart };
    case "mine": return { title: "My Drinks", icon: Edit };
    case "feed": return { title: "Your Feed", icon: Rss };
    case "learn": return { title: "Learn", icon: GraduationCap };
    default: return { title: "Cocktails", icon: Book };
  }
}

export default function LibraryHeader({ library }: LibraryHeaderProps) {
  // Don't render for pages that have their own headings
  if (library === "featured" || library === "ingredients" || library === "feed" || library === "learn") {
    return null;
  }

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
