import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UseRecipeScalingReturn } from "@/hooks/useRecipeScaling";

interface RecipeScalingProps {
  scaling: UseRecipeScalingReturn;
  className?: string;
}

export default function RecipeScaling({ scaling, className = "" }: RecipeScalingProps) {
  const [inputValue, setInputValue] = useState(scaling.currentServings.toString());
  
  const {
    currentServings,
    setServings,
    resetScaling,
    canScaleUp,
    canScaleDown,
    isScaled,
    scalingConfig,
    scaledRecipe
  } = scaling;
  
  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setServings(numValue);
    }
  };
  
  const handleIncrement = () => {
    if (canScaleUp) {
      const newValue = currentServings + 1;
      setServings(newValue);
      setInputValue(newValue.toString());
    }
  };
  
  const handleDecrement = () => {
    if (canScaleDown) {
      const newValue = currentServings - 1;
      setServings(newValue);
      setInputValue(newValue.toString());
    }
  };
  
  const handleReset = () => {
    resetScaling();
    setInputValue(scalingConfig.defaultServings.toString());
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Scaling Controls */}
      <div className="flex items-center gap-3 p-4 bg-medium-charcoal rounded-organic-sm border border-light-charcoal">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-light-text">Servings:</span>
            {isScaled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-6 px-2 text-xs text-soft-gray hover:text-pure-white"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={!canScaleDown}
              className="h-8 w-8 p-0 rounded-organic-sm"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              min={scalingConfig.minServings}
              max={scalingConfig.maxServings}
              className="w-16 h-8 text-center rounded-organic-sm"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              disabled={!canScaleUp}
              className="h-8 w-8 p-0 rounded-organic-sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-soft-gray mt-1">
            Range: {scalingConfig.minServings}-{scalingConfig.maxServings} servings
          </div>
        </div>
        
        {isScaled && (
          <div className="text-right">
            <div className="text-sm font-medium text-emerald">
              {currentServings}x Recipe
            </div>
            <div className="text-xs text-soft-gray">
              Original: {scalingConfig.defaultServings} serving{scalingConfig.defaultServings !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
      
      {/* Scaling Warnings */}
      {scaledRecipe.scalingWarnings.length > 0 && (
        <Alert className="bg-golden-amber/10 border-golden-amber/30">
          <AlertDescription className="text-sm">
            <div className="font-medium text-golden-amber mb-1">Scaling Notes:</div>
            <ul className="list-disc list-inside space-y-1 text-light-text">
              {scaledRecipe.scalingWarnings.map((warning, index) => (
                <li key={index} className="text-xs">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Batch Size Suggestions */}
      {currentServings >= 8 && (
        <Alert className="bg-primary/10 border-primary/30">
          <AlertDescription className="text-sm text-light-text">
            <div className="font-medium text-emerald mb-1">Large Batch Tips:</div>
            <div className="text-xs space-y-1">
              <div>• Consider pre-batching in a pitcher</div>
              <div>• Adjust ice and dilution for batch mixing</div>
              <div>• Garnish individual servings as needed</div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}