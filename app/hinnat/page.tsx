import type { Metadata } from "next";
import { PricingPageContent } from "./PricingPageContent";

export const metadata: Metadata = {
  title: "Hinnat — Pricing",
  description: "Northstar Executive kiinteät reittihinnat. Pori–Helsinki, Pori–Turku, Pori–Tampere ja muut reitit. Ei yllätyksiä.",
};

export default function PricingPage() {
  return <PricingPageContent />;
}
