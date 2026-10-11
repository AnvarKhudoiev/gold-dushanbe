import { T, type Lang } from "@/lib/i18n";
import { SHOP, resolveShop } from "@/lib/config";
import type { ShopSettings } from "@/lib/types";
import { CoverArt } from "./Art";

const svg = { fill: "none", stroke: "currentColor", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Вход на сайт: сначала фото магазина, затем блок «О магазине», затем каталог. */
export default function Cover({ lang, settings }: { lang: Lang; settings: ShopSettings }) {
  const t = T[lang];
  const shop = resolveShop(settings);
  const heroUrl = settings.hero_url;
  const about = (lang === "tj" && settings.about_tj ? settings.about_tj : settings.about)?.trim() || t.heroSub;
  return (
    <>
      <section className={"cover" + (heroUrl ? "" : " plain")}>
        {heroUrl ? (
          <div className="bg" style={{ backgroundImage: `url(${heroUrl})` }} />
        ) : (
          <div className="cart">
            <CoverArt />
          </div>
        )}
        <div className="cover-in">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{shop.name}</h1>
        </div>
      </section>

      <section className="about">
        <div className="ab-main">
          <div className="eyebrow">{t.aboutTitle}</div>
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
            {shop.whatsapp && (
              <a className="btn ghost" href={`tel:+${shop.whatsapp}`}>
                {t.call}
              </a>
            )}
            <a className="btn ghost" href="#catalog">
              {t.cta}
            </a>
          </div>
        </div>
        <ul className="feats">
          <li>
            <svg width="22" height="22" viewBox="0 0 48 48" strokeWidth="2" {...svg} aria-hidden="true">
              <polygon points="6,18 14,8 34,8 42,18 24,42" />
              <polyline points="6,18 42,18" />
            </svg>
            <div><b>{t.f1t}</b><span>{t.f1d}</span></div>
          </li>
          <li>
            <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.6" {...svg} aria-hidden="true">
              <path d="M3 12V4h8l10 10-8 8L3 12z" />
              <circle cx="7.5" cy="8.5" r="1.2" />
            </svg>
            <div><b>{t.f2t}</b><span>{t.f2d}</span></div>
          </li>
          <li>
            <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.6" {...svg} aria-hidden="true">
              <path d="M4 5h16v11H9l-5 4V5z" />
            </svg>
            <div><b>{t.f3t}</b><span>{t.f3d}</span></div>
          </li>
        </ul>
      </section>
      <div id="catalog" />
    </>
  );
}
