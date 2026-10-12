-- v3: ник Telegram в настройках магазина (редактируется в админке)
alter table public.shop_settings add column if not exists telegram text;
-- фото плиток категорий на главной (редактируются в админке): {"Кольца": "https://…", …}
alter table public.shop_settings add column if not exists category_images jsonb;
-- отдельное главное фото для телефона
alter table public.shop_settings add column if not exists hero_mobile_url text;
