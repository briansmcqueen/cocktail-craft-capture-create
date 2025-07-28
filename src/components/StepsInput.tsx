
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
          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
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
        className="bg-white border-gray-300 text-gray-700"
      />
      
      {showTemplates && (
        <div 
          ref={templatesRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {stepTemplates.map((template, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100 last:border-b-0"
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
