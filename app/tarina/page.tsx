import type { Metadata } from "next";
import { StoryPageContent } from "./StoryPageContent";

export const metadata: Metadata = {
  title: "Tarina — Story",
  description: "Northstar Executive — Jonin tarina. Miksi premium-kuljetus Satakunnassa? Missio, arvot ja Polestar 4.",
};

export default function StoryPage() {
  return <StoryPageContent />;
}
