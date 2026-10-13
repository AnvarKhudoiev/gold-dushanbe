import type { Metadata, Viewport } from "next";
import "../../globals.css";
import { SHOP, resolveShop } from "@/lib/config";
import { fetchSettings } from "@/lib/supabase";
import { T, htmlLang, isLang } from "@/lib/i18n";
import { ArtDefs } from "@/components/Art";
import { StoreProvider } from "@/components/StoreContext";
import { DEMO_DOCK } from "@/lib/config";
import Analytics from "@/components/Analytics";

const FONTS = "https://fonts.googleapis.com/css2?family=Prata&family=Onest:wght@400;500;600&display=swap";

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  const l = isLang(lang) ? lang : "ru";
  const t = T[l];
  const name = resolveShop(await fetchSettings()).name;
  return {
    metadataBase: new URL(SHOP.siteUrl),
    title: { default: t.siteTitle.replace(SHOP.name, name), template: `%s | ${name}` },
    description: t.siteDesc,
    icons: {
      icon: [
        { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: { type: "website", siteName: name, locale: l === "tj" ? "tg_TJ" : "ru_RU" },
    alternates: {
      canonical: l === "tj" ? "/tj" : "/",
      languages: { ru: "/", tg: "/tj", "x-default": "/" },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F6F5",
};

export default async function SiteLayout({ children, params }: Props) {
  const { lang } = await params;
  const l = isLang(lang) ? lang : "ru";
  return (
    <html lang={htmlLang(l)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Шрифты грузятся без блокировки отрисовки: страница видна сразу, шрифт подменяется через swap */}
        <link rel="stylesheet" href={FONTS} media="print" data-nb="1" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: "document.querySelectorAll('link[data-nb]').forEach(function(l){var f=function(){l.media='all'};l.sheet?f():l.addEventListener('load',f)})" }} />
        <noscript>
          <link rel="stylesheet" href={FONTS} />
        </noscript>
      </head>
      <body className={DEMO_DOCK ? "withdock" : undefined}>
        <ArtDefs />
        <Analytics />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
