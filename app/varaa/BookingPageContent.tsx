"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { SERVICES, FIXED_ROUTES, EXTRAS, DEPOSIT_AMOUNT } from "@/lib/constants";

const schema = z.object({
  service: z.string().min(1, "Valitse palvelu"),
  from: z.string().min(1, "Syötä lähtöpaikka"),
  to: z.string().min(1, "Syötä kohde"),
  date: z.string().min(1, "Valitse päivä"),
  time: z.string().min(1, "Valitse kellonaika"),
  name: z.string().min(2, "Syötä nimi"),
  phone: z.string().min(6, "Syötä puhelinnumero"),
  email: z.string().email("Virheellinen sähköpostiosoite"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = ["Palvelu", "Ajankohta", "Lisäpalvelut", "Tietosi", "Yhteenveto"];

export function BookingPageContent() {
  const [step, setStep] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const watchedValues = watch();

  const estimatedPrice = (() => {
    const route = FIXED_ROUTES.find(
      (r) =>
        r.to.toLowerCase().includes(watchedValues.to?.toLowerCase() || "") ||
        watchedValues.to?.toLowerCase().includes(r.to.split(" ")[0].toLowerCase() || "")
    );
    return route?.priceFi ?? null;
  })();

  const toggleExtra = (key: string) => {
    setSelectedExtras((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ["service", "from", "to"],
      ["date", "time"],
      [],
      ["name", "phone", "email"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          extras: selectedExtras,
          estimatedPrice,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Lähetys epäonnistui. Soita suoraan: +358 40 123 4567");
      }
    } catch {
      setError("Verkkovirhe. Soita suoraan: +358 40 123 4567");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-[#D4A853] text-6xl mb-6">★</div>
          <h1 className="text-3xl font-bold font-serif text-[#F5F5F5] mb-4">
            Varauskyynyö vastaanotettu!
          </h1>
          <p className="text-[#888888] mb-2">
            Vahvistamme varauksen 1-2 tunnin sisällä sähköpostiisi.
          </p>
          <p className="text-[#888888] text-sm italic mb-8">
            We&apos;ll confirm your booking within 1-2 hours by email.
          </p>
          <a
            href="https://wa.me/358401234567?text=Hei, lähetin juuri varauskyynyön."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4A853]/50 text-[#D4A853] text-sm uppercase tracking-widest hover:bg-[#D4A853]/10 transition-colors rounded-sm mb-6"
          >
            Nopeammin? WhatsApp →
          </a>
          <div className="mt-6">
            <Link href="/" className="text-[#888888] text-sm hover:text-[#D4A853] transition-colors">
              ← Takaisin etusivulle
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-serif text-[#F5F5F5] mb-2">Varaa kyyti</h1>
          <p className="text-[#888888]">Book a ride — vahvistus 1-2h sisällä</p>
        </div>

        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i === step
                    ? "bg-[#D4A853] text-[#0A0A0A]"
                    : i < step
                    ? "bg-[#D4A853]/40 text-[#D4A853]"
                    : "bg-[#2a2a2a] text-[#888888]"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-px mx-1 ${i < step ? "bg-[#D4A853]/40" : "bg-[#2a2a2a]"}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <h2 className="text-xl font-bold font-serif text-[#F5F5F5]">Valitse palvelu</h2>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Palvelu</label>
                  <select {...register("service")} className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] outline-none transition-colors">
                    <option value="">-- Valitse --</option>
                    {SERVICES.map((s) => (<option key={s.key} value={s.fi.title}>{s.fi.title} / {s.en.title}</option>))}
                  </select>
                  {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service.message}</p>}
                </div>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Lähtöpaikka</label>
                  <input {...register("from")} placeholder="esim. Pori, Yyterin hotelli..." className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                  {errors.from && <p className="text-red-400 text-xs mt-1">{errors.from.message}</p>}
                </div>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Kohde</label>
                  <input {...register("to")} placeholder="esim. Helsinki-Vantaa, Turku..." className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                  {errors.to && <p className="text-red-400 text-xs mt-1">{errors.to.message}</p>}
                </div>
                {estimatedPrice && (
                  <div className="p-4 border border-[#D4A853]/30 bg-[#D4A853]/10 rounded-sm">
                    <p className="text-[#D4A853] text-sm font-semibold">Arvioitu hinta: {estimatedPrice} €</p>
                    <p className="text-[#888888] text-xs">+ varausmaksu {DEPOSIT_AMOUNT} €</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <h2 className="text-xl font-bold font-serif text-[#F5F5F5]">Päivä ja aika</h2>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Päivä</label>
                  <input type="date" {...register("date")} min={new Date().toISOString().split("T")[0]} className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] outline-none transition-colors" />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Kellonaika</label>
                  <input type="time" {...register("time")} className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] outline-none transition-colors" />
                  {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time.message}</p>}
                </div>
                <div className="p-4 border border-[#2a2a2a] bg-[#111111] rounded-sm">
                  <p className="text-[#888888] text-sm">✈️ Lentokenttäkuljetuksissa seuraamme lennon aikataulua automaattisesti — viivästykset eivät aiheuta lisäkuluja.</p>
                  <p className="text-[#888888] text-xs italic mt-1">For airport transfers, we automatically track your flight — delays never cost extra.</p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#F5F5F5] mb-2">Lisäpalvelut</h2>
                <p className="text-[#888888] text-sm mb-6">Kaikki ilmaisia ellei hinta merkitty · All free unless priced</p>
                {EXTRAS.map((extra) => (
                  <button key={extra.key} type="button" onClick={() => toggleExtra(extra.key)}
                    className={`w-full flex items-center justify-between p-4 border rounded-sm transition-all ${
                      selectedExtras.includes(extra.key) ? "border-[#D4A853] bg-[#D4A853]/10" : "border-[#2a2a2a] bg-[#111111] hover:border-[#D4A853]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedExtras.includes(extra.key) ? "border-[#D4A853] bg-[#D4A853]" : "border-[#888888]"}`}>
                        {selectedExtras.includes(extra.key) && <span className="text-[#0A0A0A] text-xs">✓</span>}
                      </div>
                      <span className="text-[#F5F5F5] text-sm">{extra.fi}</span>
                      <span className="text-[#888888] text-xs italic">· {extra.en}</span>
                    </div>
                    {extra.price > 0 && <span className="text-[#D4A853] text-sm font-semibold">+{extra.price} €</span>}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <h2 className="text-xl font-bold font-serif text-[#F5F5F5]">Yhteystietosi</h2>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Nimi</label>
                  <input {...register("name")} placeholder="Etu- ja sukunimi" className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Puhelin</label>
                  <input {...register("phone")} type="tel" placeholder="+358 40 123 4567" className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Sähköposti</label>
                  <input {...register("email")} type="email" placeholder="sinä@esimerkki.fi" className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-[#888888] text-xs tracking-widest uppercase mb-2">Erityistoiveet (valinnainen)</label>
                  <textarea {...register("notes")} rows={3} placeholder="Lentotunnus, erityistarpeet, toiveet..." className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#D4A853] rounded-sm px-4 py-3 text-[#F5F5F5] placeholder-[#888888] outline-none transition-colors resize-none" />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                <h2 className="text-xl font-bold font-serif text-[#F5F5F5]">Yhteenveto</h2>
                <div className="border border-[#D4A853]/20 rounded-sm overflow-hidden">
                  {[
                    ["Palvelu", watchedValues.service],
                    ["Reitti", `${watchedValues.from} → ${watchedValues.to}`],
                    ["Päivä", watchedValues.date],
                    ["Aika", watchedValues.time],
                    ["Lisäpalvelut", selectedExtras.length > 0 ? selectedExtras.join(", ") : "Ei lisäpalveluja"],
                    ["Nimi", watchedValues.name],
                    ["Puhelin", watchedValues.phone],
                    ["Sähköposti", watchedValues.email],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-3 px-5 border-b border-[#D4A853]/10 odd:bg-[#0f0f0f] even:bg-[#111111]">
                      <span className="text-[#888888] text-sm">{label}</span>
                      <span className="text-[#F5F5F5] text-sm text-right max-w-[60%]">{value || "—"}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 px-5 bg-[#D4A853]/10">
                    <span className="text-[#D4A853] text-sm font-semibold">Varausmaksu</span>
                    <span className="text-[#D4A853] font-bold">{DEPOSIT_AMOUNT} €</span>
                  </div>
                  {estimatedPrice && (
                    <div className="flex justify-between py-3 px-5">
                      <span className="text-[#888888] text-sm">Arvioitu reittihinta</span>
                      <span className="text-[#F5F5F5] text-sm">{estimatedPrice} €</span>
                    </div>
                  )}
                </div>
                <div className="p-4 border border-[#D4A853]/20 bg-[#111111] rounded-sm text-sm text-[#888888]">
                  <p>Lähettämällä tämän lomakkeen hyväksyt, että otamme yhteyttä vahvistaaksemme varauksesi. Varausmaksu {DEPOSIT_AMOUNT} € laskutetaan vahvistuksen yhteydessä.</p>
                  <p className="italic mt-1 text-xs">By submitting, you agree that we contact you to confirm. Deposit of €{DEPOSIT_AMOUNT} invoiced on confirmation.</p>
                </div>
                {error && <div className="p-4 bg-red-900/30 border border-red-500/40 rounded-sm text-red-300 text-sm">{error}</div>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-10">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 border border-[#2a2a2a] text-[#888888] text-sm uppercase tracking-widest hover:border-[#D4A853]/40 hover:text-[#F5F5F5] transition-colors rounded-sm">
                ← Edellinen
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 py-3 bg-[#D4A853] text-[#0A0A0A] text-sm font-bold uppercase tracking-widest hover:bg-[#e8c47a] transition-colors rounded-sm">
                Seuraava →
              </button>
            ) : (
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 bg-[#D4A853] text-[#0A0A0A] text-sm font-bold uppercase tracking-widest hover:bg-[#e8c47a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm">
                {submitting ? "Lähetetään..." : "★ Lähetä varauskyynyö"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
