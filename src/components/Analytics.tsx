"use client";
import Script from "next/script";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
  }
}

/** Google Analytics 4. Включается переменной NEXT_PUBLIC_GA_ID (G-XXXXXXX).
 *  Отдельно считает клики: whatsapp_click, telegram_click, phone_click (по ссылкам на странице, ничего править не нужно). */
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href") || "";
      let name = "";
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) name = "whatsapp_click";
      else if (/^https?:\/\/t\.me\//i.test(href)) name = "telegram_click";
      else if (/^tel:/i.test(href)) name = "phone_click";
      if (!name || !window.gtag) return;
      const where = a?.classList.contains("wa-float")
        ? "float"
        : a?.closest("header")
          ? "header"
          : a?.closest("footer")
            ? "footer"
            : "page";
      window.gtag("event", name, { link_location: where, page_path: location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="ga4" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
