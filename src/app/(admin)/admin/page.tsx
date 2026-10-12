"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient, normalize } from "@/lib/supabase";
import { CATEGORIES, PURITIES, SET_CATEGORY, SHOP, money } from "@/lib/config";
import type { Product, SetItem, ShopSettings } from "@/lib/types";
import Art from "@/components/Art";
import Dock from "@/components/Dock";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

type ItemDraft = { name: string; name_tj: string; weight: string; desc: string; desc_tj: string };

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
  condition: "new" | "used";
  sold_separately: boolean;
  parts: ItemDraft[];
};

const EMPTY: Draft = {
  name: "", name_tj: "", description_tj: "", category: CATEGORIES[0], price: "", weight: "", purity: "585",
  description: "", in_stock: true, image_url: null, condition: "new", sold_separately: true, parts: [],
};

const EMPTY_ITEM: ItemDraft = { name: "", name_tj: "", weight: "", desc: "", desc_tj: "" };

const ARROW = (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 6H1M6 1L1 6l5 5" />
  </svg>
);

/** Сжимает картинку до max px по длинной стороне. PNG сохраняет прозрачность (для логотипа). */
function compress(file: File, max: number, type: "image/jpeg" | "image/png", quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("compress"))), type, quality);
    };
    img.onerror = () => reject(new Error("image"));
    img.src = url;
  });
}

