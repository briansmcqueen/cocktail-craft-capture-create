
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { parseIngredientLine } from "@/utils/ingredientParser";

type IngredientInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  commonIngredients: string[];
  error?: string;
};

export default function IngredientInput({
  value,
  onChange,
  placeholder,
  commonIngredients,
  error,
}: IngredientInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    const lines = newValue.split('\n');
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const currentLineIndex = textBeforeCursor.split('\n').length - 1;
    const currentLineText = lines[currentLineIndex] || "";
    
    setCurrentLine(currentLineText);
    
    if (currentLineText.trim().length > 0) {
      const filtered = commonIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(currentLineText.toLowerCase()) &&
        !lines.includes(ingredient)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Normalize all ingredient lines on blur
    const lines = value.split('\n');
    const normalizedLines = lines.map(line => line.trim() ? parseIngredientLine(line) : line);
    const normalizedValue = normalizedLines.join('\n');
    
    if (normalizedValue !== value) {
      onChange(normalizedValue);
    }
  };

  const addIngredient = (ingredient: string) => {
    const lines = value.split('\n');
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const currentLineIndex = textBeforeCursor.split('\n').length - 1;
    
    lines[currentLineIndex] = ingredient;
    onChange(lines.join('\n'));
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const toggleQuickAdd = () => {
    setShowSuggestions(!showSuggestions);
    if (!showSuggestions) {
      setFilteredSuggestions(commonIngredients);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="recipe-ingredients" className="font-medium text-pure-white">
          Ingredients <span className="text-destructive" aria-hidden="true">*</span> <span className="text-xs text-light-text">(one per line)</span>
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs bg-medium-charcoal text-light-text hover:bg-light-charcoal border-light-charcoal transition-all duration-300"
          onClick={toggleQuickAdd}
          aria-expanded={showSuggestions}
          aria-controls="recipe-ingredients-suggestions"
        >
          Quick Add
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        id="recipe-ingredients"
        name="ingredients"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        required
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? "recipe-ingredients-error recipe-ingredients-hint" : "recipe-ingredients-hint"}
        aria-autocomplete="list"
        aria-controls="recipe-ingredients-suggestions"
        onFocus={() => {
          if (currentLine.trim().length > 0) {
            const filtered = commonIngredients.filter(ingredient =>
              ingredient.toLowerCase().includes(currentLine.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
          }
        }}
      />
      <p id="recipe-ingredients-hint" className="mt-1 text-xs text-light-text">
        Enter one ingredient per line, e.g. "2 oz Vodka"
      </p>
      {error && (
        <p id="recipe-ingredients-error" role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          id="recipe-ingredients-suggestions"
          role="listbox"
          aria-label="Ingredient suggestions"
          className="absolute z-50 mt-1 w-full bg-medium-charcoal border border-light-charcoal rounded-organic-sm shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((ingredient, i) => (
            <button
              key={i}
              type="button"
              role="option"
              aria-selected="false"
              className="w-full text-left px-3 py-2 text-sm hover:bg-light-charcoal transition-colors text-light-text border-b border-light-charcoal last:border-b-0"
              onClick={() => addIngredient(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
