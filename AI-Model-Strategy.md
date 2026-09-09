# WeatherGPT - SIH26068
## Conversational AI for Weather Forecasting, Alerts, and Climate Information

### Problem Statement
Weather information is fragmented across multiple portals, bulletins, satellite products, and forecast systems. Common users, farmers, disaster managers, and government agencies struggle to quickly obtain actionable insights.

### Objective
Develop an AI-powered conversational platform (WeatherGPT) that integrates meteorological datasets, forecasting models, and disaster warning systems to provide accurate, contextual, and multilingual weather intelligence through conversational interfaces.

### Key Features
1. Real-time weather information retrieval
2. Natural language querying for weather forecasts
3. Integration with NWP models (GFS/WRF)
4. Extreme weather alerts and early warning dissemination
5. Location-based forecasting and advisory generation
6. Multilingual support for Indian languages
7. Climate trend and historical weather analysis
8. Voice-enabled interaction for rural accessibility

### Unique Differentiators

#### 1. Grounded Provenance Card (Anti-Hallucination)
LLM never invents numbers. Flow: Geocode pincode → Open-Meteo Weather+Flood+AQI → threshold engine → Gemini formats only. Shows source timestamp and rule trace (e.g., "Rain 84mm > 70 → Red").

#### 2. Role-Based Advisory Engine
Same query returns 4 outputs:
- **Citizen**: Do/Don't + travel advisories
- **Farmer**: Spray window / irrigation hold + agromet
- **Fisherman**: SST/wave + PFZ safe hours
- **Aviation**: METAR/TAF decode

#### 3. Panchayat-Level Downscaling
Geocode pincode → block→panchayat delta (mock) to address SIH26074 downscaling requirement.

#### 4. Voice + Hindi + Offline Bulletin
Web Speech API toggle (hi-IN/en), PDF/SMS preview with QR code for rural accessibility.

#### 5. Explainable Alert Popup
Click Red polygon → show "Why Red?" with rule breakdown (rain + discharge + zone). Uses explainable AI principle from SIH26073.

#### 6. Historical Climate Lens
Toggle 30-year archive → Open-Meteo Archive API trend (e.g., "Mumbai Sep rain +14% vs 1994-2024").

### Tech Stack

#### Frontend (6-Hour MVP)
- Single `index.html` + Tailwind CSS CDN + Vanilla JS
- Map: Leaflet + OpenStreetMap (no API key)
- Layout: 380px chat sidebar + flexible dashboard

#### Free AI Models
- **Gemini** (Primary): 60 req/min, 1.5M tokens/day - Main LLM for grounding and formatting
- **Groq** (Fallback): 30 req/min - Fast inference for real-time chat (sub-1s latency)
- **Hugging Face** (Regional): Mistral-7B, Indic-LLaMA for Hindi/regional languages
- **OpenRouter** (A/B testing): Compare responses, bypass rate limits

#### Free Weather APIs (No Key Required)
- Open-Meteo Weather: Temperature, rain, wind, humidity
- Open-Meteo Flood: River discharge (GloFAS)
- Open-Meteo Air Quality: AQI
- NASA EONET: Live floods, cyclones, wildfires
- USGS Earthquake: Quake-triggered landslide hint

#### ML Enhancement (Optional Accuracy Layer)
- XGBoost trained on 1 year IMD data for local bias correction
- Reduces RMSE by 15-30% for India-specific microclimates
- Deploy on HF Space (free T4 GPU) as "AI Enhanced" toggle

### Threshold Engine
| Level | Rain (mm) | Wind (km/h) | Conditions |
|-------|-----------|-------------|------------|
| Green | <10 | <30 | Normal |
| Yellow | 10-40 | 30-50 | Caution |
| Orange | 40-70 | 50-60 | Warning |
| Red | >70 | >60 | Emergency |

**Flood Red**: 3-day rain >150mm + discharge >80%

### File Structure
```
WeatherGPT-SIH26068/
├── index.html          # Main dashboard
├── app.js              # Core logic, API calls, chat engine
├── demo-data.js        # Mock flood polygons, IMD warnings
├── README.md           # This file
└── assets/
    ├── icons/          # Weather icons
    └── fonts/          # Noto Sans for Hindi
```

### Deployment
- **Frontend**: Vercel / Netlify (drag-and-drop)
- **Backend** (optional): FastAPI on HF Space
- **Demo**: Live at weathergpt-sih.vercel.app

### Evaluation Parameters
- Accuracy and relevance
- Response latency
- Multilingual capability
- User interface and accessibility
- Scalability and innovation
- Integration with real-time meteorological systems
- Voice-enabled interaction for rural accessibility

### Team Split (6 Hours)
1. UI/UX Designer
2. Weather API Integration
3. Map & Visualization
4. Chat + Voice
5. Demo Data + Bulletin
6. PPT + Deployment

### Demo Script (3 Minutes)
1. **Problem**: Show fragmented weather information
2. **Solution**: Guwahati flood Red alert + map visualization
3. **Interaction**: Farmer query in Hindi voice: "कल खेती करू?"
4. **Response**: Grounded Hindi advisory + bulletin PDF
5. **Impact**: Stack, future improvements

### References
- [SIH26068 Official](https://sih.gov.in)
- [Open-Meteo API](https://open-meteo.com)
- [NASA EONET](https://eonet.gsfc.nasa.gov)
- [Groq Cloud](https://groq.com)
- [Google Gemini](https://ai.google.dev/gemini-api)

---
**Built for Smart India Hackathon 2026**
