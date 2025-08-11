-- Create shopping_list_items table (idempotent)
create table if not exists public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  ingredient_id text not null,
  quantity text null,
  purchased boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Useful indexes
create index if not exists idx_shopping_list_items_user on public.shopping_list_items(user_id);
create index if not exists idx_shopping_list_items_user_purchased on public.shopping_list_items(user_id, purchased);
create index if not exists idx_shopping_list_items_created_at on public.shopping_list_items(created_at desc);

-- Ensure only one active (unpurchased) row per user+ingredient
create unique index if not exists uniq_active_shopping_item
on public.shopping_list_items(user_id, ingredient_id)
where purchased = false;

-- Enable RLS
alter table public.shopping_list_items enable row level security;

-- Policies (idempotent via DO blocks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'shopping_list_items' 
      AND policyname = 'Users can view their own shopping items'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can view their own shopping items"
      ON public.shopping_list_items
      FOR SELECT
      USING (auth.uid() = user_id);
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'shopping_list_items' 
      AND policyname = 'Users can insert their own shopping items'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can insert their own shopping items"
      ON public.shopping_list_items
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'shopping_list_items' 
      AND policyname = 'Users can update their own shopping items'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can update their own shopping items"
      ON public.shopping_list_items
      FOR UPDATE
      USING (auth.uid() = user_id);
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'shopping_list_items' 
      AND policyname = 'Users can delete their own shopping items'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Users can delete their own shopping items"
      ON public.shopping_list_items
      FOR DELETE
      USING (auth.uid() = user_id);
    $$;
  END IF;
END$$;

-- Trigger for updated_at (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trg_shopping_list_items_updated_at' 
      AND tgrelid = 'public.shopping_list_items'::regclass
  ) THEN
    EXECUTE $$
      CREATE TRIGGER trg_shopping_list_items_updated_at
      BEFORE UPDATE ON public.shopping_list_items
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    $$;
  END IF;
END$$;