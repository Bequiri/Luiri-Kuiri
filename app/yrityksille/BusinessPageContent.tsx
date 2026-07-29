"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BRAND } from "@/lib/constants";

const plans = [
  { name: "Starter", fi: "Satunnainen", desc: "Yksittäiset matkat kiinteällä hinnalla",
    features: ["Kiinteät reittihinnat", "Ennakkovaraus", "Sähköpostilasku", "WhatsApp-tuki"],
    price: "Reittihinnoittelu", cta: "Varaa kyyti", href: "/varaa" },
  { name: "Business", fi: "Yrityspaketti", desc: "Säännöllinen käyttö sopimushinnoilla",
    features: ["10% alennus reittihinnoista", "Kuukausilaskutus", "Prioriteettivaraus", "Nimetty yhteyshenkölö", "Kuukausiraportti"],
    price: "Tarjouspyyntö", cta: "Pyydä tarjous", href: "#form", featured: true },
  { name: "Premium", fi: "Premium-sopimus", desc: "Kansainväliset vieraat ja jatkuva tarve",
    features: ["Räätälöity sopimushinta", "Kuukausilaskutus", "Prioriteettisaatavuus 24/7", "Dedicated kuljettaja", "Kaikki raportit", "Kalenteri-integraatio"],
    price: "Tarjouspyyntö", cta: "Pyydä tarjous", href: "#form" },
];

const industries = [
  { icon: "🏨", fi: "Hotellit", en: "Hotels" },
  { icon: "🏭", fi: "Teollisuus", en: "Industry" },
  { icon: "🎭", fi: "Tapahtumat", en: "Events" },
  { icon: "⚖️", fi: "Lakitoimistot", en: "Legal" },
  { icon: "🏥", fi: "Terveydenhuolto", en: "Healthcare" },
  { icon: "✈️", fi: "Kansainväliset", en: "International" },
];

export function BusinessPageContent() {
  const [formState, setFormState] = useState({ company: "", name: "", email: "", phone: "", message: "", sent: false, sending: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((s) => ({ ...s, sending: true }));
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "B2B Tarjouspyyntö", from: formState.company, to: "Yrityspaketti",
          date: "Sovitaan", time: "Sovitaan", name: formState.name, phone: formState.phone, email: formState.email, notes: formState.message }),
      });
      setFormState((s) => ({ ...s, sent: true, sending: false }));
    } catch {
      setFormState((s) => ({ ...s, sending: false }));
    }
  };

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Yrityksille" subtitle="For Business — sopimushinnat, kuukausilaskutus, prioriteetti" gold />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-16 text-[#888888]">
          <p className="leading-relaxed">Northstar Executive tekee yrityksesi kuljetustarpeista sujuvia. Kuukausilaskutus, prioriteettivaraukset ja räätälöidyt sopimushinnat.</p>
          <p className="mt-3 text-sm italic">Monthly invoicing, priority bookings and custom contract rates — exactly what business professionals expect.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-sm border ${plan.featured ? "border-[#D4A853] bg-[#D4A853]/5" : "border-[#D4A853]/20 bg-[#111111]"}`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A853] text-[#0A0A0A] text-xs font-bold px-3 py-1 tracking-widest uppercase">SUOSITTU</div>
              )}
              <h3 className="text-[#F5F5F5] text-xl font-bold font-serif mb-1">{plan.name}</h3>
              <p className="text-[#888888] text-xs mb-4">{plan.desc}</p>
              <div className="text-[#D4A853] font-bold mb-6">{plan.price}</div>
              <ul className="space-y-2 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="text-[#888888] text-sm flex items-center gap-2">
                    <span className="text-[#D4A853]">◆</span>{f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} className={`block text-center py-3 text-xs font-bold tracking-widest uppercase rounded-sm transition-colors ${
                plan.featured ? "bg-[#D4A853] text-[#0A0A0A] hover:bg-[#e8c47a]" : "border border-[#D4A853]/40 text-[#D4A853] hover:bg-[#D4A853]/10"
              }`}>{plan.cta}</a>
            </motion.div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] text-center mb-8">Toimialat · Industries</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {industries.map((ind, i) => (
              <motion.div key={ind.fi} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center p-4 border border-[#D4A853]/15 rounded-sm bg-[#111111]">
                <div className="text-2xl mb-2">{ind.icon}</div>
                <div className="text-[#F5F5F5] text-xs font-semibold">{ind.fi}</div>
                <div className="text-[#888888] text-xs italic">{ind.en}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="form" className="scroll-mt-20">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] text-center mb-8">Tarjouspyyntö · Request a Quote</h2>
          {formState.sent ? (
            <div className="text-center py-12">
              <div className="text-[#D4A853] text-4xl mb-4">★</div>
              <p className="text-[#F5F5F5] font-bold mb-2">Tarjouspyyntö lähetetty!</p>
              <p className="text-[#888888] text-sm">Otamme yhteyttä 24 tunnin sisällä.</p>
              <p className="text-[#888888] text-xs italic mt-1">We&apos;ll be in touch within 24 hours.</p>
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 border border-[#D4A853]/40 text-[#D4A853] text-sm hover:bg-[#D4A853]/10 transition-colors rounded-sm">Tai WhatsApp →</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
              {[
                { id: "company", label: "Yritys / Company", placeholder: "Oy Esimerkki Ab", type: "text" },
                { id: "name", label: "Yhteyshenkölö / Contact", placeholder: "Nimi / Name", type: "text" },
                { id: "email", label: "Sähköposti / Email", placeholder: "nimi@yritys.fi", type: "email" },
                { id: "phone", label: "Puhelin / Phone", placeholder: "+358 40 000 0000", type: "tel" },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">{field.label}</label>
                  <input type={field.type} value={formState[field.id as keyof typeof formState] as string}
                    onChange={(e) => setFormState((s) => ({ ...s, [field.id]: e.target.value }))}
                    placeholder={field.placeholder} required
                    className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Viesti / Message</label>
                <textarea rows={4} value={formState.message} onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Kuinka monta matkaa kuukaudessa? Erityistoiveet?"
                  className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors resize-none" />
              </div>
              <button type="submit" disabled={formState.sending}
                className="w-full py-3 bg-[#D4A853] text-[#0A0A0A] font-bold text-sm tracking-widest uppercase hover:bg-[#e8c47a] disabled:opacity-50 transition-colors rounded-sm">
                {formState.sending ? "Lähetetään..." : "Lähetä tarjouspyyntö →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
