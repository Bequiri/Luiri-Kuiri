"use client";
import { motion } from "framer-motion";
import { GoldDivider } from "./GoldDivider";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  gold?: boolean;
}

export function SectionHeader({ title, subtitle, center = true, gold = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      {gold ? (
        <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-shimmer">{title}</h2>
      ) : (
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#F5F5F5]">{title}</h2>
      )}
      <GoldDivider className={center ? "max-w-xs mx-auto" : "max-w-xs"} />
      {subtitle && (
        <p className="mt-4 text-[#888888] text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
}
