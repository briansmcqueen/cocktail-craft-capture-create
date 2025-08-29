import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';

// Input sanitization utilities
const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove < and > characters  
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*['"]/gi, '') // Remove event handlers
    .slice(0, maxLength)
    .trim();
};

const validateRecipeInput = (field: string, value: string): boolean => {
  switch (field) {
    case 'name':
      return value.length >= 3 && value.length <= 100;
    case 'description':
      return value.length <= 500;
    case 'instructions':
      return value.length >= 10 && value.length <= 5000;
    case 'notes':
      return value.length <= 1000;
    case 'origin':
      return value.length <= 100;
    default:
      return true;
  }
};

interface SecureRecipeFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function SecureRecipeForm({ initialData, onSave, onCancel }: SecureRecipeFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    notes: initialData?.notes || '',
    origin: initialData?.origin || '',
    tags: initialData?.tags || [],
    ingredients: initialData?.ingredients || [],
    isPrivate: !initialData?.is_public,
    imageUrl: initialData?.image_url || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSecureInputChange = useCallback((field: string, value: string) => {
    const sanitized = sanitizeInput(value, field === 'instructions' ? 5000 : 
                                    field === 'notes' ? 1000 : 
                                    field === 'description' ? 500 : 100);
    
    // Validate input
    if (!validateRecipeInput(field, sanitized)) {
      setErrors(prev => ({ ...prev, [field]: `Invalid ${field} format or length` }));
      return;
    }
    
    // Clear error if validation passes
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  }, []);

  const handleArrayInputChange = useCallback((field: string, value: string[]) => {
    // Sanitize each array item
    const sanitized = value.map(item => sanitizeInput(item, 50));
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const validationErrors: Record<string, string> = {};
    
    if (!validateRecipeInput('name', formData.name)) {
      validationErrors.name = 'Recipe name must be 3-100 characters';
    }
    
    if (!validateRecipeInput('instructions', formData.instructions)) {
      validationErrors.instructions = 'Instructions must be 10-5000 characters';
    }
    
    if (formData.ingredients.length === 0) {
      validationErrors.ingredients = 'At least one ingredient is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Rate limiting check could be added here
    onSave({
      ...formData,
      is_public: !formData.isPrivate,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {initialData ? 'Edit Recipe' : 'Create Recipe'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Recipe Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleSecureInputChange('name', e.target.value)}
            placeholder="Enter recipe name"
            maxLength={100}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleSecureInputChange('description', e.target.value)}
            placeholder="Describe your recipe"
            rows={3}
            maxLength={500}
            className={errors.description ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.description.length}/500 characters
          </p>
          {errors.description && (
            <p className="text-sm text-destructive mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <Label htmlFor="instructions">Instructions *</Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => handleSecureInputChange('instructions', e.target.value)}
            placeholder="Step-by-step instructions"
            rows={6}
            maxLength={5000}
            className={errors.instructions ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.instructions.length}/5000 characters
          </p>
          {errors.instructions && (
            <p className="text-sm text-destructive mt-1">{errors.instructions}</p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleSecureInputChange('notes', e.target.value)}
            placeholder="Additional notes or tips"
            rows={3}
            maxLength={1000}
            className={errors.notes ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.notes.length}/1000 characters
          </p>
        </div>

        <div>
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            value={formData.origin}
            onChange={(e) => handleSecureInputChange('origin', e.target.value)}
            placeholder="Recipe origin or source"
            maxLength={100}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="private"
            checked={formData.isPrivate}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, isPrivate: !!checked }))
            }
          />
          <Label htmlFor="private">Keep recipe private</Label>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {initialData ? 'Update Recipe' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </div>
  );
}