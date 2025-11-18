import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";
import { Ingredient } from "@/data/ingredients";

export interface ShoppingListItemUI {
  id: string;
  ingredient_id: string;
  quantity?: string | null;
}

interface ShoppingListDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ShoppingListItemUI[];
  ingredientMap: { [id: string]: Ingredient };
  onRemove: (ingredientId: string) => void;
  onPurchased: (id: string) => void;
}

export default function ShoppingListDrawer({
  open,
  onOpenChange,
  items,
  ingredientMap,
  onRemove,
  onPurchased,
}: ShoppingListDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background border-border">
        <DrawerHeader>
          <DrawerTitle className="text-pure-white">Shopping List</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-3">
          {items.length === 0 ? (
            <div className="text-soft-gray text-sm py-8 text-center">Your shopping list is empty.</div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => {
                const ing = ingredientMap[item.ingredient_id];
                return (
                  <li key={item.id} className="flex items-center justify-between bg-card border border-border rounded-organic-sm px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-sm text-pure-white truncate">{ing?.name || item.ingredient_id}</div>
                      {item.quantity ? (
                        <div className="text-xs text-soft-gray">Qty: {item.quantity}</div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="rounded-organic-sm hover:scale-[1.02] hover:rotate-[0.5deg] transition-all duration-300" onClick={() => onPurchased(item.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Bought
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-organic-sm" onClick={() => onRemove(item.ingredient_id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
