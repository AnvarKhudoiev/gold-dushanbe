/** Рисунок-заглушка, пока у товара нет фото (тонкие золотые линии). */
export default function Art({ category }: { category: string }) {
  const g = { stroke: "url(#gold)", fill: "none", strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      {category === "Кольца" && (
        <>
          <circle cx="100" cy="124" r="46" {...g} strokeWidth="7" />
          <ellipse cx="100" cy="58" rx="21" ry="25" fill="url(#gem)" stroke="url(#gold)" strokeWidth="3" />
          <path d="M84 50 Q100 60 116 50" fill="none" stroke="url(#gold)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {category === "Серьги" &&
        [68, 132].map((x) => (
          <g key={x}>
            <path d={`M${x} 30 v18`} {...g} strokeWidth="3" />
            <path d={`M${x} 48 c-22 30 -26 52 0 70 c26 -18 22 -40 0 -70z`} {...g} strokeWidth="4" />
            <circle cx={x} cy="104" r="7" fill="url(#ruby)" />
          </g>
        ))}
      {category === "Цепочки" && <path d="M24 48 Q100 190 176 48" {...g} strokeWidth="7" strokeDasharray="0.1 11" />}
      {category === "Браслеты" && <ellipse cx="100" cy="104" rx="72" ry="44" {...g} strokeWidth="9" strokeDasharray="0.1 13" />}
      {category === "Подвески" && (
        <>
          <path d="M38 40 Q100 150 162 40" {...g} strokeWidth="3" />
          <path d="M100 168 c-34 -22 -42 -40 -30 -56 c10 -12 24 -8 30 4 c6 -12 20 -16 30 -4 c12 16 4 34 -30 56z" {...g} strokeWidth="5" strokeLinejoin="round" />
        </>
      )}
      {category === "Комплекты" && (
        <>
          <circle cx="70" cy="128" r="26" {...g} strokeWidth="6" />
          <ellipse cx="70" cy="85" rx="11" ry="14" fill="url(#gem)" stroke="url(#gold)" strokeWidth="2" />
          <path d="M132 40 c-14 18 -16 34 0 46 c16 -12 14 -28 0 -46z" {...g} strokeWidth="4" />
          <path d="M168 40 c-14 18 -16 34 0 46 c16 -12 14 -28 0 -46z" {...g} strokeWidth="4" />
          <path d="M130 176 c-22 -14 -28 -26 -20 -36 c6 -8 16 -5 20 3 c4 -8 14 -11 20 -3 c8 10 2 22 -20 36z" {...g} strokeWidth="4" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

/** Большая композиция для обложки, пока не загружено главное фото. */
export function CoverArt() {
  const g = { stroke: "url(#gold)", fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true">
      <g {...g}>
        <circle cx="150" cy="190" r="78" strokeWidth="9" />
        <circle cx="150" cy="190" r="96" strokeWidth="1" opacity=".5" />
        <ellipse cx="150" cy="76" rx="40" ry="46" fill="url(#gem)" strokeWidth="4" />
        <path d="M112 68 Q150 84 188 68" strokeWidth="2" />
        <path d="M150 32 Q132 76 150 120 Q168 76 150 32z" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Градиенты для рисунков; вставляется один раз в layout. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D9C28F" />
          <stop offset=".55" stopColor="#B08A3E" />
          <stop offset="1" stopColor="#7C5C1E" />
        </linearGradient>
        <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4FAFD" />
          <stop offset="1" stopColor="#9FBDCC" />
        </linearGradient>
        <linearGradient id="ruby" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C95466" />
          <stop offset="1" stopColor="#6E1F2F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
