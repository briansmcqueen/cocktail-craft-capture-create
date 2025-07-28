
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type IngredientInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  commonIngredients: string[];
};

export default function IngredientInput({
  value,
  onChange,
  placeholder,
  commonIngredients
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
        <label className="font-medium text-pure-white">
          Ingredients <span className="text-xs text-light-text">(one per line)</span>
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
          onClick={toggleQuickAdd}
        >
          Quick Add
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        required
        className="bg-white border-gray-300 text-gray-700"
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
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((ingredient, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
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
