import { SHOP } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <span>{SHOP.address}</span>
      {SHOP.whatsapp && (
        <a href={`https://wa.me/${SHOP.whatsapp}`} target="_blank" rel="noopener">
          WhatsApp: +{SHOP.whatsapp}
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
