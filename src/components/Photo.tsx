import Art from "./Art";
import type { Product } from "@/lib/types";
import { T, pName, type Lang } from "@/lib/i18n";

export default function Photo({ p, lang, tags = true }: { p: Product; lang: Lang; tags?: boolean }) {
  const t = T[lang];
  const used = p.condition === "used";
  return (
    <div className="ph">
      {p.image_url ? <img src={p.image_url} alt={pName(p, lang)} loading="lazy" /> : <Art category={p.category} />}
      {!p.in_stock && <span className="tag">{t.outStock}</span>}
      {tags && <span className={"tag t " + (used ? "u" : "n")}>{used ? t.cUsedTag : t.cNewTag}</span>}
    </div>
  );
}
