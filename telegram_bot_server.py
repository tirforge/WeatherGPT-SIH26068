"""
WeatherGPT Telegram Bot Server — polling every 0.8s with queue + workers.
Free APIs only. Reads tokens from config.js (gitignored) or env vars.
Run:  python telegram_bot_server.py
"""
import re, json, time, queue, threading, os, html
from pathlib import Path
import requests

# ---------- Config ----------
BASE = Path(__file__).parent
CONFIG_PATH = BASE / "config.js"
OFFSET_FILE = BASE / ".tg_offset"

def load_config():
    tok = os.getenv("TELEGRAM_BOT_TOKEN", "")
    groq = os.getenv("GROQ_API_KEY", "")
    groq_model = os.getenv("GROQ_MODEL", "groq/compound-mini")
    if CONFIG_PATH.exists():
        try:
            txt = CONFIG_PATH.read_text(encoding="utf-8", errors="ignore")
            m = re.search(r'telegramBotToken\s*:\s*"([^"]*)"', txt)
            if m and m.group(1): tok = m.group(1)
            m2 = re.search(r'groqApiKey\s*:\s*"([^"]*)"', txt)
            if m2 and m2.group(1): groq = m2.group(1)
            m3 = re.search(r'groqModel\s*:\s*"([^"]*)"', txt)
            if m3 and m3.group(1): groq_model = m3.group(1)
        except Exception as e:
            print(f"[config] read failed: {e}")
    return tok.strip(), groq.strip(), groq_model.strip()

TOKEN, GROQ_KEY, GROQ_MODEL = load_config()
if not TOKEN:
    print("[fatal] Telegram token missing. Set TELEGRAM_BOT_TOKEN env or fill config.js -> telegramBotToken")
    raise SystemExit(1)
# Groq may be empty -> offline fallback still works

# Polling & queue — hardened to 0.5s
POLL_INTERVAL = 0.5
WORKERS = 4
q = queue.Queue(maxsize=300)

def load_offset():
    try:
        if OFFSET_FILE.exists():
            return int(OFFSET_FILE.read_text().strip() or "0")
    except: pass
    return 0

def save_offset(v):
    try: OFFSET_FILE.write_text(str(v))
    except: pass

offset = load_offset()
print(f"[bot] Token OK: ...{TOKEN[-6:]}  Groq: {'yes' if GROQ_KEY.startswith('gsk_') else 'offline'}  offset={offset}")

# ---------- Helpers ----------
INJ = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions", re.I),
    re.compile(r"disregard\s+(all\s+)?(previous|prior|above|system)", re.I),
    re.compile(r"reveal\s+(your\s+)?(system\s+prompt|instructions|prompt|api\s*key|secret)", re.I),
    re.compile(r"show\s+(me\s+)?(your\s+)?system\s+prompt", re.I),
    re.compile(r"jailbreak|dan\s+mode|\bDAN\b|bypass\s+(safety|filter|guard)", re.I),
    re.compile(r"act\s+as\s+(a\s+)?(different|new|unrestricted|evil)", re.I),
    re.compile(r"pretend\s+(you\s+are|to\s+be)\s+(not|a\s+different)", re.I),
    re.compile(r"override\s+(your|system|all)\s+(rules|instructions|prompt)", re.I),
    re.compile(r"forget\s+(all|your|everything).*instructions", re.I),
    re.compile(r"you\s+are\s+now\s+(a\s+)?(different|unrestricted|evil|hacker)", re.I),
    re.compile(r"api[_\s-]?key|gsk_[a-zA-Z0-9]+", re.I),
]
def is_injection(s): return any(r.search(s or "") for r in INJ)

LEAK_RX = re.compile(r"we need to respond as|provide mention of|as an ai language model|my instructions tell me|my system prompt|here is my reasoning", re.I)
def is_reasoning_leak(t): return bool(LEAK_RX.search(t or ""))

GREET = {"hi","hello","hey","namaste","namaskar","vanakkam","morning","evening","yo"}
def assess(s):
    raw = re.sub(r"\b(\S+)(?:\s+\1\b)+", r"\1", (s or "").strip(), flags=re.I)
    toks = [t for t in raw.lower().split() if t]
    if not toks: return "short", raw
    uniq = len(set(toks))
    if len(toks) <=3 and all(re.sub(r"[!.,?]+$","",t) in GREET for t in toks): return "greeting", raw
    if len(toks)>=3 and uniq/len(toks) < 0.34: return "gibberish", raw
    if len(raw.replace(" ","")) <3: return "short", raw
    return "ok", raw

# Minimal demo dataset (same as weathergpt-app DATA for fallback)
DEMO = {
 "guwahati":{"name":"Guwahati","temp":"29.4°C","rain":"88.5 mm","rain3":"168 mm","wind":"38 km/h","gust":"52 km/h","aqi":"48","aqiLabel":"Good","level":"RED · EMERGENCY","rule":"3-day 168 mm (>150) + discharge 92% (>80%) = Flood Red","lat":26.18,"lon":91.75},
 "mumbai":{"name":"Mumbai","temp":"28.1°C","rain":"64.2 mm","rain3":"121 mm","wind":"47 km/h","gust":"58 km/h","aqi":"52","aqiLabel":"Satisfactory","level":"ORANGE · ALERT","rule":"24-h 64 mm (>40) + tide 4.48 m = Orange","lat":19.07,"lon":72.87},
 "chennai":{"name":"Chennai","temp":"31.2°C","rain":"22.4 mm","rain3":"38 mm","wind":"28 km/h","gust":"36 km/h","aqi":"68","aqiLabel":"Satisfactory","level":"YELLOW · WATCH","rule":"24-h 22 mm (10–40) + gust 36 km/h = Yellow","lat":13.08,"lon":80.27},
  "delhi":{"name":"Delhi","temp":"30.6°C","rain":"6.8 mm","rain3":"11 mm","wind":"18 km/h","gust":"27 km/h","aqi":"242","aqiLabel":"Poor","level":"YELLOW · WATCH","rule":"AQI 242 + drizzle 6.8 mm = Yellow haze","lat":28.61,"lon":77.20},
  "kolkata":{"name":"Kolkata","temp":"30.2°C","rain":"52 mm","rain3":"96 mm","wind":"58 km/h","gust":"71 km/h","aqi":"71","aqiLabel":"Satisfactory","level":"ORANGE · ALERT","rule":"52 mm + wind 58 km/h + VARUNA outer bands = Orange","lat":22.57,"lon":88.36},
  "bengaluru":{"name":"Bengaluru","temp":"26.8°C","rain":"4.2 mm","rain3":"8 mm","wind":"18 km/h","gust":"26 km/h","aqi":"42","aqiLabel":"Good","level":"GREEN · NORMAL","rule":"4.2 mm + wind 18 km/h = Green","lat":12.97,"lon":77.59},
  "patna":{"name":"Patna","temp":"31.5°C","rain":"18 mm","rain3":"40 mm","wind":"32 km/h","gust":"41 km/h","aqi":"88","aqiLabel":"Satisfactory","level":"YELLOW · WATCH","rule":"18 mm + Ganga 78% danger = Yellow","lat":25.59,"lon":85.13},
  "shimla":{"name":"Shimla","temp":"19.5°C","rain":"24 mm","rain3":"68 mm","wind":"28 km/h","gust":"39 km/h","aqi":"35","aqiLabel":"Good","level":"YELLOW · WATCH","rule":"24 mm + 3-day 68 mm on steep slopes = Yellow","lat":31.10,"lon":77.17},
}
COORDS = {k:(v["lat"],v["lon"]) for k,v in DEMO.items()}

