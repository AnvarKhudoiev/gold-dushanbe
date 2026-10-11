import { SHOP, money } from "./config";
import type { Product } from "./types";

export type Lang = "ru" | "tj";
export const LANGS: Lang[] = ["ru", "tj"];

export function isLang(x: string): x is Lang {
  return x === "ru" || x === "tj";
}

/** Русский живёт на «/», таджикский на «/tj». */
export function prefix(lang: Lang): string {
  return lang === "tj" ? "/tj" : "";
}

export function htmlLang(lang: Lang): string {
  return lang === "tj" ? "tg" : "ru";
}

export function pName(p: Product, lang: Lang): string {
  return lang === "tj" && p.name_tj ? p.name_tj : p.name;
}

export function pDesc(p: Product, lang: Lang): string | null {
  return lang === "tj" && p.description_tj ? p.description_tj : p.description;
}

type Dict = {
  tagline: string;
  all: string;
  search: string;
  onlyStock: string;
  found: (n: number) => string;
  emptyNone: string;
  emptyFilter: string;
  inStock: string;
  outStock: string;
  category: string;
  weight: string;
  purity: string;
  availability: string;
  g: string;
  wa: string;
  waHint: string;
  back: string;
  cats: Record<string, string>;
  msg: (name: string, price: number, purity: string | null, weight: number | null, url: string) => string;
  siteTitle: string;
  siteDesc: string;
  productDesc: (p: Product) => string;
  langName: string;
  eyebrow: string;
  hero: string;
  heroSub: string;
  cta: string;
  call: string;
  catTitle: string;
  filt: string;
  home: string;
  menu: string;
  annMid: string;
  sort: string;
  sDef: string;
  sAsc: string;
  sDesc: string;
  favs: string;
  cNew: string;
  cUsed: string;
  cNewTag: string;
  cUsedTag: string;
  condLabel: string;
  saleLabel: string;
  sepYes: string;
  sepNo: string;
  inSet: string;
  backShort: string;
  themeDark: string;
  themeLight: string;
  dockShop: string;
  dockAdmin: string;
  note: string;
  aboutTitle: string;
  f1t: string;
  f1d: string;
  f2t: string;
  f2d: string;
  f3t: string;
  f3d: string;
};

const ru: Dict = {
  tagline: SHOP.tagline,
  all: "Все",
  search: "Поиск",
  onlyStock: "Только в наличии",
  found: (n) => `Найдено: ${n}`,
  emptyNone: "Товары скоро появятся.",
  emptyFilter: "Ничего не найдено. Сбросьте фильтры.",
  inStock: "В наличии",
  outStock: "Нет в наличии",
  category: "Категория",
  weight: "Вес",
  purity: "Проба",
  availability: "Наличие",
  g: "г",
  wa: "Написать в WhatsApp",
  waHint: "Откроется чат с готовым сообщением о товаре.",
  back: "Весь каталог",
  cats: { Кольца: "Кольца", Серьги: "Серьги", Цепочки: "Цепочки", Браслеты: "Браслеты", Подвески: "Подвески", Комплекты: "Комплекты" },
  msg: (name, price, purity, weight, url) =>
    `Здравствуйте! Интересует: ${name} (${money(price)})${purity ? `, проба ${purity}` : ""}${weight ? `, ${weight} г` : ""}. Есть в наличии? ${url}`,
  siteTitle: `${SHOP.name} — ювелирные изделия в Душанбе`,
  siteDesc: `${SHOP.name}: каталог золотых украшений в Душанбе. Кольца, серьги, цепочки, браслеты. Актуальное наличие, цены, вес и проба.`,
  productDesc: (p) =>
    `${p.name}, ${money(p.price)}${p.purity ? `, проба ${p.purity}` : ""}${p.weight ? `, ${p.weight} г` : ""}. ${p.in_stock ? "В наличии" : "Нет в наличии"}.`,
  langName: "RU",
  eyebrow: "Коллекция · Душанбе",
  hero: "Украшения из золота",
  heroSub: "Актуальное наличие, цены и вес. Выберите украшение и напишите нам в WhatsApp.",
  cta: "Смотреть коллекцию",
  call: "Позвонить",
  catTitle: "Каталог",
  filt: "Фильтры",
  home: "Главная",
  menu: "Меню",
  annMid: "Актуальное наличие · заказ в WhatsApp",
  sort: "Сортировка",
  sDef: "По умолчанию",
  sAsc: "Цена: по возрастанию",
  sDesc: "Цена: по убыванию",
  favs: "Избранное",
  cNew: "Новые",
  cUsed: "Б/у · выкуплено",
  cNewTag: "Новинка",
  cUsedTag: "Б/у",
  condLabel: "Состояние",
  saleLabel: "Продажа",
  sepYes: "Можно по отдельности",
  sepNo: "Только комплектом",
  inSet: "Что в комплекте",
  backShort: "Назад",
  themeDark: "Тёмная тема",
  themeLight: "Светлая тема",
  dockShop: "Витрина",
  dockAdmin: "Продавец",
  note: "",
  aboutTitle: "О магазине",
  f1t: "Проба 585 и 750",
  f1d: "Проба и вес указаны в каждой карточке",
  f2t: "Актуальное наличие",
  f2d: "Сразу видно, что есть в магазине",
  f3t: "Заказ в WhatsApp",
  f3d: "Откроется чат с готовым сообщением",
};

