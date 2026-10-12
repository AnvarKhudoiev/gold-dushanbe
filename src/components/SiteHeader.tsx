"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, fmtPhone } from "@/lib/config";
import { T, prefix, type Lang } from "@/lib/i18n";
import Logo from "./Logo";
import WaIcon from "./WaIcon";
import ThemeToggle from "./ThemeToggle";
import { useStore } from "./StoreContext";

const ico = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Тонкая полоса сверху (адрес, звонок, язык) и шапка: меню, название по центру, поиск и избранное.
 *  altPath: путь страницы без языка, например "/" или "/product/123". */
export default function SiteHeader({
  lang,
  altPath = "/",
  logoUrl,
  name,
  address,
  whatsapp,
}: {
  lang: Lang;
  altPath?: string;
  logoUrl?: string | null;
  name: string;
  address?: string;
  whatsapp?: string;
}) {
  const t = T[lang];
  const rest = altPath === "/" ? "" : altPath;
  const home = prefix(lang) || "/";
  const path = usePathname();
  const router = useRouter();
  const { cat, setCat, fav, favOnly, setFavOnly, setFOpen, bumpQ } = useStore();
  const [open, setOpen] = useState(false);
  const onHome = path === home || path === home + "/";

  function toCatalog() {
    if (onHome) document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    else router.push(home + "#catalog");
  }

  const phone = whatsapp ? fmtPhone(whatsapp) : "";
  return (
    <>
      <div className="ann">
        <div className="wrap">
          <span className="a-l">
            <svg width="15" height="15" viewBox="0 0 24 24" strokeWidth="1.7" {...ico} aria-hidden="true">
              <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>{address}</span>
          </span>
          <span className="a-c">
            {whatsapp && (
              <a href={`tel:+${whatsapp}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" strokeWidth="1.7" {...ico} aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
                <span>{phone}</span>
              </a>
            )}
          </span>
          <span className="a-r">
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener">
                <WaIcon size={15} />
                <span id="annWaT">{t.wa}</span>
              </a>
            )}
          </span>
        </div>
      </div>

      <header className="top">
        <div className="wrap hrow">
          <button type="button" className="menu" aria-label={t.menu} onClick={() => setOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 28 28" strokeWidth="1.6" {...ico} aria-hidden="true">
              <path d="M3 8h22M3 14h22M3 20h22" />
            </svg>
          </button>
          <Link href={home} className="brand" onClick={() => setCat("Все")}>
            <Logo url={logoUrl} size={46} />
            <div style={{ minWidth: 0 }}>
              <span className="nm">{name}</span>
              <small className="tg">{t.tagHdr}</small>
            </div>
          </Link>
          <div className="hdr-r">
            <nav className="langs" aria-label="Язык / Забон">
              <Link href={rest || "/"} className={lang === "ru" ? "on" : ""} hrefLang="ru" aria-current={lang === "ru" ? "true" : undefined}>
                RU
              </Link>
              <i />
              <Link href={"/tj" + rest} className={lang === "tj" ? "on" : ""} hrefLang="tg" aria-current={lang === "tj" ? "true" : undefined}>
                TJ
              </Link>
            </nav>
            <button
              type="button"
              className="ic"
              id="icSearch"
              aria-label={t.search}
              onClick={() => {
                setFOpen(true);
                bumpQ();
                toCatalog();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.6" {...ico} aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5L21 21" />
              </svg>
            </button>
            <button
              type="button"
              className="ic"
              aria-label={t.favs}
              aria-pressed={favOnly}
              onClick={() => {
                setFavOnly(!favOnly);
                toCatalog();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.6" {...ico} aria-hidden="true">
                <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
              </svg>
              <b>{fav.length}</b>
            </button>
            <ThemeToggle lang={lang} />
          </div>
        </div>
      </header>

      {open && (
        <div className="dr">
          <div className="dr-bg" onClick={() => setOpen(false)} />
          <aside className="dr-p">
            <button type="button" className="x" aria-label="×" onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 14 14" strokeWidth="1.5" {...ico}>
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
            <div className="eyebrow">{t.catTitle}</div>
            {["Все", ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                className={"dr-i" + (cat === c ? " on" : "")}
                onClick={() => {
                  setCat(c);
                  setOpen(false);
                  toCatalog();
                }}
              >
                {c === "Все" ? t.all : t.cats[c]}
              </button>
            ))}
          </aside>
        </div>
      )}
    </>
  );
}
