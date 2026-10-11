import type { Metadata } from "next";
import "../../globals.css";
import { ArtDefs } from "@/components/Art";

export const metadata: Metadata = {
  title: "Панель продавца",
  icons: { icon: "/icon.svg" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
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
