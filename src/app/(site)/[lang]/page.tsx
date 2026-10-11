import { notFound } from "next/navigation";
import { fetchProducts } from "@/lib/supabase";
import { SHOP } from "@/lib/config";
import { isLang } from "@/lib/i18n";
import Catalog from "@/components/Catalog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const products = await fetchProducts();
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
      <SiteHeader lang={lang} altPath="/" />
      <main>
        <Catalog products={products} lang={lang} />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
