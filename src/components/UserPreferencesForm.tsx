import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { getUserPreferences, updateUserPreferences } from "@/services/userPreferencesService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function UserPreferencesForm() {
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


  if (initialLoading) {
    return <div className="animate-pulse">Loading preferences...</div>;
  }

  return (
    <Card className="bg-transparent border-0 !shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold text-pure-white flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-pure-white" />
          Your Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="space-y-3">
          <Label>Preferred Unit for Recipes</Label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-organic-sm transition-all min-h-[44px] sm:min-h-auto sm:px-3 sm:py-1.5 sm:text-sm ${
                preferredUnit === 'oz'
                  ? 'bg-accent/20 border-accent text-foreground'
                  : 'bg-card border border-border text-foreground hover:border-accent/50 hover:bg-accent/5'
              }`}
              onClick={() => setPreferredUnit('oz')}
            >
              Ounces (oz)
            </button>
            <button
              type="button"
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-organic-sm transition-all min-h-[44px] sm:min-h-auto sm:px-3 sm:py-1.5 sm:text-sm ${
                preferredUnit === 'ml'
                  ? 'bg-accent/20 border-accent text-foreground'
                  : 'bg-card border border-border text-foreground hover:border-accent/50 hover:bg-accent/5'
              }`}
              onClick={() => setPreferredUnit('ml')}
            >
              Milliliters (ml)
            </button>
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}