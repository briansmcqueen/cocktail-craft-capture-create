
import React from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onSidebarOpen: () => void;
  onAddRecipe: () => void;
};

export default function MobileHeader({ onSidebarOpen, onAddRecipe }: Props) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarOpen}
            className="p-2"
          >
            <Menu size={20} />
          </Button>
          
          <h1 className="text-xl font-serif font-bold text-orange-600 tracking-wide">
            BARBOOK
          </h1>
        </div>
        
        <Button
          onClick={onAddRecipe}
          size="sm"
          className="flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Recipe</span>
        </Button>
      </div>
    </header>
  );
}
