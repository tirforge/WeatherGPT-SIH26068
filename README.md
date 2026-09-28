# WeatherGPT — SIH26068

Multilingual conversational assistant for Indian weather and disaster information.
Built for Smart India Hackathon 2026, Ministry of Earth Sciences (IMD), Disaster Management, Software category.

- **Live demo:** https://tirforge.github.io/WeatherGPT-SIH26068/
- **Telegram bot:** [@Weathergpt_hackathon_bot](https://t.me/Weathergpt_hackathon_bot)

Ask in words, get a plan: color alert (Green / Yellow / Orange / Red), the rule behind it,
and what to do in the next three hours. English, Hindi, Tamil, Telugu, Bengali, Kannada,
with voice input and spoken replies.

## What is inside

**Web dashboard** (`index.html`)
Assistant chatbot, hazard map with city pins (Streets / Topo / Satellite, all keyless),
KPI cards, 7-day outlook, gauges, timeline, shelter map, IMD-style bulletins with QR codes,
cyclone VARUNA tracker, live disaster news ticker, light and dark themes, PWA with offline cache.

**City page** (`city.html?pin=695001&city=thiruvananthapuram`)
Per-pincode deep link: alert banner, 7-day alert levels, live Leaflet map, decision trace,
nearby relief shelters and hospitals, printable IMD bulletin.

**Telegram bot** (`telegram_bot_server.py`)
Commands: `/start /help /sos /report /reports /climate /cyclone /quake /space /nwp`.
Automatic place, role (farmer, fisherman, aviation, planner, researcher, citizen) and
language detection. Typing indicator while loading. USSD menu (`*99*68#`) for feature phones.

**Engine guarantees**
- Numeric guard rejects any AI reply whose figures differ from fetched telemetry.
- Prompt-injection shield ignores instructions embedded in user messages.
- Offline fallback serves clearly labeled cached advisories when live data or AI is down.

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Home dashboard (entry page) |
| `city.html` | Pincode city page |
| `app.js` | Core engine: live feeds, chat, map, guards |
| `plus.js` | SOS, crowd reports, push, manager dashboard, USSD |
| `telegram_bot_server.py` | Telegram bot (polling, no webhook needed) |
| `config.example.js` | Key template — copy to `config.js` (gitignored) |
| `manifest.json` / `service-worker.js` | PWA install + offline shell (cache `weathergpt-doc-v2`) |
| `backend/` | Optional FastAPI + MQTT scaffold for self-hosting |

## Run locally

```bash
# Website (any static server)
python -m http.server 8815
# open http://localhost:8815/

# Telegram bot (needs keys in config.js)
pip install requests
python telegram_bot_server.py
```

## Configuration

```bash
cp config.example.js config.js
```

Fill in `config.js` (never commit it):
- `groqApiKey` — free key from https://console.groq.com (chat phrasing, model `openai/gpt-oss-20b`)
- `telegramBotToken` — from [@BotFather](https://t.me/BotFather)

`mapStyle` (`osm` / `esri-sat`) needs no key.

## Data sources

Open-Meteo (temperature, rain, wind, humidity, pressure), GloFAS river discharge,
CPCB air quality, Nominatim / Photon geocoding, Overpass shelters, GFS vs ECMWF via
Open-Meteo ensembles, USGS earthquakes, NASA EONET + GDACS disaster events, IMD bulletins.

## Verification

- Bot suite: 61 checks (`assess`, geocode routing, numeric guard, commands) — all green.
- Frontend: 116 automated checks; live feed verified 12/12 for Pathanamthitta 689107.
- Secret scan: no keys in the repo (`config.js` is gitignored).

## Team / SIH

Problem Statement SIH26068 · Ministry of Earth Sciences (IMD) · Disaster Management.
Same code runs on a laptop today and on government cloud tomorrow.
