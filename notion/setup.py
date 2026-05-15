"""
J4P Notion Setup — Luo kaikki 10 tietokantaa + pre-populoi kriittiset tiedot.

Vaatii:
  NOTION_API_KEY        — Notion integraation API-avain
  NOTION_PARENT_PAGE_ID — Sivu johon tietokannat luodaan

Ajo:
  python setup.py           # Luo kaikki tietokannat
  python setup.py --check   # Tarkista olemassaolevat
  python setup.py --db ideas # Luo vain Ideas-tietokanta
"""

import os
import json
import argparse
from notion_client import Client

NOTION_API_KEY = os.getenv("NOTION_API_KEY")
PARENT_PAGE_ID = os.getenv("NOTION_PARENT_PAGE_ID")

notion = Client(auth=NOTION_API_KEY)

# Tallenna luotujen tietokantojen ID:t (täytä .env:iin)
CREATED_DB_IDS = {}


def rich_text(content: str) -> list:
    return [{"type": "rich_text", "rich_text": [{"type": "text", "text": {"content": content}}]}]


def select_property(options: list[dict]) -> dict:
    return {"select": {"options": options}}


def multi_select_property(options: list[dict]) -> dict:
    return {"multi_select": {"options": options}}


def create_database(name: str, properties: dict, description: str = "") -> str:
    """Luo Notion-tietokanta ja palauttaa sen ID:n."""
    result = notion.databases.create(
        parent={"type": "page_id", "page_id": PARENT_PAGE_ID},
        title=[{"type": "text", "text": {"content": name}}],
        description=[{"type": "text", "text": {"content": description}}] if description else [],
        properties=properties
    )
    db_id = result["id"]
    CREATED_DB_IDS[name] = db_id
    print(f"  ✅ {name}: {db_id}")
    return db_id


def create_areas_db() -> str:
    return create_database(
        "J4P Areas",
        {
            "Name": {"title": {}},
            "Type": select_property([
                {"name": "Business", "color": "blue"},
                {"name": "Health", "color": "green"},
                {"name": "Legal", "color": "red"},
                {"name": "Personal", "color": "purple"}
            ]),
            "Active": {"checkbox": {}}
        },
        "Elämänalueet — top-level konteksti kaikille muille tietokannoille"
    )


def create_companies_db() -> str:
    db_id = create_database(
        "J4P Companies",
        {
            "Name": {"title": {}},
            "Status": select_property([
                {"name": "Active", "color": "green"},
                {"name": "Building", "color": "yellow"},
                {"name": "Dormant", "color": "gray"},
                {"name": "Planned", "color": "blue"}
            ]),
            "Legal_Entity": {"rich_text": {}},
            "Revenue_MTD": {"number": {"format": "euro"}},
            "Notes": {"rich_text": {}}
        },
        "Liiketoiminnot ja yhtiörakenne"
    )

    # Pre-populoi yritykset
    companies = [
        {"Name": "PEKINVEST OY", "Status": "Active", "Legal_Entity": "Y-tunnus: tarkista"},
        {"Name": "HIANO Kattohuolto", "Status": "Building", "Legal_Entity": "PEKINVEST OY aputoiminimi"},
        {"Name": "AKSIL-jakelu (Pohjoismaat)", "Status": "Building", "Legal_Entity": "PEKINVEST OY"},
        {"Name": "J4P Digikauppa", "Status": "Building", "Legal_Entity": "Lemon Squeezy"},
        {"Name": "Masan Pressu Perheyhtiö", "Status": "Planned", "Legal_Entity": "Shopify"},
        {"Name": "PSNOYAB", "Status": "Dormant", "Legal_Entity": "Partly Sunny & Nice Oy Ab"}
    ]

    for c in companies:
        notion.pages.create(
            parent={"database_id": db_id},
            properties={
                "Name": {"title": [{"text": {"content": c["Name"]}}]},
                "Status": {"select": {"name": c["Status"]}},
                "Legal_Entity": {"rich_text": [{"text": {"content": c["Legal_Entity"]}}]}
            }
        )
    print(f"    → {len(companies)} yritystä lisätty")
    return db_id


