
import React from "react";
import { Button } from "@/components/ui/button";

type Library = "featured" | "all" | "classics" | "favorites" | "mine" | "ingredients";

type LibraryHeaderProps = {
  library: Library;
  onCopyDialogOpen: () => void;
};

function getLibraryTitle(library: Library): string {
  switch (library) {
    case "featured": return "Featured";
    case "all": return "All Cocktails";
    case "classics": return "Classic Collection";
    case "favorites": return "Your Favorites";
    case "mine": return "My Creations";
    default: return "Cocktails";
  }
}

export default function LibraryHeader({ library, onCopyDialogOpen }: LibraryHeaderProps) {
  // Don't render anything for the featured page or ingredients page since they have their own section headings
  if (library === "featured" || library === "ingredients") {
    return null;
  }

  return (
    <>
      {/* Mobile library title */}
      <div className="lg:hidden mb-4">
        <h2 className="text-xl font-display font-semibold text-gray-900">
          {getLibraryTitle(library)}
        </h2>
        {library === "mine" && (
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            onClick={onCopyDialogOpen}
          >
            Copy from…
          </Button>
        )}
      </div>

      {/* Desktop header with NYT styling */}
      <div className="hidden lg:flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl xl:text-4xl font-display font-light text-gray-900 mb-1 tracking-wide">
            {getLibraryTitle(library)}
          </h2>
        </div>
        {library === "mine" && (
          <Button 
            variant="secondary" 
            onClick={onCopyDialogOpen}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Copy from…
          </Button>
        )}
      </div>
    </>
  );
}
