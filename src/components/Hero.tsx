import { getImageProps } from "next/image";
import { T, type Lang } from "@/lib/i18n";
import { CoverArt } from "./Art";
import { canOptimize } from "@/lib/config";

const I = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Баннер вверху: тёмно-синий фон, фото магазина (если загружено), крупный заголовок и три пункта доверия. */
export default function Hero({ lang, heroUrl, heroMobileUrl }: { lang: Lang; heroUrl: string | null; heroMobileUrl?: string | null }) {
  const t = T[lang];
  const words = t.tagHdr.split(" · ");
  const dUrl = heroUrl || heroMobileUrl;
  const mUrl = heroMobileUrl || heroUrl;
  const common = { alt: "", fill: true, sizes: "100vw", quality: 70, priority: true } as const;
  const desk = dUrl ? getImageProps({ ...common, src: dUrl, unoptimized: !canOptimize(dUrl) }).props : null;
  const mob = mUrl && mUrl !== dUrl ? getImageProps({ ...common, src: mUrl, unoptimized: !canOptimize(mUrl) }).props : null;
  const unit = [...words, ...words, ...words, ...words];
  return (
    <>
    <section className={"hero2" + (heroUrl || heroMobileUrl ? "" : " nophoto")}>
      {desk ? (
        <picture className="bg">
          {mob ? <source media="(max-width:620px)" srcSet={mob.srcSet} sizes="100vw" /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img {...desk} alt="" fetchPriority="high" />
        </picture>
      ) : (
        <div className="cart">
          <CoverArt />
        </div>
      )}
      <div className="wrap hin">
        <div className="htxt">
          <div className="eyebrow">{t.hEy}</div>
          <h1>
            {t.h1a} <em>{t.h1b}</em>
          </h1>
          <p>{t.hSub}</p>
          <a className="gbtn" href="#cats">
            <svg viewBox="0 0 24 24" strokeWidth="1.6" {...I} aria-hidden="true">
              <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
              <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
              <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
              <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
            </svg>
            <span>{t.ctaCat}</span>
            <svg viewBox="0 0 24 24" strokeWidth="1.6" {...I} aria-hidden="true">
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </a>
        </div>
        <ul className="badges">
          <li>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" {...I} aria-hidden="true">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
              <path d="M8.5 12l2.5 2.5 4.5-5" />
            </svg>
            <span>{t.b1}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" {...I} aria-hidden="true">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
              <path d="M2 9h20M9 3l3 6 3-6M12 21L9 9M12 21l3-12" />
            </svg>
            <span>{t.b2}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" {...I} aria-hidden="true">
              <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" />
              <circle cx="6.5" cy="17.5" r="1.8" />
              <circle cx="16.5" cy="17.5" r="1.8" />
            </svg>
            <span>{t.b3}</span>
          </li>
        </ul>
      </div>
    </section>
    <div className="fx-marq" aria-hidden="true">
      <div>
        {[0, 1].map((k) =>
          unit.map((w, i) => (
            <span key={k + "-" + i}>{w}</span>
          ))
        )}
      </div>
    </div>
    </>
  );
}