def create_contacts_db() -> str:
    db_id = create_database(
        "J4P Contacts",
        {
            "Name": {"title": {}},
            "Toxic_Level": select_property([
                {"name": "None", "color": "green"},
                {"name": "Yellow", "color": "yellow"},
                {"name": "Red", "color": "red"}
            ]),
            "No_Contact": {"checkbox": {}},
            "Last_Contact": {"date": {}},
            "Notes": {"rich_text": {}}
        },
        "CRM-kontaktit — Red = No Contact -suojaus"
    )

    # Pre-populoi TOXIC contacts
    toxic_contacts = [
        {"name": "Jenna", "level": "Red", "note": "NO CONTACT. Narsistinen lähisuhdeväkivalta. Grey Rock."},
        {"name": "Juuso", "level": "Red", "note": "NO CONTACT. Triangulaatio Jennan kanssa. Grey Rock."}
    ]

    for c in toxic_contacts:
        notion.pages.create(
            parent={"database_id": db_id},
            properties={
                "Name": {"title": [{"text": {"content": c["name"]}}]},
                "Toxic_Level": {"select": {"name": c["level"]}},
                "No_Contact": {"checkbox": True},
                "Notes": {"rich_text": [{"text": {"content": c["note"]}}]}
            }
        )
    print(f"    → 2 TOXIC kontaktia lisätty (Jenna, Juuso)")
    return db_id


def create_ideas_db() -> str:
    return create_database(
        "J4P Ideas",
        {
            "Title": {"title": {}},
            "Lifecycle": select_property([
                {"name": "Seedling", "color": "green"},
                {"name": "Growing", "color": "blue"},
                {"name": "Ripe", "color": "yellow"},
                {"name": "Archived", "color": "gray"}
            ]),
            "Energy_Required": select_property([
                {"name": "Low", "color": "green"},
                {"name": "Medium", "color": "yellow"},
                {"name": "High", "color": "orange"},
                {"name": "Hyperfocus", "color": "red"}
            ]),
            "Revenue_Potential": select_property([
                {"name": "< 1k€", "color": "gray"},
                {"name": "1-10k€", "color": "blue"},
                {"name": "10-100k€", "color": "green"},
                {"name": "> 100k€", "color": "yellow"},
                {"name": "Recurring", "color": "purple"}
            ]),
            "Last_Activity": {"date": {}},
            "Notes": {"rich_text": {}}
        },
        "Ideapankki — Dabrowski-lifecycle + automaattinen Kill Score"
    )


def create_crm_db() -> str:
    return create_database(
        "J4P CRM",
        {
            "Title": {"title": {}},
            "Status": select_property([
                {"name": "New Lead", "color": "blue"},
                {"name": "Quoted", "color": "yellow"},
                {"name": "Won", "color": "green"},
                {"name": "Lost", "color": "red"},
                {"name": "Invoiced", "color": "purple"}
            ]),
            "Value": {"number": {"format": "euro"}},
            "Quote_Date": {"date": {}},
            "Follow_Up": {"date": {}},
            "Business_Line": select_property([
                {"name": "HIANO", "color": "blue"},
                {"name": "AKSIL", "color": "green"},
                {"name": "Digikauppa", "color": "purple"},
                {"name": "Masan Pressu", "color": "orange"}
            ]),
            "Notes": {"rich_text": {}}
        },
        "CRM — kaikki liidit ja asiakkuudet"
    )


def create_energy_log_db() -> str:
    return create_database(
        "J4P Energy Log",
        {
            "Title": {"title": {}},
            "Energy_Level": {"number": {}},
            "HRV_Score": {"number": {"format": "number"}},
            "Fatigue_Detected": {"checkbox": {}},
            "Recovery_Block": {"checkbox": {}},
            "Sentiment": select_property([
                {"name": "Positive", "color": "green"},
                {"name": "Neutral", "color": "blue"},
                {"name": "Negative", "color": "orange"},
                {"name": "Distress", "color": "red"}
            ]),
            "Garmin_Source": select_property([
                {"name": "garminconnect", "color": "green"},
                {"name": "sqlite", "color": "blue"},
                {"name": "manual", "color": "yellow"},
                {"name": "unavailable", "color": "gray"}
            ]),
            "Voice_Summary": {"rich_text": {}}
        },
        "Päivittäinen energia + Garmin biometriikka"
    )


