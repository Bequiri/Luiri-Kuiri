"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  { titleKey: "card1_title", descKey: "card1_desc", icon: "◈" },
  { titleKey: "card2_title", descKey: "card2_desc", icon: "⬟" },
  { titleKey: "card3_title", descKey: "card3_desc", icon: "◇" },
];

export function WhySection() {
  const t = useTranslations("why");

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} gold />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {cards.map((card, i) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ borderColor: "rgba(212,168,83,0.6)", y: -4 }}
              className="relative p-8 border border-[#D4A853]/20 rounded-sm bg-[#111111] transition-all duration-300 group"
            >
              <div className="text-[#D4A853] text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-[#F5F5F5] text-xl font-bold mb-3 font-serif">
                {t(card.titleKey as "card1_title" | "card2_title" | "card3_title")}
              </h3>
              <p className="text-[#888888] leading-relaxed">
                {t(card.descKey as "card1_desc" | "card2_desc" | "card3_desc")}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
