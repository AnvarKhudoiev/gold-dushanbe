-- Если базу ты уже создал раньше: добавь поля для таджикской версии.
-- Выполни в Supabase -> SQL Editor. Можно запускать повторно.
alter table public.products add column if not exists name_tj text;
alter table public.products add column if not exists description_tj text;
