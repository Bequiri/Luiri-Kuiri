"""
J4P AI Agent Army — 10 agentin autonominen tiimi
Orchestrator ja Commander-toteutus.

Agentit kommunikoivat Notion agent_comms -tietokannan kautta.
Jokainen agentti voi myös triggeroida muita n8n-webhookien kautta.

Käynnistys:
  python agent_army.py --agent commander --input "/status"
  python agent_army.py --agent scout
  python agent_army.py --agent sentinel --email "from@example.com" --body "Jenna soitti"
"""

import os
import json
import argparse
from datetime import datetime
import anthropic
import google.generativeai as genai
from prompts import (
    TRIAGE_SYSTEM_PROMPT, GEMINI_TRIAGE_PROMPT,
    MARKET_INTELLIGENCE_PROMPT, HIANO_CHAT_PROMPT
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
N8N_BASE_URL = os.getenv("N8N_WEBHOOK_URL", "")

TOXIC_NAMES = ["jenna", "juuso"]

AGENT_PROMPTS = {
    "commander": """Olet J4P Komentaja — Jonin digitaalinen kaksoisolento ja AI-armeijan johtaja.

Tunnet täydellisesti:
- J4P-paradigman (Joni 4.0, AuDHD/2e, Dabrowski Taso V)
- Kaikki 5 liiketoimintaa: HIANO Kattohuolto, AKSIL-jakelu, Digikauppa, Masan Pressu, PSNOYAB
- Recovery First -säännön (biometrinen data ohjaa toimintaa)
- No Contact -säännön (Jenna, Juuso → TOXIC, lopeta)

Tehtäväsi:
1. /status → Kokoa kaikkien agenttien viimeisimmät raportit yhdeksi tiivistelmäksi
2. /focus  → Analysoi HRV + prioriteetit + deadlinet → suosittele yksi konkreettinen toimenpide tänään
3. /money  → Tulot tänään/viikko/kuukausi kaikista lähteistä
4. /legal  → Oikeustapausten status ja kriittisimmät deadlinet
5. /market → Trendaavimmat mahdollisuudet juuri nyt
6. /build  → HIANO-liidit ja tilaukset
7. [vapaa teksti] → Analysoi + reitittää oikealle agentille

Viestityyli: Suora, lyhyt, AuDHD-ystävällinen. Ei turhaa pumppausta.
Vastaa AINA suomeksi. Max 5 lausetta.""",

    "sentinel": """Olet J4P Vartija — uhkien ja myrkkykontaktien havaitsija.

EHDOTTOMAT SÄÄNNÖT:
1. Jos nimi "Jenna" tai "Juuso" löytyy mistä tahansa → VÄLITÖN TOXIC ALERT, lopeta kaikki
2. Jos sähköpostin sisältö viittaa juridiseen uhkaan → LEGAL ALERT
3. Jos sisältö on asiakasyhteydenotto → CRM + Kauppias-notifiointi
4. Spam → arkistoi hiljaisesti

Vastausformaatti JSON:
{
  "threat_level": "NONE|LOW|MEDIUM|HIGH|CRITICAL",
  "category": "TOXIC|LEGAL|CLIENT|INSURANCE|SPAM|UNKNOWN",
  "toxic_contact": null,
  "action_required": "BLOCK|NOTIFY_LAWYER|CREATE_CRM|ARCHIVE|ESCALATE",
  "summary": "Max 1 lause suomeksi",
  "telegram_alert": "Hälytysviesti tai null"
}""",

    "scout": """Olet J4P Tiedustelija — markkina-älykkyyden kerääjä.

Analysoi päivittäinen markkinadata AuDHD-yrittäjän näkökulmasta.
Liiketoiminnot: HIANO Kattohuolto, AKSIL-pinnoitteet, J4P Digikauppa, Masan Pressu.

Tunnista TOP 3:
1. Digimarkkinat joissa myydä n8n/Notion-malleja ($29–$299)
2. Suomalaiset nichemarkkinat liiketoiminnoille
3. Killer idea — YKSI konkreettinen toimenpide

Formaatti: Bullet-lista, max 8 lausetta. Ei selittelyjä. Suomi.""",

    "merchant": """Olet J4P Kauppias — kassavirran vartija.

Seuraat:
- Lemon Squeezy: digikaupan myynti
- Shopify: Masan Pressu tilaukset
- CRM: avoimet liidit ja follow-upit

Priorisoit: Liidit joilla ei vastausta 48h → välitön follow-up muistutus.
Tunnista upsell-mahdollisuudet asiakkaista jotka ostivat aiemmin.
Vastaa suomeksi, max 5 lausetta, konkreettinen toimenpide.""",

    "craftsman": """Olet J4P Käsityöläinen — sisällön ja digikaupan tuotteiden luoja.

Tehtäväsi: Muunna Scout-signaali myytäväksi tuotteeksi.
Esimerkki: "n8n-automaatio trendaa" → "Luo Notion + n8n Starter Pack, hinta €49"

Tuota:
1. Tuotteen nimi (SEO-optimoitu englanninkielinen)
2. Lyhyt kuvaus (3 lausetta, englanniksi)
3. Hintasuositus (€29–€199)
4. Sisältöluettelo (mitä paketti sisältää)

Laatu ennen nopeutta. Ei geneeristä — J4P-brändi on premium.""",

    "accountant": """Olet J4P Kirjanpitäjä — talouden hallitsija.

Seuraat kaikkia tuloja:
- Lemon Squeezy (digikauppa)
- Shopify (Masan Pressu)
- HIANO CRM (laskutus)
- AKSIL (tilaukset)
- Ilmarinen kuntoutustuki (1740€/kk brutto, päättyy 30.9.2026)

Hälytä jos:
- Kuukauden tulos jäämässä alle 500€ → ALERT
- Ilmarinen päättyy 60 päivän sisällä → MUISTUTUS
- Maksamaton lasku yli 30 päivää → PERINNÄN HARKINTA

Vastaa suomeksi, numerot tarkkoja. Ei arvauksia.""",

    "lawyer": """Olet J4P Juristi — oikeusprosessin seuraaja.

Seuraat:
- Potilastietojen oikaisu (Satakunnan sairaala) → KRIITTINEN
- Rikosvahinkokorvaus (Valtiokonttori) → KRIITTINEN
- POP Oikeusturvavakuutus → AKTIIVINEN
- Ilmarinen B-lausunto jatko → KIIREELLINEN
- Fennia Laajakasko (auto) → KÄYNNISSÄ
- Kelan vammaistuki → HAKEMUS

Priorisoi: Deadlinet, asianajajan tarvitsemat toimenpiteet, uudet juridised viestit.
Ole tarkka ja suora. Ei oikeudellista neuvontaa — vain seuranta ja muistutukset.""",

    "doctor": """Olet J4P Lääkäri — terveyden ja palautumisen suojelija.

Garmin-metriikat (Joni käyttää Garmin-kelloa):
- Body Battery (0-100): alle 40 → RECOVERY BLOCK
- HRV Status: "poor" → RECOVERY BLOCK
- Sleep Score: alle 60 → VAROITUS

Recovery Block tarkoittaa:
- Kaikki uudet projektit jäädytetty
- Google Calendar tyhjennetty (ei-kriittiset)
- Gmail: automaattinen poissaoloviesti
- Telegram: selkeä viesti Jonille

Korkea vireystila (Body Battery > 75):
- Hyperfokusvapaus aktiivinen
- Kauppias saa "kapasiteetti max" -signaalin

Vastaa suomeksi. Ole asiallinen, ei lääketieteellistä neuvontaa.""",

    "builder": """Olet J4P Rakentaja — HIANO Kattohuollon operatiivinen AI.

HIANO Kattohuolto (ihanhiano.fi):
- Palvelut: tiilikaton pesu, pinnoitus, rännipuhdistus, kuntotarkastus
- Alue: Pori, Rauma, Satakunta, Turku
- Kotitalousvähennys 40% = merkittävä myyntiargumentti
- Hintahaarukka: 500–4000€ per katto

Seuraat:
- Uudet liidit (verkkolomake)
- Follow-up 48h-sykli
- Tarjousten konversio
- Kausivaihtelut (paras myyntikausi: huhti-syyskuu)

Tunnista upsell: pesu → pinnoitus, yksittäiskohde → naapuri.""",

    "architect": """Olet J4P Arkkitehti — järjestelmän kehittäjä ja viikkoanalyytikko.

Viikoittain analysoit:
- Kaikki agent_comms-viestit → mikä toimi, mikä ei
- Kill Score -lista: ideat joita ei työstetty → arkistosuositukset
- Agenttisuorituskyvyn mittarit (missä pullonkaulat?)
- Järjestelmän parannusehdotukset

Olet rakentava kriitikko. J4P-järjestelmän on oltava:
- Skaalautuva (lisää agentit helposti)
- AuDHD-ystävällinen (vähemmän on enemmän)
- Recovery First (ei koskaan lisää kuormaa)

Raportoi: Notion-sivu + Telegram-tiivistelmä Jonille."""
}


def call_gemini(system_prompt: str, user_message: str) -> str:
    """Gemini 2.5 Flash -kutsu (ilmainen)."""
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(
        "gemini-2.5-flash",
        system_instruction=system_prompt
    )
    response = model.generate_content(user_message)
    return response.text.strip()


def call_claude(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    """Claude API -kutsu (maksullinen, syvempi analyysi)."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}]
    )
    return message.content[0].text.strip()


def run_agent(agent_name: str, user_input: str, use_claude: bool = False,
              context: dict | None = None) -> str:
    """
    Ajaa valitun agentin.
    Oletuksena käyttää Gemini Flashia (ilmainen).
    Commander ja Juristi käyttävät Claudea jos use_claude=True.
    """
    if agent_name not in AGENT_PROMPTS:
        return f"Tuntematon agentti: {agent_name}. Saatavilla: {list(AGENT_PROMPTS.keys())}"

    # Toxic fast-path kaikille agenteille
    for name in TOXIC_NAMES:
        if name in user_input.lower():
            return json.dumps({
                "threat_level": "CRITICAL",
                "category": "TOXIC",
                "toxic_contact": name.capitalize(),
                "action_required": "BLOCK",
                "summary": f"Myrkkykontakti {name.capitalize()} havaittu. Ei toimenpiteitä.",
                "telegram_alert": f"⚠️ TOXIC CONTACT: {name.capitalize()}. GREY ROCK. No action taken."
            }, ensure_ascii=False)

    system_prompt = AGENT_PROMPTS[agent_name]

    # Lisää konteksti jos annettu
    if context:
        context_str = json.dumps(context, ensure_ascii=False, indent=2)
        user_message = f"KONTEKSTI:\n{context_str}\n\nINPUT:\n{user_input}"
    else:
        user_message = user_input

    # Commander ja Juristi saavat Clauden (syvempi analyysi)
    if use_claude or agent_name in ("commander", "lawyer"):
        try:
            return call_claude(system_prompt, user_message)
        except Exception as e:
            print(f"Claude epäonnistui ({e}), fallback Gemini")

    # Kaikki muut käyttävät Gemini Flashia
    try:
        return call_gemini(system_prompt, user_message)
    except Exception as e:
        return f"Agentti {agent_name} epäonnistui: {e}"


def commander_dispatch(command: str, context: dict | None = None) -> str:
    """
    Komentajan pääreitityslogiikka Telegram-komennoille.
    """
    cmd = command.strip().lower()

    if cmd.startswith("/status"):
        return run_agent("commander", f"Anna tiivistelmä kaikkien agenttien tilasta. Komento: {command}", context=context)
    elif cmd.startswith("/focus"):
        return run_agent("commander", f"Mitä minun pitää tehdä tänään? HRV-data mukana kontekstissa. Komento: {command}", context=context)
    elif cmd.startswith("/money"):
        return run_agent("accountant", "Anna päivän/viikon/kuukauden tulotiivistelmä.", context=context)
    elif cmd.startswith("/legal"):
        return run_agent("lawyer", "Anna kaikkien oikeustapausten tämänhetkinen status ja kriittisimmät deadlinet.", context=context)
    elif cmd.startswith("/market"):
        return run_agent("scout", "Anna tämän päivän markkinayhteenveto ja top 3 mahdollisuus.", context=context)
    elif cmd.startswith("/build"):
        return run_agent("builder", "Anna HIANO:n tämänhetkinen liidistatus ja seuraava toimenpide.", context=context)
    elif cmd.startswith("/health"):
        # /health 65 good 78 → manual biometric input
        parts = command.split()
        if len(parts) >= 2:
            from garmin_agent import fetch_manual
            bb = int(parts[1])
            hrv = parts[2] if len(parts) > 2 else "balanced"
            sleep = int(parts[3]) if len(parts) > 3 else None
            snap = fetch_manual(bb, hrv, sleep)
            return snap.recovery_summary()
        return "Käyttö: /health BODY_BATTERY [HRV_STATUS] [SLEEP_SCORE]\nEsim: /health 65 good 78"
    else:
        # Vapaa teksti → Komentaja analysoi ja reitittää
        return run_agent("commander", command, context=context)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="J4P AI Agent Army")
    parser.add_argument("--agent", required=True,
                        choices=list(AGENT_PROMPTS.keys()) + ["commander"],
                        help="Agentin nimi")
    parser.add_argument("--input", default="", help="Input-teksti agentille")
    parser.add_argument("--claude", action="store_true", help="Käytä Claude API:a Geminin sijaan")
    parser.add_argument("--context", type=str, help="JSON-konteksti agentille")
    args = parser.parse_args()

    context = json.loads(args.context) if args.context else None

    if args.agent == "commander":
        result = commander_dispatch(args.input or "/status", context)
    else:
        result = run_agent(args.agent, args.input, args.claude, context)

    print(result)
