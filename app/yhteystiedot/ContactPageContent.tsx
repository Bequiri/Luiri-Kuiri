"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BRAND } from "@/lib/constants";

export function ContactPageContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "", sent: false, sending: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((s) => ({ ...s, sending: true }));
    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "Yhteydenotto", from: "Yhteystietolomake", to: "Northstar",
          date: "Vapaa", time: "Vapaa", name: form.name, email: form.email, phone: "", notes: form.message }),
      });
      setForm((s) => ({ ...s, sent: true, sending: false }));
    } catch {
      setForm((s) => ({ ...s, sending: false }));
    }
  };

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="Yhteystiedot" subtitle="Contact — tavoitat meidät nopeimmin WhatsAppilla" gold />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="space-y-8">
              {[
                { icon: "📱", title: "WhatsApp", value: BRAND.phone,
                  href: `https://wa.me/${BRAND.whatsapp}?text=Hei, haluaisin varata kyydin.`, cta: "Lähetä viesti →", external: true },
                { icon: "📞", title: "Puhelin", value: BRAND.phone, href: `tel:${BRAND.phone}`, cta: "Soita →", external: false },
                { icon: "✉️", title: "Sähköposti", value: BRAND.email, href: `mailto:${BRAND.email}`, cta: "Kirjoita →", external: false },
                { icon: "📍", title: "Sijainti", value: `${BRAND.city}, ${BRAND.region}, Suomi`, href: null, cta: null, external: false },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="text-2xl w-8 flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-[#D4A853] text-xs tracking-widest uppercase mb-1">{item.title}</div>
                    <div className="text-[#F5F5F5] mb-1">{item.value}</div>
                    {item.href && item.cta && (
                      <a href={item.href} target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-[#888888] text-sm hover:text-[#D4A853] transition-colors">{item.cta}</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <a href={`https://wa.me/${BRAND.whatsapp}?text=Hei, haluaisin varata kyydin.`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#D4A853] text-[#0A0A0A] text-sm font-bold uppercase tracking-widest hover:bg-[#e8c47a] transition-colors rounded-sm">
                💬 WhatsApp-pikaviesti
              </a>
              <a href={`tel:${BRAND.phone}`}
                className="flex items-center justify-center gap-2 py-3 border border-[#D4A853]/40 text-[#D4A853] text-sm font-bold uppercase tracking-widest hover:bg-[#D4A853]/10 transition-colors rounded-sm">
                📞 {BRAND.phone}
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-xl font-bold font-serif text-[#F5F5F5] mb-6">Lähetä viesti</h2>
            {form.sent ? (
              <div className="text-center py-12 border border-[#D4A853]/20 rounded-sm bg-[#111111]">
                <div className="text-[#D4A853] text-4xl mb-4">★</div>
                <p className="text-[#F5F5F5] font-bold mb-2">Viesti lähetetty!</p>
                <p className="text-[#888888] text-sm">Vastaamme mahdollisimman pian.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Nimi / Name", type: "text", placeholder: "Etu Sukunimi" },
                  { id: "email", label: "Sähköposti / Email", type: "email", placeholder: "sinä@esimerkki.fi" },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">{f.label}</label>
                    <input type={f.type} value={form[f.id as keyof typeof form] as string}
                      onChange={(e) => setForm((s) => ({ ...s, [f.id]: e.target.value }))}
                      placeholder={f.placeholder} required
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Viesti / Message</label>
                  <textarea rows={5} value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Kerro tarpeestasi..." required
                    className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors resize-none" />
                </div>
                <button type="submit" disabled={form.sending}
                  className="w-full py-3 bg-[#D4A853] text-[#0A0A0A] font-bold text-sm tracking-widest uppercase hover:bg-[#e8c47a] disabled:opacity-50 transition-colors rounded-sm">
                  {form.sending ? "Lähetetään..." : "Lähetä →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
