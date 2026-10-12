export const SHOP = {
  name: process.env.NEXT_PUBLIC_SHOP_NAME || "gold.dushanbe",
  tagline: process.env.NEXT_PUBLIC_SHOP_TAGLINE || "Золото 585 и 750 · Душанбе",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, ""),
  telegram: (process.env.NEXT_PUBLIC_TELEGRAM || "").replace(/^@/, ""),
  address: process.env.NEXT_PUBLIC_ADDRESS || "Душанбе",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

export const CATEGORIES = ["Кольца", "Серьги", "Цепочки", "Браслеты", "Подвески", "Комплекты"] as const;
export const SET_CATEGORY = "Комплекты";
export const DEMO_DOCK = process.env.NEXT_PUBLIC_DEMO_DOCK === "1";
export const PURITIES = ["375", "500", "585", "750", "875", "925", "999"] as const;

export function money(n: number, lang: "ru" | "tj" = "ru"): string {
  return Number(n).toLocaleString("ru-RU") + (lang === "tj" ? " сомонӣ" : " сомони");
}

/** 992500509906 → +992 500-509-906 (если формат другой, просто с плюсом). */
export function fmtPhone(d: string): string {
  const m = d.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/);
  return m ? `+${m[1]} ${m[2]}-${m[3]}-${m[4]}` : d ? `+${d}` : "";
}

export function whatsappLink(text: string, number: string = SHOP.whatsapp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Название и WhatsApp: сначала из админки, иначе из переменных окружения. */
export function resolveShop(settings?: { shop_name?: string | null; whatsapp?: string | null; telegram?: string | null } | null) {
  return {
    name: settings?.shop_name?.trim() || SHOP.name,
    whatsapp: (settings?.whatsapp || "").replace(/\D/g, "") || SHOP.whatsapp,
    telegram: (settings?.telegram || "").trim().replace(/^(https?:\/\/)?(t\.me\/)?@?/i, "").replace(/\/.*$/, "") || SHOP.telegram,
  };
}
