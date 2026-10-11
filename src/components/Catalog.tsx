"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { CATEGORIES, money } from "@/lib/config";
import { T, pName, pDesc, prefix, type Lang } from "@/lib/i18n";
import Photo from "./Photo";

export default function Catalog({ products, lang }: { products: Product[]; lang: Lang }) {
  const t = T[lang];
  const [cat, setCat] = useState<string>("Все");
  const [onlyStock, setOnlyStock] = useState(false);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === "Все" || p.category === cat) &&
        (!onlyStock || p.in_stock) &&
        (!s || (pName(p, lang) + " " + (pDesc(p, lang) ?? "")).toLowerCase().includes(s)),
    );
  }, [products, cat, onlyStock, q, lang]);

  return (
    <>
      <div className="tools">
        <div className="chips">
          {["Все", ...CATEGORIES].map((c) => (
            <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === "Все" ? t.all : t.cats[c]}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="search"
          placeholder={t.search}
          aria-label={t.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <label className="stockfilter">
          <input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} />
          {t.onlyStock}
        </label>
      </div>
      <div className="count">{t.found(list.length)}</div>
      <div className="grid">
        {list.length === 0 && <div className="empty">{products.length === 0 ? t.emptyNone : t.emptyFilter}</div>}
        {list.map((p) => (
          <Link key={p.id} href={`${prefix(lang)}/product/${p.id}`} className={"card" + (p.in_stock ? "" : " sold")}>
            <Photo p={p} lang={lang} />
            <div className="info">
              <span className="n">{pName(p, lang)}</span>
              <span className="m">
                {t.cats[p.category] ?? p.category}
                {p.weight ? ` · ${p.weight} ${t.g}` : ""}
                {p.purity ? ` · ${t.purity.toLowerCase()} ${p.purity}` : ""}
              </span>
              <span className="price">{money(p.price)}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
