import Link from "next/link";
import { SHOP } from "@/lib/config";
import { T, prefix, type Lang } from "@/lib/i18n";
import Logo from "./Logo";

/** altPath: путь страницы без языка, например "/" или "/product/123". */
export default function SiteHeader({ lang, altPath = "/" }: { lang: Lang; altPath?: string }) {
  const rest = altPath === "/" ? "" : altPath;
  return (
    <header className="top">
      <Link href={prefix(lang) || "/"} className="brand">
        <Logo />
        <span className="bt">
          <span className="logo">{SHOP.name}</span>
          <span className="tag">{T[lang].tagline}</span>
        </span>
      </Link>
      <nav className="langs" aria-label="Язык / Забон">
        <Link href={rest || "/"} className={lang === "ru" ? "on" : ""} hrefLang="ru" aria-current={lang === "ru" ? "true" : undefined}>
          RU
        </Link>
        <Link href={"/tj" + rest} className={lang === "tj" ? "on" : ""} hrefLang="tg" aria-current={lang === "tj" ? "true" : undefined}>
          TJ
        </Link>
      </nav>
    </header>
  );
}
