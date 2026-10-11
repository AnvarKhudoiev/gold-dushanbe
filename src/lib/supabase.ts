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
  return (data ?? []) as import("./types").Product[];
}

export async function fetchProduct(id: string) {
  const { data, error } = await getServerClient().from("products").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("fetchProduct:", error.message);
    return null;
  }
  return (data ?? null) as import("./types").Product | null;
}
