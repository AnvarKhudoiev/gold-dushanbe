import { SHOP } from "@/lib/config";

export default function SiteFooter({ whatsapp = SHOP.whatsapp }: { whatsapp?: string }) {
  return (
    <footer className="foot">
      <span>{SHOP.address}</span>
      {whatsapp && (
        <a href={`tel:+${whatsapp}`}>+{whatsapp}</a>
      )}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener">
          WhatsApp: +{whatsapp}
        </a>
      )}
      {SHOP.telegram && (
        <a href={`https://t.me/${SHOP.telegram}`} target="_blank" rel="noopener">
          Telegram: @{SHOP.telegram}
        </a>
      )}
    </footer>
  );
}
