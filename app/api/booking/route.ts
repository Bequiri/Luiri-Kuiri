import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BRAND } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      service,
      from,
      to,
      date,
      time,
      extras,
      name,
      phone,
      email,
      notes,
      estimatedPrice,
    } = body;

    const extrasText = extras?.length > 0 ? extras.join(", ") : "Ei lisäpalveluja";

    const emailBody = `
UUSI VARAUSKYYNYÖ — NORTHSTAR EXECUTIVE
========================================

Palvelu: ${service}
Reitti: ${from} → ${to}
Päivä: ${date}
Kellonaika: ${time}
Arvioitu hinta: ${estimatedPrice ? estimatedPrice + " €" : "Pyydä tarjous"}
Varausmaksu: 50 €

ASIAKKAAN TIEDOT
----------------
Nimi: ${name}
Puhelin: ${phone}
Sähköposti: ${email}
Erityistoiveet: ${notes || "Ei toiveita"}
Lisäpalvelut: ${extrasText}

========================================
Vahvista varaus vastaamalla tähän sähköpostiin tai soittamalla asiakkaalle.
    `.trim();

    await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "noreply@northstarexecutive.fi",
      to: process.env.TO_EMAIL ?? BRAND.email,
      subject: `Uusi varauskyynyö: ${name} — ${from} → ${to} (${date})`,
      text: emailBody,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ success: false, error: "Email send failed" }, { status: 500 });
  }
}
