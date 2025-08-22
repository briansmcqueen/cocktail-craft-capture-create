-- Create user bar presets table for saving ingredient combinations
CREATE TABLE public.user_bar_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ingredient_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_bar_presets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own presets" 
ON public.user_bar_presets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presets" 
ON public.user_bar_presets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets" 
ON public.user_bar_presets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets" 
ON public.user_bar_presets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_user_bar_presets_updated_at
BEFORE UPDATE ON public.user_bar_presets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();