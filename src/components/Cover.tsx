import { T, type Lang } from "@/lib/i18n";
import { CoverArt } from "./Art";

/** Главный экран: фото магазина (его загружает продавец) или рисунок по умолчанию. */
export default function Cover({ lang, heroUrl }: { lang: Lang; heroUrl: string | null }) {
  const t = T[lang];
  return (
    <>
      <section className="cover">
        {heroUrl ? (
          <div className="bg" style={{ backgroundImage: `url(${heroUrl})` }} />
        ) : (
          <div className="cart">
            <CoverArt />
          </div>
        )}
        <div className="cover-in">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.hero}</h1>
          <p>{t.heroSub}</p>
          <a className="btn light" href="#catalog">
            {t.cta}
          </a>
        </div>
      </section>
      <div id="catalog" />
    </>
  );
}
