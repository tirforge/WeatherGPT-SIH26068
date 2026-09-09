# WeatherGPT SIH26068 - 6Hr Build Plan (Simplified & Demo-Ready)

## 1. What to Build (MVP)
A conversational weather + disaster alert dashboard with:
- Chat (text/voice, Hindi/English toggle) with role-based advisory (Citizen, Farmer, Fisherman, Aviation).
- 5 weather cards (Temp, Rain, Wind, AQI, Humidity) + 7-day forecast strip.
- Leaflet map with flood polygons, cyclone path, color-coded markers (Green/Yellow/Orange/Red).
- **Unique Differentiators (Easy to Implement):**
  - **Actionable Timeline**: 3‑hourly advice (e.g., "9-12 AM: Spray safe; 12-3 PM: Rain expected, hold irrigation").
  - **Grounded Provenance**: Every AI response shows source: "Open-Meteo • IMD v1.2 • {{timestamp}}".
  - **Explainable Alerts**: Click Red polygon → popup: "Why Red? 3-day rain 168mm + discharge 92% (>80%) = Flood Red".
  - **Voice + Hindi**: Web Speech API (hi-IN/en) + offline bulletin (PDF preview).
- Demo presets: Mumbai, Chennai, Guwahati, Delhi.

Skip (out of scope): Login, DB, Auth, Admin, real SMS, radar layers, ML training.

## 2. Stack for 6Hr (Frontend-First)
- **Frontend**: single `index.html` + Tailwind CDN + Vanilla JS (no build step).
- **Map**: Leaflet + OpenStreetMap (no key).
- **Weather APIs (No Key, Fast)**:
  - Open-Meteo Weather: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`
  - Open-Meteo Flood: `https://flood-api.open-meteo.com/v1/flood?latitude=...&longitude=...&daily=river_discharge`
  - Open-Meteo Air Quality: `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=...&longitude=...&current=pm10,pm2_5`
  - NASA EONET (disasters): `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20` (use for flood/cyclone points).
  - USGS Earthquake: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson` (free, no key, optional for quake markers).
- **AI (LLM)**: Use **Groq** free tier (30 req/min) with `llama-3.1-70b-versatile` for Hindi/English. Fallback to static responses if quota exceeded.
  - Prompt: Ground with actual API numbers, never invent.
  - **Key security**: keep Groq key in `config.js` (gitignored) – never hardcode in `app.js` if repo is public.
- **Geocoding**: OpenStreetMap Nominatim (free, rate-limited) – use city name to lat/lon. Throttle to 1 req/sec, or pre-hardcode lat/lon for the 4 demo cities.
- **Deploy**: Vercel/Netlify (drag-drop). Record a 3-min fallback video of the demo as insurance against live deploy failure.

## 3. How It Works (Simple Flow)
1. User types/ speaks query (e.g., "Guwahati flood risk").
2. Geocode city → fetch Weather+Flood+AQI+EONET.
3. Apply threshold rules (see below) → determine alert level (Red/Yellow/Orange/Green).
4. Build actionable timeline based on hourly forecast (mock 3-hour slots using daily data).
5. Call Groq with prompt: "You are WeatherGPT. Given weather data: {temp, rain, wind, discharge, alert_level}, produce a concise advisory for the user (role: Farmer). Include Do's and Don'ts. Format as bullet points. Respond in {language}. Never invent numbers."
6. Render answer + update map/cards.

Thresholds (IMD‑inspired):
- Green: rain <10mm, wind <30km/h
- Yellow: rain 10‑40mm, wind 30‑50km/h
- Orange: rain 40‑70mm, wind 50‑60km/h
- Red: rain >70mm, wind >60km/h, or (3‑day rain >150mm AND discharge >80%)

## 4. File Structure
```
index.html         # all HTML + Tailwind
app.js             # all JS (fetch, map, chat, voice, timeline)
demo-data.js       # static flood polygons, IMD warnings, mock timelines
README.md
```
No backend – all in frontend.

## 5. Step-by-Step 6Hr (Realistic)
- **Hr0‑1**: HTML scaffold (header, chat sidebar, dashboard grid), Tailwind setup, prompt chips.
- **Hr1‑2**: Weather API integration (fetch → display cards + 7‑day strip).
- **Hr2‑3**: Leaflet map with OSM tiles, add markers (Green/Yellow/Orange/Red) + flood polygons (from demo-data) + cyclone polyline.
- **Hr3‑4**: Chat + voice (Web Speech API) + Groq API integration (grounded prompt).
- **Hr4‑5**: Role tabs (switch advisory format), timeline widget (3‑hourly), Hindi toggle, bulletin PDF preview (print).
- **Hr5‑6**: Polish: loading states, error handling, responsive, test 3 cities, record demo video, deploy to Vercel.

## 6. Map Layers (Use demo-data for polygons)
- Flood: real EONET points (if available) + static polygons (demo-data) for visual impact.
- Cyclone: EONET events + polyline from demo-data.
- Landslide proxy: show static zones (W.Ghats, Himachal, etc.) with rain overlay.

## 7. Constraints & Realism
- No IMD/CWC APIs – use Open-Meteo (good enough).
- No live landslide API – show static zones + rain threshold logic.
- LLM never invents numbers – we feed numbers and ask for formatting.
- Voice only in supported browsers (Chrome/Edge).

## 8. Originality
- Write own alert engine and timeline logic.
- Don't copy full existing repos – use MIT libraries with attribution.

## 9. Team Split (6 people)
1. UI/HTML (Header, cards, chat)
2. Weather API + cards
3. Map + markers/polygons
4. Chat + Voice + Groq
5. Role tabs + Timeline + Hindi
6. Bulletin + Polish + PPT

## 10. Demo Script (3 min)
1. Show fragmented weather info problem.
2. Open app → Guwahati Red flood alert on map.
3. Click Red polygon → explain popup.
4. Ask: "Farmer, Hindi voice: कल खेती करू?" → show timeline + advisory.
5. Print bulletin → show PDF preview.

## 11. PPT (5 Slides)
1. Problem & Solution Overview
2. Architecture (frontend + APIs)
3. Features (map, chat, timeline, alerts)
4. Tech Stack & Thresholds
5. Impact & Future

## 12. Design System (Consistent)
- Primary: #0E63B6 (IMD Blue)
- Alerts: #16A34A (Green), #EAB308 (Yellow), #F97316 (Orange), #DC2626 (Red)
- Font: Inter (system), mono for numbers
- Layout: 380px chat left, dashboard right (desktop); stacked on mobile
- Components: header ticker, role tabs, chat bubbles, weather cards, map, timeline, bulletin button
- Responsive: break at 1024px

## 13. Backend (Optional, for scale)
If time permits, build a FastAPI backend with:
- POST /api/chat → queues requests, calls Groq with retry (1s,2s,4s), returns answer.
- GET /api/weather → caches Open-Meteo for 10min.
- But for demo, frontend direct calls are fine.

## 14. Opendesign Handover
Generate a single-page dashboard with all components above. Use Tailwind for styling, Leaflet for map, and plain JS for logic. Mock data in demo-data.js.
