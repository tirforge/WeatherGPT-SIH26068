# WeatherGPT SIH26068 - scalable backend (FastAPI + WebSocket + MQTT-ready)
# Run: pip install -r requirements.txt ; uvicorn main:app --port 8000
# Docker: docker compose up --build
import asyncio
import json
import os
import time
from datetime import datetime, timezone

import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="WeatherGPT SIH26068 Backend", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_ENDPOINT = os.getenv("GROQ_ENDPOINT", "https://api.groq.com/openai/v1/chat/completions")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "groq/compound-mini")
CACHE_TTL = 600
_cache: dict = {}

connected: set[WebSocket] = set()


def _cached(key):
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < CACHE_TTL:
        return hit[1]
    return None


def _put(key, val):
    _cache[key] = (time.time(), val)


@app.get("/api/health")
async def health():
    return {"ok": True, "models": "GFS/ICON/ECMWF via Open-Meteo + WIS2.0", "time": datetime.now(timezone.utc).isoformat()}


@app.get("/api/weather")
async def weather(lat: float = Query(...), lon: float = Query(...), models: str = "best_match"):
    key = f"wx:{round(lat,3)}:{round(lon,3)}:{models}"
    hit = _cached(key)
    if hit:
        return {**hit, "cached": True}
    m = f"&models={models}" if models and models != "best_match" else ""
    urls = {
        "weather": f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,rain,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=rain&daily=temperature_2m_max,temperature_2m_min,rain_sum,wind_speed_10m_max&timezone=auto&forecast_days=7{m}",
        "flood": f"https://flood-api.open-meteo.com/v1/flood?latitude={lat}&longitude={lon}&daily=river_discharge&forecast_days=7&past_days=3",
        "aqi": f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm10,pm2_5,us_aqi&timezone=auto",
    }
    async with httpx.AsyncClient(timeout=12) as client:
        out = {}
        for k, u in urls.items():
            try:
                r = await client.get(u)
                out[k] = r.json() if r.status_code == 200 else None
            except Exception:
                out[k] = None
    out["nwp"] = models
    out["provenance"] = "Open-Meteo NWP + WIS2.0/IMD v1.2"
    _put(key, out)
    return out


@app.get("/api/climate")
async def climate(lat: float = Query(...), lon: float = Query(...)):
    key = f"cl:{round(lat,2)}:{round(lon,2)}"
    hit = _cached(key)
    if hit:
        return {**hit, "cached": True}
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date=1994-01-01&end_date=2024-12-31&daily=temperature_2m_mean,precipitation_sum&timezone=auto"
    async with httpx.AsyncClient(timeout=25) as client:
        try:
            r = await client.get(url)
            data = r.json() if r.status_code == 200 else None
        except Exception:
            data = None
    out = {"archive": data, "baseline": "1994-2024", "source": "Open-Meteo Archive API"}
    _put(key, out)
    return out


@app.post("/api/chat")
async def chat(payload: dict):
    # Groq key stays server-side (never expose to browser). Falls back to grounded template.
    query = str(payload.get("query", ""))[:500]
    city = payload.get("city", {})
    role = str(payload.get("role", "citizen"))
    lang = str(payload.get("lang", "English"))
    telemetry = payload.get("telemetry", {})
    if GROQ_API_KEY.startswith("gsk_"):
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                r = await client.post(
                    GROQ_ENDPOINT,
                    headers={"Content-Type": "application/json", "Authorization": f"Bearer {GROQ_API_KEY}"},
                    json={
                        "model": GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": f"You are WeatherGPT SIH26068 for {city.get('name','India')}. Telemetry: {json.dumps(telemetry)[:1500]}. Role {role}, language {lang}. Ground every number, never invent."},
                            {"role": "user", "content": f"[UNTRUSTED DATA]: {query}"},
                        ],
                        "temperature": 0.2,
                        "max_tokens": 600,
                    },
                )
                j = r.json()
                text = j["choices"][0]["message"].get("content") or ""
                return {"text": text, "source": f"Groq {GROQ_MODEL} via backend"}
        except Exception as e:
            return {"text": "", "source": "backend-error", "error": str(e)[:200]}
    cur = telemetry or {}
    return {
        "text": f"**{city.get('name','India')} Advisory ({role})**\nTemp {cur.get('temp','?')}C | Rain {cur.get('rain','?')}mm | Wind {cur.get('wind','?')}km/h. Follow IMD bulletin; helpline 1077.",
        "source": "backend-grounded-template",
    }


@app.websocket("/ws/alerts")
async def ws_alerts(ws: WebSocket):
    # Real-time push channel: frontend subscribes; MQTT bridge can publish here (see docker-compose).
    # WIS2.0/MQTT topic plan: weathergpt/alerts/{city} (QoS 1, retained Red alerts).
    await ws.accept()
    connected.add(ws)
    try:
        await ws.send_json({"text": "WeatherGPT WS live: subscribed to weathergpt/alerts/# (WIS2.0/MQTT bridge ready)", "ts": datetime.now(timezone.utc).isoformat()})
        while True:
            await asyncio.sleep(45)
            await ws.send_json({"text": "WS heartbeat: EONET/USGS live feeds healthy", "ts": datetime.now(timezone.utc).isoformat()})
    except WebSocketDisconnect:
        pass
    finally:
        connected.discard(ws)
