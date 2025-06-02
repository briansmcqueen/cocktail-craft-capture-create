
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type MobileHeaderProps = {
  onSidebarOpen: () => void;
  onAddRecipe: () => void;
};

export default function MobileHeader({ onSidebarOpen, onAddRecipe }: MobileHeaderProps) {
  return (
    <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20 px-4 py-3 w-full">
      <div className="flex items-center justify-between">
        <button
          onClick={onSidebarOpen}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-display font-bold text-orange-600 tracking-wide">
            BARBOOK
          </h1>
        </div>
        <Button
          size="sm"
          onClick={onAddRecipe}
          className="text-sm px-3 bg-orange-600 text-white hover:bg-orange-700"
        >
          Add
        </Button>
      </div>
    </header>
  );
}
