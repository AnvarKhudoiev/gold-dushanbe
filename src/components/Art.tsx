/** Рисунок-заглушка, пока у товара нет фото. */
export default function Art({ category }: { category: string }) {
  const g = { stroke: "url(#gold)", fill: "none", strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      {category === "Кольца" && (
        <>
          <circle cx="100" cy="124" r="46" {...g} strokeWidth="12" />
          <polygon points="100,34 122,58 100,84 78,58" fill="url(#gem)" stroke="url(#gold)" strokeWidth="4" />
        </>
      )}
      {category === "Серьги" &&
        [68, 132].map((x) => (
          <g key={x}>
            <path d={`M${x} 30 v18`} {...g} strokeWidth="4" />
            <path d={`M${x} 48 c-22 30 -26 52 0 70 c26 -18 22 -40 0 -70z`} fill="url(#gold)" />
            <circle cx={x} cy="104" r="7" fill="url(#ruby)" />
          </g>
        ))}
      {category === "Цепочки" && <path d="M24 48 Q100 190 176 48" {...g} strokeWidth="9" strokeDasharray="13 6" />}
      {category === "Браслеты" && <ellipse cx="100" cy="104" rx="72" ry="44" {...g} strokeWidth="12" strokeDasharray="16 6" />}
      {category === "Подвески" && (
        <>
          <path d="M40 40 L100 108 L160 40" {...g} strokeWidth="5" />
          <path d="M100 168 c-34 -22 -42 -40 -30 -56 c10 -12 24 -8 30 4 c6 -12 20 -16 30 -4 c12 16 4 34 -30 56z" fill="url(#gold)" />
        </>
      )}
    </svg>
  );
}

/** Градиенты для рисунков; вставляется один раз в layout. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3D58B" />
          <stop offset=".5" stopColor="#C99A3F" />
          <stop offset="1" stopColor="#8E6420" />
        </linearGradient>
        <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9F7FF" />
          <stop offset="1" stopColor="#7FB7D6" />
        </linearGradient>
        <linearGradient id="ruby" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A8A" />
          <stop offset="1" stopColor="#A5162B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
