# J4P SYSTEM ARCHITECTURE — PEKINVEST OY
*Joni 4.0 (J4P) · Second Brain + Business OS · Päivitetty: 2026-05-15*

---

## 1. KOKONAISARKKITEHTUURI

```
┌─────────────────────────────────────────────────────────────────────┐
│                        JONI (AuDHD/2e/Dabrowski V)                  │
│                    "Kaikki input äänellä tai kuvin"                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
              ┌────────────▼──────────────┐
              │    TELEGRAM BOT (input)    │
              │  Ääniviesti / Kuva / Teksti│
              └────────────┬──────────────┘
                           │
              ┌────────────▼──────────────┐
              │     n8n AUTOMAATIOKESKUS   │
              │  (self-hosted VPS ~5€/kk) │
              └──┬────────┬───────┬───────┘
                 │        │       │
    ┌────────────▼┐  ┌────▼─────┐ ┌▼──────────────┐
    │ Groq Whisper│  │Gemini 2.5│ │  Oura Ring API │
    │ (ilmainen)  │  │Flash(ilm)│ │  HRV + Readiness│
    └────────────┬┘  └────┬─────┘ └┬──────────────┘
                 └────────┘        │
                     │             │
              ┌──────▼─────────────▼──────┐
              │   TRIAGE AGENT (Python)    │
              │ Claude API (prim.) tai     │
              │ Gemini Flash (ilmainen)    │
              │                           │
              │ → type: IDEA/TASK/ENERGY/  │
              │         TOXIC/LEGAL       │
              │ → fatigue_detected: bool  │
              │ → recovery_block: bool    │
              └────────┬──────────────────┘
                       │
         ┌─────────────┼──────────────────┐
         │             │                  │
    ┌────▼────┐  ┌─────▼────┐  ┌─────────▼──────┐
    │  NOTION  │  │ TELEGRAM │  │   GOOGLE       │
    │  Life OS │  │  Reply   │  │   SHEETS CRM   │
    │  (9 DB)  │  │          │  │  (HIANO leads) │
    └─────────┘  └──────────┘  └────────────────┘
```

---

## 2. LIIKETOIMINTA-EKOSYSTEEMI

### 2.1 HIANO Kattohuolto (ihanhiano.fi)
- **Status**: Rakennusvaihe
- **Yhtiö**: PEKINVEST OY (aputoiminimi: Hiano Kattohuolto)
- **Asiakkaille näkyvä nimi**: Hiano Kattohuolto / Pekinvest Oy — EI PSNOYAB
- **Tech**: Vanilla HTML + GSAP · Netlify (ilmainen hosting) · n8n webhook · Google Sheets CRM
- **AI**: Claude API chat-widget + kuva-analyysi (vaihe 2)
- **CRM-flow**: Liidi → Google Sheets → Telegram/SMS Jonille → automaattinen vahvistus asiakkaalle
- **Markkinat**: Pori (pää), Rauma, Satakunta, Turku (geo-sivut)

### 2.2 PEKINVEST Pinnoitteet (AKSIL-jakelu)
- **Status**: LOI allekirjoitetaan (PEKINVEST-LOI-2026-001)
- **Kumppani**: AKSIL Sp. z o.o., Dębica, Puola
- **Tuotteet**: AS-LAK (tiilikattomaali) + AKSIKOR PREMIUM/PRIMER (peltikattomaali) + SIL-FAS (julkisivu)
- **Markkinat**: FI+EE+SE (heti) → LV+LT (6kk) → NO+DK (optio 12kk)
- **Hinnoittelu**: Landed cost 3.40€/L → B2B 5.50€/L → Retail 7.70€/L (bruttokate 55%)
- **Volyymi**: 2000L (2026) → 8000L (2027) → 20000L (2028)
- **E-commerce**: Shopify (verkkokauppa) + 3PL (Posti/DHL)
- **Automaatio**: Tilaus → Notion CRM → lasku (Visma/Netvisor) → toimitusilmoitus

### 2.3 J4P Second Brain (Personal OS)
- **Pilari 1**: Saner.ai (päivittäinen idea-dump, ei manuaalista kirjausta)
- **Pilari 2**: Notion (tietokanta — 10 DB + agent_comms — ei käytetä suoraan)
- **Pilari 3**: n8n + Garmin + Whisper (automaatiohermosto)
- **Biometrinen**: Garmin kello → Body Battery + HRV Status → päivittäinen pacing → recovery-blokit
- **AI Agent Army**: 10 erikoistunutta agenttia, 24/7, Notion viestibussi

