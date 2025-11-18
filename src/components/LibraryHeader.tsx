
import React from "react";
import { Button } from "@/components/ui/button";

type Library = "featured" | "all" | "classics" | "favorites" | "mine" | "ingredients" | "feed" | "learn";

type LibraryHeaderProps = {
  library: Library;
};

function getLibraryTitle(library: Library): string {
  switch (library) {
    case "featured": return "Featured";
    case "all": return "Recipes";
    case "classics": return "Classic Collection";
    case "favorites": return "Your Favorites";
    case "mine": return "My Drinks";
    case "feed": return "Your Feed";
    case "learn": return "Learn";
    default: return "Cocktails";
  }
}

export default function LibraryHeader({ library }: LibraryHeaderProps) {
  // Don't render anything for the featured page, ingredients page, feed, or learn since they have their own section headings
  if (library === "featured" || library === "ingredients" || library === "feed" || library === "learn") {
    return null;
  }

  return (
    <>
      {/* Mobile library title with consistent padding */}
      <div className="lg:hidden mb-4 px-4 sm:px-0">
        <h2 className="text-xl font-display font-semibold text-pure-white">
          {getLibraryTitle(library)}
        </h2>
      </div>

      {/* Desktop header with NYT styling */}
      <div className="hidden lg:flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl xl:text-4xl font-display font-light text-pure-white mb-1 tracking-wide">
            {getLibraryTitle(library)}
          </h2>
        </div>
      </div>
    </>
  );
}
