import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] border-t border-[#D4A853]/20 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="mb-4">
              <div className="text-[#D4A853] font-bold text-xl tracking-[0.15em] font-serif">NORTHSTAR</div>
              <div className="text-[#F5F5F5] text-[9px] tracking-[0.3em] opacity-60">EXECUTIVE</div>
            </div>
            <p className="text-[#888888] text-sm leading-relaxed max-w-xs">
              Premium executive -kuljetukset Satakunnassa.<br />
              Premium executive transfers in Satakunta.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888888] hover:text-[#D4A853] transition-colors text-sm"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${BRAND.phone}`}
                className="text-[#888888] hover:text-[#D4A853] transition-colors text-sm"
              >
                {BRAND.phone}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#F5F5F5] text-xs tracking-widest uppercase mb-6">Sivut</h4>
            <ul className="space-y-3">
              {ROUTES.map((route) => (
                <li key={route.key}>
                  <Link
                    href={route.href}
                    className="text-[#888888] hover:text-[#D4A853] transition-colors text-sm"
                  >
                    {route.fi} / {route.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#F5F5F5] text-xs tracking-widest uppercase mb-6">Yhteystiedot</h4>
            <ul className="space-y-3 text-[#888888] text-sm">
              <li>
                <a href={`tel:${BRAND.phone}`} className="hover:text-[#D4A853] transition-colors">
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`} className="hover:text-[#D4A853] transition-colors">
                  {BRAND.email}
                </a>
              </li>
              <li>{BRAND.city}, {BRAND.region}, Suomi</li>
              <li className="mt-6">
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=Hei, haluaisin varata kyydin.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4A853]/40 text-[#D4A853] text-xs tracking-widest uppercase hover:bg-[#D4A853] hover:text-[#0A0A0A] transition-all rounded-sm"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#D4A853]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#888888] text-xs">
            &copy; {year} {BRAND.name}. Kaikki oikeudet pidätetään.
          </p>
          <div className="flex gap-4 text-[#888888] text-xs">
            <Link href="/yhteystiedot" className="hover:text-[#D4A853] transition-colors">
              Tietosuoja
            </Link>
            <span className="opacity-30">|</span>
            <span>Pori, Finland</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
