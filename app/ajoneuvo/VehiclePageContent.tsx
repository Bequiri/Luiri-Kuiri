"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

const specs = [
  { label: "Malli / Model", value: "Polestar 4 Long Range" },
  { label: "Moottori / Motor", value: "Sähkö / Electric" },
  { label: "Teho / Power", value: "272 hp / 200 kW" },
  { label: "Toimintamatka / Range", value: "Jopa 610 km (WLTP)" },
  { label: "Kiihtyvyys / Acceleration", value: "0–100 km/h 7.4 s" },
  { label: "Huipputorsiini / Torque", value: "343 Nm" },
  { label: "Lataustapa / Charging", value: "AC + DC nopea" },
  { label: "Paino / Weight", value: "2,275 kg" },
  { label: "Istuinpaikat / Seats", value: "4 (1+3)" },
  { label: "Tavaratila / Trunk", value: "526 L + 32 L frunk" },
];

const features = [
  { icon: "🎵", fi: "Musiikkijärjestelmä (Harman Kardon)", en: "Harman Kardon audio" },
  { icon: "❄️", fi: "Istuinten ilmastointi ja lämmitys", en: "Seat ventilation & heating" },
  { icon: "🔌", fi: "USB-C -laturit molemmille", en: "USB-C chargers for all" },
  { icon: "📦", fi: "4G WiFi-hotspot", en: "4G WiFi hotspot" },
  { icon: "🌿", fi: "Vegaaninen sisustus", en: "Vegan interior" },
  { icon: "🔇", fi: "Erittäin hiljainen kabine", en: "Ultra-quiet cabin" },
  { icon: "🌡️", fi: "Kaksivyöhykeilmastointi", en: "Dual-zone climate control" },
  { icon: "💧", fi: "Vesipaketit matkustajille", en: "Water bottles included" },
];

const comparisons = [
  { aspect: "Äänekkyys", northstar: "Lähes äänetön sähkö", taxi: "Dieselmoottori" },
  { aspect: "Hinta/km", northstar: "Kiinteä reittihinta", taxi: "Taksametri + lisät" },
  { aspect: "Kuljettaja", northstar: "Aina sama nimetty kuljettaja", taxi: "Vaihtelee" },
  { aspect: "Varaus", northstar: "Ennakkoon, vahvistus 1-2h", taxi: "Ehkä saatavilla" },
  { aspect: "Lennonseuranta", northstar: "Automaattinen, ilmainen", taxi: "Ei" },
  { aspect: "Päästöt", northstar: "Nolla CO₂", taxi: "Korkeat" },
  { aspect: "Premium", northstar: "✓ Aina", taxi: "✗ Ei" },
];

export function VehiclePageContent() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Polestar 4" subtitle="Ajoneuvo · The Vehicle" gold />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#888888] text-lg leading-relaxed">
            Polestar 4 on ruotsalainen luksus-sähköauto, joka yhdistää urheilullisuuden, kestävyyden ja poikkeuksellisen ajomukavuuden.
            Se on täydellinen valinta executive-kuljetuksiin — hiljaa, tilava ja täysin päästötön.
          </p>
          <p className="text-[#888888] mt-4 italic text-sm">
            The Polestar 4 is a Swedish luxury EV combining sportiness, sustainability, and exceptional comfort —
            silent, spacious, zero-emission.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="relative h-64 sm:h-96 bg-[#111111] border border-[#D4A853]/20 rounded-sm mb-16 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4A853]/5 to-transparent" />
          <div className="text-center">
            <div className="text-[#D4A853] text-6xl mb-4">◈</div>
            <p className="text-[#888888] text-sm">Polestar 4 — kuvat tulossa</p>
            <p className="text-[#888888] text-xs mt-1 italic">Photos coming soon</p>
          </div>
        </motion.div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-8 text-center">Matkustamon ominaisuudet · Cabin Features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.fi} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-4 border border-[#D4A853]/15 rounded-sm bg-[#111111] text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-[#F5F5F5] text-xs font-semibold">{f.fi}</div>
                <div className="text-[#888888] text-xs italic mt-1">{f.en}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-8 text-center">Tekniset tiedot · Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-[#D4A853]/20 rounded-sm overflow-hidden">
            {specs.map((spec, i) => (
              <div key={spec.label} className={`flex justify-between px-6 py-4 ${i % 2 === 0 ? "bg-[#111111]" : "bg-[#0f0f0f]"} border-b border-[#D4A853]/10`}>
                <span className="text-[#888888] text-sm">{spec.label}</span>
                <span className="text-[#F5F5F5] text-sm font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-8 text-center">Northstar vs. Tavallinen taksi</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-[#D4A853]/20 rounded-sm overflow-hidden">
              <thead>
                <tr className="bg-[#111111]">
                  <th className="text-left py-3 px-4 text-xs tracking-widest text-[#888888] uppercase">Kriteeri</th>
                  <th className="text-center py-3 px-4 text-xs tracking-widest text-[#D4A853] uppercase">Northstar</th>
                  <th className="text-center py-3 px-4 text-xs tracking-widest text-[#888888] uppercase">Taksi</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#111111]"}>
                    <td className="py-3 px-4 text-[#888888] text-sm">{row.aspect}</td>
                    <td className="py-3 px-4 text-center text-[#D4A853] text-sm font-semibold">{row.northstar}</td>
                    <td className="py-3 px-4 text-center text-[#888888] text-sm">{row.taxi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Button href="/varaa" variant="gold">Varaa kyyti Polestar 4:llä →</Button>
        </div>
      </div>
    </div>
  );
}
