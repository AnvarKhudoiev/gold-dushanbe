import type { Metadata, Viewport } from "next";
import "../../globals.css";
import { SHOP } from "@/lib/config";
import { T, htmlLang, isLang } from "@/lib/i18n";
import { ArtDefs } from "@/components/Art";

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  const l = isLang(lang) ? lang : "ru";
  const t = T[l];
  return {
    metadataBase: new URL(SHOP.siteUrl),
    title: { default: t.siteTitle, template: `%s | ${SHOP.name}` },
    description: t.siteDesc,
    icons: { icon: "/icon.svg" },
    openGraph: { type: "website", siteName: SHOP.name, locale: l === "tj" ? "tg_TJ" : "ru_RU" },
    alternates: {
      canonical: l === "tj" ? "/tj" : "/",
      languages: { ru: "/", tg: "/tj", "x-default": "/" },
    },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2A0A10" };

export default async function SiteLayout({ children, params }: Props) {
  const { lang } = await params;
  const l = isLang(lang) ? lang : "ru";
  return (
    <html lang={htmlLang(l)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Onest:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ArtDefs />
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
