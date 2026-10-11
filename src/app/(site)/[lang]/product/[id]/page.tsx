import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProduct } from "@/lib/supabase";
import { SHOP, money, whatsappLink } from "@/lib/config";
import { T, isLang, pDesc, pName, prefix } from "@/lib/i18n";
import Photo from "@/components/Photo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang)) return {};
  const p = await fetchProduct(id);
  if (!p) return { title: lang === "tj" ? "Маҳсулот ёфт нашуд" : "Товар не найден" };
  const desc = T[lang].productDesc(p);
  const name = pName(p, lang);
  return {
    title: name,
    description: desc,
    alternates: {
      canonical: `${prefix(lang)}/product/${p.id}`,
      languages: { ru: `/product/${p.id}`, tg: `/tj/product/${p.id}`, "x-default": `/product/${p.id}` },
    },
    openGraph: { title: name, description: desc, images: p.image_url ? [p.image_url] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const p = await fetchProduct(id);
  if (!p) notFound();

  const t = T[lang];
  const name = pName(p, lang);
  const desc = pDesc(p, lang);
  const url = `${SHOP.siteUrl}${prefix(lang)}/product/${p.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: desc || name,
    ...(p.image_url ? { image: p.image_url } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "TJS",
      price: p.price,
      availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  };

  return (
    <>
      <SiteHeader lang={lang} altPath={`/product/${p.id}`} />
      <main className="product">
        <Photo p={p} lang={lang} />
        <div>
          <h1>{name}</h1>
          <div className="price">{money(p.price)}</div>
          <dl className="spec">
            <dt>{t.category}</dt>
            <dd>{t.cats[p.category] ?? p.category}</dd>
            {p.weight ? (<><dt>{t.weight}</dt><dd>{p.weight} {t.g}</dd></>) : null}
            {p.purity ? (<><dt>{t.purity}</dt><dd>{p.purity}</dd></>) : null}
            <dt>{t.availability}</dt>
            <dd>{p.in_stock ? t.inStock : t.outStock}</dd>
          </dl>
          {desc && <p>{desc}</p>}
          {SHOP.whatsapp && (
            <>
              <a className="btn" href={whatsappLink(t.msg(name, p.price, p.purity, p.weight, url))} target="_blank" rel="noopener">
                {t.wa}
              </a>
              <p className="hint">{t.waHint}</p>
            </>
          )}
          <Link href={prefix(lang) || "/"} className="back">{t.back}</Link>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
