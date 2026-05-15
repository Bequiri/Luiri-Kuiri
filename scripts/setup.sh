#!/bin/bash
# J4P System Setup Script
# Asenna Python-ympäristö, tarkista riippuvuudet ja valmistele n8n

set -e

echo "🚀 J4P System Setup"
echo "==================="

# Tarkista Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 ei löydy. Asenna: sudo apt install python3 python3-pip python3-venv"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Python $PYTHON_VERSION"

# Luo virtual environment
cd "$(dirname "$0")/.."
REPO_ROOT=$(pwd)

if [ ! -d "venv" ]; then
    echo "📦 Luodaan virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "✅ Virtual environment aktiivinen"

# Asenna Python-riippuvuudet
echo "📦 Asennetaan Python-riippuvuudet..."
pip install -q --upgrade pip
pip install -q -r agent/requirements.txt
pip install -q notion-client  # setup.py:lle

echo "✅ Python-riippuvuudet asennettu"

# Kopioi .env.example jos .env puuttuu
if [ ! -f ".env" ]; then
    cp scripts/.env.example .env
    echo "📋 .env luotu — TÄYTÄ API-AVAIMET ennen jatkamista!"
    echo "   nano .env"
    echo ""
fi

# Tarkista .env
echo "🔍 Tarkistetaan ympäristömuuttujat..."
source .env 2>/dev/null || true

MISSING=0
check_var() {
    if [ -z "${!1}" ]; then
        echo "  ❌ $1 PUUTTUU"
        MISSING=$((MISSING + 1))
    else
        echo "  ✅ $1"
    fi
}

check_var "ANTHROPIC_API_KEY"
check_var "GEMINI_API_KEY"
check_var "NOTION_API_KEY"
check_var "NOTION_PARENT_PAGE_ID"
check_var "TELEGRAM_BOT_TOKEN"
check_var "TELEGRAM_CHAT_ID"
check_var "GROQ_API_KEY"

echo ""
if [ $MISSING -gt 0 ]; then
    echo "⚠️  $MISSING API-avainta puuttuu. Täytä .env ennen jatkamista."
    echo "   Pakolliset: ANTHROPIC/GEMINI + NOTION + TELEGRAM + GROQ"
    exit 1
fi

echo "✅ Kaikki pakolliset API-avaimet asetettu"

# Luo Notion-tietokannat
echo ""
echo "📋 Luodaan Notion-tietokannat..."
cd "$REPO_ROOT"
python3 notion/setup.py

echo ""
echo "🧪 Testataan triage-agentti..."
cd agent
python3 triage_agent.py --transcription "Testaus: Hei tuli idea HIANO-dronepalvelusta" --hrv 65
cd ..

echo ""
echo "✅ Setup valmis!"
echo ""
echo "📋 SEURAAVAT ASKELEET:"
echo "  1. Lisää Notion DB ID:t .env:iin (tulostui yllä)"
echo "  2. Asenna n8n: npm install -g n8n (tai Docker)"
echo "  3. Tuo n8n-työnkulut: n8n/workflows/*.json"
echo "  4. Tuo agenttityönkulut: n8n/workflows/agents/*.json"
echo "  5. Aseta Garmin: GARMIN_EMAIL + GARMIN_PASSWORD .env:iin"
echo "     TAI: käytä /health 65 good 72 Telegramissa manuaalisesti"
echo ""
echo "🤖 Käynnistä AI Agent Army Telegramissa:"
echo "  /status  — kaikkien agenttien tila"
echo "  /focus   — mitä teen tänään?"
echo "  /health 65 good 72 — Garmin manuaalisyöte"
echo ""
echo "💡 Google Cloud lisäys (valinnainen):"
echo "  - Firebase: agenttiviestibussin real-time parantamiseksi"
echo "  - Cloud Run: triage-agentin hostaukseen (2M req/kk ilmainen)"
echo "  - Looker Studio: ilmainen dashboard Google Sheetsistä"
