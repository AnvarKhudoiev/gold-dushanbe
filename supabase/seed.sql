-- Пример данных (кольца, серьги, цепочки и т.д.) без фото, чтобы сразу увидеть витрину.
-- Выполни в Supabase -> SQL Editor. Потом удали ненужное в /admin.
insert into public.products (name, name_tj, category, price, weight, purity, description, description_tj, in_stock, condition) values
('Кольцо с топазом','Ангуштарини топаздор','Кольца',3850,3.4,'585','Классическое кольцо из жёлтого золота с огранённым топазом. Размеры 16–19.','Ангуштарини классикии тиллои зард бо топази тарошида. Андозаҳо 16–19.',true,'new'),
('Кольцо-дорожка','Ангуштарини сангдор','Кольца',2900,2.6,'585','Тонкое кольцо с россыпью фианитов, подходит для ежедневной носки.','Ангуштарини борик бо фианитҳо, барои пӯшидани ҳаррӯза мувофиқ аст.',false,'used'),
('Серьги-капли','Гӯшвори қатрагӣ','Серьги',2150,2.1,'585','Лёгкие серьги-капли на английской застёжке.','Гӯшвори сабуки қатрагӣ бо қуфли англисӣ.',true,'new'),
('Серьги с рубином','Гӯшвор бо ёқут','Серьги',6400,4.8,'750','Серьги-пусеты с синтетическим рубином, золото 750.','Гӯшвори пусет бо ёқути сунъӣ, тилло 750.',true,'new'),
('Цепочка «Бисмарк»','Занҷири «Бисмарк»','Цепочки',7200,9.5,'585','Плотное плетение «Бисмарк», длина 50 см.','Бофти зичи «Бисмарк», дарозӣ 50 см.',true,'new'),
('Цепочка «Якорь»','Занҷири «Лангар»','Цепочки',4100,5.2,'585','Тонкая цепочка плетения «Якорь», длина 45 см.','Занҷири борики бофти «Лангар», дарозӣ 45 см.',false,'used'),
('Браслет «Панцирь»','Дастбанди «Панцир»','Браслеты',5300,6.9,'585','Мужской и женский браслет плетения «Панцирь», длина 20 см.','Дастбанди мардона ва занона бо бофти «Панцир», дарозӣ 20 см.',true,'used'),
('Подвеска-сердце','Овезони дилшакл','Подвески',1850,1.7,'585','Небольшая подвеска-сердце, подходит как подарок.','Овезони хурди дилшакл, барои тӯҳфа мувофиқ аст.',true,'new'),
('Комплект «Классика»','Маҷмӯаи «Классика»','Комплекты',9800,8.9,'585','Кольцо, серьги и подвеска в одном стиле с топазами. Можно купить по отдельности.','Ангуштарин, гӯшвор ва овезон дар як услуб бо топазҳо. Ҷудо ҳам харидан мумкин.',true,'new'),
('Свадебный комплект','Маҷмӯаи тӯйона','Комплекты',7600,7.2,'585','Парный комплект: кольцо и серьги. Продаётся только вместе.','Маҷмӯаи ҷуфт: ангуштарин ва гӯшвор. Танҳо якҷоя фурӯхта мешавад.',true,'used');

update public.products set sold_separately = true, parts = '[
 {"name":"Кольцо с топазом","name_tj":"Ангуштарин бо топаз","weight":3.4,"desc":"Жёлтое золото 585, огранённый топаз, размеры 16–19.","desc_tj":"Тиллои зард 585, топази тарошида, андозаҳо 16–19."},
 {"name":"Серьги с топазом","name_tj":"Гӯшвор бо топаз","weight":3.2,"desc":"Серьги-пусеты с топазами, английская застёжка.","desc_tj":"Гӯшвори пусет бо топаз, қуфли англисӣ."},
 {"name":"Подвеска с топазом","name_tj":"Овезон бо топаз","weight":2.3,"desc":"Подвеска на цепочке 45 см, цепочка входит в комплект.","desc_tj":"Овезон бо занҷири 45 см, занҷир дохил аст."}
]'::jsonb where name = 'Комплект «Классика»';

update public.products set sold_separately = false, parts = '[
 {"name":"Кольцо","name_tj":"Ангуштарин","weight":3.8,"desc":"Гладкое обручальное кольцо, ширина 4 мм.","desc_tj":"Ангуштарини ҳамвор, паҳнӣ 4 мм."},
 {"name":"Серьги","name_tj":"Гӯшвор","weight":3.4,"desc":"Серьги-кольца небольшого диаметра в тон кольцу.","desc_tj":"Гӯшвори ҳалқагии хурд, ҳамранги ангуштарин."}
]'::jsonb where name = 'Свадебный комплект';

-- Демо-фото (Unsplash, свободная лицензия). Продавец заменит их своими в админке.
update public.products set image_url = 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=800&q=70' where name = 'Кольцо с топазом' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=70' where name = 'Кольцо-дорожка' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1708220040828-9ab1673681d3?auto=format&fit=crop&w=800&q=70' where name = 'Серьги-капли' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1653227907864-560dce4c252d?auto=format&fit=crop&w=800&q=70' where name = 'Серьги с рубином' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=800&q=70' where name = 'Цепочка «Бисмарк»' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1651160670627-2896ddf7822f?auto=format&fit=crop&w=800&q=70' where name = 'Цепочка «Якорь»' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=70' where name = 'Браслет «Панцирь»' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1685970731194-e27b477e87ba?auto=format&fit=crop&w=800&q=70' where name = 'Подвеска-сердце' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1722410180687-b05b50922362?auto=format&fit=crop&w=800&q=70' where name = 'Комплект «Классика»' and image_url is null;
update public.products set image_url = 'https://images.unsplash.com/photo-1628926379972-9843ad139a8c?auto=format&fit=crop&w=800&q=70' where name = 'Свадебный комплект' and image_url is null;
