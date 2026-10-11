import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProduct, fetchSettings } from "@/lib/supabase";
import { SET_CATEGORY, SHOP, money, whatsappLink } from "@/lib/config";
import { T, isLang, itemDesc, itemName, pDesc, pName, prefix } from "@/lib/i18n";
import Photo from "@/components/Photo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Dock from "@/components/Dock";

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
  const [p, settings] = await Promise.all([fetchProduct(id), fetchSettings()]);
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

  const isSet = p.category === SET_CATEGORY;
  const used = p.condition === "used";
  return (
    <>
      <SiteHeader lang={lang} altPath={`/product/${p.id}`} logoUrl={settings.logo_url} />
      <div className="crumb">
        <Link href={prefix(lang) || "/"} className="link back">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6H1M6 1L1 6l5 5" />
          </svg>
          <span>{t.backShort}</span>
        </Link>
      </div>
      <main className="product">
        <Photo p={p} lang={lang} />
        <div>
          <div className="eyebrow">{t.cats[p.category] ?? p.category}</div>
          <h1>{name}</h1>
          <div className="pr">{money(p.price)}</div>
          <dl className="spec">
            {p.weight ? (<div><dt>{t.weight}</dt><dd>{p.weight} {t.g}</dd></div>) : null}
            {p.purity ? (<div><dt>{t.purity}</dt><dd>{p.purity}</dd></div>) : null}
            {isSet && (<div><dt>{t.saleLabel}</dt><dd>{p.sold_separately ? t.sepYes : t.sepNo}</dd></div>)}
            <div><dt>{t.condLabel}</dt><dd>{used ? t.cUsed : t.cNew}</dd></div>
            <div><dt>{t.availability}</dt><dd>{p.in_stock ? t.inStock : t.outStock}</dd></div>
          </dl>
          {desc && <p>{desc}</p>}
          {isSet && p.parts && p.parts.length > 0 && (
            <div className="parts">
              <div className="eyebrow">{t.inSet}</div>
              {p.parts.map((it, i) => {
                const d = itemDesc(it, lang);
                return (
                  <div className="pt" key={i}>
                    <div className="pt-h">
                      <span>{itemName(it, lang)}</span>
                      {it.weight ? <em>{it.weight} {t.g}</em> : null}
                    </div>
                    {d && <p>{d}</p>}
                  </div>
                );
              })}
            </div>
          )}
          {SHOP.whatsapp && (
            <>
              <a className="btn" href={whatsappLink(t.msg(name, p.price, p.purity, p.weight, url))} target="_blank" rel="noopener" style={{ marginTop: 22 }}>
                {t.wa}
              </a>
              <p className="hint" style={{ marginTop: 12 }}>{t.waHint}</p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
      <Dock current="shop" lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