def create_legal_case_db() -> str:
    db_id = create_database(
        "J4P Legal Cases",
        {
            "Title": {"title": {}},
            "Type": select_property([
                {"name": "Criminal", "color": "red"},
                {"name": "Insurance", "color": "orange"},
                {"name": "Medical", "color": "blue"},
                {"name": "KELA", "color": "green"},
                {"name": "Ilmarinen", "color": "purple"}
            ]),
            "Status": select_property([
                {"name": "Pending", "color": "yellow"},
                {"name": "Active", "color": "blue"},
                {"name": "Resolved", "color": "green"},
                {"name": "Appealing", "color": "orange"}
            ]),
            "Priority": select_property([
                {"name": "Critical", "color": "red"},
                {"name": "High", "color": "orange"},
                {"name": "Medium", "color": "yellow"}
            ]),
            "Deadline": {"date": {}},
            "Amount_Claimed": {"number": {"format": "euro"}},
            "Amount_Received": {"number": {"format": "euro"}},
            "Responsible_Party": {"rich_text": {}},
            "Lawyer_Action_Required": {"checkbox": {}},
            "Notes": {"rich_text": {}}
        },
        "Oikeusprosessien seuranta — vakuutukset, rikos, KELA, Ilmarinen"
    )

    # Pre-populoi kriittiset tapaukset
    legal_cases = [
        {
            "Title": "Potilastietojen oikaisu — Satakunnan sairaala",
            "Type": "Medical",
            "Status": "Active",
            "Priority": "Critical",
            "Notes": "Virheellinen päihdemerkintä sydänkohtauksen yhteydessä. Laki potilaan asemasta 10§. Asianajaja hoitaa.",
            "Lawyer": True
        },
        {
            "Title": "Rikosvahinkokorvaus — Valtiokonttori",
            "Type": "Criminal",
            "Status": "Active",
            "Priority": "Critical",
            "Amount": 15000,
            "Notes": "Rikosvahinkolaki max 12 000€ tilapäinen haitta + 3 500€ kärsimys. Asianajaja hoitaa.",
            "Lawyer": True
        },
        {
            "Title": "POP Oikeusturvavakuutus aktivointi",
            "Type": "Insurance",
            "Status": "Active",
            "Priority": "Critical",
            "Notes": "Kattaa asianajokulut 10 000-20 000€ (omavastuu 15-20%). Aktivoi ensin ennen muita.",
            "Lawyer": True
        },
        {
            "Title": "Ilmarinen kuntoutustuki — B-lausunto jatko",
            "Type": "Ilmarinen",
            "Status": "Active",
            "Priority": "Critical",
            "Notes": "Nykyinen tuki päättyy 30.9.2026. Psykiatrin/neurologin uusi B-lausunto tarvitaan.",
            "Lawyer": False
        },
        {
            "Title": "Fennia Laajakasko — auto-ilkivalta",
            "Type": "Insurance",
            "Status": "Active",
            "Priority": "High",
            "Notes": "Kattaa auton ilkivallan/turmelemisen. Laita vaatimus asianajajan kautta.",
            "Lawyer": True
        },
        {
            "Title": "Kelan vammaistukihakemus",
            "Type": "KELA",
            "Status": "Pending",
            "Priority": "High",
            "Amount": 257,
            "Notes": "Korotettu vammaistuki 257,82€/kk jos toisen henkilön apu tarpeen. Täytä Kelan lomake.",
            "Lawyer": False
        }
    ]

    for c in legal_cases:
        props = {
            "Title": {"title": [{"text": {"content": c["Title"]}}]},
            "Type": {"select": {"name": c["Type"]}},
            "Status": {"select": {"name": c["Status"]}},
            "Priority": {"select": {"name": c["Priority"]}},
            "Lawyer_Action_Required": {"checkbox": c.get("Lawyer", False)},
            "Notes": {"rich_text": [{"text": {"content": c["Notes"]}}]}
        }
        if "Amount" in c:
            props["Amount_Claimed"] = {"number": c["Amount"]}
        notion.pages.create(parent={"database_id": db_id}, properties=props)

    print(f"    → {len(legal_cases)} oikeustapausta pre-populoitu")
    return db_id


def create_market_signals_db() -> str:
    return create_database(
        "J4P Market Signals",
        {
            "Title": {"title": {}},
            "Signal_Source": select_property([
                {"name": "Google Trends", "color": "blue"},
                {"name": "Reddit", "color": "orange"},
                {"name": "Product Hunt", "color": "red"},
                {"name": "HackerNews", "color": "yellow"},
                {"name": "GitHub", "color": "gray"},
                {"name": "HN+GitHub+ProductHunt", "color": "purple"}
            ]),
            "Opportunity_Type": select_property([
                {"name": "Digital Product", "color": "purple"},
                {"name": "Client Lead", "color": "green"},
                {"name": "Content", "color": "blue"},
                {"name": "Research", "color": "gray"}
            ]),
            "Action_Required": {"checkbox": {}},
            "Summary": {"rich_text": {}},
            "Gemini_Analysis": {"rich_text": {}}
        },
        "Päivittäiset markkinasignaalit Tiedustelija-agentilta"
    )


def create_products_catalog_db() -> str:
    return create_database(
        "J4P Products Catalog",
        {
            "Title": {"title": {}},
            "Type": select_property([
                {"name": "Notion Template", "color": "blue"},
                {"name": "n8n Workflow", "color": "green"},
                {"name": "AI Prompt Pack", "color": "purple"},
                {"name": "Canva Template", "color": "pink"},
                {"name": "Setup Service", "color": "orange"},
                {"name": "Agency Project", "color": "red"}
            ]),
            "Status": select_property([
                {"name": "Draft", "color": "gray"},
                {"name": "Listed", "color": "blue"},
                {"name": "Active", "color": "green"},
                {"name": "Archived", "color": "red"}
            ]),
            "Price_EUR": {"number": {"format": "euro"}},
            "Platform": select_property([
                {"name": "Lemon Squeezy", "color": "yellow"},
                {"name": "Gumroad", "color": "pink"},
                {"name": "Shopify", "color": "green"},
                {"name": "Direct", "color": "blue"}
            ]),
            "Revenue_Total": {"number": {"format": "euro"}},
            "Sales_Count": {"number": {}},
            "Description": {"rich_text": {}}
        },
        "Myytävät digitaalituotteet ja palvelut"
    )


