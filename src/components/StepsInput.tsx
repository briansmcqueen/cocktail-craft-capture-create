
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type StepsInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  stepTemplates: string[];
  error?: string;
};

export default function StepsInput({
  value,
  onChange,
  placeholder,
  stepTemplates,
  error,
}: StepsInputProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        templatesRef.current &&
        !templatesRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowTemplates(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addStepTemplate = (template: string) => {
    onChange(template);
    setShowTemplates(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="recipe-steps" className="font-medium text-pure-white">
          Steps <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs bg-medium-charcoal text-light-text hover:bg-light-charcoal border-light-charcoal transition-all duration-300"
          onClick={() => setShowTemplates(!showTemplates)}
          aria-expanded={showTemplates}
          aria-controls="recipe-steps-templates"
        >
          Quick Add
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        id="recipe-steps"
        name="steps"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? "recipe-steps-error recipe-steps-hint" : "recipe-steps-hint"}
        maxLength={5000}
      />
      <p id="recipe-steps-hint" className="mt-1 text-xs text-light-text">
        10–5000 characters
      </p>
      {error && (
        <p id="recipe-steps-error" role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
      
      {showTemplates && (
        <div 
          ref={templatesRef}
          id="recipe-steps-templates"
          role="listbox"
          aria-label="Step templates"
          className="absolute z-50 mt-1 w-full bg-medium-charcoal border border-light-charcoal rounded-organic-sm shadow-lg max-h-48 overflow-y-auto"
        >
          {stepTemplates.map((template, i) => (
            <button
              key={i}
              type="button"
              role="option"
              aria-selected="false"
              className="w-full text-left px-3 py-2 text-sm hover:bg-light-charcoal transition-colors text-light-text border-b border-light-charcoal last:border-b-0"
              onClick={() => addStepTemplate(template)}
            >
              {template}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
