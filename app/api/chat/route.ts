import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FIXED_ROUTES, SERVICES, BRAND } from "@/lib/constants";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const routesText = FIXED_ROUTES.map((r) => `${r.from} → ${r.to}: ${r.priceFi} €`).join("\n");
const servicesText = SERVICES.map((s) => `- ${s.fi.title} (${s.en.title}): alkaen ${s.basePrice ?? "tarjouspyyntö"} €`).join("\n");

const SYSTEM_PROMPT = `You are the AI assistant for Northstar Executive, a premium chauffeur service in Pori, Finland, operating a Polestar 4 electric vehicle.

BRAND: ${BRAND.name}
CITY: ${BRAND.city}, ${BRAND.region}, Finland
PHONE: ${BRAND.phone}
EMAIL: ${BRAND.email}
WHATSAPP: +${BRAND.whatsapp}
VEHICLE: ${BRAND.vehicle} (electric, luxury, zero-emission)

FIXED ROUTES & PRICES:
${routesText}

SERVICES:
${servicesText}

BOOKING DEPOSIT: 50 € for all bookings (invoiced on confirmation)

KEY FACTS:
- NOT a taxi — a premium executive transport concept
- Named driver every time
- Flight tracking for airport transfers (delays never cost extra)
- Available 24/7 by appointment
- Corporate accounts available (monthly invoicing)
- Events: Pori Jazz, Suomi Areena packages available
- Languages: Finnish and English

RULES:
- Answer in the language the user writes in (Finnish or English)
- Be helpful, confident, warm — never pushy or arrogant
- For pricing: give exact route prices if known; say "from X €" for estimates
- For bookings: direct to /varaa (Finnish) or the booking page
- For B2B: direct to /yrityksille
- Keep responses concise — max 3-4 sentences
- If unsure about something specific (e.g. exact availability), direct to phone/WhatsApp`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const anthropicMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Pahoittelut, tekninen ongelma. Soita suoraan: " + BRAND.phone },
      { status: 200 }
    );
  }
}
