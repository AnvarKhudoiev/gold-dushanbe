"use client";

import { useState } from "react";
import Image from "next/image";
import Art from "./Art";
import { canOptimize } from "@/lib/config";
import type { Product } from "@/lib/types";
import { T, pName, type Lang } from "@/lib/i18n";

export default function Photo({ p, lang, tags = true, eager = false, children }: { p: Product; lang: Lang; tags?: boolean; eager?: boolean; children?: React.ReactNode }) {
  const t = T[lang];
  const used = p.condition === "used";
  const [broken, setBroken] = useState(false);
  return (
    <div className="ph">
      {p.image_url && !broken ? (
        <Image
          src={p.image_url}
          alt={pName(p, lang)}
          fill
          sizes={tags ? "(min-width:720px) 480px, 100vw" : "(max-width:620px) 50vw, (max-width:1000px) 33vw, 25vw"}
          quality={72}
          priority={eager}
          unoptimized={!canOptimize(p.image_url)}
          onError={() => setBroken(true)}
        />
      ) : (
        <Art category={p.category} />
      )}
      {!p.in_stock && <span className="tag">{t.outStock}</span>}
      {children}
      {tags && <span className={"tag t " + (used ? "u" : "n")}>{used ? t.cUsedTag : t.cNewTag}</span>}
    </div>
  );
}
