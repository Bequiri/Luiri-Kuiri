"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonials = [
  {
    name: "Markku S.",
    role: "Toimitusjohtaja, Pori",
    text: "Täsmällinen, hiljainen ja täysin ammattimainen. Polestar 4 on täydellinen valinta VIP-asiakkaille. Suosittelen lämpöimästi.",
  },
  {
    name: "Sarah K.",
    role: "Event Director, Helsinki",
    text: "Used Northstar for all executive transfers during Suomi Areena. Flawless service, every single time. Our go-to in Satakunta.",
  },
  {
    name: "Riitta V.",
    role: "Johtaja, Satakunnan Osuuspankki",
    text: "Varaan kyytini aina Northstarin kautta. Kuljettaja odottaa, matkatavarat hoidetaan, ei stressin. Juuri sellainen palvelu kuin johtajat tarvitsevat.",
  },
];

const stats = [
  { value: "100%", label: "Täsmällisyys" },
  { value: "0 €", label: "Viivästylisät lennoissa" },
  { value: "24/7", label: "Saatavilla" },
  { value: "★★★★★", label: "Asiakasarviot" },
];

export function SocialProofSection() {
  return (
    <section className="py-24 px-6 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Mitä asiakkaamme sanovat" subtitle="What our clients say" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-[#D4A853] text-3xl font-bold font-serif mb-1">{stat.value}</div>
              <div className="text-[#888888] text-xs tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-6 border border-[#D4A853]/20 rounded-sm bg-[#111111]"
            >
              <div className="text-[#D4A853] text-sm mb-4">★★★★★</div>
              <p className="text-[#F5F5F5] text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="text-[#F5F5F5] text-sm font-semibold">{t.name}</div>
                <div className="text-[#888888] text-xs">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
