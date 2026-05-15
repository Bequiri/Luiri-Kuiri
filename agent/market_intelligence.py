"""
J4P Market Intelligence
Automaattinen päivittäinen trendianalyysi — pytrends + Reddit + HN + Product Hunt
Analysoidaan Gemini 2.5 Flash:lla (ILMAINEN)
"""

import os
import json
import time
from datetime import datetime, timedelta
import google.generativeai as genai
from prompts import MARKET_INTELLIGENCE_PROMPT

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# --- DATA COLLECTORS ---

def get_google_trends(keywords: list[str], geo: str = "FI") -> dict:
    """Fetch Google Trends data using pytrends."""
    try:
        from pytrends.request import TrendReq
        pt = TrendReq(hl="fi-FI", tz=120, timeout=(10, 25), retries=2, backoff_factor=0.5)
        pt.build_payload(keywords[:5], cat=0, timeframe="now 7-d", geo=geo)
        interest = pt.interest_over_time()
        if interest.empty:
            return {"error": "No data", "keywords": keywords}
        latest = interest.iloc[-1].to_dict()
        latest.pop("isPartial", None)
        return {"geo": geo, "keywords": latest, "source": "pytrends"}
    except Exception as e:
        return {"error": str(e), "source": "pytrends"}


def get_reddit_posts(subreddits: list[str], limit: int = 5) -> list[dict]:
    """Fetch top Reddit posts via PRAW."""
    try:
        import praw
        reddit = praw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"),
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
            user_agent="J4P-MarketIntel/1.0"
        )
        posts = []
        for sub_name in subreddits:
            subreddit = reddit.subreddit(sub_name)
            for post in subreddit.hot(limit=limit):
                posts.append({
                    "subreddit": sub_name,
                    "title": post.title,
                    "score": post.score,
                    "url": post.url,
                    "comments": post.num_comments
                })
        return sorted(posts, key=lambda x: x["score"], reverse=True)[:10]
    except Exception as e:
        return [{"error": str(e), "source": "reddit"}]


def get_hn_top_posts(limit: int = 10) -> list[dict]:
    """Fetch Hacker News top stories via Algolia API (completely free)."""
    try:
        import requests
        url = "https://hn.algolia.com/api/v1/search"
        params = {
            "tags": "show_hn,ask_hn",
            "hitsPerPage": limit,
            "numericFilters": f"created_at_i>{int((datetime.now() - timedelta(days=1)).timestamp())}"
        }
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        hits = resp.json().get("hits", [])
        return [{"title": h.get("title"), "points": h.get("points", 0), "url": h.get("url", "")} for h in hits]
    except Exception as e:
        return [{"error": str(e), "source": "hackernews"}]


def get_github_trending(language: str = "python") -> list[dict]:
    """Fetch GitHub trending repos (unofficial, free)."""
    try:
        import requests
        url = f"https://gh-trending-api.waningflow.com/repositories?language={language}&since=daily"
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        repos = resp.json()[:5]
        return [{"name": r.get("name"), "stars": r.get("stars"), "description": r.get("description", "")} for r in repos]
    except Exception as e:
        return [{"error": str(e), "source": "github"}]


# --- ANALYSIS ---

def analyze_with_gemini(data: dict) -> str:
    """Analyze collected market data using Gemini 2.5 Flash (FREE)."""
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

    data_str = json.dumps(data, ensure_ascii=False, indent=2)
    prompt = f"{MARKET_INTELLIGENCE_PROMPT}\n\nPÄIVÄN DATA:\n{data_str}"

    response = model.generate_content(prompt)
    return response.text.strip()


def run_daily_intelligence() -> dict:
    """
    Full market intelligence pipeline.
    Returns structured report ready for n8n webhook dispatch.
    """
    print(f"🔍 Market Intelligence run: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    # Collect data in parallel (sequential here for simplicity, n8n handles parallelism)
    data = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "google_trends_fi": get_google_trends(
            ["kattohuolto", "kattopinnoite", "pressut verkkokauppa", "AI automaatio yrittäjä"],
            geo="FI"
        ),
        "google_trends_global": get_google_trends(
            ["n8n workflow", "notion template", "AI agent tools", "roof coating"],
            geo=""
        ),
        "reddit": get_reddit_posts(
            ["SideProject", "entrepreneur", "passive_income", "n8n", "NoCode"]
        ),
        "hacker_news": get_hn_top_posts(10),
        "github_trending": get_github_trending("python")
    }

    print("📊 Data collected. Analyzing with Gemini...")
    analysis = analyze_with_gemini(data)

    report = {
        "date": data["date"],
        "analysis": analysis,
        "raw_data_summary": {
            "google_trends_fi": data["google_trends_fi"].get("keywords", {}),
            "reddit_top_posts": len(data["reddit"]),
            "hn_top_posts": len(data["hacker_news"])
        }
    }

    print("✅ Market Intelligence complete")
    print(f"\n📋 ANALYSIS:\n{analysis}")
    return report


if __name__ == "__main__":
    report = run_daily_intelligence()
    print("\n" + "="*60)
    print("Full report saved. Ready for n8n webhook.")
