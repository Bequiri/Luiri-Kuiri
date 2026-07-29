"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FIXED_ROUTES, SERVICES, DEPOSIT_AMOUNT } from "@/lib/constants";

const eventPrices = [
  { event: "Pori Jazz (1 matka)", price: 80 },
  { event: "Pori Jazz (VIP-paketti 3 matkaa)", price: 220 },
  { event: "Suomi Areena (päivä)", price: 350 },
  { event: "Yksityinen illalliskuljetus", price: 120 },
  { event: "Häärattaat (4h)", price: 480 },
];

export function PricingPageContent() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="Hinnat" subtitle="Fixed pricing — no meters, no surprises" gold />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-5 border border-[#D4A853]/40 bg-[#D4A853]/10 rounded-sm text-center">
          <p className="text-[#D4A853] font-semibold">Varausmaksu kaikista varauksista: {DEPOSIT_AMOUNT} €</p>
          <p className="text-[#888888] text-sm mt-1 italic">Booking deposit for all reservations: €{DEPOSIT_AMOUNT} — invoiced upon confirmation</p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-6">Kiinteät reittihinnat · Fixed Routes</h2>
          <div className="overflow-x-auto border border-[#D4A853]/20 rounded-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[#111111] border-b border-[#D4A853]/20">
                  <th className="text-left py-3 px-5 text-xs tracking-widest text-[#D4A853] uppercase">Lähtö</th>
                  <th className="text-left py-3 px-5 text-xs tracking-widest text-[#D4A853] uppercase">Kohde · Destination</th>
                  <th className="text-right py-3 px-5 text-xs tracking-widest text-[#D4A853] uppercase">Hinta</th>
                  <th className="text-right py-3 px-5 text-xs tracking-widest text-[#888888] uppercase">Varaa</th>
                </tr>
              </thead>
              <tbody>
                {FIXED_ROUTES.map((route, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className={`border-b border-[#D4A853]/10 hover:bg-[#D4A853]/5 transition-colors ${i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#111111]"}`}>
                    <td className="py-4 px-5 text-[#888888] text-sm">{route.from}</td>
                    <td className="py-4 px-5 text-[#F5F5F5] text-sm">{route.to}</td>
                    <td className="py-4 px-5 text-right text-[#D4A853] font-bold">{route.priceFi} €</td>
                    <td className="py-4 px-5 text-right">
                      <Link href="/varaa" className="text-xs text-[#888888] hover:text-[#D4A853] transition-colors">Varaa →</Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[#888888] text-xs">* Hinnat ovat yhdenuuntaiselle matkalle. Paluumatka lisätään erikseen. Prices are one-way. Return trips priced separately.</p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-6">Palveluhinnat · Service Pricing</h2>
          <div className="space-y-3">
            {SERVICES.map((s) => (
              <div key={s.key} className="flex items-center justify-between py-4 px-5 border-b border-[#D4A853]/10 bg-[#111111] rounded-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <div className="text-[#F5F5F5] text-sm font-semibold">{s.fi.title}</div>
                    <div className="text-[#888888] text-xs italic">{s.en.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  {s.basePrice ? (
                    <div className="text-[#D4A853] font-bold">alkaen {s.basePrice} €</div>
                  ) : (
                    <Link href="/yrityksille" className="text-[#D4A853] text-sm hover:underline">Pyydä tarjous →</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-6">Tapahtumapaketit · Event Packages</h2>
          <div className="border border-[#D4A853]/20 rounded-sm overflow-hidden">
            {eventPrices.map((ep, i) => (
              <div key={ep.event} className={`flex justify-between py-4 px-5 border-b border-[#D4A853]/10 ${i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#111111]"}`}>
                <span className="text-[#F5F5F5] text-sm">{ep.event}</span>
                <span className="text-[#D4A853] font-bold">{ep.price} €</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-8 border border-[#D4A853]/30 bg-[#111111] rounded-sm text-center">
          <div className="text-[#D4A853] text-3xl mb-4">🏢</div>
          <h3 className="text-[#F5F5F5] text-xl font-bold font-serif mb-2">Yrityspakettisopimukset</h3>
          <p className="text-[#888888] text-sm mb-2">Corporate Account Pricing</p>
          <p className="text-[#888888] leading-relaxed text-sm mb-6">Kuukausilaskutus, sopimushinnat, prioriteettivaraukset. Monthly invoicing, contract rates, priority booking.</p>
          <Link href="/yrityksille" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A853] text-[#0A0A0A] text-sm font-bold tracking-widest uppercase hover:bg-[#e8c47a] transition-colors rounded-sm">
            Pyydä tarjous / Request quote
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
