import type { Metadata } from "next";
import { BookingPageContent } from "./BookingPageContent";

export const metadata: Metadata = {
  title: "Varaa kyyti — Book a Ride",
  description: "Varaa Northstar Executive -kyyti helposti. Täytä tiedot, vahvistamme 1-2 tunnin sisällä.",
};

export default function BookingPage() {
  return <BookingPageContent />;
}
