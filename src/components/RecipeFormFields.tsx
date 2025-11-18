
import React, { useRef, ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Loader2, X } from "lucide-react";
import TagInput from "./TagInput";
import IngredientInput from "./IngredientInput";
import StepsInput from "./StepsInput";
import { uploadImage, getCompressedSize } from "@/services/imageUploadService";
import { toast } from "@/hooks/use-toast";

type RecipeFormFieldsProps = {
  name: string;
  setName: (value: string) => void;
  image: string;
  setImage: (value: string) => void;
  ingredients: string;
  setIngredients: (value: string) => void;
  steps: string;
  setSteps: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  origin: string;
  setOrigin: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  commonIngredients: string[];
  stepTemplates: string[];
};

export default function RecipeFormFields({
  name,
  setName,
  image,
  setImage,
  ingredients,
  setIngredients,
  steps,
  setSteps,
  notes,
  setNotes,
  origin,
  setOrigin,
  tags,
  setTags,
  isPrivate,
  setIsPrivate,
  commonIngredients,
  stepTemplates,
}: RecipeFormFieldsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress('Compressing image...');
    
    try {
      // Show compressed size estimate
      const compressedSize = await getCompressedSize(file);
      const compressionPercent = Math.round((1 - compressedSize / file.size) * 100);
      
      setUploadProgress(`Uploading (${compressionPercent}% smaller)...`);
      
      // Upload the image
      const imageUrl = await uploadImage(file);
      
      setImage(imageUrl);
      
      toast({
        title: "Image uploaded",
        description: `Image compressed and uploaded successfully`,
      });
      
      // Clear the input so the same file can be selected again if needed
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <div>
        <label className="font-medium mb-1 block text-pure-white">Recipe Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Espresso Martini"
          required
        />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">Image</label>
        <div className="flex items-center gap-3">
          {image && (
            <div className="relative">
              <img
                src={image}
                alt="Cocktail"
                className="h-16 w-16 object-cover rounded border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-error-red text-white rounded-full p-1 hover:bg-error-red/80 transition-colors shadow-md"
                disabled={uploading}
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {!image && uploading && (
            <div className="h-16 w-16 bg-medium-charcoal rounded flex flex-col items-center justify-center border border-light-charcoal">
              <Loader2 size={20} className="text-forest-green animate-spin" />
              <span className="text-[9px] text-soft-gray mt-1 text-center px-1">
                {uploadProgress.split(' ')[0]}
              </span>
            </div>
          )}
          {!image && !uploading && (
            <div 
              className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <Image size={24} className="text-gray-400" />
            </div>
          )}
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              variant="secondary"
              className="flex items-center gap-1 text-pure-white hover:text-pure-white hover:scale-[1.02] hover:rotate-[0.5deg] transition-all duration-300"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Image size={18} /> Upload Photo
                </>
              )}
            </Button>
            {!image && !uploading && (
              <span className="text-[10px] text-soft-gray">
                Max 10MB • Auto-compressed
              </span>
            )}
            {uploading && uploadProgress && (
              <span className="text-[10px] text-forest-green animate-pulse">
                {uploadProgress}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <IngredientInput
        value={ingredients}
        onChange={setIngredients}
        placeholder="2 oz Vodka&#10;1 oz Espresso&#10;1/2 oz Coffee Liqueur"
        commonIngredients={commonIngredients}
      />
      
      <StepsInput
        value={steps}
        onChange={setSteps}
        placeholder="Combine all ingredients in a shaker with ice. Shake well..."
        stepTemplates={stepTemplates}
      />
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">
          Tags <span className="text-xs text-light-text">(keywords, separated)</span>
        </label>
        <TagInput value={tags} onChange={setTags} />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">
          Notes <span className="text-xs text-light-text">(optional)</span>
        </label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Invented at Soho Brasserie, London, 1980s"
        />
      </div>
      
      <div>
        <label className="font-medium mb-1 block text-pure-white">
          Region / Origin <span className="text-xs text-light-text">(optional)</span>
        </label>
        <Input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. Italy"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPrivate"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
        />
        <label htmlFor="isPrivate" className="font-medium text-pure-white">
          Make this recipe private
          <span className="block text-xs text-light-text">Only you can see private recipes</span>
        </label>
      </div>
    </>
  );
}
