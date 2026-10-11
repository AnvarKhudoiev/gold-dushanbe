"use client";

import { useState } from "react";
import Art from "./Art";
import type { Product } from "@/lib/types";
import { T, pName, type Lang } from "@/lib/i18n";

export default function Photo({ p, lang, tags = true, children }: { p: Product; lang: Lang; tags?: boolean; children?: React.ReactNode }) {
  const t = T[lang];
  const used = p.condition === "used";
  const [broken, setBroken] = useState(false);
  return (
    <div className="ph">
      {p.image_url && !broken ? (
        <img src={p.image_url} alt={pName(p, lang)} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <Art category={p.category} />
      )}
      {!p.in_stock && <span className="tag">{t.outStock}</span>}
      {children}
      {tags && <span className={"tag t " + (used ? "u" : "n")}>{used ? t.cUsedTag : t.cNewTag}</span>}
    </div>
  );
}
