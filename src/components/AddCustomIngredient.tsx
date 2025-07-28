import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { createCustomIngredient } from "@/services/customIngredientsService";
import { useToast } from "@/hooks/use-toast";

interface AddCustomIngredientProps {
  onIngredientAdded: () => void;
}

const categories = [
  "Spirits",
  "Liqueurs", 
  "Wines & Vermouths",
  "Mixers",
  "Produce",
  "Pantry"
];

const subCategories: { [key: string]: string[] } = {
  "Spirits": ["Whiskey", "Gin", "Vodka", "Rum", "Tequila", "Brandy", "Other"],
  "Liqueurs": ["Fruit Liqueur", "Herbal Liqueur", "Bitter Liqueur", "Cream Liqueur", "Other"],
  "Wines & Vermouths": ["Fortified Wine", "Sparkling Wine", "Still Wine", "Other"],
  "Mixers": ["Carbonated", "Juice", "Syrup", "Bitters", "Other"],
  "Produce": ["Citrus", "Herbs", "Fruits", "Vegetables", "Other"],
  "Pantry": ["Syrups", "Sweeteners", "Spices", "Garnishes", "Other"]
};

export default function AddCustomIngredient({ onIngredientAdded }: AddCustomIngredientProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [aliasInput, setAliasInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAlias = () => {
    if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
      setAliases([...aliases, aliasInput.trim()]);
      setAliasInput("");
    }
  };

  const handleRemoveAlias = (alias: string) => {
    setAliases(aliases.filter(a => a !== alias));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !category || !subCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const success = await createCustomIngredient({
      name: name.trim(),
      category,
      sub_category: subCategory,
      description: description.trim() || undefined,
      aliases
    });

    if (success) {
      toast({
        title: "Ingredient Added",
        description: `${name} has been added to your custom ingredients.`
      });
      
      // Reset form
      setName("");
      setCategory("");
      setSubCategory("");
      setDescription("");
      setAliases([]);
      setAliasInput("");
      setOpen(false);
      onIngredientAdded();
    } else {
      toast({
        title: "Error",
        description: "Failed to add ingredient. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-gray-300 text-white hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400">
          <Plus className="h-4 w-4 mr-1" />
          Add Custom Ingredient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="add-ingredient-description">
        <DialogHeader>
          <DialogTitle>Add Custom Ingredient</DialogTitle>
          <p id="add-ingredient-description" className="text-sm text-muted-foreground">
            Create a custom ingredient to add to your bar inventory.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fernet-Branca"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => {
              setCategory(value);
              setSubCategory(""); // Reset subcategory when category changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory *</Label>
              <Select value={subCategory} onValueChange={setSubCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories[category]?.map((subCat) => (
                    <SelectItem key={subCat} value={subCat}>
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the flavor profile and characteristics..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Aliases (Alternative Names)</Label>
            <div className="flex gap-2">
              <Input
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                placeholder="e.g., Italian Bitter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAlias();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddAlias}>
                Add
              </Button>
            </div>
            {aliases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {aliases.map((alias) => (
                  <Badge key={alias} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveAlias(alias)}>
                    {alias}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Ingredient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}