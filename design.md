# WeatherGPT – Design System & UI Research
## Anti‑Slop, Trust‑First, Disaster‑Ready

### 1. Research Insights (2026 best practices)
- **Minimalist, spacious white‑themed UI** with modular cards → data density without clutter (Muzli 2026).
- **F‑/Z‑pattern visual hierarchy**: high‑impact KPIs top‑left, charts center, filters bottom (AuFaitux).
- **Crisp dual‑tone palette** + strong typography → readability at a glance (Medium dashboard vol.239).
- **Restrained color palette** – a few intentional colors > rainbow noise (Think.Design).
- **Pair color with icons/labels/arrows**, not color alone – critical for accessibility and clarity.
- **Transparency**: surface assumptions like data freshness, sources, date ranges.

### 2. Anti‑Slop Principles (What We Avoid)
- ❌ Gauge charts, 3D effects, gradient overload.
- ❌ Over‑automation that hides context (e.g., no “AI magic” without explanation).
- ❌ Inconsistent spacing / misaligned modules.
- ❌ Too many colors → noise.
- ❌ Generic stock photos or decorative illustrations.
- ❌ Long paragraphs – keep it scannable.

### 3. AI‑Specific UX Patterns for Weather
**Conversational UI**
- **Predictability**: Show typing indicator, queue position, estimated response time.
- **Grounding**: Every AI response must include source attribution and timestamp (provenance footer).
- **Fallback**: Graceful degradation – if AI fails, show cached data or offline message with retry.
- **Explainability**: For alerts, show “Why Red?” popup with rule breakdown (e.g., “Rain 84mm > 70 → Red”).
- **Role‑based responses**: Same query yields different advisory formats (Citizen, Farmer, Fisherman, Aviation) – tabs or dropdown.

**Data Visualization**
- **Trend arrows**: Show direction and percentage change for each metric (e.g., ↑ 12% vs yesterday).
- **Uncertainty**: For forecast, show range (high‑low) instead of single number.
- **Alert hierarchy**: Use color + icon + text label (e.g., “ Yellow: Caution – Moderate rain expected”).
- **Map clarity**: Flood polygons with opacity; markers with color fills; click → popup with detailed stats.

**AI‑specific Components**
- **Provenance Card**: Small footer under every AI response: “Source: Open‑Meteo • 2026‑09‑08 05:30 IST • IMD v1.2”.
- **Confidence Score**: Show low/medium/high confidence for predictions (e.g., “Confidence: 85%”).
- **Retry Flow**: If API fails, show “Unable to fetch fresh data. Showing cached data from 10 min ago. [Retry]”.
- **Queue Status**: Show “Position in queue: 2” with estimated wait time.

### 4. Core Design Decisions for WeatherGPT
**Layout (Desktop 1440px)**
```
[Header: logo + location search + alert ticker]
[Left: Chat (380px) | Right: Dashboard (flex)]
  Dashboard:
    - Top: 5 weather cards (Temp, Rain, Wind, AQI, Humidity) in a row
    - Middle: 7‑day forecast strip (horizontal scroll)
    - Bottom: Full‑width Leaflet map (layer toggle + legend)
```
**Mobile (<768px)**: single column – Header → Map → Chat → Cards.

**Color Palette (IMD + Trust)**
- Primary: #0B3B5C (deep navy – authority, calm)
- Accent: #E85D3A (IMD orange – alerts, action)
- Alerts: #DC2626 (Red), #F59E0B (Yellow), #10B981 (Green)
- Map water: #D4E6F1
- Text: #1E293B (dark), #64748B (muted)
- Background: #F8FAFC (light), #0F172A (dark mode)

**Typography**
- Font: Inter (system) – headings 700, body 400, numbers tabular.
- Sizes: h1 28px, h2 20px, body 14px, small 12px.
- Monospace for metrics: `84 mm`, `32°C`.

**Primary color (locked)**: `#0E63B6` (IMD Blue) — overrides the earlier navy `#0B3B5C`. This is the single canonical primary for all components. Accent stays `#E85D3A`.

**Icons**
- Use Lucide via CDN (`https://unpkg.com/lucide@latest`) — consistent 24px stroke icons, no emoji, no image sprites.
- Map markers use Leaflet `L.circleMarker` (no external icon files).

**Dark Mode (built-in, not optional)**
- Toggle in header, persisted to `localStorage` key `wg-theme`; default follows OS `prefers-color-scheme`.
- Implementation: CSS variables (`--bg`, `--surface`, `--border`, `--text`, `--muted`) + a `dark` class on `<html>`.
- Dark palette:
  - `--bg: #0F172A`, `--surface: #1E293B`, `--border: #334155`
  - `--text: #F1F5F9`, `--muted: #94A3B8`
  - Primary lightened to `#3B82F6` for links/accents on dark; alert colors unchanged.
  - Map tiles: swap OSM → `CartoDB.DarkMatter` when dark mode is active.

**Key Components (Non‑Slop)**
1. **Alert Banner**: Full‑width, colored bg, icon + short message + “View Details” link.
2. **Weather Cards**: Icon + value + unit + trend arrow (↑/↓) + percentage.
3. **7‑Day Strip**: Horizontal scroll – day, icon, high/low.
4. **Map**: Leaflet with custom IMD‑style markers (circles with color fills), flood polygons with opacity, popup with explainer.
5. **Chat**: Clean bubbles – AI left (white, shadow), user right (primary). Typing indicator with dots.
6. **Role Tabs**: Pill buttons – Citizen | Farmer | Fisherman | Aviation – changes advisory.
7. **Provenance Footer**: “Source: Open‑Meteo • 2026‑09‑08 05:30 IST • IMD v1.2” under each AI response.
8. **Queue Status**: Show “Waiting in queue…” with estimated time.
9. **Confidence Badge**: Small badge next to forecast values (e.g., “85% confident”).

**Interactions**
- Hover on map markers → popup with stats.
- Click alert banner → scroll to explanation.
- Voice input (mic) → waveform animation.
- Dark/light toggle in header.
- Retry button on error states.

**Accessibility**
- High contrast for alerts.
- ARIA labels on all interactive elements.
- Keyboard navigable (Tab, Enter).
- Text labels + icons for status indicators.

### 5. Trust & Transparency
- Show data freshness (timestamp).
- Show source attribution for every number.
- Explain alert rules (e.g., “Rain 84mm > 70 → Red”).
- Provide fallback when offline or API fails – graceful degradation.
- Surface model version and confidence.

### 6. Disaster‑Specific Research
- **IMD alert colors**: Green (no action), Yellow (watch), Orange (alert), Red (emergency).
- **Flood map layers**: Show inundation zones with opacity, river discharge data.
- **Cyclone track**: Polyline with direction arrows, wind speed markers.
- **Landslide risk**: Heatmap overlay based on rainfall + terrain data.
- **Accessibility**: Alerts must be readable without color – use icons and text labels.

### 7. Inspirations (without copying)
- Dark Sky / Apple Weather – clean card layout.
- Windy.com – map layering.
- IMD official bulletins – color scheme.
- NOAA Weather – data transparency and confidence indicators.

### 8. Deliverables
- Single `index.html` + `app.js` + `style.css` (Tailwind optional).
- No external UI libraries (except Leaflet for map).
- All AI responses grounded with provenance footer.

---
**Built for SIH26068 – WeatherGPT**
