"""
J4P Garmin Agent — Biometrinen datakerääjä
Korvaa Oura Ring -integraation.

HUOM (2026): Garmin sulki virallisen API-pääsyn kevään 2026 Cloudflare-suojauksilla.
Tuetut metodit:
  1. garminconnect Python -kirjasto (saattaa toimia, yritetään ensin)
  2. garmin-givemydata SQLite-tietokanta (jos Selenium-työkalu asennettu)
  3. Manuaalinen syöte Telegramista (/health BODY_BATTERY HRV_STATUS SLEEP_SCORE)

Garmin-metriikat (vastaavat Oura-metriikkoja):
  Body Battery (0-100)   ≈ Oura Readiness (1-100)
  HRV Status             ≈ Oura HRV
  Sleep Score            ≈ Oura Sleep
  Stress Level (0-100)   → lisämetriikka
"""

import os
import json
import sqlite3
from datetime import datetime, date, timedelta
from dataclasses import dataclass, asdict

GARMIN_EMAIL = os.getenv("GARMIN_EMAIL")
GARMIN_PASSWORD = os.getenv("GARMIN_PASSWORD")
GARMIN_DB_PATH = os.getenv("GARMIN_DB_PATH", "/data/garmin.db")

# Recovery thresholds
BODY_BATTERY_THRESHOLD = 40   # alle 40 → recovery block
SLEEP_SCORE_THRESHOLD = 60    # alle 60 → recovery warning
HRV_STATUS_RECOVERY = {"poor"}  # näillä statuksilla recovery block


@dataclass
class BiometricSnapshot:
    date: str
    body_battery: int | None       # 0-100, päämetriikka (= Oura readiness)
    hrv_status: str | None         # "poor"|"balanced"|"good"|"prime"
    sleep_score: int | None        # 0-100
    stress_level: int | None       # 0-100
    resting_hr: int | None         # bpm
    steps: int | None
    source: str                    # "garminconnect"|"sqlite"|"manual"
    recovery_block: bool = False
    notes: str = ""

    def to_dict(self) -> dict:
        return asdict(self)

    def recovery_summary(self) -> str:
        """Telegram-ystävällinen tiivistelmä."""
        bb = f"🔋 Body Battery: {self.body_battery}/100" if self.body_battery is not None else "🔋 Body Battery: N/A"
        hrv = f"💓 HRV: {self.hrv_status}" if self.hrv_status else ""
        sleep = f"😴 Uni: {self.sleep_score}/100" if self.sleep_score is not None else ""
        stress = f"⚡ Stressi: {self.stress_level}/100" if self.stress_level is not None else ""
        parts = [p for p in [bb, hrv, sleep, stress] if p]
        status = "🔴 PALAUTUMISBLOKKI AKTIIVINEN" if self.recovery_block else "🟢 Vireystila OK"
        return f"{status}\n" + " | ".join(parts)


def _assess_recovery(snap: BiometricSnapshot) -> BiometricSnapshot:
    """Määrittää recovery_block -lipun metriikkojen perusteella."""
    block = False
    if snap.body_battery is not None and snap.body_battery < BODY_BATTERY_THRESHOLD:
        block = True
        snap.notes += f"Body Battery {snap.body_battery} < {BODY_BATTERY_THRESHOLD}. "
    if snap.hrv_status and snap.hrv_status.lower() in HRV_STATUS_RECOVERY:
        block = True
        snap.notes += f"HRV Status: {snap.hrv_status}. "
    if snap.sleep_score is not None and snap.sleep_score < SLEEP_SCORE_THRESHOLD:
        snap.notes += f"Uni {snap.sleep_score} < {SLEEP_SCORE_THRESHOLD} (varoitus). "
    snap.recovery_block = block
    return snap


def fetch_from_garminconnect(target_date: date | None = None) -> BiometricSnapshot:
    """
    Hakee datan garminconnect-kirjastolla.
    Saattaa epäonnistua Cloudflare-suojauksen takia (2026).
    """
    import garminconnect  # pip install garminconnect

    if target_date is None:
        target_date = date.today()

    date_str = target_date.isoformat()

    client = garminconnect.Garmin(GARMIN_EMAIL, GARMIN_PASSWORD)
    client.login()

    # Body Battery
    bb_data = client.get_body_battery(date_str)
    body_battery = None
    if bb_data and isinstance(bb_data, list):
        charged_values = [d.get("charged", 0) for d in bb_data if d.get("charged")]
        body_battery = max(charged_values) if charged_values else None

    # HRV
    hrv_data = client.get_hrv_data(date_str)
    hrv_status = None
    if hrv_data:
        hrv_summary = hrv_data.get("hrvSummary", {})
        hrv_status = hrv_summary.get("status", "").lower() or None

    # Sleep
    sleep_data = client.get_sleep_data(date_str)
    sleep_score = None
    if sleep_data:
        daily = sleep_data.get("dailySleepDTO", {})
        sleep_score = daily.get("sleepScores", {}).get("overall", {}).get("value")

    # Stress
    stress_data = client.get_stress_data(date_str)
    avg_stress = None
    if stress_data:
        avg_stress = stress_data.get("avgStressLevel")

    # Resting HR
    rhr_data = client.get_rhr_day(date_str)
    resting_hr = rhr_data.get("allMetrics", {}).get("metricsMap", {}).get(
        "WELLNESS_RESTING_HEART_RATE", [{}]
    )
    resting_hr = resting_hr[0].get("value") if resting_hr else None

    # Steps
    stats = client.get_stats(date_str)
    steps = stats.get("totalSteps") if stats else None

    snap = BiometricSnapshot(
        date=date_str,
        body_battery=int(body_battery) if body_battery else None,
        hrv_status=hrv_status,
        sleep_score=int(sleep_score) if sleep_score else None,
        stress_level=int(avg_stress) if avg_stress else None,
        resting_hr=int(resting_hr) if resting_hr else None,
        steps=int(steps) if steps else None,
        source="garminconnect"
    )
    return _assess_recovery(snap)


