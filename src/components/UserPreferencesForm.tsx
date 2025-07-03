import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getUserPreferences, updateUserPreferences } from "@/services/userPreferencesService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const spiritTypes = [
  "Whiskey", "Gin", "Vodka", "Rum", "Tequila", "Brandy", "Mezcal"
];

const flavorProfiles = [
  "Sweet", "Sour", "Bitter", "Herbal", "Citrus", "Fruity", "Spicy", "Smoky", "Floral", "Tropical"
];

export default function UserPreferencesForm() {
  const [preferredSpirits, setPreferredSpirits] = useState<string[]>([]);
  const [flavorPreferences, setFlavorPreferences] = useState<string[]>([]);
  const [difficultyPreference, setDifficultyPreference] = useState(3);
  const [preferredUnit, setPreferredUnit] = useState<'oz' | 'ml'>('oz');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const preferences = await getUserPreferences();
      if (preferences) {
        setPreferredSpirits(preferences.preferred_spirit_types || []);
        setFlavorPreferences(preferences.flavor_preferences || []);
        setDifficultyPreference(preferences.difficulty_preference || 3);
        setPreferredUnit(preferences.preferred_unit || 'oz');
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    
    const success = await updateUserPreferences({
      preferred_spirit_types: preferredSpirits,
      flavor_preferences: flavorPreferences,
      difficulty_preference: difficultyPreference,
      preferred_unit: preferredUnit
    });

    if (success) {
      toast({
        title: "Preferences Saved",
        description: "Your preferences have been updated successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const toggleSpirit = (spirit: string) => {
    setPreferredSpirits(prev => 
      prev.includes(spirit) 
        ? prev.filter(s => s !== spirit)
        : [...prev, spirit]
    );
  };

  const toggleFlavor = (flavor: string) => {
    setFlavorPreferences(prev => 
      prev.includes(flavor) 
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  if (initialLoading) {
    return <div className="animate-pulse">Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Preferred Spirits</Label>
          <div className="flex flex-wrap gap-2">
            {spiritTypes.map((spirit) => (
              <Badge
                key={spirit}
                variant={preferredSpirits.includes(spirit) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSpirit(spirit)}
              >
                {spirit}
                {preferredSpirits.includes(spirit) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Flavor Preferences</Label>
          <div className="flex flex-wrap gap-2">
            {flavorProfiles.map((flavor) => (
              <Badge
                key={flavor}
                variant={flavorPreferences.includes(flavor) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFlavor(flavor)}
              >
                {flavor}
                {flavorPreferences.includes(flavor) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="difficulty">Preferred Difficulty Level</Label>
          <div className="flex items-center gap-4">
            <Input
              id="difficulty"
              type="range"
              min="1"
              max="5"
              value={difficultyPreference}
              onChange={(e) => setDifficultyPreference(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-16">
              {difficultyPreference}/5
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferred Unit for Recipes</Label>
          <div className="flex gap-2">
            <Badge
              variant={preferredUnit === 'oz' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setPreferredUnit('oz')}
            >
              Ounces (oz)
            </Badge>
            <Badge
              variant={preferredUnit === 'ml' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setPreferredUnit('ml')}
            >
              Milliliters (ml)
            </Badge>
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}