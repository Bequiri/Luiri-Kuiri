import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Northstar Executive — Premium kuljetukset Pori",
    template: "%s | Northstar Executive",
  },
  description:
    "Satakunnan ensimmäinen premium executive -kuljetuskonsepti. Polestar 4 -sähköauto, täsmällinen palvelu, Pori–Helsinki–Turku–Tampere.",
  keywords: [
    "premium kuljetus Pori",
    "executive chauffeur Satakunta",
    "VIP kyyti Pori Jazz",
    "lentokenttäkuljetus Pori",
    "yrityskuljetus Pori",
    "Northstar Executive",
    "Polestar 4 chauffeur",
  ],
  openGraph: {
    siteName: "Northstar Executive",
    locale: "fi_FI",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F5] antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
