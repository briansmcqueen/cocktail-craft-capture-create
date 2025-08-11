-- Shopping list items for My Bar
-- 1) Create table
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ingredient_id TEXT NOT NULL,
  quantity TEXT,
  purchased BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes and constraints
CREATE UNIQUE INDEX IF NOT EXISTS uniq_shopping_item_user_ingredient ON public.shopping_list_items (user_id, ingredient_id) WHERE purchased = false;
CREATE INDEX IF NOT EXISTS idx_shopping_items_user ON public.shopping_list_items (user_id);

-- Timestamp trigger function already exists: public.update_updated_at_column()
DROP TRIGGER IF EXISTS trg_shopping_items_updated_at ON public.shopping_list_items;
CREATE TRIGGER trg_shopping_items_updated_at
BEFORE UPDATE ON public.shopping_list_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Enable RLS
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- 3) Policies: users manage only their own items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'shopping_list_items' AND policyname = 'Users can view their own shopping items'
  ) THEN
    CREATE POLICY "Users can view their own shopping items"
    ON public.shopping_list_items
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'shopping_list_items' AND policyname = 'Users can insert their own shopping items'
  ) THEN
    CREATE POLICY "Users can insert their own shopping items"
    ON public.shopping_list_items
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'shopping_list_items' AND policyname = 'Users can update their own shopping items'
  ) THEN
    CREATE POLICY "Users can update their own shopping items"
    ON public.shopping_list_items
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'shopping_list_items' AND policyname = 'Users can delete their own shopping items'
  ) THEN
    CREATE POLICY "Users can delete their own shopping items"
    ON public.shopping_list_items
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;