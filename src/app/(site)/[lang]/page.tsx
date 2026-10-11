import { notFound } from "next/navigation";
import { fetchProducts, fetchSettings } from "@/lib/supabase";
import { SHOP } from "@/lib/config";
import { isLang } from "@/lib/i18n";
import Catalog from "@/components/Catalog";
import Cover from "@/components/Cover";
import Dock from "@/components/Dock";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const [products, settings] = await Promise.all([fetchProducts(), fetchSettings()]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: SHOP.name,
    url: lang === "tj" ? `${SHOP.siteUrl}/tj` : SHOP.siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Душанбе", addressCountry: "TJ", streetAddress: SHOP.address },
    ...(SHOP.whatsapp ? { telephone: `+${SHOP.whatsapp}` } : {}),
  };
  return (
    <>
      <SiteHeader lang={lang} altPath="/" logoUrl={settings.logo_url} />
      <main>
        <Cover lang={lang} heroUrl={settings.hero_url} />
        <Catalog products={products} lang={lang} />
      </main>
      <SiteFooter />
      <Dock current="shop" lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
