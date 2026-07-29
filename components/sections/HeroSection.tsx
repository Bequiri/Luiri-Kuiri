"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0f0f0f] to-[#0A0A0A]" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-1/3 h-px bg-gradient-to-r from-transparent to-[#D4A853]/30" />
        <div className="absolute top-3/4 right-0 w-1/3 h-px bg-gradient-to-l from-transparent to-[#D4A853]/30" />
        <div className="absolute top-0 left-1/4 w-px h-1/4 bg-gradient-to-b from-transparent to-[#D4A853]/20" />
        <div className="absolute bottom-0 right-1/4 w-px h-1/4 bg-gradient-to-t from-transparent to-[#D4A853]/20" />
      </div>

      <div className="absolute inset-0">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-[#D4A853]"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 17) % 100}%`,
              opacity: 0.2 + (i % 4) * 0.1,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="w-8 h-px bg-[#D4A853]" />
          <span className="text-[#D4A853] text-xs tracking-[0.3em] uppercase">{t("badge")}</span>
          <div className="w-8 h-px bg-[#D4A853]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
        >
          <span className="text-[#F5F5F5]">{t("title").split("—")[0]}</span>
          {t("title").includes("—") && (
            <>
              <span className="text-[#D4A853]">—</span>
              <br />
              <span className="gold-shimmer">{t("title").split("—")[1]?.trim()}</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#888888] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/varaa"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0A0A0A] font-bold text-sm tracking-widest uppercase hover:bg-[#e8c47a] transition-colors rounded-sm"
            >
              ★ {t("cta_book")}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/hinnat"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#D4A853]/50 text-[#D4A853] font-bold text-sm tracking-widest uppercase hover:bg-[#D4A853]/10 transition-colors rounded-sm"
            >
              {t("cta_pricing")} →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-6 text-[#888888] text-xs tracking-[0.2em] uppercase"
        >
          <div className="w-12 h-px bg-[#D4A853]/30" />
          <span>Polestar 4 · Electric · Zero Emission</span>
          <div className="w-12 h-px bg-[#D4A853]/30" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#888888] text-xs tracking-widest">{t("scroll")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[#D4A853] to-transparent"
        />
      </motion.div>
    </section>
  );
}
