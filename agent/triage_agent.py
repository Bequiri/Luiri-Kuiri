"""
J4P Triage Agent
Analysoi Telegram-ääniviestit ja ohjaa ne oikeaan Notion-tietokantaan.
Primary: Gemini 2.5 Flash (ILMAINEN) | Fallback: Claude API
"""

import os
import json
import argparse
from datetime import datetime
import anthropic
import google.generativeai as genai
from prompts import TRIAGE_SYSTEM_PROMPT, GEMINI_TRIAGE_PROMPT

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
HRV_RECOVERY_THRESHOLD = 50
READINESS_RECOVERY_THRESHOLD = 60

# Test cases for validation
TEST_CASES = [
    {
        "name": "Normal IDEA",
        "transcription": "Hei, tuli idea että voisimme lisätä drone-kuntotarkastuksen HIANO:n palveluihin. Se on ensin ilmainen tarkastus ja sitten myydään huoltotyö päälle. Marginaali vois olla 50-70%.",
        "hrv_score": 65,
        "readiness": 78,
        "expected_type": "IDEA"
    },
    {
        "name": "ENERGY LOW — recovery block",
        "transcription": "Olen todella väsynyt tänään, ei jaksa tehdä mitään, ehkä pitäisi vain levätä",
        "hrv_score": 38,
        "readiness": 45,
        "expected_type": "ENERGY"
    },
    {
        "name": "TOXIC contact",
        "transcription": "Jenna laittoi viestiä ja haluaa tavata",
        "hrv_score": 70,
        "readiness": 80,
        "expected_type": "TOXIC"
    },
    {
        "name": "LEGAL case",
        "transcription": "Pitää muistaa laittaa Valtiokonttorille rikosvahinkokorvauslomake ja asianajajalle viesti potilastiedoista",
        "hrv_score": 60,
        "readiness": 70,
        "expected_type": "LEGAL"
    }
]


def triage_with_gemini(transcription: str, hrv_score: float | None, readiness: float | None) -> dict:
    """Primary triage using Gemini 2.5 Flash (FREE)."""
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

    context = f"""
HRV_SCORE: {hrv_score if hrv_score else 'ei saatavilla'}
READINESS: {readiness if readiness else 'ei saatavilla'}
AIKALEIMA: {datetime.now().strftime('%Y-%m-%d %H:%M')}

TRANSKRIPTIO:
{transcription}
"""

    prompt = GEMINI_TRIAGE_PROMPT + "\n\nDATA:\n" + context

    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown code blocks if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)


def triage_with_claude(transcription: str, hrv_score: float | None, readiness: float | None) -> dict:
    """Fallback triage using Claude API (paid but higher quality)."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    user_message = f"""
Analysoi seuraava input:

HRV: {hrv_score if hrv_score else 'ei saatavilla'}
Readiness: {readiness if readiness else 'ei saatavilla'}
Aikaleima: {datetime.now().strftime('%Y-%m-%d %H:%M')}

Transkriptio:
{transcription}

Palauta täsmällinen JSON ilman muuta tekstiä.
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=TRIAGE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)


def triage(
    transcription: str,
    hrv_score: float | None = None,
    readiness: float | None = None,
    force_provider: str = "gemini"
) -> dict:
    """
    Main triage function.
    Uses Gemini first (free), falls back to Claude if Gemini fails.
    """

    # Pre-check: toxic contact fast path
    for toxic_name in ["Jenna", "Juuso"]:
        if toxic_name.lower() in transcription.lower():
            return {
                "type": "TOXIC",
                "toxic_contact_detected": toxic_name,
                "fatigue_detected": False,
                "recovery_block_required": False,
                "legal_case_detected": False,
                "sentiment": "Negative",
                "summary": f"Myrkkykontakti tunnistettu: {toxic_name}. Ei toimenpiteitä.",
                "telegram_response": f"⚠️ TOXIC CONTACT DETECTED: {toxic_name}. No action taken. Grey Rock.",
                "notion_fields": {"Title": f"TOXIC: {toxic_name}", "Notes": "Ehdoton NO CONTACT. Ei toimenpiteitä."}
            }

    # Pre-check: recovery block fast path
    recovery_block = False
    if hrv_score and hrv_score < HRV_RECOVERY_THRESHOLD:
        recovery_block = True
    if readiness and readiness < READINESS_RECOVERY_THRESHOLD:
        recovery_block = True

    try:
        if force_provider == "claude":
            result = triage_with_claude(transcription, hrv_score, readiness)
        else:
            result = triage_with_gemini(transcription, hrv_score, readiness)
    except Exception as e:
        print(f"Primary provider failed ({e}), falling back...")
        try:
            result = triage_with_claude(transcription, hrv_score, readiness)
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
            return {
                "type": "ERROR",
                "error": str(e2),
                "telegram_response": "⚠️ Triage-agentti epäonnistui. Tarkista API-avaimet."
            }

    # Enforce recovery block regardless of AI response
    if recovery_block:
        result["recovery_block_required"] = True
        result["fatigue_detected"] = True
        result["telegram_response"] = "🔴 Keho sanoo EI. HRV tai palautuminen liian matala. Palautumisblokki aktiivinen. Uudet projektit jäädytetty."

    return result


def run_tests():
    """Run all test cases and verify outputs."""
    print("🧪 Running J4P Triage Agent tests...\n")
    passed = 0
    failed = 0

    for tc in TEST_CASES:
        print(f"Test: {tc['name']}")
        try:
            result = triage(
                transcription=tc["transcription"],
                hrv_score=tc.get("hrv_score"),
                readiness=tc.get("readiness")
            )
            actual_type = result.get("type", "UNKNOWN")
            expected_type = tc["expected_type"]

            if actual_type == expected_type:
                print(f"  ✅ PASS — type: {actual_type}")
                passed += 1
            else:
                print(f"  ❌ FAIL — expected: {expected_type}, got: {actual_type}")
                print(f"     Response: {result.get('telegram_response', 'N/A')}")
                failed += 1
        except Exception as e:
            print(f"  💥 ERROR — {e}")
            failed += 1
        print()

    print(f"Results: {passed} passed, {failed} failed out of {len(TEST_CASES)} tests")
    return failed == 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="J4P Triage Agent")
    parser.add_argument("--test", action="store_true", help="Run test cases")
    parser.add_argument("--transcription", type=str, help="Text to triage")
    parser.add_argument("--hrv", type=float, help="HRV score from Oura")
    parser.add_argument("--readiness", type=float, help="Readiness score from Oura")
    parser.add_argument("--provider", choices=["gemini", "claude"], default="gemini")
    args = parser.parse_args()

    if args.test:
        success = run_tests()
        exit(0 if success else 1)
    elif args.transcription:
        result = triage(args.transcription, args.hrv, args.readiness, args.provider)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        parser.print_help()
