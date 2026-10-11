"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  cat: string;
  setCat: (c: string) => void;
  fOpen: boolean;
  setFOpen: (b: boolean) => void;
  favOnly: boolean;
  setFavOnly: (b: boolean) => void;
  fav: string[];
  toggleFav: (id: string) => void;
  focusQ: number;
  bumpQ: () => void;
};

const Store = createContext<Ctx | null>(null);

/** Общее состояние витрины: категория, фильтры, избранное. Нужно шапке, баннеру и каталогу одновременно. */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cat, setCat] = useState("Все");
  const [fOpen, setFOpen] = useState(false);
  const [favOnly, setFavOnly] = useState(false);
  const [fav, setFav] = useState<string[]>([]);
  const [focusQ, setFocusQ] = useState(0);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("gd_w") || "[]");
      if (Array.isArray(raw)) setFav(raw);
    } catch {}
  }, []);

  const toggleFav = useCallback((id: string) => {
    setFav((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      try {
        localStorage.setItem("gd_w", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const bumpQ = useCallback(() => setFocusQ((n) => n + 1), []);

  const value = useMemo(
    () => ({ cat, setCat, fOpen, setFOpen, favOnly, setFavOnly, fav, toggleFav, focusQ, bumpQ }),
    [cat, fOpen, favOnly, fav, toggleFav, focusQ, bumpQ],
  );
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export function useStore(): Ctx {
  const c = useContext(Store);
  if (!c) throw new Error("useStore вне StoreProvider");
  return c;
}
