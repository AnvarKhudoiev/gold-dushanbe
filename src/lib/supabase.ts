import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let browserClient: SupabaseClient | null = null;

/** Клиент для браузера (админка): хранит сессию продавца. */
export function getBrowserClient(): SupabaseClient {
  if (!browserClient) browserClient = createClient(url, key);
  return browserClient;
}

/** Клиент для сервера (витрина): только чтение, без сессии. */
export function getServerClient(): SupabaseClient {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function fetchProducts() {
  const { data, error } = await getServerClient()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchProducts:", error.message);
    return [];
  }
  return (data ?? []).map(normalize);
}

export async function fetchProduct(id: string) {
  const { data, error } = await getServerClient().from("products").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("fetchProduct:", error.message);
    return null;
  }
  return data ? normalize(data) : null;
}

/** Подставляет значения по умолчанию, если миграция v2 ещё не выполнена. */
export function normalize(row: Record<string, unknown>): import("./types").Product {
  const r = row as unknown as import("./types").Product;
  return {
    ...r,
    condition: r.condition === "used" ? "used" : "new",
    parts: Array.isArray(r.parts) ? r.parts : null,
    sold_separately: r.sold_separately !== false,
  };
}

export async function fetchSettings(): Promise<import("./types").ShopSettings> {
  const empty = { logo_url: null, hero_url: null, hero_mobile_url: null, about: null, about_tj: null, shop_name: null, whatsapp: null, telegram: null, category_images: null };
  const { data, error } = await getServerClient().from("shop_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return empty;
  return {
    logo_url: data.logo_url ?? null,
    hero_url: data.hero_url ?? null,
    hero_mobile_url: data.hero_mobile_url ?? null,
    about: data.about ?? null,
    about_tj: data.about_tj ?? null,
    shop_name: data.shop_name ?? null,
    whatsapp: data.whatsapp ?? null,
    telegram: data.telegram ?? null,
    category_images: data.category_images ?? null,
  };
}
