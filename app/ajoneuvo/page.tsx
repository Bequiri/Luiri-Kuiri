import type { Metadata } from "next";
import { VehiclePageContent } from "./VehiclePageContent";

export const metadata: Metadata = {
  title: "Ajoneuvo — Polestar 4",
  description: "Northstar Executiven ajoneuvona Polestar 4 — luksus-sähköauto, hiljaa, tilava ja täysin päästötön.",
};

export default function VehiclePage() {
  return <VehiclePageContent />;
}