function Switch({ on, onClick, label, onText = "В наличии", offText = "Нет в наличии" }: {
  on: boolean; onClick: () => void; label: string; onText?: string; offText?: string;
}) {
  return (
    <button type="button" className="sw" role="switch" aria-checked={on} aria-label={label} onClick={onClick}>
      <i />
      <span style={{ minWidth: 150 }}>{on ? onText : offText}</span>
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
  const [settings, setSettings] = useState<ShopSettings>({ logo_url: null, hero_url: null, hero_mobile_url: null, about: null, about_tj: null, shop_name: null, whatsapp: null, telegram: null, category_images: null });
  const [nameIn, setNameIn] = useState("");
  const [waIn, setWaIn] = useState("");
  const [tgIn, setTgIn] = useState("");
  const [aboutRu, setAboutRu] = useState("");
  const [aboutTj, setAboutTj] = useState("");
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
    else setProducts((data ?? []).map(normalize));
    const st = await sb.from("shop_settings").select("*").eq("id", 1).maybeSingle();
    if (st.data) {
      setSettings({ logo_url: st.data.logo_url ?? null, hero_url: st.data.hero_url ?? null, hero_mobile_url: st.data.hero_mobile_url ?? null, about: st.data.about ?? null, about_tj: st.data.about_tj ?? null, shop_name: st.data.shop_name ?? null, whatsapp: st.data.whatsapp ?? null, telegram: st.data.telegram ?? null, category_images: st.data.category_images ?? null });
      setNameIn(st.data.shop_name ?? "");
      setWaIn(st.data.whatsapp ?? "");
      setTgIn(st.data.telegram ?? "");
      setAboutRu(st.data.about ?? "");
      setAboutTj(st.data.about_tj ?? "");
    }
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

  async function removeFile(url: string | null) {
    const path = url?.split("/products/")[1];
    if (path) await sb.storage.from("products").remove([decodeURIComponent(path)]);
  }

  async function remove(p: Product) {
    const { error } = await sb.from("products").delete().eq("id", p.id);
    if (error) return say("Ошибка: " + error.message);
    await removeFile(p.image_url);
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
            condition: p.condition, sold_separately: p.sold_separately,
            parts: (p.parts ?? []).map((it) => ({
              name: it.name ?? "", name_tj: it.name_tj ?? "", weight: it.weight == null ? "" : String(it.weight),
              desc: it.desc ?? "", desc_tj: it.desc_tj ?? "",
            })),
          }
        : { ...EMPTY, parts: [] },
    );
    window.scrollTo(0, 0);
  }

  async function pick(f: File | undefined) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function upload(blob: Blob, prefix: string, ext: "jpg" | "png", contentType: string) {
    const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const up = await sb.storage.from("products").upload(path, blob, { contentType });
    if (up.error) throw up.error;
    return sb.storage.from("products").getPublicUrl(path).data.publicUrl;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    try {
      let image_url = draft.image_url;
      if (file) {
        const blob = await compress(file, 1000, "image/jpeg");
        image_url = await upload(blob, "p", "jpg", "image/jpeg");
        if (draft.image_url) await removeFile(draft.image_url);
      }
      const isSet = draft.category === SET_CATEGORY;
      const parts: SetItem[] | null = isSet
        ? draft.parts
            .filter((it) => it.name.trim())
            .map((it) => ({
              name: it.name.trim(),
              name_tj: it.name_tj.trim() || null,
              weight: it.weight === "" ? null : Number(it.weight),
              desc: it.desc.trim() || null,
              desc_tj: it.desc_tj.trim() || null,
            }))
        : null;
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
        condition: draft.condition,
        sold_separately: isSet ? draft.sold_separately : true,
        parts,
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

  /** Логотип или главное фото: загрузка и сброс. */
  async function setImage(kind: "logo" | "hero" | "hero_m", f: File | undefined) {
    if (!f) return;
    try {
      const col = kind === "logo" ? "logo_url" : kind === "hero" ? "hero_url" : "hero_mobile_url";
      const old = settings[col];
      const blob = kind === "logo" ? await compress(f, 256, "image/png") : await compress(f, 1600, "image/jpeg", 0.78);
      const url = await upload(blob, kind, kind === "logo" ? "png" : "jpg", kind === "logo" ? "image/png" : "image/jpeg");
      const next = { ...settings, [col]: url };
      const res = await sb.from("shop_settings").upsert({ id: 1, ...next });
      if (res.error) throw res.error;
      await removeFile(old ?? null);
      setSettings(next);
      say(kind === "logo" ? "Логотип обновлён" : kind === "hero" ? "Главное фото обновлено" : "Фото для телефона обновлено");
    } catch (err) {
      say("Ошибка: " + (err instanceof Error ? err.message : "не удалось загрузить") + " (выполнен ли migration-v2.sql?)");
    }
  }

  async function saveShop() {
    const next = {
      ...settings,
      shop_name: nameIn.trim() || null,
      whatsapp: waIn.replace(/\D/g, "") || null,
      telegram: tgIn.trim().replace(/^(https?:\/\/)?(t\.me\/)?@?/i, "").replace(/\/.*$/, "") || null,
      about: aboutRu.trim() || null,
      about_tj: aboutTj.trim() || null,
    };
    const res = await sb.from("shop_settings").upsert({ id: 1, ...next });
    if (res.error) return say("Ошибка: " + res.error.message + " (выполнены ли migration-v2.sql и migration-v3.sql?)");
    setSettings(next);
    say("Данные сохранены");
  }

  /** Фото плитки категории на главной: загрузка и сброс. */
  async function setCatImage(cat: string, f: File | undefined) {
    if (!f) return;
    try {
      const old = settings.category_images?.[cat] ?? null;
      const blob = await compress(f, 700, "image/jpeg", 0.8);
      const url = await upload(blob, "cat", "jpg", "image/jpeg");
      const next = { ...settings, category_images: { ...(settings.category_images ?? {}), [cat]: url } };
      const res = await sb.from("shop_settings").upsert({ id: 1, ...next });
      if (res.error) throw res.error;
      await removeFile(old ?? null);
      setSettings(next);
      say("Фото категории обновлено");
    } catch (err) {
      say("Ошибка: " + (err instanceof Error ? err.message : "не удалось загрузить") + " (выполнен ли migration-v3.sql?)");
    }
  }

  async function resetCatImage(cat: string) {
    const old = settings.category_images?.[cat] ?? null;
    const rest = { ...(settings.category_images ?? {}) };
    delete rest[cat];
    const next = { ...settings, category_images: Object.keys(rest).length ? rest : null };
    const res = await sb.from("shop_settings").upsert({ id: 1, ...next });
    if (res.error) return say("Ошибка: " + res.error.message);
    await removeFile(old ?? null);
    setSettings(next);
    say("Фото категории сброшено");
  }

  async function resetImage(kind: "logo" | "hero" | "hero_m") {
    const col = kind === "logo" ? "logo_url" : kind === "hero" ? "hero_url" : "hero_mobile_url";
    const old = settings[col];
    const next = { ...settings, [col]: null };
    const res = await sb.from("shop_settings").upsert({ id: 1, ...next });
    if (res.error) return say("Ошибка: " + res.error.message);
    await removeFile(old ?? null);
    setSettings(next);
    say(kind === "logo" ? "Логотип сброшен" : "Фото сброшено");
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const setItem = (i: number, k: keyof ItemDraft, v: string) =>
    setDraft((d) => (d ? { ...d, parts: d.parts.map((it, j) => (j === i ? { ...it, [k]: v } : it)) } : d));

  if (!ready) return <p className="hint" style={{ padding: 24 }}>Загрузка…</p>;

  if (!session)
    return (
      <>
        <form className="lock box" onSubmit={login}>
          <h2>Вход для продавца</h2>
          <input type="email" placeholder="Почта" aria-label="Почта" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" aria-label="Пароль" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn" type="submit">Войти</button>
          {loginErr && <div className="err">{loginErr}</div>}
          <Link href="/" className="link back">{ARROW}<span>Витрина</span></Link>
        </form>
        <Dock current="admin" />
      </>
    );

  const isSet = draft?.category === SET_CATEGORY;

  return (
    <>
      <header className="top">
        <Link href="/" className="brand">
          <Logo url={settings.logo_url} />
          <div style={{ minWidth: 0 }}>
            <span className="nm">{settings.shop_name || SHOP.name}</span>
            <p>Панель продавца</p>
          </div>
        </Link>
        <div className="hdr-r">
          <button className="link" onClick={() => sb.auth.signOut()}>Выйти</button>
          <ThemeToggle />
        </div>
      </header>

      <div className="panel">
        <Link href="/" className="link back" style={{ justifySelf: "start" }}>{ARROW}<span>Витрина</span></Link>
        <div className="bar">
          <h2>Товары</h2>
          <button className="btn" onClick={() => startEdit()}>Добавить товар</button>
        </div>

        {draft && (
          <div className="box">
            <form className="f" onSubmit={save}>
              <button type="button" className="link back bk" onClick={() => setDraft(null)}>{ARROW}<span>К списку товаров</span></button>
              <div className="fld wide">
                <label>Фото</label>
                <div className="bar" style={{ justifyContent: "flex-start", gap: 16 }}>
                  <div className="pv">
                    {preview || draft.image_url ? <img src={preview ?? draft.image_url ?? ""} alt="" /> : <Art category={draft.category} />}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} />
                    <div className="hint" style={{ marginTop: 6 }}>Фото сожмётся автоматически.</div>
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
                <label htmlFor="fcd">Состояние</label>
                <select id="fcd" value={draft.condition} onChange={(e) => set("condition", e.target.value as "new" | "used")}>
                  <option value="new">Новое</option>
                  <option value="used">Б/у (выкуплено у клиента)</option>
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

              {isSet && (
                <div className="fld wide">
                  <label>Изделия в комплекте</label>
                  {draft.parts.map((it, i) => (
                    <div className="itm" key={i}>
                      <div className="bar">
                        <b>Изделие {i + 1}</b>
                        <button type="button" className="link no" onClick={() => set("parts", draft.parts.filter((_, j) => j !== i))}>Убрать</button>
                      </div>
                      <div className="f" style={{ marginTop: 10 }}>
                        <div className="fld">
                          <label>Название</label>
                          <input value={it.name} onChange={(e) => setItem(i, "name", e.target.value)} />
                        </div>
                        <div className="fld">
                          <label>Вес, г</label>
                          <input type="number" min="0" step="0.01" value={it.weight} onChange={(e) => setItem(i, "weight", e.target.value)} />
                        </div>
                        <div className="fld wide">
                          <label>Описание</label>
                          <textarea rows={2} value={it.desc} onChange={(e) => setItem(i, "desc", e.target.value)} />
                        </div>
                        <div className="fld">
                          <label>Название (TJ, необязательно)</label>
                          <input value={it.name_tj} onChange={(e) => setItem(i, "name_tj", e.target.value)} />
                        </div>
                        <div className="fld">
                          <label>Описание (TJ, необязательно)</label>
                          <input value={it.desc_tj} onChange={(e) => setItem(i, "desc_tj", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <button type="button" className="btn ghost small" onClick={() => set("parts", [...draft.parts, { ...EMPTY_ITEM }])}>
                      Добавить изделие в комплект
                    </button>
                  </div>
                  <Switch
                    on={draft.sold_separately}
                    onClick={() => set("sold_separately", !draft.sold_separately)}
                    label="Продажа по отдельности"
                    onText="Можно продать по отдельности"
                    offText="Только комплектом"
                  />
                </div>
              )}

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
          {products.length === 0 && <p className="hint" style={{ padding: "14px 0" }}>Товаров пока нет. Нажмите «Добавить товар».</p>}
          {products.map((p) => (
            <div className="row" key={p.id}>
              <div className="th">{p.image_url ? <img src={p.image_url} alt="" /> : <Art category={p.category} />}</div>
              <div className="t">
                <b>{p.name}</b>
                <span>{p.category} · {p.condition === "used" ? "Б/у" : "Новое"} · {money(p.price)}</span>
              </div>
              <div className="acts">
                <Switch on={p.in_stock} onClick={() => toggle(p)} label={`Наличие: ${p.name}`} />
                <button className="link" onClick={() => startEdit(p)}>Изменить</button>
                {confirmDel === p.id ? (
                  <button className="btn danger small" onClick={() => remove(p)}>Точно удалить</button>
                ) : (
                  <button className="link no" onClick={() => setConfirmDel(p.id)}>Удалить</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="box">
          <h4>Данные магазина</h4>
          <div className="f">
            <div className="fld">
              <label>Логотип</label>
              <div className="bar" style={{ justifyContent: "flex-start", gap: 16 }}>
                <div className="pv" style={{ width: 64, aspectRatio: "1" }}>
                  {settings.logo_url ? <img src={settings.logo_url} alt="" style={{ objectFit: "contain" }} /> : <span className="hint">по умолч.</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => setImage("logo", e.target.files?.[0])} />
                  <div style={{ marginTop: 8 }}>
                    <button type="button" className="link no" onClick={() => resetImage("logo")}>Сбросить</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fld">
              <label>Главное фото для телефона (необязательно — иначе берётся основное)</label>
              <div className="bar" style={{ justifyContent: "flex-start", gap: 16 }}>
                <div className="pv" style={{ width: 80, aspectRatio: "9/16" }}>
                  {settings.hero_mobile_url ? <img src={settings.hero_mobile_url} alt="" /> : <span className="hint">как основное</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => setImage("hero_m", e.target.files?.[0])} />
                  <div style={{ marginTop: 8 }}>
                    <button type="button" className="link no" onClick={() => resetImage("hero_m")}>Сбросить</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fld">
              <label>Главное фото для компьютера (на входе)</label>
              <div className="bar" style={{ justifyContent: "flex-start", gap: 16 }}>
                <div className="pv" style={{ width: 140, aspectRatio: "16/10" }}>
                  {settings.hero_url ? <img src={settings.hero_url} alt="" /> : <span className="hint">по умолчанию</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => setImage("hero", e.target.files?.[0])} />
                  <div style={{ marginTop: 8 }}>
                    <button type="button" className="link no" onClick={() => resetImage("hero")}>Сбросить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fld wide" style={{ marginTop: 16 }}>
            <label>Фото категорий на главной (если не загружено, берётся фото первого товара)</label>
            <div className="catpics">
              {CATEGORIES.map((c) => (
                <div className="catpic" key={c}>
                  <div className="pv" style={{ width: 72 }}>
                    {settings.category_images?.[c] ? <img src={settings.category_images[c]} alt="" /> : <span className="hint">авто</span>}
                  </div>
                  <b>{c}</b>
                  <input type="file" accept="image/*" aria-label={`Фото: ${c}`} onChange={(e) => setCatImage(c, e.target.files?.[0])} />
                  {settings.category_images?.[c] && (
                    <button type="button" className="link no" onClick={() => resetCatImage(c)}>Сбросить</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="f" style={{ marginTop: 16 }}>
            <div className="fld">
              <label htmlFor="sn">Название</label>
              <input id="sn" value={nameIn} onChange={(e) => setNameIn(e.target.value)} placeholder={SHOP.name} />
            </div>
            <div className="fld">
              <label htmlFor="sw">WhatsApp (с кодом страны)</label>
              <input id="sw" inputMode="tel" value={waIn} onChange={(e) => setWaIn(e.target.value)} placeholder={SHOP.whatsapp || "992900000000"} />
            </div>
            <div className="fld">
              <label htmlFor="stg">Telegram (ник, без @)</label>
              <input id="stg" value={tgIn} onChange={(e) => setTgIn(e.target.value)} placeholder={SHOP.telegram || "golddushanbe"} />
            </div>
            <div className="fld wide">
              <label htmlFor="abr">Описание магазина (под фото на входе)</label>
              <textarea id="abr" rows={4} value={aboutRu} onChange={(e) => setAboutRu(e.target.value)} placeholder="Например: Семейный ювелирный магазин в Душанбе. Золото 585 и 750." />
            </div>
            <div className="fld wide">
              <label htmlFor="abt">Описание на таджикском (необязательно)</label>
              <textarea id="abt" rows={4} value={aboutTj} onChange={(e) => setAboutTj(e.target.value)} />
              <span className="hint">Если пусто, на таджикской версии покажется русский текст. Если пусто везде, будет стандартный текст.</span>
            </div>
            <div><button type="button" className="btn" onClick={saveShop}>Сохранить данные</button></div>
          </div>
          <p className="hint" style={{ marginTop: 14 }}>
            Адрес магазина задаётся в переменных окружения (Vercel → Settings → Environment Variables → NEXT_PUBLIC_ADDRESS).
          </p>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
      <Dock current="admin" />
    </>
  );
}
