import type { Metadata } from "next";
import { BusinessPageContent } from "./BusinessPageContent";

export const metadata: Metadata = {
  title: "Yrityksille — For Business",
  description: "Northstar Executive yrityksille. Kuukausilaskutus, sopimushinnat, prioriteettivaraukset. Pori, Satakunta.",
};

export default function BusinessPage() {
  return <BusinessPageContent />;
}
