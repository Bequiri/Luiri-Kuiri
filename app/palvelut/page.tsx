import type { Metadata } from "next";
import { ServicesPageContent } from "./ServicesPageContent";

export const metadata: Metadata = {
  title: "Palvelut — Services",
  description: "Kaikki Northstar Executive -kuljetuspalvelut. Lentokenttäkuljetukset, yrityspakettisopimukset, tapahtumat ja enemmän.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
