export type SetItem = {
  name: string;
  name_tj?: string | null;
  weight?: number | string | null;
  desc?: string | null;
  desc_tj?: string | null;
};

export type Product = {
  id: string;
  name: string;
  name_tj: string | null;
  category: string;
  price: number;
  weight: number | null;
  purity: string | null;
  description: string | null;
  description_tj: string | null;
  in_stock: boolean;
  image_url: string | null;
  created_at: string;
  /** "new" — новое, "used" — б/у (выкуплено у клиента) */
  condition: "new" | "used";
  /** Состав комплекта (только для категории «Комплекты») */
  parts: SetItem[] | null;
  /** Можно ли купить части комплекта по отдельности */
  sold_separately: boolean;
};

export type ShopSettings = {
  logo_url: string | null;
  hero_url: string | null;
  /** Главное фото для телефона (если нет — берётся hero_url) */
  hero_mobile_url?: string | null;
  /** Описание магазина на главном экране (русский и таджикский) */
  about: string | null;
  about_tj: string | null;
  /** Название и WhatsApp из админки (если пусто, берутся из переменных окружения) */
  shop_name: string | null;
  whatsapp: string | null;
  /** Ник Telegram без @ (из админки; если пусто, из NEXT_PUBLIC_TELEGRAM) */
  telegram: string | null;
  /** Свои фото плиток категорий: { "Кольца": "https://…" } */
  category_images: Record<string, string> | null;
};