const tj: Dict = {
  tagline: process.env.NEXT_PUBLIC_SHOP_TAGLINE_TJ || "Тиллои 585 ва 750 · Душанбе",
  all: "Ҳама",
  search: "Ҷустуҷӯ",
  onlyStock: "Танҳо мавҷуд",
  found: (n) => `Ёфт шуд: ${n}`,
  emptyNone: "Ба наздикӣ маҳсулот илова мешавад.",
  emptyFilter: "Чизе ёфт нашуд. Филтрҳоро тоза кунед.",
  inStock: "Мавҷуд аст",
  outStock: "Мавҷуд нест",
  category: "Категория",
  weight: "Вазн",
  purity: "Проба",
  availability: "Мавҷудият",
  g: "г",
  wa: "Дар WhatsApp нависед",
  waHint: "Чат бо паёми тайёр дар бораи маҳсулот кушода мешавад.",
  back: "Тамоми каталог",
  cats: { Кольца: "Ангуштарин", Серьги: "Гӯшвор", Цепочки: "Занҷир", Браслеты: "Дастбанд", Подвески: "Овезон", Комплекты: "Маҷмӯа" },
  msg: (name, price, purity, weight, url) =>
    `Салом! Ба ман ин маҳсулот писанд омад: ${name} (${money(price)})${purity ? `, проба ${purity}` : ""}${weight ? `, ${weight} г` : ""}. Оё мавҷуд аст? ${url}`,
  siteTitle: `${SHOP.name} — ҷавоҳирот дар Душанбе`,
  siteDesc: `${SHOP.name}: каталоги маснуоти тилло дар Душанбе. Ангуштарин, гӯшвор, занҷир, дастбанд. Мавҷудияти навтарин, нарх, вазн ва проба.`,
  productDesc: (p) =>
    `${p.name_tj || p.name}, ${money(p.price)}${p.purity ? `, проба ${p.purity}` : ""}${p.weight ? `, ${p.weight} г` : ""}. ${p.in_stock ? "Мавҷуд аст" : "Мавҷуд нест"}.`,
  langName: "TJ",
  eyebrow: "Коллексия · Душанбе",
  hero: "Маснуоти тилло",
  heroSub: "Мавҷудияти ҳозира, нарх ва вазн. Маснуотро интихоб кунед ва дар WhatsApp нависед.",
  cta: "Дидани коллексия",
  call: "Занг задан",
  catTitle: "Каталог",
  filt: "Филтрҳо",
  home: "Асосӣ",
  menu: "Феҳрист",
  annMid: "Мавҷудияти ҳозира · фармоиш дар WhatsApp",
  sort: "Мураттабсозӣ",
  sDef: "Одатӣ",
  sAsc: "Нарх: аз арзон",
  sDesc: "Нарх: аз гарон",
  favs: "Писандидаҳо",
  cNew: "Нав",
  cUsed: "Истифодашуда · харидорӣ",
  cNewTag: "Нав",
  cUsedTag: "Истифодашуда",
  condLabel: "Ҳолат",
  saleLabel: "Фурӯш",
  sepYes: "Ҷудо ҳам мумкин",
  sepNo: "Танҳо маҷмӯъ",
  inSet: "Дар маҷмӯа чӣ ҳаст",
  backShort: "Бозгашт",
  themeDark: "Мавзӯи торик",
  themeLight: "Мавзӯи равшан",
  dockShop: "Витрина",
  dockAdmin: "Фурӯшанда",
  note: "",
  aboutTitle: "Дар бораи мағоза",
  f1t: "Проба 585 ва 750",
  f1d: "Проба ва вазн дар ҳар корт нишон дода шудааст",
  f2t: "Мавҷудияти ҳозира",
  f2d: "Фавран мебинед, ки дар мағоза чӣ ҳаст",
  f3t: "Фармоиш дар WhatsApp",
  f3d: "Чат бо паёми тайёр кушода мешавад",
};

export const T: Record<Lang, Dict> = { ru, tj };

export function itemName(it: import("./types").SetItem, lang: Lang): string {
  return lang === "tj" && it.name_tj ? it.name_tj : it.name;
}

export function itemDesc(it: import("./types").SetItem, lang: Lang): string | null | undefined {
  return lang === "tj" && it.desc_tj ? it.desc_tj : it.desc;
}