### 2.4 Digitaalisten tuotteiden myynti
- **Tuotteet**: J4P Notion -mallit · n8n workflow-paketit · AI-promptipaketit · Canva-mallit
- **Kanava**: Lemon Squeezy (EU ALV automaattisesti, 5%+$0.50)
- **Potentiaali**: $500–$1500/kk passiivisesti

### 2.5 Masan Pressu Perheyhtiö (verkkokauppa)
- **Tuotteet**: Pressut, kuomat, suojapeitteet (räätälöidyt)
- **Kanava**: Shopify (MCP kytketty)
- **Malli**: Perheyhtiö, työllistää

---

## 3. API-KERROS JA KUSTANNUKSET

| Työkalu | Tarkoitus | Hinta/kk |
|---------|-----------|----------|
| n8n self-hosted | Automaatiokeskus | ~5€ (VPS) |
| Gemini 2.5 Flash | Triage (ilmainen) | 0€ |
| Claude API | Monimutkaiset analyysit | ~10-30€ |
| Groq Whisper | Äänen transkriptio | 0€ (ilmainen tier) |
| Notion Free | Life OS tietokanta | 0€ |
| Garmin API (unofficial) | Body Battery + HRV biometriikka | 0€ |
| Netlify | HIANO-sivuston hosting | 0€ |
| Google Sheets | HIANO CRM | 0€ |
| Microsoft Clarity | HIANO analytics | 0€ |
| Lemon Squeezy | Digikauppa | 0€ + 5% |
| Shopify | Masan Pressu | $29/kk |
| **YHTEENSÄ** | | **~35-60€/kk** |

---

## 4. KRIITTISET SÄÄNNÖT (koodattu kaikkialle)

### Recovery First
- HRV alle raja-arvon TAI readiness < 60 → `recovery_block = true`
- Triage estää uudet Notion-kirjaukset
- Google Calendar: poista ei-kriittiset tapaamiset
- Telegram: "🔴 Keho palautuu. Tänään vain oleellinen."

### No Contact
- "Jenna" tai "Juuso" mainitaan missä tahansa input → `type: TOXIC`
- Välitön Telegram-hälytys: "⚠️ TOXIC CONTACT DETECTED"
- Notion Contact: No_Contact = true
- Ei toimenpiteitä näiden nimien puolesta

### Dabrowski V — Autenttisuus
- Järjestelmä ei koskaan pakota lineaarisia normeja
- Hyperfokus hyväksytty ja tuettu (ei "sinun pitäisi pitää taukoja")
- Epälineaarinen ajattelu = feature, ei bug

### Kill Score
- Idea jolla Kill_Score > 70 → Archive_Candidate = true
- Kaava: (päiviä luomisesta × 0.4) + (päiviä aktiviteetista × 0.35) + (lifecycle × 0.25)

---

## 5. AI AGENT ARMY — 10 AGENTTIA 24/7

| # | Agentti | Ajastus | Päätehtävä |
|---|---------|---------|------------|
| 1 | **Komentaja** | 08:00 + Telegram | Orchestroi, aamubriefing, Telegram-komennot |
| 2 | **Vartija** | Jatkuva | Gmail + Telegram uhkasuodatus, No Contact |
| 3 | **Tiedustelija** | 06:00 | HN + GitHub + Product Hunt markkina-analyysi |
| 4 | **Kauppias** | Tunneittain | Lemon Squeezy + Shopify myynti, follow-upit |
| 5 | **Käsityöläinen** | Scout-trigger | Trendistä → digikauppatuote (Canva + Gemini) |
| 6 | **Kirjanpitäjä** | 09:00 | Tulot kaikista lähteistä, Ilmarinen-hälytykset |
| 7 | **Juristi** | Maanantai | Legal Cases deadlinet, Valtiokonttori, vakuutukset |
| 8 | **Lääkäri** | 07:30 | Garmin Body Battery → recovery block tai hyperfokusvapaus |
| 9 | **Rakentaja** | Liidi+viikko | HIANO liidit, tarjouslaskuri, follow-up 48h |
| 10 | **Arkkitehti** | Sunnuntai | Kill Score, agenttisuorituskyky, järjestelmän kehitys |

**Viestibussi**: Notion `agent_comms` DB — agentit kirjoittavat/lukevat toisilleen
**Telegram-komennot**: `/status` `/focus` `/money` `/legal` `/market` `/build` `/health`

