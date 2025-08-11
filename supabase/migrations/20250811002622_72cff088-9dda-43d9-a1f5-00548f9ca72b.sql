-- Create shopping_list_items table
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

-- Policies
create policy if not exists "Users can view their own shopping items"
  on public.shopping_list_items for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own shopping items"
  on public.shopping_list_items for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own shopping items"
  on public.shopping_list_items for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own shopping items"
  on public.shopping_list_items for delete
  using (auth.uid() = user_id);

-- Update updated_at on change
create trigger if not exists trg_shopping_list_items_updated_at
before update on public.shopping_list_items
for each row execute function public.update_updated_at_column();