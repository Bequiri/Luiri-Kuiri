"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES } from "@/lib/constants";

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section className="py-24 px-6 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative border border-[#D4A853]/15 rounded-sm p-6 bg-[#111111] hover:border-[#D4A853]/50 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-[#F5F5F5] text-lg font-bold mb-2 font-serif group-hover:text-[#D4A853] transition-colors">
                {service.fi.title}
              </h3>
              <p className="text-[#888888] text-sm leading-relaxed mb-4">
                {service.fi.description}
              </p>
              <ul className="space-y-1 mb-6">
                {service.fi.details.map((d) => (
                  <li key={d} className="text-xs text-[#888888] flex items-center gap-2">
                    <span className="text-[#D4A853]">◆</span>
                    {d}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <div className="text-[#D4A853] font-bold">
                  {service.basePrice ? (
                    <span>
                      <span className="text-xs text-[#888888] mr-1">{t("from")}</span>
                      {service.basePrice} €
                    </span>
                  ) : (
                    <span className="text-sm">{t("enquire")}</span>
                  )}
                </div>
                <Link
                  href={service.key === "corporate" ? "/yrityksille" : "/varaa"}
                  className="text-xs tracking-widest text-[#888888] group-hover:text-[#D4A853] uppercase transition-colors"
                >
                  {t("book")} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
