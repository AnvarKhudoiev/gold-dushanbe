import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/supabase";
import { SHOP } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();
  const home = (path: string) => ({
    changeFrequency: "daily" as const,
    priority: 1,
    alternates: { languages: { ru: SHOP.siteUrl + path, tg: `${SHOP.siteUrl}/tj${path}` } },
  });
  return [
    { url: SHOP.siteUrl, ...home("") },
    { url: `${SHOP.siteUrl}/tj`, ...home("") },
    ...products.flatMap((p) => {
      const alt = { languages: { ru: `${SHOP.siteUrl}/product/${p.id}`, tg: `${SHOP.siteUrl}/tj/product/${p.id}` } };
      return [
        { url: `${SHOP.siteUrl}/product/${p.id}`, lastModified: p.created_at, changeFrequency: "weekly" as const, priority: 0.7, alternates: alt },
        { url: `${SHOP.siteUrl}/tj/product/${p.id}`, lastModified: p.created_at, changeFrequency: "weekly" as const, priority: 0.7, alternates: alt },
      ];
    }),
  ];
}