def fetch_from_sqlite(db_path: str = GARMIN_DB_PATH, target_date: date | None = None) -> BiometricSnapshot:
    """
    Lukee datan garmin-givemydata SQLite-tietokannasta.
    Asennusohjeet: https://github.com/nrvim/garmin-givemydata
    """
    if target_date is None:
        target_date = date.today()

    date_str = target_date.isoformat()

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Body Battery
    cursor.execute(
        "SELECT MAX(body_battery_charged) as bb FROM body_battery WHERE DATE(timestamp) = ?",
        (date_str,)
    )
    row = cursor.fetchone()
    body_battery = row["bb"] if row and row["bb"] else None

    # HRV (approximated from last night)
    cursor.execute(
        "SELECT hrv_weekly_average, hrv_last_night FROM hrv_data WHERE calendar_date = ? LIMIT 1",
        (date_str,)
    )
    row = cursor.fetchone()
    hrv_status = None
    if row:
        # Estimate status from value
        nightly = row["hrv_last_night"] or 0
        if nightly > 60:
            hrv_status = "prime"
        elif nightly > 45:
            hrv_status = "good"
        elif nightly > 30:
            hrv_status = "balanced"
        else:
            hrv_status = "poor"

    # Sleep score
    cursor.execute(
        "SELECT overall_sleep_score FROM sleep WHERE calendar_date = ? LIMIT 1",
        (date_str,)
    )
    row = cursor.fetchone()
    sleep_score = row["overall_sleep_score"] if row else None

    # Stress
    cursor.execute(
        "SELECT avg_stress_level FROM stress WHERE calendar_date = ? LIMIT 1",
        (date_str,)
    )
    row = cursor.fetchone()
    stress_level = row["avg_stress_level"] if row else None

    conn.close()

    snap = BiometricSnapshot(
        date=date_str,
        body_battery=int(body_battery) if body_battery else None,
        hrv_status=hrv_status,
        sleep_score=int(sleep_score) if sleep_score else None,
        stress_level=int(stress_level) if stress_level else None,
        resting_hr=None,
        steps=None,
        source="sqlite"
    )
    return _assess_recovery(snap)


def fetch_manual(body_battery: int, hrv_status: str = "balanced",
                 sleep_score: int | None = None) -> BiometricSnapshot:
    """
    Manuaalinen syöte Telegramista.
    Komento: /health 65 good 78
    """
    snap = BiometricSnapshot(
        date=date.today().isoformat(),
        body_battery=body_battery,
        hrv_status=hrv_status.lower(),
        sleep_score=sleep_score,
        stress_level=None,
        resting_hr=None,
        steps=None,
        source="manual"
    )
    return _assess_recovery(snap)


def get_todays_biometrics(target_date: date | None = None) -> BiometricSnapshot:
    """
    Pääfunktio — yrittää lähteet järjestyksessä.
    1. garminconnect (saattaa olla rikki 2026 Cloudflaren takia)
    2. garmin-givemydata SQLite (jos asennettu)
    3. Palauttaa tyhjän snapin (manuaali täytetään Telegramista)
    """
    # Yritä garminconnect
    if GARMIN_EMAIL and GARMIN_PASSWORD:
        try:
            return fetch_from_garminconnect(target_date)
        except Exception as e:
            print(f"garminconnect epäonnistui: {e} — kokeillaan SQLite")

    # Yritä SQLite
    import os
    if os.path.exists(GARMIN_DB_PATH):
        try:
            return fetch_from_sqlite(GARMIN_DB_PATH, target_date)
        except Exception as e:
            print(f"SQLite epäonnistui: {e}")

    # Fallback: tyhjä snapshotslurring Telegram-manuaalille
    today = (target_date or date.today()).isoformat()
    return BiometricSnapshot(
        date=today,
        body_battery=None,
        hrv_status=None,
        sleep_score=None,
        stress_level=None,
        resting_hr=None,
        steps=None,
        source="unavailable",
        notes="Garmin-data ei saatavilla. Syötä /health BODY_BATTERY (0-100) Telegramissa."
    )


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="J4P Garmin Agent")
    parser.add_argument("--manual", nargs="+", help="Manuaalinen syöte: BODY_BATTERY [HRV_STATUS] [SLEEP_SCORE]")
    parser.add_argument("--date", help="Päivämäärä YYYY-MM-DD (oletuksena tänään)")
    args = parser.parse_args()

    target = date.fromisoformat(args.date) if args.date else None

    if args.manual:
        bb = int(args.manual[0])
        hrv = args.manual[1] if len(args.manual) > 1 else "balanced"
        sleep = int(args.manual[2]) if len(args.manual) > 2 else None
        snap = fetch_manual(bb, hrv, sleep)
    else:
        snap = get_todays_biometrics(target)

    print(json.dumps(snap.to_dict(), ensure_ascii=False, indent=2))
    print("\n" + snap.recovery_summary())
