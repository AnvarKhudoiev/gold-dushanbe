"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { CATEGORIES, SET_CATEGORY, money } from "@/lib/config";
import { T, pName, pDesc, prefix, type Lang } from "@/lib/i18n";
import Photo from "./Photo";

type Cond = "all" | "new" | "used";

export default function Catalog({ products, lang }: { products: Product[]; lang: Lang }) {
  const t = T[lang];
  const [cat, setCat] = useState<string>("Все");
  const [cond, setCond] = useState<Cond>("all");
  const [onlyStock, setOnlyStock] = useState(false);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === "Все" || p.category === cat) &&
        (cond === "all" || p.condition === cond) &&
        (!onlyStock || p.in_stock) &&
        (!s || (pName(p, lang) + " " + (pDesc(p, lang) ?? "")).toLowerCase().includes(s)),
    );
  }, [products, cat, cond, onlyStock, q, lang]);

  return (
    <>
      <div className="tools">
        <div className="cats">
          {["Все", ...CATEGORIES].map((c) => (
            <button key={c} className="cat" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === "Все" ? t.all : t.cats[c]}
            </button>
          ))}
        </div>
        <div className="tools-r">
          <input
            className="search"
            type="search"
            placeholder={t.search}
            aria-label={t.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="tog">
            <button type="button" role="switch" aria-checked={onlyStock} aria-label={t.onlyStock} onClick={() => setOnlyStock(!onlyStock)} />
            <span>{t.onlyStock}</span>
          </div>
        </div>
      </div>
      <div className="tools" style={{ borderTop: 0, paddingBlock: "0 4px" }}>
        <div className="cats">
          {([["all", t.all], ["new", t.cNew], ["used", t.cUsed]] as [Cond, string][]).map(([k, label]) => (
            <button key={k} className="cat" aria-pressed={cond === k} onClick={() => setCond(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="count">{t.found(list.length)}</div>
      <div className="grid">
        {list.length === 0 && <div className="empty">{products.length === 0 ? t.emptyNone : t.emptyFilter}</div>}
        {list.map((p, i) => (
          <Link
            key={p.id}
            href={`${prefix(lang)}/product/${p.id}`}
            className={"card" + (p.in_stock ? "" : " sold")}
            style={{ ["--i" as string]: Math.min(i, 12) }}
          >
            <Photo p={p} lang={lang} />
            <div className="info">
              <span className="c">{t.cats[p.category] ?? p.category}</span>
              <span className="n">{pName(p, lang)}</span>
              <span className="p">
                {money(p.price)}
                {p.in_stock && <span className="dot">{t.inStock}</span>}
                {p.category === SET_CATEGORY && <span className="sep">{p.sold_separately ? t.sepYes : t.sepNo}</span>}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
