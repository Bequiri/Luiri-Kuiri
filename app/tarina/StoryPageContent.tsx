"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { GoldDivider } from "@/components/ui/GoldDivider";

const values = [
  {
    title: "Luotettavuus",
    en: "Reliability",
    desc: "Jokainen varaus on lupaus. Olemme ajoissa — aina. Lennonseuranta, liikenneanalyysi, varapäivystys.",
  },
  {
    title: "Laatu",
    en: "Quality",
    desc: "Polestar 4, puhtaat sisätilat, vesipullot, laturi käteen, musiikki haluamaksesi. Jokainen detalji harkittu.",
  },
  {
    title: "Täsmällisyys",
    en: "Punctuality",
    desc: "Et odota meitä — me odotamme sinua. Varausmaksu jää sinulle jos myöhästymme.",
  },
];

export function StoryPageContent() {
  return (
    <div className="min-h-screen">
      <div className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <SectionHeader title="Tarina" subtitle="Why Northstar?" gold />
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <p className="text-[#F5F5F5] text-xl leading-relaxed mb-6">
            Satakunnassa ei ollut sellaista palvelua, jota johtajat ja kansainväliset vieraat ansaitsevat.
          </p>
          <p className="text-[#888888] leading-relaxed mb-4">
            Taksijonot lentokentällä. Epävarmuus siitä, saapuuko auto ajoissa. Ei nimetättyjä kuljettajia, ei kiinteätä hintoja, ei premium-kokemusta. Satakunta ansaitsee paremman.
          </p>
          <p className="text-[#888888] leading-relaxed mb-4">
            Northstar Executive syntyi yksinkertaisesta missiosta: tuoda maailmanluokan executive-kuljetuspalvelu Poriin ja koko Satakuntaan. Yksi kuljettaja, yksi auto, täydellinen luotettavuus.
          </p>
          <p className="text-[#888888] leading-relaxed italic text-sm">
            Satakunta had no service that executives and international visitors deserve. Northstar Executive was born from a simple mission: bring world-class chauffeur service to Pori and the entire Satakunta region.
          </p>
        </motion.div>

        <GoldDivider className="mb-16" />

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="h-48 bg-[#111111] border border-[#D4A853]/20 rounded-sm mb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[#D4A853] text-4xl mb-2">◈</div>
            <p className="text-[#888888] text-xs">Joni Pelkonen — Northstar Executive</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] mb-4">Joni Pelkonen — Kuljettaja &amp; perustaja</h2>
          <p className="text-[#888888] leading-relaxed mb-4">
            Porista kotoisin, vuosia kokemusta liikenteestä, asiakaspalvelusta ja premium-palvelun tuottamisesta. Joni perusti Northstar Executiven, koska halusi tehdä asiat oikein — ei kompromisseja, ei lisäveloituksia, ei epävarmuutta.
          </p>
          <p className="text-[#888888] leading-relaxed mb-4">
            Jokaisella matkalla Joni on itse ratissa. Asiakkaat eivät saa tuntematonta kuljettajaa — he saavat Jonin, joka tietää reitin, tuntee asiakkaan toiveet ja on aina ajoissa.
          </p>
          <p className="text-[#888888] leading-relaxed italic text-sm">
            Every ride, Joni is personally at the wheel. No strangers — just one driver who knows the routes, knows your preferences, and is always there on time.
          </p>
        </motion.div>

        <GoldDivider className="mb-16" />

        <div className="space-y-8 mb-16">
          <h2 className="text-2xl font-bold font-serif text-[#F5F5F5] text-center mb-8">Arvot · Values</h2>
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="flex gap-6 p-6 border border-[#D4A853]/15 rounded-sm bg-[#111111]">
              <div className="text-[#D4A853] font-bold text-2xl font-serif leading-none pt-1">0{i + 1}</div>
              <div>
                <h3 className="text-[#F5F5F5] font-bold mb-1">{v.title} <span className="text-[#888888] text-sm italic">· {v.en}</span></h3>
                <p className="text-[#888888] text-sm leading-relaxed">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button href="/varaa" variant="gold">Kokeile itse →</Button>
        </div>
      </div>
    </div>
  );
}
