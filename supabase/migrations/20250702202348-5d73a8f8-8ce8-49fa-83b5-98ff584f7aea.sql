-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user_ingredients table for "My Bar" inventory
CREATE TABLE public.user_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ingredient_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, ingredient_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own ingredients" 
ON public.user_ingredients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" 
ON public.user_ingredients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" 
ON public.user_ingredients 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_ingredients_updated_at
BEFORE UPDATE ON public.user_ingredients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();