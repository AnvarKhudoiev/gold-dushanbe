-- gold.dushanbe: схема базы. Выполни целиком в Supabase -> SQL Editor.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_tj text,
  category text not null,
  price numeric(12,2) not null check (price >= 0),
  weight numeric(8,2),
  purity text,
  description text,
  description_tj text,
  in_stock boolean not null default true,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists products_created_idx on public.products (created_at desc);

alter table public.products enable row level security;

-- Все могут читать товары (витрина)
drop policy if exists "products are public" on public.products;
create policy "products are public" on public.products
  for select using (true);

-- Менять товары может только вошедший продавец
drop policy if exists "seller inserts" on public.products;
create policy "seller inserts" on public.products
  for insert to authenticated with check (true);

drop policy if exists "seller updates" on public.products;
create policy "seller updates" on public.products
  for update to authenticated using (true) with check (true);

drop policy if exists "seller deletes" on public.products;
create policy "seller deletes" on public.products
  for delete to authenticated using (true);

-- Хранилище фото (публичное чтение, запись только продавцу)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "seller uploads photos" on storage.objects;
create policy "seller uploads photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'products');

drop policy if exists "seller updates photos" on storage.objects;
create policy "seller updates photos" on storage.objects
  for update to authenticated using (bucket_id = 'products');

drop policy if exists "seller deletes photos" on storage.objects;
create policy "seller deletes photos" on storage.objects
  for delete to authenticated using (bucket_id = 'products');
