import { HeroSection } from "@/components/sections/HeroSection";
import { WhySection } from "@/components/sections/WhySection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PricingTableSection } from "@/components/sections/PricingTableSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { CtaSection } from "@/components/sections/CtaSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Northstar Executive — Premium kuljetukset Pori",
  description: "Satakunnan ensimmäinen premium executive -kuljetuskonsepti. Polestar 4, täsmällinen palvelu, Pori–Helsinki–Turku–Tampere.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <ServicesSection />
      <PricingTableSection />
      <SocialProofSection />
      <CtaSection />
    </>
  );
}
