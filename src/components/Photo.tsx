import Art from "./Art";
import type { Product } from "@/lib/types";
import { T, pName, type Lang } from "@/lib/i18n";

export default function Photo({ p, lang }: { p: Product; lang: Lang }) {
  const t = T[lang];
  return (
    <div className="ph">
      {p.image_url ? <img src={p.image_url} alt={pName(p, lang)} loading="lazy" /> : <Art category={p.category} />}
      <span className={"badge " + (p.in_stock ? "in" : "out")}>{p.in_stock ? t.inStock : t.outStock}</span>
    </div>
  );
}
