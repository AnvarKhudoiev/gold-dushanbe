"use client";

import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/config";
import { T, type Lang } from "@/lib/i18n";
import Art from "./Art";
import { useStore } from "./StoreContext";
import { useState } from "react";

function Tile({ c, src, label, onPick }: { c: string; src: string | null; label: string; onPick: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <button type="button" className="ctile" onClick={onPick}>
      <span className="cph">
        {src && !broken ? <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} /> : <Art category={c} />}
      </span>
      <span className="cl">
        <span>{label}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}

/** Плитки категорий: фото берётся с первого товара категории. Клик выбирает категорию и прокручивает к каталогу. */
export default function Categories({ products, lang, images }: { products: Product[]; lang: Lang; images?: Record<string, string> | null }) {
  const t = T[lang];
  const { setCat } = useStore();
  return (
    <section className="wrap catsec" id="cats">
      <div className="sec-h">
        <div className="eyebrow c">{t.catsEy}</div>
        <h2>{t.catsT}</h2>
      </div>
      <div className="ctiles">
        {CATEGORIES.map((c) => (
          <Tile
            key={c}
            c={c}
            src={images?.[c] || products.find((x) => x.category === c && x.image_url)?.image_url || null}
            label={t.cats[c]}
            onPick={() => {
              setCat(c);
              document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ))}
      </div>
    </section>
  );
}
