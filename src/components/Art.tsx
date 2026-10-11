/** Рисунок-заглушка, пока у товара нет фото (тонкие золотые линии). */
export default function Art({ category }: { category: string }) {
  const g = { stroke: "url(#gold)", fill: "none", strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      {category === "Кольца" && (
        <>
          <circle cx="100" cy="124" r="46" {...g} strokeWidth="7" />
          <polygon points="100,34 122,58 100,84 78,58" fill="url(#gem)" stroke="url(#gold)" strokeWidth="3" />
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
      {category === "Цепочки" && <path d="M24 48 Q100 190 176 48" {...g} strokeWidth="6" strokeDasharray="11 6" />}
      {category === "Браслеты" && <ellipse cx="100" cy="104" rx="72" ry="44" {...g} strokeWidth="8" strokeDasharray="14 6" />}
      {category === "Подвески" && (
        <>
          <path d="M40 40 L100 108 L160 40" {...g} strokeWidth="3" />
          <path d="M100 168 c-34 -22 -42 -40 -30 -56 c10 -12 24 -8 30 4 c6 -12 20 -16 30 -4 c12 16 4 34 -30 56z" {...g} strokeWidth="5" strokeLinejoin="round" />
        </>
      )}
      {category === "Комплекты" && (
        <>
          <circle cx="70" cy="128" r="26" {...g} strokeWidth="6" />
          <polygon points="70,70 82,84 70,100 58,84" fill="url(#gem)" stroke="url(#gold)" strokeWidth="2" />
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
        <polygon points="150,32 190,72 150,122 110,72" fill="url(#gem)" strokeWidth="4" />
        <polyline points="110,72 190,72" strokeWidth="2" />
        <polyline points="150,32 135,72 150,122 165,72 150,32" strokeWidth="2" />
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
