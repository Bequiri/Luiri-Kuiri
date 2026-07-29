"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES } from "@/lib/constants";

export function ServicesPageContent() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Palvelut" subtitle="Services — kaikki kiinteähintaisena, ilman yllätyksiä" gold />

        <div className="space-y-12 mt-16">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-[#D4A853]/20 rounded-sm bg-[#111111]"
            >
              <div>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-1">{service.fi.title}</h2>
                <p className="text-[#888888] text-sm mb-1 italic">{service.en.title}</p>
                <p className="text-[#888888] leading-relaxed mt-4">{service.fi.description}</p>
                <p className="text-[#888888] leading-relaxed mt-2 text-sm italic">{service.en.description}</p>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-[#D4A853] text-xs tracking-widest uppercase mb-3">Sisältää · Includes</h3>
                  <ul className="space-y-2">
                    {service.fi.details.map((d, j) => (
                      <li key={d} className="text-[#888888] text-sm flex items-center gap-2">
                        <span className="text-[#D4A853]">◆</span>
                        {d}
                        <span className="text-[#888888]/40 text-xs">· {service.en.details[j]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    {service.basePrice ? (
                      <div className="text-[#D4A853] font-bold text-2xl">
                        <span className="text-[#888888] text-sm mr-1">alkaen</span>
                        {service.basePrice} €
                      </div>
                    ) : (
                      <div className="text-[#888888] text-sm">Hinta pyydettäessä · Price on request</div>
                    )}
                  </div>
                  <Link href={service.key === "corporate" ? "/yrityksille" : "/varaa"}
                    className="px-5 py-2.5 bg-[#D4A853] text-[#0A0A0A] text-xs font-bold tracking-widest uppercase hover:bg-[#e8c47a] transition-colors rounded-sm">
                    {service.key === "corporate" ? "Tarjouspyyntö" : "Varaa"}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
