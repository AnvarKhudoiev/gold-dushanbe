"use client";

import Link from "next/link";
import { T, prefix, type Lang } from "@/lib/i18n";
import { CoverArt } from "./Art";
import { useStore } from "./StoreContext";

/** Баннер вверху: хлебные крошки и заголовок меняются вместе с категорией, фото не перезагружается. */
export default function Hero({ lang, heroUrl }: { lang: Lang; heroUrl: string | null }) {
  const t = T[lang];
  const { cat, setCat } = useStore();
  const title = cat === "Все" ? t.catTitle : t.cats[cat] ?? cat;
  const home = prefix(lang) || "/";
  return (
    <section className={"cover" + (heroUrl ? "" : " plain")}>
      {heroUrl ? (
        <div className="bg" style={{ backgroundImage: `url(${heroUrl})` }} />
      ) : (
        <div className="cart">
          <CoverArt />
        </div>
      )}
      <div className="cover-in">
        <nav className="crumbs" aria-label="breadcrumb">
          <Link href={home} onClick={() => setCat("Все")}>
            {t.home}
          </Link>
          <i>/</i>
          {cat === "Все" ? (
            <span>{t.catTitle}</span>
          ) : (
            <>
              <a href="#catalog" onClick={() => setCat("Все")}>
                {t.catTitle}
              </a>
              <i>/</i>
              <span>{title}</span>
            </>
          )}
        </nav>
        <h1>{title}</h1>
        <p className="hdesc">{t.heroSub}</p>
      </div>
    </section>
  );
}
