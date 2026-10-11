-- Миграция v2: состояние (новое/б/у), комплекты, логотип и главное фото.
-- Выполни целиком в Supabase -> SQL Editor (если базу уже создавал раньше). Можно запускать повторно.

alter table public.products add column if not exists condition text not null default 'new';
alter table public.products add column if not exists parts jsonb;
alter table public.products add column if not exists sold_separately boolean not null default true;

do $$ begin
  alter table public.products add constraint products_condition_check check (condition in ('new','used'));
exception when duplicate_object then null; end $$;

create table if not exists public.shop_settings (
  id int primary key default 1 check (id = 1),
  logo_url text,
  hero_url text
);
insert into public.shop_settings (id) values (1) on conflict (id) do nothing;
alter table public.shop_settings enable row level security;

drop policy if exists "settings are public" on public.shop_settings;
create policy "settings are public" on public.shop_settings for select using (true);
drop policy if exists "seller inserts settings" on public.shop_settings;
create policy "seller inserts settings" on public.shop_settings for insert to authenticated with check (true);
drop policy if exists "seller updates settings" on public.shop_settings;
create policy "seller updates settings" on public.shop_settings for update to authenticated using (true) with check (true);

notify pgrst, 'reload schema';