## 6. GOOGLE CLOUD INTEGRAATIO

| Palvelu | Käyttö | Hinta |
|---------|--------|-------|
| **Google AI Studio** | Gemini 2.5 Flash triage (pääagentti) | 0€ |
| **Google Workspace** | Drive + Calendar + Gmail (MCP-yhteydet valmiina) | 0€ |
| **Google Sheets** | HIANO CRM, kevyt backup-tietokanta | 0€ |
| **Looker Studio** | Ilmainen dashboard Sheets-datasta | 0€ |
| **Firebase** | Agenttiviestibussin real-time vaihtoehto | 0€ (free tier) |
| **Cloud Run** | Triage-agentin API-hosting (2M req/kk ilmainen) | 0€ |
| **Google Maps API** | HIANO-asiakaskartta | 0-5€/kk |
| **YouTube Data API** | Trendivideo-analyysi markkina-älykkyyteen | 0€ |

**Gemini Pro -tilaus** (jpelkonen88@gmail.com): Antaa pääsyn Gemini Advancediin kuluttajasovelluksessa.
API-käyttö on erillinen — ilmainen Gemini API (AI Studio) on paras valinta J4P:lle nyt.

## 7. GARMIN-INTEGRAATIO (korvaa Oura)

**Metriikat**: Body Battery (0-100) + HRV Status (poor/balanced/good/prime) + Sleep Score + Stress

**Tilanne (2026)**: Garmin otti käyttöön Cloudflare-suojaukset maaliskuussa 2026, mikä rikkoi useimmat kirjastot.

**Priorisoitu integraatiostrategia:**
1. `garminconnect` Python-kirjasto — kokeillaan ensin (saattaa toimia)
2. `garmin-givemydata` + SQLite (github.com/nrvim/garmin-givemydata) — Selenium-bypass, suositeltavin
3. **Manuaali-fallback**: `/health 65 good 72` Telegramissa → Lääkäri-agentti käsittelee

**Recovery thresholds:**
- Body Battery < 40 → RECOVERY BLOCK (kalenteri tyhjennetään, uudet projektit jäädytetään)
- HRV Status = "poor" → RECOVERY BLOCK
- Body Battery > 75 + HRV ≠ "poor" → HYPERFOKUSVAPAUS

## 8. CREDENTIALS CHECKLIST

```
.env tiedostoon (ÄLÄ COMMITOI):
□ ANTHROPIC_API_KEY        → claude.ai → Settings → API
□ GEMINI_API_KEY           → aistudio.google.com (jpelkonen88@gmail.com) → Get API key
□ NOTION_API_KEY           → notion.so → Settings → Integrations
□ NOTION_PARENT_PAGE_ID    → URL:sta oikeasta sivusta
□ TELEGRAM_BOT_TOKEN       → BotFather @telegram
□ TELEGRAM_CHAT_ID         → @userinfobot
□ GROQ_API_KEY             → console.groq.com (ilmainen Whisper!)
□ GARMIN_EMAIL             → Garmin Connect -sähköposti
□ GARMIN_PASSWORD          → Garmin Connect -salasana
□ N8N_WEBHOOK_URL          → n8n:n automaattinen URL
□ LEMON_SQUEEZY_API_KEY    → app.lemonsqueezy.com
□ SHOPIFY_ACCESS_TOKEN     → Shopify Admin → Apps → API
□ GOOGLE_SHEETS_ID         → HIANO CRM Google Sheets URL
□ REDDIT_CLIENT_ID         → reddit.com/prefs/apps (ilmainen)
□ REDDIT_CLIENT_SECRET     → Reddit app secret
```

---

## 9. QUICK START (15 min)

```bash
# 1. Kloonaa ja asenna
git clone https://github.com/bequiri/luiri-kuiri
cd luiri-kuiri
cp scripts/.env.example .env
# Täytä API-avaimet .env:iin

# 2. Asenna Python-riippuvuudet
cd agent && pip install -r requirements.txt

# 3. Luo Notion-tietokannat
cd ../notion && python setup.py

# 4. Testaa triage-agentti
cd ../agent && python triage_agent.py --test

# 5. Tuo n8n-työnkulut
# n8n UI → Import → valitse n8n/workflows/*.json

# 6. Testaa koko putki
# Telegram: lähetä ääniviesti → tarkista Notion
```