# Default demo is Thiruvananthapuram LIVE (never Guwahati). Cached 10 min.
TVM = {"lat":8.5241,"lon":76.9366}
_tvm_cache = {"at":0,"data":None}
def get_default():
    now = time.time()
    if _tvm_cache["data"] and now - _tvm_cache["at"] < 600:
        return _tvm_cache["data"]
    live = fetch_live(TVM["lat"], TVM["lon"])
    if live:
        d = {"name":"Thiruvananthapuram", **live}
    else:
        d = {"name":"Thiruvananthapuram","temp":"30.0°C","rain":"0 mm","rain3":"5 mm","wind":"15 km/h","aqi":"55","aqiLabel":"Satisfactory","level":"GREEN · NORMAL","rule":"Thiruvananthapuram live feed warming up","lat":TVM["lat"],"lon":TVM["lon"]}
    _tvm_cache.update(at=now, data=d)
    return d

def aqi_label(a):
    try:
        a=float(a)
        if a<=50: return "Good"
        if a<=100: return "Satisfactory"
        if a<=200: return "Moderate"
        if a<=300: return "Poor"
        return "Severe"
    except: return "Unknown"

def _geo_name(addr, display):
    # prefer real place names over POIs ("Today Paradise" bug) — city/town/village first
    for k in ("city","town","village","municipality","county"):
        if addr.get(k): return addr[k]
    return (display or "").split(",")[0]

def _sim(a, b):
    import difflib
    return difflib.SequenceMatcher(None, (a or "").lower(), (b or "").lower()).ratio()

def photon(q):
    # typo-tolerant fallback (handles "alapuzha" -> Alappuzha). Free, no key.
    try:
        r = requests.get("https://photon.komoot.io/api/",
            params={"q": q, "limit": 5, "lat": 10.5, "lon": 76.5},
            headers={"User-Agent": "WeatherGPT/1.0"}, timeout=10)
        r.raise_for_status()
        for f in (r.json().get("features") or []):
            p = f.get("properties") or {}
            if str(p.get("countrycode") or "").upper() != "IN":
                continue
            city = p.get("city") or p.get("town") or p.get("village") or ""
            nm = p.get("name") or ""
            label = city or nm
            if not label or _sim(q, label) < 0.45:
                continue
            lon, lat = (f.get("geometry") or {}).get("coordinates") or (None, None)
            if lat is None:
                continue
            return {"lat": float(lat), "lon": float(lon), "name": label}
    except Exception as e:
        print(f"[photon] {e}")
    return None

def geocode(q):
    # Nominatim strict (similarity-checked) -> Photon typo-tolerant. Cached 1 hr.
    ck = (q or "").strip().lower()
    hit = _geo_cache.get(ck)
    if hit and time.time() - hit[0] < 3600:
        return hit[1]
    for params in (
        {"format":"json","countrycodes":"in","addressdetails":"1","limit":3,"featuretype":"city","q":q},
        {"format":"json","countrycodes":"in","addressdetails":"1","limit":3,"q":q},
    ):
        try:
            r=requests.get("https://nominatim.openstreetmap.org/search",
                params=params,
                headers={"Accept":"application/json","User-Agent":"WeatherGPT/1.0"}, timeout=9)
            r.raise_for_status()
            j=r.json()
            if not j: continue
            # pick first result that is actually a populated place
            pick=None
            for res in j:
                a=res.get("address",{})
                if str(a.get("country_code","")).lower()!="in": continue
                if any(a.get(k) for k in ("city","town","village","municipality","county")):
                    pick=res; break
            if pick is None:
                # none is a populated place — check country of top hit only
                a0=j[0].get("address",{})
                if str(a0.get("country_code","")).lower()!="in":
                    return {"outside": j[0].get("display_name","").split(",")[0]}
                continue
            a=pick.get("address",{})
            nm=_geo_name(a, pick.get("display_name"))
            # similarity gate: reject fuzzy garbage ("alapuzha" must not become Kollad)
            if _sim(q, nm) < 0.5:
                print(f"[geocode] similarity reject {q!r} -> {nm!r}")
                break  # fall through to Photon, don't burn the plain-search loop
            res={"lat":float(pick["lat"]),"lon":float(pick["lon"]),"name":nm}
            _geo_cache[ck]=(time.time(),res)
            return res
        except Exception as e:
            print(f"[geocode] {e}")
    # Photon typo-tolerant fallback
    ph = photon(q)
    if ph:
        _geo_cache[ck]=(time.time(),ph)
        return ph
    return None

