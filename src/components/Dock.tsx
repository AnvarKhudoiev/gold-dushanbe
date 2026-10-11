import Link from "next/link";
import { DEMO_DOCK } from "@/lib/config";
import { T, type Lang } from "@/lib/i18n";

/** Плавающий переключатель Витрина / Продавец. Включается NEXT_PUBLIC_DEMO_DOCK=1.
 *  Админка при этом остаётся под логином. */
export default function Dock({ current, lang = "ru" }: { current: "shop" | "admin"; lang?: Lang }) {
  if (!DEMO_DOCK) return null;
  const t = T[lang];
  return (
    <nav className="dock" aria-label="Вид">
      <Link href="/" aria-current={current === "shop" ? "page" : undefined}>{t.dockShop}</Link>
      <Link href="/admin" aria-current={current === "admin" ? "page" : undefined}>{t.dockAdmin}</Link>
    </nav>
  );
}
