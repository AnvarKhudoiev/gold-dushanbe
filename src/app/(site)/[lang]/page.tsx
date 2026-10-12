import { notFound } from "next/navigation";
import { fetchProducts, fetchSettings } from "@/lib/supabase";
import { SHOP, resolveShop } from "@/lib/config";
import { isLang } from "@/lib/i18n";
import Catalog from "@/components/Catalog";
import Cover from "@/components/Cover";
import Categories from "@/components/Categories";
import Trust from "@/components/Trust";
import Hero from "@/components/Hero";
import Dock from "@/components/Dock";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const [products, settings] = await Promise.all([fetchProducts(), fetchSettings()]);
  const shop = resolveShop(settings);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: shop.name,
    url: lang === "tj" ? `${SHOP.siteUrl}/tj` : SHOP.siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Душанбе", addressCountry: "TJ", streetAddress: SHOP.address },
    ...(shop.whatsapp ? { telephone: `+${shop.whatsapp}` } : {}),
  };
  return (
    <>
      <SiteHeader lang={lang} altPath="/" logoUrl={settings.logo_url} name={shop.name} address={SHOP.address} whatsapp={shop.whatsapp} />
      <main>
        <Hero lang={lang} heroUrl={settings.hero_url} heroMobileUrl={settings.hero_mobile_url ?? null} />
        <Categories products={products} lang={lang} images={settings.category_images} />
        <div id="catalog" />
        <Catalog products={products} lang={lang} whatsapp={shop.whatsapp} />
        <Cover lang={lang} settings={settings} />
        <Trust lang={lang} />
      </main>
      <SiteFooter whatsapp={shop.whatsapp} telegram={shop.telegram} lang={lang} name={shop.name} logoUrl={settings.logo_url} />
      <Dock current="shop" lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
