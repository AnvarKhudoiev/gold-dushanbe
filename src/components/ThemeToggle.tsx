"use client";

import { useEffect, useState } from "react";
import { T, type Lang } from "@/lib/i18n";

const MOON = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
  </svg>
);
const SUN = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
  </svg>
);

export default function ThemeToggle({ lang = "ru" }: { lang?: Lang }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let t: string | null = null;
    try {
      t = localStorage.getItem("gd_t");
    } catch {}
    if (t) document.documentElement.setAttribute("data-theme", t);
    setDark(t === "dark");
  }, []);
  const t = T[lang];
  return (
    <button
      className="theme"
      type="button"
      aria-label={dark ? t.themeLight : t.themeDark}
      onClick={() => {
        const next = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
          localStorage.setItem("gd_t", next);
        } catch {}
        setDark(!dark);
      }}
    >
      {dark ? SUN : MOON}
    </button>
  );
}
