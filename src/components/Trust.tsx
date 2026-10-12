import { T, type Lang } from "@/lib/i18n";
import WaIcon from "./WaIcon";

const I = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Тёмно-синяя полоса с четырьмя пунктами доверия перед футером. */
export default function Trust({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <section className="trust">
      <div className="wrap">
        <ul className="tr">
          <li>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" {...I} aria-hidden="true">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
              <path d="M2 9h20M9 3l3 6 3-6M12 21L9 9M12 21l3-12" />
            </svg>
            <b>{t.tr1t}</b>
            <span>{t.tr1d}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" {...I} aria-hidden="true">
              <path d="M12 3v18M7 21h10M4 7h16" />
              <path d="M4 7l-3 7a3.5 3.5 0 0 0 6 0L4 7zM20 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z" />
            </svg>
            <b>{t.tr2t}</b>
            <span>{t.tr2d}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" {...I} aria-hidden="true">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
              <path d="M8.5 12l2.5 2.5 4.5-5" />
            </svg>
            <b>{t.tr3t}</b>
            <span>{t.tr3d}</span>
          </li>
          <li>
            <WaIcon size={30} />
            <b>{t.tr4t}</b>
            <span>{t.tr4d}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
