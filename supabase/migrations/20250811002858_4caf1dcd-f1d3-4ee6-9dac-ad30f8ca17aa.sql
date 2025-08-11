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

-- Create policies with duplicate-safe blocks
DO $$
BEGIN
  BEGIN
    CREATE POLICY "Users can view their own shopping items"
    ON public.shopping_list_items
    FOR SELECT
    USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Users can insert their own shopping items"
    ON public.shopping_list_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Users can update their own shopping items"
    ON public.shopping_list_items
    FOR UPDATE
    USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END;

  BEGIN
    CREATE POLICY "Users can delete their own shopping items"
    ON public.shopping_list_items
    FOR DELETE
    USING (auth.uid() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END$$;

-- Trigger for updated_at (duplicate-safe)
DO $$
BEGIN
  BEGIN
    CREATE TRIGGER trg_shopping_list_items_updated_at
    BEFORE UPDATE ON public.shopping_list_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END$$;