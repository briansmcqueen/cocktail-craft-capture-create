
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type StepsInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  stepTemplates: string[];
};

export default function StepsInput({
  value,
  onChange,
  placeholder,
  stepTemplates
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
        <label className="font-medium text-pure-white">Steps</label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs bg-medium-charcoal text-light-text hover:bg-light-charcoal border-light-charcoal transition-all duration-300"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          Quick Add
        </Button>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
      
      {showTemplates && (
        <div 
          ref={templatesRef}
          className="absolute z-50 mt-1 w-full bg-medium-charcoal border border-light-charcoal rounded-organic-sm shadow-lg max-h-48 overflow-y-auto"
        >
          {stepTemplates.map((template, i) => (
            <button
              key={i}
              type="button"
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
