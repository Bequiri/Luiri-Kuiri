"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function CtaSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0f0800] to-[#0A0A0A] opacity-50" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 border border-[#D4A853]/10 m-8 rounded-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <div className="text-[#D4A853] text-4xl mb-6">★</div>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#F5F5F5] mb-4">
          Valmis matkaan?
        </h2>
        <p className="text-[#888888] text-lg mb-10">
          Varaa kyyti nyt — vahvistamme 1-2 tunnin sisällä.<br />
          <span className="text-[#D4A853]/70 text-sm">Book now — confirmed within 1-2 hours.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/varaa"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A853] text-[#0A0A0A] font-bold text-sm tracking-widest uppercase hover:bg-[#e8c47a] transition-colors rounded-sm"
            >
              Varaa kyyti / Book a ride
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=Hei, haluaisin varata kyydin.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#D4A853]/50 text-[#D4A853] font-bold text-sm tracking-widest uppercase hover:bg-[#D4A853]/10 transition-colors rounded-sm"
            >
              WhatsApp →
            </a>
          </motion.div>
        </div>

        <p className="text-[#888888] text-sm">
          <a href={`tel:${BRAND.phone}`} className="text-[#D4A853] hover:underline">{BRAND.phone}</a>
          {" · "}
          <a href={`mailto:${BRAND.email}`} className="text-[#D4A853] hover:underline">{BRAND.email}</a>
        </p>
      </motion.div>
    </section>
  );
}