def create_agent_comms_db() -> str:
    return create_database(
        "J4P Agent Comms",
        {
            "Title": {"title": {}},
            "From_Agent": select_property([
                {"name": "commander", "color": "red"},
                {"name": "sentinel", "color": "orange"},
                {"name": "scout", "color": "blue"},
                {"name": "merchant", "color": "green"},
                {"name": "craftsman", "color": "purple"},
                {"name": "accountant", "color": "yellow"},
                {"name": "lawyer", "color": "gray"},
                {"name": "doctor", "color": "pink"},
                {"name": "builder", "color": "brown"},
                {"name": "architect", "color": "default"}
            ]),
            "To_Agent": select_property([
                {"name": "commander", "color": "red"},
                {"name": "sentinel", "color": "orange"},
                {"name": "scout", "color": "blue"},
                {"name": "merchant", "color": "green"},
                {"name": "craftsman", "color": "purple"},
                {"name": "accountant", "color": "yellow"},
                {"name": "lawyer", "color": "gray"},
                {"name": "doctor", "color": "pink"},
                {"name": "builder", "color": "brown"},
                {"name": "architect", "color": "default"},
                {"name": "all", "color": "red"}
            ]),
            "Message_Type": select_property([
                {"name": "Report", "color": "blue"},
                {"name": "Alert", "color": "red"},
                {"name": "Task", "color": "green"},
                {"name": "Request", "color": "yellow"}
            ]),
            "Priority": select_property([
                {"name": "Critical", "color": "red"},
                {"name": "High", "color": "orange"},
                {"name": "Normal", "color": "blue"},
                {"name": "Low", "color": "gray"}
            ]),
            "Status": select_property([
                {"name": "Pending", "color": "yellow"},
                {"name": "Read", "color": "blue"},
                {"name": "Acted", "color": "green"},
                {"name": "Archived", "color": "gray"}
            ]),
            "Content": {"rich_text": {}},
            "Acted_At": {"date": {}}
        },
        "AI Agent Army viestibussi — agentit kommunikoivat tässä"
    )


ALL_DATABASES = {
    "areas": create_areas_db,
    "companies": create_companies_db,
    "contacts": create_contacts_db,
    "ideas": create_ideas_db,
    "crm": create_crm_db,
    "energy_log": create_energy_log_db,
    "legal_case": create_legal_case_db,
    "market_signals": create_market_signals_db,
    "products_catalog": create_products_catalog_db,
    "agent_comms": create_agent_comms_db
}


def setup_all():
    print("🚀 J4P Notion Setup — Luodaan 10 tietokantaa...\n")

    if not NOTION_API_KEY:
        print("❌ NOTION_API_KEY puuttuu! Tarkista .env")
        return

    if not PARENT_PAGE_ID:
        print("❌ NOTION_PARENT_PAGE_ID puuttuu! Tarkista .env")
        return

    for name, fn in ALL_DATABASES.items():
        print(f"\n📋 {name}...")
        fn()

    print("\n" + "="*60)
    print("✅ Kaikki tietokannat luotu!")
    print("\n📋 LISÄÄ NÄMÄ .env:iin:")
    for name, db_id in CREATED_DB_IDS.items():
        env_key = f"NOTION_{name.upper()}_DB_ID"
        print(f"  {env_key}={db_id}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="J4P Notion Setup")
    parser.add_argument("--db", choices=list(ALL_DATABASES.keys()), help="Luo vain yksi tietokanta")
    parser.add_argument("--check", action="store_true", help="Tarkista ympäristömuuttujat")
    args = parser.parse_args()

    if args.check:
        keys = ["NOTION_API_KEY", "NOTION_PARENT_PAGE_ID", "ANTHROPIC_API_KEY",
                "GEMINI_API_KEY", "TELEGRAM_BOT_TOKEN", "GARMIN_EMAIL"]
        for k in keys:
            val = os.getenv(k)
            status = "✅" if val else "❌"
            print(f"  {status} {k}: {'asetettu' if val else 'PUUTTUU'}")
    elif args.db:
        print(f"📋 Luodaan {args.db}...")
        ALL_DATABASES[args.db]()
        print(f"  ID: {CREATED_DB_IDS.get(args.db, 'virhe')}")
    else:
        setup_all()
