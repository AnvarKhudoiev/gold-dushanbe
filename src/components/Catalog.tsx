"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { CATEGORIES, SET_CATEGORY, SHOP, money, whatsappLink } from "@/lib/config";
import { T, pName, pDesc, prefix, type Lang } from "@/lib/i18n";
import Photo from "./Photo";
import WaIcon from "./WaIcon";
import { useStore } from "./StoreContext";

type Cond = "all" | "new" | "used";
type Sort = "def" | "asc" | "desc";

const HEART = (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
  </svg>
);

const FILTER_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
    <circle cx="15" cy="8" r="2" />
    <circle cx="9" cy="16" r="2" />
  </svg>
);
const SORT_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 4v16M4 16l4 4 4-4M16 20V4M12 8l4-4 4 4" />
  </svg>
);

export default function Catalog({ products, lang, whatsapp = SHOP.whatsapp }: { products: Product[]; lang: Lang; whatsapp?: string }) {
  const t = T[lang];
  const { cat, setCat, fOpen, setFOpen, favOnly, setFavOnly, fav, toggleFav, focusQ } = useStore();
  const [cond, setCond] = useState<Cond>("all");
  const [onlyStock, setOnlyStock] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("def");
  const qRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusQ > 0) qRef.current?.focus();
  }, [focusQ]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const res = products.filter(
      (p) =>
        (cat === "Все" || p.category === cat) &&
        (cond === "all" || p.condition === cond) &&
        (!onlyStock || p.in_stock) &&
        (!favOnly || fav.includes(p.id)) &&
        (!s || (pName(p, lang) + " " + (pDesc(p, lang) ?? "")).toLowerCase().includes(s)),
    );
    if (sort === "asc") res.sort((a, b) => a.price - b.price);
    if (sort === "desc") res.sort((a, b) => b.price - a.price);
    return res;
  }, [products, cat, cond, onlyStock, q, lang, sort, favOnly, fav]);

  const nAct = (cond !== "all" ? 1 : 0) + (onlyStock ? 1 : 0) + (favOnly ? 1 : 0) + (q.trim() ? 1 : 0);

  return (
    <section className="wrap lst">
      <div className="sec-h">
        <div className="eyebrow c">{t.listEy}</div>
        <h2>{t.catTitle}</h2>
      </div>
      <div className="chips">
        {["Все", ...CATEGORIES].map((c) => (
          <button key={c} className="cat" aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c === "Все" ? t.all : t.cats[c]}
          </button>
        ))}
      </div>
      <div className="bar2">
        <div className="count">{t.found(list.length)}</div>
        <div className="pills">
          <button type="button" className="pill" aria-expanded={fOpen} onClick={() => setFOpen(!fOpen)}>
            {FILTER_ICON}
            <span>
              {t.filt}
              {nAct ? ` (${nAct})` : ""}
            </span>
          </button>
          <label className="pill">
            {SORT_ICON}
            <select className="srt" aria-label={t.sort} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="def">{t.sDef}</option>
              <option value="asc">{t.sAsc}</option>
              <option value="desc">{t.sDesc}</option>
            </select>
          </label>
        </div>
      </div>
      <div className={"fpanel" + (fOpen ? " open" : "")}>
        <div className="chips" style={{ padding: 0 }}>
          {([["all", t.all], ["new", t.cNew], ["used", t.cUsed]] as [Cond, string][]).map(([k, label]) => (
            <button key={k} className="cat" aria-pressed={cond === k} onClick={() => setCond(k)}>
              {label}
            </button>
          ))}
        </div>
        <input ref={qRef} className="search" type="search" placeholder={t.search} aria-label={t.search} value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="favb" aria-pressed={favOnly} onClick={() => setFavOnly(!favOnly)}>
          {HEART}
          <span>
            {t.favs}
            {fav.length ? ` (${fav.length})` : ""}
          </span>
        </button>
        <div className="tog">
          <button type="button" role="switch" aria-checked={onlyStock} aria-label={t.onlyStock} onClick={() => setOnlyStock(!onlyStock)} />
          <span>{t.onlyStock}</span>
        </div>
      </div>
      <div className="grid">
        {list.length === 0 && <div className="empty">{products.length === 0 ? t.emptyNone : t.emptyFilter}</div>}
        {list.map((p, i) => {
          const on = fav.includes(p.id);
          const used = p.condition === "used";
          return (
            <div key={p.id} className={"card" + (p.in_stock ? "" : " sold")} style={{ ["--i" as string]: Math.min(i, 12) }}>
              <Link href={`${prefix(lang)}/product/${p.id}`} className="cardlink">
                <Photo p={p} lang={lang} tags={false}>
                  <span className={"bdg" + (used ? " u" : "")}>{used ? t.cUsedTag : t.cNewTag}</span>
                </Photo>
                <div className="info">
                  <span className="n">{pName(p, lang)}</span>
                  <span className="d">
                    {p.weight != null ? `${p.weight} ${t.g}` : ""}
                    {p.weight != null && p.purity ? <i /> : null}
                    {p.purity ? `${t.purity} ${p.purity}` : ""}
                  </span>
                  <span className="p">
                    {money(p.price, lang)}
                    {p.in_stock && <span className="dot">{t.inStock}</span>}
                  </span>
                </div>
              </Link>
              {whatsapp && (
                <div className="cta">
                  <a
                    className="gbtn sm wa"
                    href={whatsappLink(t.msg(pName(p, lang), p.price, p.purity, p.weight, `${SHOP.siteUrl}${prefix(lang)}/product/${p.id}`), whatsapp)}
                    target="_blank"
                    rel="noopener"
                  >
                    <WaIcon size={18} />
                    <span>{t.wa}</span>
                  </a>
                </div>
              )}
              <button type="button" className={"heart" + (on ? " on" : "")} aria-pressed={on} aria-label={t.favs} onClick={() => toggleFav(p.id)}>
                {HEART}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