_live_cache = {}  # (lat,lon rounded) -> (ts, data), 10 min: fixes slowness + flaky feeds
_geo_cache = {}   # query -> (ts, result), 1 hr
def fetch_live(lat,lon):
    key = (round(float(lat), 2), round(float(lon), 2))
    hit = _live_cache.get(key)
    if hit and time.time() - hit[0] < 600:
        return hit[1]
    try:
        w=requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,rain_sum,precipitation_probability_max&timezone=auto&forecast_days=7", timeout=10).json()
        aq=requests.get(f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=us_aqi,pm2_5&timezone=auto", timeout=10).json()
        cur=w.get("current",{}); d=w.get("daily",{}); ac=(aq.get("current") or {})
        rain=float(cur.get("rain") or 0); wind=float(cur.get("wind_speed_10m") or 0)
        rain3=sum(float(x or 0) for x in (d.get("rain_sum") or [])[:3]) if d.get("rain_sum") else rain
        # level
        if rain>70 or wind>60 or rain3>150: lvl="RED · EMERGENCY"
        elif rain>=40 or wind>=50: lvl="ORANGE · ALERT"
        elif rain>=10 or wind>=30: lvl="YELLOW · WATCH"
        else: lvl="GREEN · NORMAL"
        aqi= ac.get("us_aqi")
        hum = cur.get("relative_humidity_2m", 70); pres = int(cur.get("surface_pressure") or 1010)
        data={"temp":f"{cur.get('temperature_2m',28)}°C","rain":f"{rain} mm","rain3":f"{round(rain3,1)} mm","wind":f"{round(wind)} km/h","aqi":str(int(aqi)) if aqi is not None else "65","aqiLabel":aqi_label(aqi) if aqi is not None else "Moderate","hum":f"{hum}%","pres":f"{pres} hPa","level":lvl,"rule":f"Live: 24h {rain} mm, 3-day {round(rain3,1)} mm, wind {round(wind)} km/h = {lvl}","lat":lat,"lon":lon}
        _live_cache[key]=(time.time(),data)
        return data
    except Exception as e:
        print(f"[live] {e}")
        hit=_live_cache.get(key)
        if hit:  # stale cache beats wrong-city fallback
            print("[live] using stale cache")
            return hit[1]
        return None

# ---------- NWP multi-model + CAPE lightning + 30-yr climate + live feeds ----------
# Ported from WeatherGPT-SIH26068 model-data.js / app.js (GFS vs ECMWF vs ICON).
_nwp_cache = {}
def fetch_nwp(lat, lon):
    key = (round(float(lat), 2), round(float(lon), 2))
    hit = _nwp_cache.get(key)
    if hit and time.time() - hit[0] < 300:
        return hit[1]
    try:
        r = requests.get("https://api.open-meteo.com/v1/forecast",
            params={"latitude": lat, "longitude": lon,
                    "models": "ecmwf_ifs025,gfs_seamless,icon_seamless",
                    "hourly": "temperature_2m,precipitation,cape", "timezone": "auto"},
            timeout=8).json()
        h = r.get("hourly", {})
        if "temperature_2m_gfs_seamless" not in h:
            return None
        n = len(h.get("time", []))
        i = min(2, n - 1)
        g = float(h["temperature_2m_gfs_seamless"][i]); e = float(h["temperature_2m_ecmwf_ifs025"][i])
        gp = float(h["precipitation_gfs_seamless"][i]); ep = float(h["precipitation_ecmwf_ifs025"][i])
        capes = [float(x or 0) for x in (h.get("cape_gfs_seamless") or [0])[:6]]
        capes += [float(x or 0) for x in (h.get("cape_ecmwf_ifs025") or [0])[:6]]
        cape = max(capes) if capes else 0
        spread = abs(g - e) + abs(gp - ep)
        conf = 92 if spread < 2 else (80 if spread < 5 else 64)
        out = {"gfs_t": round(g, 1), "ecmwf_t": round(e, 1), "conf": conf, "cape": int(cape)}
        _nwp_cache[key] = (time.time(), out)
        return out
    except Exception as ex:
        print(f"[nwp] {ex}")
        return None

def cape_label(cape):
    if cape is None: return None
    if cape < 500: return "Low"
    if cape < 1500: return "Moderate"
    if cape < 2500: return "High — stay indoors"
    return "Severe — hail possible"

_clim_cache = {}
def fetch_climate(lat, lon):
    key = (round(float(lat), 1), round(float(lon), 1))
    hit = _clim_cache.get(key)
    if hit and time.time() - hit[0] < 3600:
        return hit[1]
    try:
        r = requests.get("https://archive-api.open-meteo.com/v1/archive",
            params={"latitude": lat, "longitude": lon, "start_date": "1994-01-01",
                    "end_date": "2024-12-31", "daily": "precipitation_sum", "timezone": "auto"},
            timeout=20).json()
        d = r.get("daily", {})
        s, n = 0.0, 0
        for t, v in zip(d.get("time", []), d.get("precipitation_sum", [])):
            if str(t)[5:7] == "09":
                s += float(v or 0); n += 1
        if not n: return None
        out = {"sepMean": round(s / (n / 30))}
        _clim_cache[key] = (time.time(), out)
        return out
    except Exception as ex:
        print(f"[climate] {ex}")
        return None

_eo_cache = {"at": 0, "data": []}
def fetch_eonet():
    if _eo_cache["data"] and time.time() - _eo_cache["at"] < 1800:
        return _eo_cache["data"]
    try:
        r = requests.get("https://eonet.gsfc.nasa.gov/api/v3/events",
            params={"status": "open", "limit": 6}, timeout=10).json()
        evs = [e.get("title", "event") for e in (r.get("events") or [])][:4]
        _eo_cache.update(at=time.time(), data=evs)
        return evs
    except Exception as ex:
        print(f"[eonet] {ex}")
        return []

_uq_cache = {"at": 0, "data": (0, 0)}
def fetch_quakes():
    if time.time() - _uq_cache["at"] < 1800:
        return _uq_cache["data"]
    try:
        r = requests.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson", timeout=10).json()
        feats = r.get("features", [])
        near = sum(1 for f in feats
                   if (lambda c: c and 5 < c[1] < 38 and 65 < c[0] < 100)((f.get("geometry") or {}).get("coordinates")))
        _uq_cache.update(at=time.time(), data=(len(feats), near))
        return len(feats), near
    except Exception as ex:
        print(f"[usgs] {ex}")
        return 0, 0

# ---------- Knowledge pack (ported from model-data.js) ----------
KNOW = {
    "cyclone": "RSMC New Delhi: Severe Cyclonic Storm VARUNA, Bay of Bengal 18.2N 87.4E, 978 hPa, 110 km/h, moving NW to Odisha/WB coast. LC-IV danger at Haldia/Digha/Paradip. Next bulletin 05:30 IST.",
    "aqi": "CPCB bands: 0-50 Good, 51-100 Satisfactory, 101-200 Moderate, 201-300 Poor, 301+ Very Poor/Severe.",
    "agro": "GKMS rule: no spray if wind>40 or rain>10mm/3h; irrigate only if 3-day rain<15mm.",
    "marine": "Sea: wind<30 calm for small boats | 30-50 rough, stay within 15nm | >50 no venture.",
    "city": "Yellow: pumps fuelled, drains checked. Orange: control room open, traffic diverted. Red: evacuation buses, boats staged.",
    "helpline": "Helplines: 1077 disaster, 112 emergency, IMD 1800-180-1717.",
}
ROLE_KNOW = {"farmer": "agro", "fisherman": "marine", "aviation": "cyclone", "planner": "city", "researcher": "cyclone", "citizen": "helpline"}

# ---------- SOS + crowd reports (ported from SIH26068 web app) ----------
CROWD_FILE = BASE / ".crowd.json"
def crowd_load():
    try:
        if CROWD_FILE.exists():
            return json.loads(CROWD_FILE.read_text() or "[]")
    except: pass
    return []
def crowd_add(chat_id, name, rtype, note):
    try:
        lst = crowd_load()
        lst.append({"chat": chat_id, "name": name, "type": rtype, "note": note, "ts": time.time()})
        CROWD_FILE.write_text(json.dumps(lst[-200:]))
        return len(lst)
    except Exception as e:
        print(f"[crowd] {e}")
        return 0
def sos_card(city_name=None):
    d = DEMO.get((city_name or "").lower()) if city_name else None
    if d:
        head = f"SOS — {d['name']} {d['level']}: rain {d['rain']}, wind {d['wind']}."
    else:
        head = "SOS — share your city name + live location in this chat."
    return (f"{head}\n- Call now: 1077 (disaster) / 112 (emergency)\n"
            f"- {KNOW['helpline']}\n- Stay out of floodwater and off rooftops in lightning.\nvia WeatherGPT SIH26068")

# ---------- Numeric guard: reject replies with invented weather figures ----------
# Catches the "model hallucinates despite telemetry" case: any number carrying a
# weather unit (°C/mm/km/h/AQI/hPa/%) must match telemetry within rounding.
UNIT_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(°C|°|mm|cm|km/h|kph|kmph|AQI|hPa|mb|mbar|%)|(\d+(?:\.\d+)?)C\b")
def _tele_nums(cur):
    vals = set()
    temps = []
    for k in ("temp", "rain", "rain3", "wind", "gust", "aqi", "pm", "hum", "pres"):
        for m in re.findall(r"[\d.]+", str(cur.get(k, ""))):
            try:
                vals.add(round(float(m), 1)); vals.add(int(float(m)))
                if k in ("temp",):
                    temps.append(float(m))
            except: pass
    vals.update([70, 40, 10, 60, 50, 30, 150, 80, 1994, 2024, 1077, 112, 1800, 15])
    return vals, temps
def nums_ok(txt, cur):
    vals, temps = _tele_nums(cur)
    for m in UNIT_RE.finditer(txt or ""):
        try: v = float(m.group(1) or m.group(3))
        except: continue
        is_temp = (m.group(3) is not None) or (m.group(2) in ("°C", "°"))
        if v in vals or round(v, 1) in vals: continue
        if any(isinstance(x, (int, float)) and abs(v - x) <= max(0.6, abs(x) * 0.02) for x in vals): continue
        # forecast highs/lows legitimately differ from current temp: ±5C vs temps only
        if is_temp and any(abs(v - t) <= 5 for t in temps): continue
        # humidity drifts through the day (±12), pressure varies by model run (±10 hPa)
        if m.group(2) == "%":
            try:
                hums = [float(x) for x in re.findall(r"[\d.]+", str(cur.get("hum", "")))]
                if any(abs(v - h) <= 12 for h in hums): continue
            except: pass
        if m.group(2) in ("hPa", "mb", "mbar"):
            try:
                prs = [float(x) for x in re.findall(r"[\d.]+", str(cur.get("pres", "")))]
                if any(abs(v - p) <= 10 for p in prs): continue
            except: pass
        return False, m.group(0)
    return True, ""

def offline_advice(d, role, lang):
    hi = lang=="hi"
    red = "RED" in (d.get("level") or "")
    ROLE_ACT = {
        "farmer": "RED — stop spraying, open paddy drains NOW." if red else "Spray before 10 AM if wind <40; irrigate only if 3-day rain <15 mm.",
        "fisherman": "DO NOT enter water. Secure boats 15m inland." if red else "Caution within 15 nautical miles; life jackets on.",
        "aviation": "Check METAR/TAF; expect holding/diversion on Red." if red else "Check METAR/TAF; VFR likely fine.",
        "planner": "Open shelters, run ward pumps, divert traffic, night control room." if red else "Pumps fuelled, drains checked, control room on standby.",
        "researcher": f"Compare vs 1994-2024 Sep baseline; rule: {d['rule']}",
        "citizen": "Avoid low roads/riverfronts. Kit ready. Helpline 1077." if red else "Normal commute; carry rain protection.",
    }
    act = ROLE_ACT.get(role, ROLE_ACT["citizen"])
    # citizen label removed from output as requested
    head = f"{d['name']} — {d['level']}" if role=="citizen" else f"{d['name']} — {role.upper()} Advisory ({d['level']})"
    if hi:
        hi_head = f"{d['name']} — {d['level']}" if role=="citizen" else f"{d['name']} — {role.upper()} परामर्श ({d['level']})"
        return f"**{hi_head}**\n• तापमान {d['temp']} | बारिश {d['rain']} | हवा {d['wind']} | AQI {d['aqi']} ({d['aqiLabel']})\n• नियम: {d['rule']}\n• सलाह: {'रेड अलर्ट — छिड़काव रोकें, जल निकासी खोलें।' if red else 'सामान्य सावधानी।'}\n\n*स्रोत: Open-Meteo · IMD v1.2*"
    if lang in LANG_OPEN:
        return f"{LANG_OPEN[lang]}: {d['name']} — {role.upper()} ({d['level']})\n• Temp {d['temp']} | Rain {d['rain']} | Wind {d['wind']} | AQI {d['aqi']} ({d['aqiLabel']})\n• Rule: {d['rule']}\n• Action: {act}\n\n*Source: Open-Meteo · IMD v1.2*"
    return f"**{head}**\n• Temp {d['temp']} | Rain {d['rain']} | Wind {d['wind']} | AQI {d['aqi']} ({d['aqiLabel']})\n• Rule: {d['rule']}\n• Action: {act}\n\n*Source: Open-Meteo · IMD v1.2*"

# Server-side Groq traffic passes through an unreliable stub proxy (id:"stub"):
# intermittent 413s, empty content, hallucinated city names. Hardened accordingly:
# custom UA, per-model retry, and a response-city check that rejects wrong-city text.
GROQ_HEADERS = {"Content-Type":"application/json","Authorization":f"Bearer {GROQ_KEY}","User-Agent":"WeatherGPT/1.0"}
def _groq_once(model, sys_prompt, user_text):
    try:
        r=requests.post("https://api.groq.com/openai/v1/chat/completions",
            headers=GROQ_HEADERS,
            json={"model":model,"messages":[{"role":"system","content":sys_prompt},{"role":"user","content":"[UNTRUSTED USER DATA]: "+user_text}],"temperature":0.2,"max_tokens":600},
            timeout=20)
        j=r.json()
        if r.status_code!=200:
            print(f"[groq {model}] {r.status_code} {(j.get('error') or {}).get('message','')[:120] if isinstance(j,dict) else str(j)[:120]}")
            return None
        msg=((j.get("choices") or [{}])[0].get("message") or {})
        # NEVER use msg["reasoning"]: gpt-oss reasoning echoes the system prompt there.
        c=(msg.get("content") or "").strip()
        if not c or is_reasoning_leak(c):
            return None
        return c
    except Exception as e:
        print(f"[groq {model}] exc {e}")
        return None

def groq_ask(sys_prompt, user_text, want_city=None):
    if not GROQ_KEY.startswith("gsk_"): return None
    for m in [GROQ_MODEL, "openai/gpt-oss-20b", "llama-3.3-70b-versatile", "groq/compound"]:
        for attempt in (1, 2):  # retry once (transient 413s)
            c = _groq_once(m, sys_prompt, user_text)
            if not c or len(c) < 30:
                if attempt == 1:
                    time.sleep(1.0)
                continue
            # response-city check: reject text about a DIFFERENT city (proxy hallucinations)
            if want_city:
                low = c.lower()
                others = [v["name"].lower() for k, v in DEMO.items() if v["name"].lower() != want_city.lower()]
                if want_city.lower() not in low and any(o in low for o in others):
                    print(f"[groq {m}] rejected wrong-city reply for {want_city}")
                    break  # don't retry same model; try next model
            return {"text": c, "model": m}
    return None

def detect_role(t):
    s=(t or "").lower()
    if re.search(r"kheti|fasal|spray|crop|irrigat|fertiliz|कृषि|खेती|फसल", s): return "farmer"
    if re.search(r"fish|boat|net|machli|मछली|नाव", s) or re.search(r"\bsea\b", s): return "fisherman"
    if re.search(r"flight|airport|runway|aviation|visibility|metar|उड़ान", s): return "aviation"
    if re.search(r"smart.?city|pump|ward|traffic|drain|mayor|municipal|control.?room", s): return "planner"
    if re.search(r"research|climate|trend|paper|thesis|dataset|nwp|\bmodel\b|anomaly|baseline", s): return "researcher"
    return "citizen"

LANG_NAMES = {"en":"English","hi":"Hindi","ta":"Tamil","te":"Telugu","bn":"Bengali","kn":"Kannada"}
LANG_OPEN = {"ta":"வானிலை ஆலோசனை","te":"వాతావరణ సలహా","bn":"আবহাওয়া পরামর্শ","kn":"ಹವಾಮಾನ ಸಲಹೆ"}
def detect_lang(t):
    s = t or ""
    if re.search(r"[\u0B80-\u0BFF]", s): return "ta"
    if re.search(r"[\u0C00-\u0C7F]", s): return "te"
    if re.search(r"[\u0980-\u09FF]", s): return "bn"
    if re.search(r"[\u0C80-\u0CFF]", s): return "kn"
    if re.search(r"[\u0900-\u097F]", s): return "hi"
    return "en"

def tg_send(chat_id, text):
    try:
        # Telegram plain text, cap 4096
        txt=text[:4000]
        r=requests.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", json={"chat_id":chat_id,"text":txt}, timeout=12)
        if not r.json().get("ok"): print(f"[send] failed {r.text[:200]}")
    except Exception as e: print(f"[send] {e}")

# Native-script city names (bot supports TA/TE/BN/KN queries, e.g. "மழை இன்று சென்னை?")
NATIVE_CITY = {
    "சென்னை": "chennai", "சென்னை?": "chennai", "चेन्नई": "chennai",
    "চেন্নাই": "chennai", "చెన్నై": "chennai", "ಚೆನ್ನೈ": "chennai",
    "மும்பை": "mumbai", "मुंबई": "mumbai", "মুম্বাই": "mumbai", "ముంబై": "mumbai", "ಮುಂಬೈ": "mumbai",
    "தில்லி": "delhi", "டெல்லி": "delhi", "दिल्ली": "delhi", "দিল্লি": "delhi", "ఢిల్లీ": "delhi", "ದೆಹಲಿ": "delhi",
    "கொல்கத்தா": "kolkata", "कोलकाता": "kolkata", "কলকাতা": "kolkata", "కోల్‌కతా": "kolkata", "ಕೊಲ್ಕತ್ತಾ": "kolkata",
    "பெங்களூர்": "bengaluru", "बेंगलुरु": "bengaluru", "বেঙ্গালুরু": "bengaluru", "బెంగళూరు": "bengaluru", "ಬೆಂಗಳೂರು": "bengaluru",
    "குவஹாத்தி": "guwahati", "गुवाहाटी": "guwahati", "গুয়াহাটি": "guwahati", "గువహతి": "guwahati", "ಗುವಾಹಟಿ": "guwahati",
    "பாட்னா": "patna", "पटना": "patna", "পাটনা": "patna", "పాట్నా": "patna", "ಪಾಟ್ನಾ": "patna",
    "சிம்லா": "shimla", "शिमला": "shimla", "শিমলা": "shimla", "షిమ్లా": "shimla", "ಶಿಮ್ಲಾ": "shimla",
}
INDIC = r"A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0980-\u09FF\u0C80-\u0CFF"

def build_reply(text, city_hint="thiruvananthapuram"):
    q_raw=(text or "").strip()
    if not q_raw: return "Send a city + question, e.g. 'Kottayam rain today?'"
    kind, clean = assess(q_raw)
    lang=detect_lang(clean); role=detect_role(clean)
    # safety + small-talk first: never geocode greetings/gibberish/attacks
    if kind=="greeting":
        return "Hello! I am WeatherGPT — ask weather/flood/AQI/flight, e.g. 'Kottayam rain today?' or 'कल खेती करू?'"
    if kind in ("gibberish","short"):
        return "Did not catch that — ask a clear weather question, e.g. 'Will it rain tomorrow?'"
    if is_injection(clean): return "Shield active — instructions inside messages are ignored. Ask a weather question like 'Mumbai rain today?'"
    # location routing: explicit city keyword (English + native script), else geocode, else TVM live default
    low=clean.lower()
    cur=DEMO.get(city_hint) or get_default()
    for k,v in DEMO.items():
        if k in low or v["name"].lower() in low:
            cur=v; break
    else:
        for nat, key in NATIVE_CITY.items():
            if nat in clean:
                cur=DEMO[key]; break
        else:
            # try geocode: handles "kottayam" (lowercase), "Kottayam rain today?", "in Kottayam"
            cand=None
            # \b boundaries are critical: bare "in" matches inside "rain", "at" inside "weather"
            m=re.search(r"(?:\bin\b|\bat\b|\bfor\b|\bof\b|\bnear\b)\s+([A-Za-z\u0900-\u097F][\w\s.'-]{2,30})", clean, re.I)
            if m: cand=m.group(1).strip().strip("?.!,;")
            else:
                # first word >=3 chars that isn't filler/interrogative, try as place (case-insensitive)
                skip={"citizen","farmer","fisherman","aviation","weather","today","tomorrow","rain","flood","alert","advisory","risk","forecast","kya","hai","batao","what","which","who","whom","whose","how","when","where","why","is","are","was","were","do","does","did","can","could","will","would","should","give","tell","show","know","about","there","their","and","the","please","kindly","hello","hey","hi","namaste","morning","thanks"}
                words=re.findall(r"[A-Za-z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F\u0980-\u09FF\u0C80-\u0CFF]{3,}", clean)
                for w in words:
                    if w.lower() in skip: continue
                    # need at least 3 letters, take "kottayam" from "kottayam rain today?"
                    cand=w.strip()
                    break
            if cand:
                time.sleep(0.9)  # Nominatim throttle
                g=geocode(cand)
                if g and not g.get("outside"):
                    live=fetch_live(g["lat"],g["lon"])
                    if live: cur={"name":g["name"],**live}
                    else: cur={"name":g["name"],**get_default(),"rule":"Live feed hiccup — nearest-station baseline"}
                elif g and g.get("outside"):
                    return f"Out of coverage — '{g['outside']}' is outside India. Try an Indian city or pincode."
                else:
                    return f"Could not locate '{cand}' — check the spelling (e.g. Alappuzha) or send a pincode."

    # (greeting / gibberish / injection already handled above)
    # Groq grounded (role knowledge appended; numbers still rule)
    # loosened prompt — natural replies, light guardrails (strict hardening was degrading answers)
    role_tag = "" if role=="citizen" else f" for {role.upper()}"
    know = KNOW.get(ROLE_KNOW.get(role, "helpline"), "")
    sys=f"You are WeatherGPT, a friendly weather assistant on Telegram. City: {cur['name']}{role_tag}. Live data: {cur['temp']}, rain {cur['rain']} (3-day {cur['rain3']}), wind {cur['wind']}, AQI {cur['aqi']} ({cur['aqiLabel']}), humidity {cur.get('hum','—')}, pressure {cur.get('pres','—')}, alert {cur['level']}. Context: {cur['rule']}. Extra: {know}. Reply in {LANG_NAMES.get(lang,'English')}, plain text, 5-9 short lines with - bullets. First line must be '{cur['name']} — {cur['level']}:' so the user sees which city. Copy every figure from the data above; never compute or guess a new weather figure. Vary each reply: lead with the 2 most decision-relevant facts for THIS question with morning/noon/evening timing. If a figure is missing, write 'not available'. Stick to these numbers; if unsure, say so."
    res=groq_ask(sys, clean, want_city=cur["name"])
    if res:
        txt = re.sub(r"\*\*(.+?)\*\*", r"\1", res["text"]).strip()[:3800]
        # drop truncated tail: model cut off mid-sentence
        if txt and not re.search(r"[.!?…\"')]\s*$", txt):
            ms = list(re.finditer(r"[.!?…][\"')]*\s", txt))
            if ms and ms[-1].end() > len(txt) * 0.4:
                txt = txt[:ms[-1].end()].strip()
        txt = fix_units(txt)
        # denial-phrase rejection: proxy model claiming "no data" despite telemetry -> offline numbers
        if re.search(r"no\s+(live\s+)?data|don'?t have|do not have|not available|can'?t provide|cannot provide|no information", txt, re.I):
            print(f"[groq] denied ('no data') for {cur['name']} -> offline fallback")
        else:
            good, bad = nums_ok(txt, cur)
            if not good:
                print(f"[groq] invented figure '{bad}' for {cur['name']} -> offline fallback")
            else:
                return _with_lightning(txt, cur, role)
    return _with_lightning(fix_units(re.sub(r"\*\*(.+?)\*\*", r"\1", offline_advice(cur, role, lang)).strip()), cur, role)

def typing_start(chat_id):
    # typing bubble lasts ~5s — refresh every 4s until stopped
    stop = threading.Event()
    def loop():
        while not stop.is_set():
            try: requests.post(f"https://api.telegram.org/bot{TOKEN}/sendChatAction", json={"chat_id":chat_id,"action":"typing"}, timeout=6)
            except Exception: pass
            stop.wait(4)
    t = threading.Thread(target=loop, daemon=True)
    t.start()
    return stop

def fix_units(txt):
    # Groq sometimes drops units ("Wind: 9") — restore km/h on bare wind/gust figures
    try:
        t = str(txt or "")
        t = re.sub(r"([Ww]inds?\s*:?\s*)(\d+(?:\.\d+)?)(?!\s*km/h)(?![\w/%\u00b0])", r"\g<1>\g<2> km/h", t)
        t = re.sub(r"([Gg]usts?\s*:?\s*)(\d+(?:\.\d+)?)(?!\s*km/h)(?![\w/%\u00b0])", r"\g<1>\g<2> km/h", t)
        return t
    except Exception:
        return txt

def _with_lightning(txt, cur, role="citizen"):    # Damini guidance: append lightning warning only when CAPE says danger
    try:
        if cur.get("lat") is None: return txt
        nwp = fetch_nwp(cur["lat"], cur["lon"])
        if not nwp: return txt
        risk = cape_label(nwp["cape"])
        extra = f"\n- NWP: GFS {nwp['gfs_t']}C vs ECMWF {nwp['ecmwf_t']}C ({nwp['conf']}% agree)"
        if nwp["cape"] >= 1500:
            extra += f"\n- Lightning risk {risk} (CAPE {nwp['cape']}) — stay indoors, see Damini app"
        if role == "researcher":
            cl = fetch_climate(cur["lat"], cur["lon"])
            if cl: extra += f"\n- 30-yr Sep baseline: ~{cl['sepMean']}mm (1994-2024)"
        return (txt + "\n" + extra)[:3900]
    except Exception as e:
        print(f"[bolt] {e}")
        return txt

def handle_message(msg):
    chat_id=msg.get("chat",{}).get("id")
    text=(msg.get("text") or "").strip()
    if not chat_id or not text or msg.get("from",{}).get("is_bot"): return
    if text in ("/start",):
        tg_send(chat_id, "WeatherGPT SIH26068\n\nAsk like the website:\n- Kottayam rain today?\n- Mumbai high tide timing?\n- Should I spray today?\n- Hindi: कल खेती करू?\n\nCommands: /sos /report /climate /cyclone /quake /space /nwp /help\nPlace, role and language auto-detected (EN HI TA TE BN KN). Grounded in IMD data.")
        return
    if text=="/help":
        tg_send(chat_id, "Send city + question, e.g. 'Delhi AQI flight delays?' — I detect place/role/language automatically.\n\n/sos [city] — rescue helplines\n/report <type> <note> — report waterlogging/flood\n/reports — recent crowd reports\n/climate [city] — 30-yr Sep baseline\n/cyclone — VARUNA RSMC tracker\n/quake — USGS quakes near India\n/space — NASA space weather events\n/nwp [city] — GFS vs ECMWF + lightning risk")
        return
    if text.startswith("/sos"):
        arg = text[4:].strip()
        city = None
        if arg:
            for k, v in DEMO.items():
                if k in arg.lower() or v["name"].lower() in arg.lower():
                    city = k; break
            if not city:
                g = geocode(arg)
                if g and not g.get("outside"): city = None
        tg_send(chat_id, sos_card(city))
        return
    if text.startswith("/report"):
        parts = text[7:].strip().split(None, 1)
        if not parts:
            tg_send(chat_id, "Usage: /report waterlogging <road/landmark>\nTypes: waterlogging, flood, tree-fallen, power-cut")
            return
        rtype = parts[0].lower()
        note = parts[1] if len(parts) > 1 else ""
        frm = (msg.get("from") or {})
        nm = " ".join(x for x in [frm.get("first_name"), frm.get("last_name")] if x)
        n = crowd_add(chat_id, nm, rtype, note)
        tg_send(chat_id, f"Crowd report saved ({n} total)\n- {rtype}: {note}\nUnverified citizen data — visible to managers. Thanks!")
        return
    if text.startswith("/reports"):
        lst = crowd_load()[-3:][::-1]
        if not lst:
            tg_send(chat_id, "No crowd reports yet. Send /report waterlogging <place> to add one.")
        else:
            lines = [f"- {e.get('type')}: {e.get('note','')} ({e.get('name','anon')})" for e in lst]
            tg_send(chat_id, "Recent crowd reports (unverified):\n" + "\n".join(lines))
        return
    if text.startswith("/climate"):
        arg = text[8:].strip()
        d = None
        if arg:
            for k, v in DEMO.items():
                if k in arg.lower() or v["name"].lower() in arg.lower():
                    d = v; break
            if not d:
                g = geocode(arg)
                if g and not g.get("outside"):
                    d = {"name": g["name"], "lat": g["lat"], "lon": g["lon"]}
        if not d:
            d = {"name": "Delhi", "lat": 28.61, "lon": 77.20}
        cl = fetch_climate(d["lat"], d["lon"])
        tg_send(chat_id, f"{d['name']} 30-yr September baseline: ~{cl['sepMean']}mm (1994-2024, Open-Meteo Archive)" if cl else "Climate archive busy — retry in a minute.")
        return
    if text.startswith("/cyclone"):
        tg_send(chat_id, "Cyclone tracker (RSMC New Delhi):\n- " + KNOW["cyclone"])
        return
    if text.startswith("/quake"):
        g_, near = fetch_quakes()
        tg_send(chat_id, f"USGS live: {g_} M2.5+ quakes worldwide in 24h, {near} near India. Drop-cover-hold if shaking.")
        return
    if text.startswith("/space"):
        evs = fetch_eonet()
        tg_send(chat_id, "NASA EONET open events:\n- " + ("\n- ".join(evs) if evs else "none right now"))
        return
    if text.startswith("/nwp"):
        arg = text[4:].strip()
        d = None
        if arg:
            for k, v in DEMO.items():
                if k in arg.lower() or v["name"].lower() in arg.lower():
                    d = v; break
        if not d:
            d = {"name": "Delhi", "lat": 28.61, "lon": 77.20}
        nwp = fetch_nwp(d["lat"], d["lon"])
        if nwp:
            tg_send(chat_id, f"{d['name']} NWP: GFS {nwp['gfs_t']}C vs ECMWF {nwp['ecmwf_t']}C ({nwp['conf']}% agree). Lightning risk {cape_label(nwp['cape'])} (CAPE {nwp['cape']}).")
        else:
            tg_send(chat_id, "NWP models busy — retry in a minute.")
        return
    # typing indicator (refreshed until reply is ready)
    stop_typing = typing_start(chat_id)
    try:
        reply=build_reply(text)
    finally:
        try: stop_typing.set()
        except Exception: pass
    try:
        first=(reply or "").splitlines()[0][:90] if reply else "EMPTY"
        print(f"[reply] chat={chat_id} q={text[:60]!r} -> {first!r}")
    except: pass
    tg_send(chat_id, reply)

# ---------- Poller & Workers ----------
def poller():
    global offset
    while True:
        try:
            r=requests.get(f"https://api.telegram.org/bot{TOKEN}/getUpdates", params={"offset":offset,"limit":20,"timeout":0}, timeout=12)
            j=r.json()
            if not j.get("ok"):
                print(f"[poll] bad {j}")
                time.sleep(POLL_INTERVAL); continue
            for upd in j.get("result",[]):
                offset = upd["update_id"]+1
                save_offset(offset)
                msg=upd.get("message")
                if msg:
                    remember_chat(msg)
                    try: q.put_nowait(msg)
                    except queue.Full: print("[queue] full, dropping")
                    print(f"[queue] +{msg.get('chat',{}).get('id')} qsize={q.qsize()}")
        except Exception as e:
            print(f"[poll] {e}")
        time.sleep(POLL_INTERVAL)

def worker(idx):
    while True:
        msg=q.get()
        try:
            print(f"[worker{idx}] handling qsize={q.qsize()}")
            handle_message(msg)
        except Exception as e:
            print(f"[worker{idx}] {e}")
        finally:
            q.task_done()

# ---------- Local bridge: website fetches seen chat IDs here ----------
# Why: the poller advances the Telegram offset, so the site's getUpdates finds
# nothing. The site reads http://127.0.0.1:5001/last_chats instead.
BRIDGE_PORT = 5001
CHATS_FILE = BASE / ".tg_chats.json"
_seen_chats = []
def _load_chats():
    global _seen_chats
    try:
        if CHATS_FILE.exists():
            _seen_chats = json.loads(CHATS_FILE.read_text() or "[]")
    except: _seen_chats = []
def remember_chat(msg):
    try:
        ch = (msg or {}).get("chat") or {}
        cid = ch.get("id")
        if not cid: return
        frm = (msg or {}).get("from") or {}
        entry = {"id": cid, "name": " ".join(x for x in [frm.get("first_name"), frm.get("last_name")] if x) or ch.get("title") or ch.get("username") or "",
                 "ts": time.time()}
        global _seen_chats
        _seen_chats = [e for e in _seen_chats if e.get("id") != cid]
        _seen_chats.insert(0, entry)
        _seen_chats = _seen_chats[:10]
        CHATS_FILE.write_text(json.dumps(_seen_chats))
    except Exception as e:
        print(f"[bridge] remember {e}")
def bridge_server():
    from http.server import BaseHTTPRequestHandler, HTTPServer
    _load_chats()
    class H(BaseHTTPRequestHandler):
        def log_message(self, *a): pass
        def _send(self, code, body):
            data = body.encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        def do_OPTIONS(self):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        def do_GET(self):
            if self.path.startswith("/last_chats"):
                self._send(200, json.dumps({"chats": _seen_chats}))
            elif self.path.startswith("/health"):
                self._send(200, json.dumps({"ok": True, "qsize": q.qsize(), "offset": offset}))
            else:
                self._send(404, json.dumps({"ok": False}))
    try:
        HTTPServer(("127.0.0.1", BRIDGE_PORT), H).serve_forever()
    except Exception as e:
        print(f"[bridge] {e}")

# ---------- Daily 7 AM IST digest (ported from SIH26068 manager broadcast) ----------
# Sends a morning briefing to every chat the bot has seen (max 25). Fail-soft.
DIGEST_SPOTS = [("Thiruvananthapuram", 8.5241, 76.9366), ("Guwahati", 26.18, 91.75), ("Mumbai", 19.07, 72.87)]
_last_digest_day = None
def build_digest():
    lines = []
    for name, lat, lon in DIGEST_SPOTS:
        live = fetch_live(lat, lon)
        if live:
            lines.append(f"- {name}: {live['temp']}, rain {live['rain']}, wind {live['wind']}, {live['level']}")
        else:
            lines.append(f"- {name}: feed busy, check website")
    return "WeatherGPT morning briefing (7 AM IST)\n" + "\n".join(lines) + "\nAsk: 'Kolkata rain today?'"
def digest_loop():
    global _last_digest_day
    import datetime
    while True:
        try:
            now = datetime.datetime.utcnow() + datetime.timedelta(hours=5, minutes=30)
            if now.hour == 7 and now.date() != _last_digest_day:
                _load_chats()
                msg = build_digest()
                sent = 0
                for e in (_seen_chats or [])[:25]:
                    try:
                        tg_send(e.get("id"), msg)
                        sent += 1
                    except Exception as ex:
                        print(f"[digest] {ex}")
                _last_digest_day = now.date()
                print(f"[digest] sent to {sent} chats")
                time.sleep(3600)
        except Exception as e:
            print(f"[digest] {e}")
        time.sleep(60)

if __name__=="__main__":
    print(f"[boot] polling every {POLL_INTERVAL}s with {WORKERS} workers")
    # prime offset past history
    try:
        r=requests.get(f"https://api.telegram.org/bot{TOKEN}/getUpdates", params={"timeout":0}, timeout=10).json()
        if r.get("ok") and r.get("result"):
            offset = r["result"][-1]["update_id"]+1
            save_offset(offset)
            print(f"[boot] primed offset={offset}")
    except Exception as e: print(f"[boot] prime {e}")
    for i in range(WORKERS):
        t=threading.Thread(target=worker, args=(i,), daemon=True); t.start()
    bt=threading.Thread(target=bridge_server, daemon=True); bt.start()
    print(f"[boot] bridge on 127.0.0.1:{BRIDGE_PORT}/last_chats")
    dt=threading.Thread(target=digest_loop, daemon=True); dt.start()
    print("[boot] 7AM digest scheduler on")
    poller()
