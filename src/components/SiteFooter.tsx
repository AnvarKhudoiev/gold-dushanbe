import { SHOP, fmtPhone } from "@/lib/config";
import { T, type Lang } from "@/lib/i18n";
import Logo from "./Logo";

/** Футер: знак, название, адрес, телефон; плюс плавающая кнопка WhatsApp. */
export default function SiteFooter({
  whatsapp = SHOP.whatsapp,
  telegram = SHOP.telegram,
  lang = "ru",
  name = SHOP.name,
  logoUrl,
}: {
  whatsapp?: string;
  telegram?: string;
  lang?: Lang;
  name?: string;
  logoUrl?: string | null;
}) {
  const t = T[lang];
  return (
    <>
      <footer className="foot2">
        <div className="wrap">
          <div className="fb">
            <Logo url={logoUrl} size={40} />
            <div>
              <b>{name}</b>
              <small>{t.tagHdr}</small>
            </div>
          </div>
          <p className="fl">
            <span>{SHOP.address}</span>
            {whatsapp && <a href={`tel:+${whatsapp}`}>{fmtPhone(whatsapp)}</a>}
            {telegram && (
              <a href={`https://t.me/${telegram}`} target="_blank" rel="noopener">
                Telegram: @{telegram}
              </a>
            )}
          </p>
        </div>
      </footer>
      {whatsapp && (
        <a className="wa-float" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
            <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l5-1.3A9.8 9.8 0 1 0 12 2.2z" fill="#fff" />
            <path d="M8.1 7.1c-.35.3-.85 1-.55 2.3.4 1.7 1.7 3.5 3.4 4.9 1.6 1.3 3.2 2 4.5 1.8.9-.2 1.45-.9 1.55-1.45.1-.4 0-.65-.3-.8l-1.8-.9c-.3-.15-.55-.1-.75.2l-.65.85c-.2.25-.4.3-.7.2-1.05-.45-2.15-1.35-3.05-2.4-.55-.65-.95-1.35-1.05-1.75 0-.3.1-.45.3-.65l.55-.65c.2-.25.2-.5.1-.75L9.3 7.35c-.2-.45-.65-.45-1.2-.25z" fill="#25D366" />
          </svg>
        </a>
      )}
    </>
  );
}
