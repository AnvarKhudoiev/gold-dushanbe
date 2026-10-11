import Link from "next/link";
import { SHOP } from "@/lib/config";
import { T, prefix, type Lang } from "@/lib/i18n";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

/** altPath: путь страницы без языка, например "/" или "/product/123". */
export default function SiteHeader({ lang, altPath = "/", logoUrl }: { lang: Lang; altPath?: string; logoUrl?: string | null }) {
  const rest = altPath === "/" ? "" : altPath;
  return (
    <header className="top">
      <Link href={prefix(lang) || "/"} className="brand">
        <Logo url={logoUrl} />
        <div style={{ minWidth: 0 }}>
          <span className="nm">{SHOP.name}</span>
          <p>{T[lang].tagline}</p>
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
        <ThemeToggle lang={lang} />
      </div>
    </header>
  );
}
