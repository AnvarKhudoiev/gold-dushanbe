import type { Metadata } from "next";
import "../../globals.css";
import { ArtDefs } from "@/components/Art";
import { DEMO_DOCK } from "@/lib/config";

export const metadata: Metadata = {
  title: "Панель продавца",
  icons: { icon: "/icon.svg" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Onest:wght@400;500;600&display=swap"
        />
      </head>
      <body className={DEMO_DOCK ? "withdock" : undefined}>
        <ArtDefs />
        <div className="wrap">{children}</div>
      </body>
    </html>
  );
}
