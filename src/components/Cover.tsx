import { T, type Lang } from "@/lib/i18n";
import { SHOP, resolveShop } from "@/lib/config";
import type { ShopSettings } from "@/lib/types";

const svg = { fill: "none", stroke: "currentColor", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Блок «О магазине» под каталогом, над синей полосой. */
export default function Cover({ lang, settings }: { lang: Lang; settings: ShopSettings }) {
  const t = T[lang];
  const shop = resolveShop(settings);
  const about = (lang === "tj" && settings.about_tj ? settings.about_tj : settings.about)?.trim() || t.heroSub;
  return (
    <div className="wrap">
      <section className="about">
        <div className="eyebrow c">{t.aboutTitle}</div>
        <p className="lead">{about}</p>
        <div className="addr">
          <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.8" style={{ flex: "none" }} {...svg} aria-hidden="true">
            <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span>{SHOP.address}</span>
        </div>
        <div className="abtn">
          {shop.whatsapp && (
            <a className="btn" href={`https://wa.me/${shop.whatsapp}`} target="_blank" rel="noopener">
              {t.wa}
            </a>
          )}
          {shop.telegram && (
            <a className="btn ghost" href={`https://t.me/${shop.telegram}`} target="_blank" rel="noopener">
              Telegram
            </a>
          )}
          {shop.whatsapp && (
            <a className="btn ghost" href={`tel:+${shop.whatsapp}`}>
              {t.call}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
