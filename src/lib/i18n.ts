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
  back: "← Весь каталог",
  cats: { Кольца: "Кольца", Серьги: "Серьги", Цепочки: "Цепочки", Браслеты: "Браслеты", Подвески: "Подвески" },
  msg: (name, price, purity, weight, url) =>
    `Здравствуйте! Интересует: ${name} (${money(price)})${purity ? `, проба ${purity}` : ""}${weight ? `, ${weight} г` : ""}. Есть в наличии? ${url}`,
  siteTitle: `${SHOP.name} — ювелирные изделия в Душанбе`,
  siteDesc: `${SHOP.name}: каталог золотых украшений в Душанбе. Кольца, серьги, цепочки, браслеты. Актуальное наличие, цены, вес и проба.`,
  productDesc: (p) =>
    `${p.name}, ${money(p.price)}${p.purity ? `, проба ${p.purity}` : ""}${p.weight ? `, ${p.weight} г` : ""}. ${p.in_stock ? "В наличии" : "Нет в наличии"}.`,
  langName: "RU",
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
  back: "← Тамоми каталог",
  cats: { Кольца: "Ангуштарин", Серьги: "Гӯшвор", Цепочки: "Занҷир", Браслеты: "Дастбанд", Подвески: "Овезон" },
  msg: (name, price, purity, weight, url) =>
    `Салом! Ба ман ин маҳсулот писанд омад: ${name} (${money(price)})${purity ? `, проба ${purity}` : ""}${weight ? `, ${weight} г` : ""}. Оё мавҷуд аст? ${url}`,
  siteTitle: `${SHOP.name} — ҷавоҳирот дар Душанбе`,
  siteDesc: `${SHOP.name}: каталоги маснуоти тилло дар Душанбе. Ангуштарин, гӯшвор, занҷир, дастбанд. Мавҷудияти навтарин, нарх, вазн ва проба.`,
  productDesc: (p) =>
    `${p.name_tj || p.name}, ${money(p.price)}${p.purity ? `, проба ${p.purity}` : ""}${p.weight ? `, ${p.weight} г` : ""}. ${p.in_stock ? "Мавҷуд аст" : "Мавҷуд нест"}.`,
  langName: "TJ",
};

export const T: Record<Lang, Dict> = { ru, tj };
