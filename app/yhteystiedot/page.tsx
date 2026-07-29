import type { Metadata } from "next";
import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Yhteystiedot — Contact",
  description: "Ota yhteyttä Northstar Executive. Puhelin, WhatsApp, sähköposti. Pori, Satakunta.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
