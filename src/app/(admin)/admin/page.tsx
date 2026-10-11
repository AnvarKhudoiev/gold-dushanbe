"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase";
import { CATEGORIES, PURITIES, SHOP, money } from "@/lib/config";
import type { Product } from "@/lib/types";
import Art from "@/components/Art";

type Draft = {
  id?: string;
  name: string;
  name_tj: string;
  description_tj: string;
  category: string;
  price: string;
  weight: string;
  purity: string;
  description: string;
  in_stock: boolean;
  image_url: string | null;
};

const EMPTY: Draft = {
  name: "", name_tj: "", description_tj: "", category: CATEGORIES[0], price: "", weight: "", purity: "585",
  description: "", in_stock: true, image_url: null,
};

/** Сжимает фото до 1000 px по длинной стороне, JPEG 80%. */
function compress(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1000 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("compress"))), "image/jpeg", 0.8);
    };
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });
}

function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" className="sw" role="switch" aria-checked={on} aria-label={label} onClick={onClick}>
      <i />
      <span>{on ? "В наличии" : "Нет в наличии"}</span>
    </button>
  );
}

export default function Admin() {
  const sb = getBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const load = useCallback(async () => {
    const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (error) say("Ошибка загрузки: " + error.message);
    else setProducts((data ?? []) as Product[]);
  }, [sb]);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setLoginErr("Неверная почта или пароль.");
  }

  async function toggle(p: Product) {
    const { error } = await sb.from("products").update({ in_stock: !p.in_stock }).eq("id", p.id);
    if (error) return say("Ошибка: " + error.message);
    setProducts((l) => l.map((x) => (x.id === p.id ? { ...x, in_stock: !p.in_stock } : x)));
    say(p.in_stock ? "Отмечено: нет в наличии" : "Отмечено: в наличии");
  }

  async function remove(p: Product) {
    const { error } = await sb.from("products").delete().eq("id", p.id);
    if (error) return say("Ошибка: " + error.message);
    if (p.image_url) {
      const path = p.image_url.split("/products/")[1];
      if (path) await sb.storage.from("products").remove([decodeURIComponent(path)]);
    }
    setConfirmDel(null);
    setProducts((l) => l.filter((x) => x.id !== p.id));
    say("Товар удалён");
  }

  function startEdit(p?: Product) {
    setFile(null);
    setPreview(null);
    setDraft(
      p
        ? {
            id: p.id, name: p.name, name_tj: p.name_tj ?? "", description_tj: p.description_tj ?? "", category: p.category, price: String(p.price),
            weight: p.weight == null ? "" : String(p.weight), purity: p.purity ?? "585",
            description: p.description ?? "", in_stock: p.in_stock, image_url: p.image_url,
          }
        : { ...EMPTY },
    );
    window.scrollTo(0, 0);
  }

  async function pick(f: File | undefined) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    try {
      let image_url = draft.image_url;
      if (file) {
        const blob = await compress(file);
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const up = await sb.storage.from("products").upload(path, blob, { contentType: "image/jpeg" });
        if (up.error) throw up.error;
        image_url = sb.storage.from("products").getPublicUrl(path).data.publicUrl;
      }
      const row = {
        name: draft.name.trim(),
        name_tj: draft.name_tj.trim() || null,
        description_tj: draft.description_tj.trim() || null,
        category: draft.category,
        price: Number(draft.price),
        weight: draft.weight === "" ? null : Number(draft.weight),
        purity: draft.purity,
        description: draft.description.trim() || null,
        in_stock: draft.in_stock,
        image_url,
      };
      const res = draft.id
        ? await sb.from("products").update(row).eq("id", draft.id)
        : await sb.from("products").insert(row);
      if (res.error) throw res.error;
      setDraft(null);
      await load();
      say("Товар сохранён");
    } catch (err) {
      say("Ошибка: " + (err instanceof Error ? err.message : "не удалось сохранить"));
    } finally {
      setBusy(false);
    }
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  if (!ready) return <p className="hint" style={{ padding: 24 }}>Загрузка…</p>;

  if (!session)
    return (
      <form className="lock box" onSubmit={login}>
        <h2 style={{ fontFamily: "var(--display)", fontWeight: 400, margin: 0 }}>Вход для продавца</h2>
        <input type="email" placeholder="Почта" aria-label="Почта" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Пароль" aria-label="Пароль" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" type="submit">Войти</button>
        {loginErr && <div className="err">{loginErr}</div>}
        <Link href="/" className="hint">← На витрину</Link>
      </form>
    );

  return (
    <div className="panel">
      <div className="bar">
        <h2>Товары — {SHOP.name}</h2>
        <div className="acts">
          <button className="btn" onClick={() => startEdit()}>Добавить товар</button>
          <Link className="btn ghost" href="/">На витрину</Link>
          <button className="btn ghost" onClick={() => sb.auth.signOut()}>Выйти</button>
        </div>
      </div>

      {draft && (
        <div className="box">
          <form className="f" onSubmit={save}>
            <div className="fld wide">
              <label>Фото</label>
              <div className="bar" style={{ justifyContent: "flex-start", gap: 14 }}>
                <div className="pv">
                  {preview || draft.image_url ? <img src={preview ?? draft.image_url ?? ""} alt="" /> : <Art category={draft.category} />}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} />
                  <div className="hint">Фото сожмётся автоматически.</div>
                </div>
              </div>
            </div>
            <div className="fld wide">
              <label htmlFor="fn">Название</label>
              <input id="fn" required value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="fld">
              <label htmlFor="fc">Категория</label>
              <select id="fc" value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld">
              <label htmlFor="fp">Цена, сомони</label>
              <input id="fp" type="number" min="0" step="any" required value={draft.price} onChange={(e) => set("price", e.target.value)} />
            </div>
            <div className="fld">
              <label htmlFor="fw">Вес, г</label>
              <input id="fw" type="number" min="0" step="0.01" value={draft.weight} onChange={(e) => set("weight", e.target.value)} />
            </div>
            <div className="fld">
              <label htmlFor="fu">Проба</label>
              <select id="fu" value={draft.purity} onChange={(e) => set("purity", e.target.value)}>
                {PURITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fld wide">
              <label htmlFor="fd">Описание</label>
              <textarea id="fd" rows={3} value={draft.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="fld wide">
              <label htmlFor="fnt">Название на таджикском (необязательно)</label>
              <input id="fnt" value={draft.name_tj} onChange={(e) => set("name_tj", e.target.value)} />
            </div>
            <div className="fld wide">
              <label htmlFor="fdt">Описание на таджикском (необязательно)</label>
              <textarea id="fdt" rows={3} value={draft.description_tj} onChange={(e) => set("description_tj", e.target.value)} />
              <span className="hint">Если не заполнить, на таджикской версии покажется русский текст.</span>
            </div>
            <div className="fld wide bar" style={{ display: "flex" }}>
              <Switch on={draft.in_stock} onClick={() => set("in_stock", !draft.in_stock)} label="Наличие" />
              <div className="acts">
                <button className="btn ghost" type="button" onClick={() => setDraft(null)}>Отмена</button>
                <button className="btn" type="submit" disabled={busy}>{busy ? "Сохраняю…" : "Сохранить"}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="rows">
        {products.length === 0 && <p className="hint">Товаров пока нет. Нажмите «Добавить товар».</p>}
        {products.map((p) => (
          <div className="row" key={p.id}>
            <div className="th">{p.image_url ? <img src={p.image_url} alt="" /> : <Art category={p.category} />}</div>
            <div className="t">
              <b>{p.name}</b>
              <span>{p.category} · {money(p.price)}</span>
            </div>
            <div className="acts">
              <Switch on={p.in_stock} onClick={() => toggle(p)} label={`Наличие: ${p.name}`} />
              <button className="btn ghost small" onClick={() => startEdit(p)}>Изменить</button>
              {confirmDel === p.id ? (
                <button className="btn danger small" onClick={() => remove(p)}>Точно удалить</button>
              ) : (
                <button className="btn ghost small" onClick={() => setConfirmDel(p.id)}>Удалить</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
