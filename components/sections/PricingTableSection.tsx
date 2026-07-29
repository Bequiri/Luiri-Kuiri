"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FIXED_ROUTES } from "@/lib/constants";

export function PricingTableSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Kiinteät reittihinnat"
          subtitle="Fixed route prices — no surprises, no meters"
        />

        <div className="overflow-x-auto">
          <table className="w-full mt-16">
            <thead>
              <tr className="border-b border-[#D4A853]/30">
                <th className="text-left py-3 px-4 text-xs tracking-widest text-[#D4A853] uppercase">Lähtö</th>
                <th className="text-left py-3 px-4 text-xs tracking-widest text-[#D4A853] uppercase">Kohde</th>
                <th className="text-right py-3 px-4 text-xs tracking-widest text-[#D4A853] uppercase">Hinta</th>
              </tr>
            </thead>
            <tbody>
              {FIXED_ROUTES.map((route, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="border-b border-[#D4A853]/10 hover:bg-[#D4A853]/5 transition-colors"
                >
                  <td className="py-4 px-4 text-[#F5F5F5] text-sm">{route.from}</td>
                  <td className="py-4 px-4 text-[#888888] text-sm">{route.to}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-[#D4A853] font-bold">{route.priceFi} €</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-4 border border-[#D4A853]/20 rounded-sm bg-[#111111] text-center"
        >
          <p className="text-[#888888] text-sm mb-3">
            Tarvitsetko muun reitin? — Need a different route?
          </p>
          <Link
            href="/hinnat"
            className="text-[#D4A853] text-sm font-semibold hover:underline"
          >
            Katso kaikki hinnat →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
