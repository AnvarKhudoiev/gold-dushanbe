/** Знак магазина: огранённый камень. Градиент #gold задаётся в ArtDefs. */
export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ flex: "none" }}>
      <polygon points="6,18 14,8 34,8 42,18 24,42" fill="url(#gold)" fillOpacity=".16" />
      <g fill="none" stroke="url(#gold)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <polygon points="6,18 14,8 34,8 42,18 24,42" />
        <polyline points="6,18 42,18" />
        <polyline points="14,8 19,18 24,42 29,18 34,8" />
        <polyline points="19,18 24,8 29,18" />
      </g>
    </svg>
  );
}
