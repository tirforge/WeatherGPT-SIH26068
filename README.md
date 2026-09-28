# WeatherGPT — Minimal UI Prototype (SIH26068)

Minimal, trust-first redesign of the WeatherGPT disaster-intelligence dashboard.
Same Corporate token system, dark mode, and EN/Hindi toggle on every page.

## Pages

- `index.html` — home dashboard: assistant chatbot + hazard
  map on top, KPI cards, 7-day outlook, gauges, timeline, shelters, bulletins.
- `city.html` — pincode deep-link page (`?pin=781001&city=guwahati&lang=en`):
  same UI with per-city alert banner, 7-day alert levels, live Leaflet map.

## Run

Open either file directly in a browser. The Leaflet map loads tiles from
OpenStreetMap / CARTO CDN; everything else is self-contained.

## Sources

Redesign of [tirforge/WeatherGPT-SIH26068](https://github.com/tirforge/WeatherGPT-SIH26068).
Telemetry values are the repo's demo dataset (Open-Meteo · GloFAS · IMD v1.2).
