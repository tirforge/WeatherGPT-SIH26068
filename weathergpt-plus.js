/* WeatherGPT — Plus pack PART 1: city data (ported from SIH26068 model-data.js).
 * Loaded AFTER weathergpt-app.js on both pages. Extends global DATA/COORDS/
 * SHELTER_PTS/PINDB additively — never overwrites existing entries.
 * Works on dashboard (selectCity) and city page (render via PINDB, mirrors bypassed).
 */
(function () {
  'use strict';
  if (typeof DATA === 'undefined') return;
  function has(k) { try { return !!DATA[k]; } catch (e) { return false; } }

  var PACK = {
    kolkata: { name: 'Kolkata', level: 'ORANGE · ALERT', shape: '◆', title: 'Kolkata — Orange cyclone-band alert', sub: 'HOOGHLY COAST · Updated 05:30 IST · IMD v1.2', temp: '30.2°C', feels: '34°C', rain: '52 mm', rain3: '96 mm', rainLabel: 'Heavy', wind: '58 km/h', gust: '71 km/h', aqi: '71', pm: '28', aqiLabel: 'Satisfactory', hum: '88%', humSub: 'Dew 26.4°C · humid', pres: '1000 hPa', river: 'Surge watch', riverSub: 'Hooghly 68% · CWC gauge', vis: '4 km', visSub: 'Squalls · E 110°', rule: '52 mm + wind 58 km/h + VARUNA outer bands = Orange', pan: 'Alipore G.P. · river breeze +4% humidity', climate: 'Sep mean 180 mm · cyclonic spells +19%', climateText: 'Post-monsoon cyclone rain days doubled since 2000. Today matches a classic outer-band pattern.',
      forecast: [['Mon', '31°/26°', 85], ['Tue', '30°/26°', 75], ['Wed', '31°/26°', 55], ['Thu', '32°/27°', 30], ['Fri', '33°/27°', 15], ['Sat', '33°/28°', 10], ['Sun', '34°/28°', 5]],
      days: [['Mon', '31°', 85, 'fbar-o', 'ORANGE'], ['Tue', '30°', 75, 'fbar-o', 'ORANGE'], ['Wed', '31°', 55, 'fbar-y', 'YELLOW'], ['Thu', '32°', 30, 'fbar-y', 'YELLOW'], ['Fri', '33°', 15, 'fbar-g', 'GREEN'], ['Sat', '33°', 10, 'fbar-g', 'GREEN'], ['Sun', '34°', 5, 'fbar-g', 'GREEN']],
      shelters: [['Topsia Relief Camp', '1.2 km · 200 beds · Open'], ['Garden Reach Shelter', '2.0 km · 150 beds · Open'], ['Salt Lake Stadium Hall', '3.5 km · 500 beds · Standby']],
      time: [['6–9 AM', 'Caution', 'Squally bands; secure hoardings, hold spraying'], ['9–12 PM', 'Avoid', 'Peak gusts 58 km/h; stay off EM Bypass lows'], ['12–3 PM', 'Avoid', 'No sea/river venture (LC-IV signals)'], ['3–6 PM', 'Caution', 'Metro over road if waterlogged'], ['6–9 PM', 'Hold', 'Bands weakening; charge devices, next bulletin 05:30']] },
    bengaluru: { name: 'Bengaluru', level: 'GREEN · NORMAL', shape: '●', title: 'Bengaluru — Pleasant, no warning', sub: 'DECCAN PLATEAU · Updated 05:30 IST · IMD v1.2', temp: '26.8°C', feels: '28°C', rain: '4.2 mm', rain3: '8 mm', rainLabel: 'Light', wind: '18 km/h', gust: '26 km/h', aqi: '42', pm: '12', aqiLabel: 'Good', hum: '68%', humSub: 'Dew 19.2°C · comfortable', pres: '1012 hPa', river: 'Normal', riverSub: 'Bellandur pumps routine', vis: '8 km', visSub: 'Clear · W 240°', rule: '4.2 mm + wind 18 km/h = Green', pan: 'HAL G.P. · elevation cooling −2°C vs plains', climate: 'Sep mean 150 mm · stable ±6%', climateText: 'Deccan plateau shows the lowest monsoon variance in the network. Good control sample for studies.',
      forecast: [['Mon', '27°/19°', 25], ['Tue', '28°/19°', 15], ['Wed', '28°/20°', 30], ['Thu', '29°/20°', 35], ['Fri', '29°/20°', 15], ['Sat', '30°/21°', 5], ['Sun', '30°/21°', 5]],
      days: [['Mon', '27°', 25, 'fbar-g', 'GREEN'], ['Tue', '28°', 15, 'fbar-g', 'GREEN'], ['Wed', '28°', 30, 'fbar-g', 'GREEN'], ['Thu', '29°', 35, 'fbar-y', 'YELLOW'], ['Fri', '29°', 15, 'fbar-g', 'GREEN'], ['Sat', '30°', 5, 'fbar-g', 'GREEN'], ['Sun', '30°', 5, 'fbar-g', 'GREEN']],
      shelters: [['HAL Community Hall', '1.0 km · 120 beds · Standby'], ['Bellandur School Shelter', '2.2 km · 200 beds · Standby']],
      time: [['6–9 AM', 'Open', 'Spray window safe; light jacket'], ['9–12 PM', 'Open', 'Normal commute on ORR'], ['12–3 PM', 'Open', 'Drip irrigation normal'], ['3–6 PM', 'Hold', 'Brief drizzle possible'], ['6–9 PM', 'Open', 'Clear evening']] },
    patna: { name: 'Patna', level: 'YELLOW · WATCH', shape: '●', title: 'Patna — Ganga swell watch', sub: 'MIDDLE GANGA · Updated 05:30 IST · IMD v1.2', temp: '31.5°C', feels: '35°C', rain: '18 mm', rain3: '40 mm', rainLabel: 'Moderate', wind: '32 km/h', gust: '41 km/h', aqi: '88', pm: '33', aqiLabel: 'Satisfactory', hum: '82%', humSub: 'Dew 27.1°C · riverine', pres: '1006 hPa', river: '78% danger', riverSub: 'Ganga watch · CWC gauge', vis: '5 km', visSub: 'Haze · E 90°', rule: '18 mm + Ganga 78% danger = Yellow', pan: 'Danapur G.P. · diara belt humidity +8%', climate: 'Sep mean 165 mm · late-monsoon +11%', climateText: 'Ganga mid-stretch floods cluster in late September. Embankment patrol advised on watch days.',
      forecast: [['Mon', '32°/26°', 60], ['Tue', '32°/26°', 65], ['Wed', '31°/26°', 75], ['Thu', '30°/25°', 85], ['Fri', '30°/25°', 55], ['Sat', '31°/26°', 25], ['Sun', '32°/26°', 15]],
      days: [['Mon', '32°', 60, 'fbar-y', 'YELLOW'], ['Tue', '32°', 65, 'fbar-y', 'YELLOW'], ['Wed', '31°', 75, 'fbar-o', 'ORANGE'], ['Thu', '30°', 85, 'fbar-o', 'ORANGE'], ['Fri', '30°', 55, 'fbar-y', 'YELLOW'], ['Sat', '31°', 25, 'fbar-g', 'GREEN'], ['Sun', '32°', 15, 'fbar-g', 'GREEN']],
      shelters: [['Danapur High School Camp', '1.5 km · 250 beds · Open'], ['Gandhi Maidan Hall', '2.8 km · 400 beds · Standby'], ['PMC Night Shelter', '0.9 km · 80 beds · Open']],
      time: [['6–9 AM', 'Caution', 'Avoid Gandhi Ghat low steps; spray before 10 AM'], ['9–12 PM', 'Caution', 'Small boats with jackets only, near bank'], ['12–3 PM', 'Hold', 'Showers likely; carry cover'], ['3–6 PM', 'Caution', 'Danapur bund patrol active'], ['6–9 PM', 'Hold', 'Helpline 1077; charge devices']] },
    shimla: { name: 'Shimla', level: 'YELLOW · WATCH', shape: '●', title: 'Shimla — Slope instability watch', sub: 'MID HILLS · Updated 05:30 IST · IMD v1.2', temp: '19.5°C', feels: '19°C', rain: '24 mm', rain3: '68 mm', rainLabel: 'Moderate', wind: '28 km/h', gust: '39 km/h', aqi: '35', pm: '10', aqiLabel: 'Good', hum: '90%', humSub: 'Dew 17.1°C · saturated', pres: '1010 hPa', river: 'Hill streams up', riverSub: '41% · spate risk', vis: '3 km', visSub: 'Mist · SW 200°', rule: '24 mm + 3-day 68 mm on steep slopes = Yellow', pan: 'Mashobra zone · +18 mm orographic lift (S face)', climate: 'Sep mean 120 mm · cloudburst days +22%', climateText: 'Mid-hill cloudbursts doubled since 2010. No night driving on NH-5 past 40 mm.',
      forecast: [['Mon', '20°/13°', 70], ['Tue', '19°/12°', 80], ['Wed', '18°/12°', 85], ['Thu', '19°/13°', 45], ['Fri', '21°/14°', 20], ['Sat', '22°/14°', 10], ['Sun', '22°/15°', 5]],
      days: [['Mon', '20°', 70, 'fbar-y', 'YELLOW'], ['Tue', '19°', 80, 'fbar-o', 'ORANGE'], ['Wed', '18°', 85, 'fbar-o', 'ORANGE'], ['Thu', '19°', 45, 'fbar-y', 'YELLOW'], ['Fri', '21°', 20, 'fbar-g', 'GREEN'], ['Sat', '22°', 10, 'fbar-g', 'GREEN'], ['Sun', '22°', 5, 'fbar-g', 'GREEN']],
      shelters: [['Sanjauli Hall', '1.1 km · 100 beds · Open'], ['Mashobra Panchayat Bhawan', '2.5 km · 60 beds · Open']],
      time: [['6–9 AM', 'Caution', 'No parking under retaining walls; report cracks 1077'], ['9–12 PM', 'Caution', 'Pause slope harvest; cover crates'], ['12–3 PM', 'Avoid', 'Heaviest band; no foot river crossing'], ['3–6 PM', 'Caution', 'Heli to Kinnaur on hold (800 ft base)'], ['6–9 PM', 'Hold', 'No NH-5 night drive if rain crosses 40 mm']] }
  };
  var COORDS_ADD = { kolkata: [22.57, 88.36, 11], bengaluru: [12.97, 77.59, 11], patna: [25.59, 85.13, 11], shimla: [31.10, 77.17, 11] };
  var SHEL_ADD = {
    kolkata: [[22.585, 88.375, 'Topsia Relief Camp'], [22.560, 88.345, 'Garden Reach Shelter']],
    bengaluru: [[12.985, 77.605, 'HAL Community Hall']],
    patna: [[25.605, 85.145, 'Danapur High School Camp'], [25.590, 85.125, 'PMC Night Shelter']],
    shimla: [[31.115, 77.185, 'Sanjauli Hall']]
  };
  var PINS_ADD = { '700001': 'kolkata', '700050': 'kolkata', '560001': 'bengaluru', '560034': 'bengaluru', '800001': 'patna', '800008': 'patna', '171001': 'shimla', '171002': 'shimla' };

  for (var k in PACK) { if (!has(k)) DATA[k] = PACK[k]; }
  if (typeof COORDS !== 'undefined') { for (var c in COORDS_ADD) { if (!COORDS[c]) COORDS[c] = COORDS_ADD[c]; } }
  if (typeof SHELTER_PTS !== 'undefined') { for (var s in SHEL_ADD) { if (!SHELTER_PTS[s]) SHELTER_PTS[s] = SHEL_ADD[s]; } }
  if (typeof PINDB !== 'undefined') { for (var p in PINS_ADD) { if (!PINDB[p]) PINDB[p] = PINS_ADD[p]; } }
  // City-page mirrors become dead code once real entries exist (code prefers DATA over MIRROR).
  window.WGPLUS_CITIES = ['kolkata', 'bengaluru', 'patna', 'shimla'];
  /* City page (?pin=) renders BEFORE this file loads, so re-render new cities. */
  try {
    if (document.getElementById('pinForm2')) {
      var _m = /[?&]pin=(\d+)/.exec(location.search || '');
      var _pk = _m && PINDB[_m[1]];
      if (_pk && DATA[_pk]) {
        cur = _pk;
        try { var _mn = document.getElementById('mirrorNote'); if (_mn) _mn.style.display = 'none'; } catch (e) {}
        try { if (typeof map !== 'undefined' && map && COORDS[_pk]) map.setView([COORDS[_pk][0], COORDS[_pk][1]], 11); } catch (e) {}
        try { render(); } catch (e2) {}
      }
    }
  } catch (e3) {}

  /* Role answers for planner + researcher (dashboard updateRole reads ROLES[role]). */
  if (typeof ROLES !== 'undefined') {
    if (!ROLES.planner) ROLES.planner = 'Smart City: pumps fuelled, drains checked on Yellow; control room + diversions + shelters on Orange/Red. Helpline 1077.';
    if (!ROLES.researcher) ROLES.researcher = 'Research: compare 7-day rain vs 1994-2024 Sep baseline; note GFS/ECMWF spread and rule trace for your paper.';
  }
  /* Role tabs on dashboard. */
  try {
    var rt = document.getElementById('roleTabs');
    if (rt && !rt.querySelector('[data-role="planner"]')) {
      rt.insertAdjacentHTML('beforeend', '<button class="role-tab" data-role="planner" onclick="selectRole(\'planner\',this)">Smart City</button><button class="role-tab" data-role="researcher" onclick="selectRole(\'researcher\',this)">Research</button>');
    }
  } catch (e) {}
  /* City chips on dashboard. */
  try {
    var row = document.querySelector('.chiprow');
    if (row && !row.querySelector('[data-city="kolkata"]')) {
      row.insertAdjacentHTML('beforeend', '<button class="city-chip" data-city="kolkata" onclick="selectCity(\'kolkata\')">Kolkata · Orange</button><button class="city-chip" data-city="bengaluru" onclick="selectCity(\'bengaluru\')">Bengaluru · Green</button><button class="city-chip" data-city="patna" onclick="selectCity(\'patna\')">Patna · Yellow</button><button class="city-chip" data-city="shimla" onclick="selectCity(\'shimla\')">Shimla · Yellow</button>');
    }
  } catch (e2) {}
})();

/* WeatherGPT — Plus pack PART 2: SOS, crowd, push, manager, CSV, USSD, lightning.
 * Own UI (injected), own storage, own fetches. Never touches app.js internals;
 * talks to the pages only through globals: DATA, COORDS, map, cur, selectCity.
 */
(function () {
  'use strict';
  if (typeof DATA === 'undefined') return;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function curKey() { try { return (typeof cur !== 'undefined' && DATA[cur]) ? cur : 'guwahati'; } catch (e) { return 'guwahati'; } }
  function curCoords() {
    try {
      if (typeof map !== 'undefined' && map && map.getCenter) {
        var mc = map.getCenter();
        if (mc && isFinite(mc.lat) && isFinite(mc.lng)) return { lat: +mc.lat.toFixed(2), lon: +mc.lng.toFixed(2) };
      }
      var c = (typeof COORDS !== 'undefined' && COORDS[curKey()]) || [26.18, 91.75];
      return { lat: c[0], lon: c[1] };
    } catch (e) { return { lat: 26.18, lon: 91.75 }; }
  }
  function tgToken() { try { return ((window.WG_CONFIG || {}).telegramBotToken || '').trim(); } catch (e) { return ''; } }
  function tgChat() { try { return (localStorage.getItem('wg-tg-chat') || '').trim(); } catch (e) { return ''; } }
  function tgSendText(text, done) {
    var tok = tgToken(), chat = tgChat();
    if (!tok || !chat) { if (done) done(false, 'Bot not connected — open the Telegram panel on the page, Start the bot, Fetch Chat ID.'); return; }
    fetch('https://api.telegram.org/bot' + tok + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: String(text).slice(0, 3500) })
    }).then(function (r) { return r.json(); }).then(function (j) { if (done) done(!!j.ok, j.ok ? 'sent' : 'failed'); })
      .catch(function (e) { if (done) done(false, String(e).slice(0, 120)); });
  }

  /* ---------- topnav action buttons (match site pill UI: .city-chip) ---------- */
  function navBtn(id, label, title, accent) {
    var ex = document.getElementById(id);
    if (ex) return ex;
    var anchor = document.getElementById('langBtn');
    var row = (anchor && anchor.parentNode) || document.querySelector('nav');
    if (!row) return null;
    var b = document.createElement('button');
    b.id = id; b.title = title;
    // self-styled pill: transparent bg + theme tokens (ignores .city-chip theme fill)
    b.className = '';
    b.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + accent + ';flex:none;"></span>' + esc(label);
    b.style.cssText = 'display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:8px 12px;border-radius:9999px;border:1px solid var(--border);background:transparent;color:var(--fg);white-space:nowrap;min-height:36px;align-self:center;cursor:pointer;';
    if (anchor) row.insertBefore(b, anchor);
    else row.appendChild(b);
    return b;
  }
  function modalShell(id) {
    var m = $(id);
    if (m) return m;
    m = document.createElement('div');
    m.id = id;
    // site modal system: .modal overlay + .open flag (matches bulletin modal)
    m.className = 'modal';
    m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('open'); });
    document.body.appendChild(m);
    return m;
  }
  function modalShow(id) { var m = modalShell(id); m.classList.add('open'); return m; }
  function modalHide(id) { var m = $(id); if (m) m.classList.remove('open'); }

  /* ---------- 1. SOS ---------- */
  function sosText(gps) {
    var d = DATA[curKey()];
    return 'SOS WEATHER RESCUE — ' + d.name + ' ' + d.level + ' (Rain ' + d.rain + ', Wind ' + d.wind + '). I need help. ' + gps + ' Helpline 1077/112. via WeatherGPT SIH26068';
  }
  function openSos() {
    var m = modalShow('wgSos');
    m.innerHTML = '<div class="modal-card" role="dialog" aria-label="SOS rescue" style="border-top:4px solid #dc2626;">' +
      '<p class="eyebrow">SOS Rescue</p>' +
      '<h3 style="margin:0 0 8px;color:#dc2626;">Send distress with GPS</h3>' +
      '<p class="meta" style="margin:0 0 12px;">Sends GPS + alert to rescue. Also dial <b>1077</b> / <b>112</b>.</p>' +
      '<textarea id="wgSosTxt" rows="4" readonly style="width:100%;font-size:12px;font-family:var(--font-mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:var(--radius-md,10px);padding:10px;"></textarea>' +
      '<div id="wgSosGps" class="meta" style="margin:8px 0;">Locating GPS…</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
      '<button id="wgSosTg" class="btn btn-primary">Send Telegram</button>' +
      '<a id="wgSosWa" href="#" target="_blank" class="btn" style="background:#16a34a;border-color:#16a34a;color:#fff;text-decoration:none;justify-content:center;">WhatsApp</a>' +
      '<button id="wgSosCp" class="btn btn-secondary">Copy text</button>' +
      '<a href="tel:1077" class="btn" style="background:#dc2626;border-color:#dc2626;color:#fff;text-decoration:none;justify-content:center;">Call 1077</a>' +
      '</div><button id="wgSosX" class="btn btn-secondary" style="margin-top:10px;width:100%;justify-content:center;">Close</button></div>';
    var set = function (gps) {
      var msg = sosText(gps);
      $('wgSosTxt').value = msg;
      $('wgSosWa').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
      $('wgSosGps').textContent = gps;
    };
    set('GPS: locating… (' + DATA[curKey()].name + ')');
    try {
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (p) {
        set('GPS: ' + p.coords.latitude.toFixed(4) + ', ' + p.coords.longitude.toFixed(4) + ' • https://maps.google.com/?q=' + p.coords.latitude + ',' + p.coords.longitude);
      }, function () { $('wgSosGps').textContent = 'GPS denied — city-level location used.'; }, { timeout: 8000 });
    } catch (e) {}
    $('wgSosX').onclick = function () { modalHide('wgSos'); };
    $('wgSosCp').onclick = function () { try { navigator.clipboard.writeText($('wgSosTxt').value); } catch (e2) {} };
    $('wgSosTg').onclick = function () { tgSendText($('wgSosTxt').value, function (ok, s) { $('wgSosGps').textContent = ok ? 'Telegram sent ✓' : s; }); };
  }

  /* ---------- 2. Crowd reports (own map layer + localStorage) ---------- */
  function crowdGet() { try { return JSON.parse(localStorage.getItem('wg-crowd') || '[]'); } catch (e) { return []; } }
  function paintCrowd() {
    try {
      if (typeof L === 'undefined' || typeof map === 'undefined' || !map) return;
      if (!window.WG_crowd) window.WG_crowd = L.layerGroup().addTo(map);
      window.WG_crowd.clearLayers();
      crowdGet().forEach(function (r) {
        if (r.lat == null) return;
        L.circleMarker([r.lat, r.lon], { radius: 7, color: '#9333ea', weight: 2, fillColor: '#a855f7', fillOpacity: 0.85 })
          .bindPopup('<b>' + esc(r.type) + '</b><br>' + esc(r.note || '') + '<br><span style="font-size:10px;">' + esc(r.when || '') + '</span>')
          .addTo(window.WG_crowd);
      });
    } catch (e) {}
  }
  function reportCrowd() {
    var m = modalShow('wgRep');
    m.innerHTML = '<div class="modal-card" role="dialog" aria-label="Report flooding" style="max-width:420px;">' +
      '<p class="eyebrow">Crowd report</p>' +
      '<h3 style="margin:0 0 8px;">Report waterlogging or damage</h3>' +
      '<p class="meta" style="margin:0 0 12px;">Shows as a purple pin on the map. Unverified citizen data.</p>' +
      '<label class="meta" for="wgRepType">Type</label>' +
      '<select id="wgRepType" class="btn btn-secondary" style="width:100%;margin:4px 0 10px;">' +
      '<option>waterlogging</option><option>flood</option><option>tree-fallen</option><option>power-cut</option></select>' +
      '<label class="meta" for="wgRepNote">Road or landmark</label>' +
      '<input id="wgRepNote" class="btn btn-secondary" style="width:100%;margin:4px 0 12px;text-align:left;" value="' + esc(DATA[curKey()].name) + '" />' +
      '<div id="wgRepMsg" class="meta" style="margin-bottom:8px;"></div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button id="wgRepGo" class="btn btn-primary" style="flex:1;justify-content:center;">Save report</button>' +
      '<button id="wgRepX" class="btn btn-secondary">Cancel</button>' +
      '</div></div>';
    $('wgRepX').onclick = function () { modalHide('wgRep'); };
    $('wgRepGo').onclick = function () {
      var type = $('wgRepType').value, note = $('wgRepNote').value || '';
      var put = function (lat, lon) {
        var list = crowdGet();
        list.push({ type: type, note: note, lat: lat, lon: lon, when: new Date().toLocaleString('en-IN') });
        try { localStorage.setItem('wg-crowd', JSON.stringify(list.slice(-200))); } catch (e) {}
        paintCrowd();
        $('wgRepMsg').textContent = 'Saved — purple pin on the map. Thank you.';
        setTimeout(function () { modalHide('wgRep'); }, 900);
      };
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (p) { put(p.coords.latitude, p.coords.longitude); }, function () { var c = curCoords(); put(c.lat, c.lon); }, { timeout: 8000 });
      else { var c2 = curCoords(); put(c2.lat, c2.lon); }
    };
  }

  /* ---------- 3. Push Red alerts ---------- */
  function pushOn() { try { return localStorage.getItem('wg-push') === '1'; } catch (e) { return false; } }
  function enablePush(cb) {
    if (!('Notification' in window)) { alert('Notifications not supported here.'); return; }
    Notification.requestPermission().then(function (p) {
      try { localStorage.setItem('wg-push', p === 'granted' ? '1' : '0'); } catch (e) {}
      if (cb) cb(p === 'granted');
    });
  }
  function pushRed() {
    try {
      if (!pushOn() || Notification.permission !== 'granted') return;
      var d = DATA[curKey()];
      if (d.level.indexOf('RED') !== 0) return;
      var key = 'wg-push-last-' + d.name + d.rain;
      if (localStorage.getItem(key)) return;
      try { localStorage.setItem(key, '1'); } catch (e) {}
      new Notification(d.name + ' RED Alert', { body: d.rule });
    } catch (e) {}
  }

  /* ---------- 4/6. Lightning badge + NWP strip + 30-yr baseline ---------- */
  function capeRisk(c) {
    if (c == null) return null;
    if (c < 500) return ['Low', '#16a34a'];
    if (c < 1500) return ['Moderate', '#eab308'];
    if (c < 2500) return ['High — stay indoors', '#f97316'];
    return ['Severe — hail possible', '#dc2626'];
  }
  function refreshStrip() {
    var host = $('ruleTraceTop') || $('ruleTrace');
    if (!host || $('wgStrip')) return;
    var div = document.createElement('div');
    div.id = 'wgStrip';
    div.style.cssText = 'font-size:11px;opacity:.85;margin-top:4px;';
    div.textContent = 'NWP: loading…';
    host.parentNode.insertBefore(div, host.nextSibling);
  }
  function updateStrip() {
    refreshStrip();
    var el = $('wgStrip');
    if (!el) return;
    /* gesture gate: Chrome throws if AudioContext starts before any tap/click */
    try {
      if (window.WG_gestured == null) {
        window.WG_gestured = false;
        ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
          document.addEventListener(ev, function () { window.WG_gestured = true; }, { once: true, passive: true });
        });
      }
    } catch (e) { window.WG_gestured = true; }
    var c = curCoords();
    // cached baselines: memory + localStorage 24h (archive API rate-limits hammering)
    var CK = 'wg-base-' + c.lat.toFixed(1) + ',' + c.lon.toFixed(1);
    var paintBase = function (txt) { el.textContent += txt; };
    var useCache = false;
    try {
      var raw = localStorage.getItem(CK);
      if (raw) {
        var o = JSON.parse(raw);
        if (Date.now() - o.at < 24 * 3600 * 1000) { paintBase(' • 30-yr Sep: ~' + o.v + 'mm'); useCache = true; }
      }
    } catch (e) {}
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon + '&hourly=cape&timezone=auto&forecast_days=1')
      .then(function (r) { return r.json(); }).then(function (w) {
        var arr = (((w || {}).hourly || {}).cape) || [];
        var cape = 0;
        for (var i = 0; i < Math.min(6, arr.length); i++) cape = Math.max(cape, Number(arr[i]) || 0);
        var r = capeRisk(cape);
        el.textContent = 'Lightning (Damini guidance): ' + (r ? r[0] + ' (CAPE ' + Math.round(cape) + ')' : '—') + ' • Archive baseline loads on Research role';
        if (cape >= 1500 && !updateStrip._w && window.WG_gestured) {
          updateStrip._w = true;
          try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.06;
            o.start(); setTimeout(function () { try { o.stop(); ctx.close(); } catch (e) {} }, 500);
          } catch (e2) {}
        }
      }).catch(function () {});
    // 30-yr September baseline for current city (Open-Meteo Archive, fail-soft, cached)
    if (!useCache) fetch('https://archive-api.open-meteo.com/v1/archive?latitude=' + c.lat + '&longitude=' + c.lon + '&start_date=1994-01-01&end_date=2024-12-31&daily=precipitation_sum&timezone=auto')
      .then(function (r) { if (!r.ok) throw new Error('archive ' + r.status); return r.json(); }).then(function (d) {
        if (!d || !d.daily || !d.daily.time) return;
        var s = 0, n = 0;
        for (var i = 0; i < d.daily.time.length; i++) {
          if (String(d.daily.time[i]).slice(5, 7) === '09') { s += Number(d.daily.precipitation_sum[i]) || 0; n++; }
        }
        if (n) {
          var v = Math.round(s / (n / 30));
          try { localStorage.setItem(CK, JSON.stringify({ at: Date.now(), v: v })); } catch (e2) {}
          paintBase(' • 30-yr Sep: ~' + v + 'mm');
        }
      }).catch(function () {});
  }

  /* ---------- 5. Manager dashboard ---------- */
  var LVLC = { RED: '#dc2626', ORANGE: '#f97316', YELLOW: '#eab308', GREEN: '#16a34a' };
  function lvlColor(lvl) {
    var l = String(lvl || '');
    if (l.indexOf('RED') === 0) return LVLC.RED;
    if (l.indexOf('ORANGE') === 0) return LVLC.ORANGE;
    if (l.indexOf('YELLOW') === 0) return LVLC.YELLOW;
    return LVLC.GREEN;
  }
  function openMgr() {
    var m = modalShow('wgMgr');
    var rows = Object.keys(DATA).filter(function (k) { return DATA[k] && DATA[k].temp; }).map(function (k) {
      var d = DATA[k];
      return '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-md,10px);margin-bottom:6px;">' +
        '<span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + lvlColor(d.level) + ';margin-right:6px;"></span><b>' + esc(d.name) + '</b></span>' +
        '<span class="meta">' + esc(d.rain) + ' · ' + esc(d.wind) + ' · AQI ' + esc(d.aqi) + '</span>' +
        '<button data-wg-city="' + k + '" class="btn btn-secondary" style="padding:6px 12px;min-height:0;font-size:12px;">Open</button></div>';
    }).join('');
    m.innerHTML = '<div class="modal-card" role="dialog" aria-label="Manager dashboard">' +
      '<p class="eyebrow">District manager</p>' +
      '<h3 style="margin:0 0 10px;">All cities at a glance</h3>' + rows +
      '<div id="wgMgrMsg" class="meta" style="margin:4px 0;"></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">' +
      '<button id="wgMgrBc" class="btn btn-primary">Broadcast Reds</button>' +
      '<button id="wgMgrPush" class="btn btn-secondary">Enable Red Push</button>' +
      '<button id="wgMgrCsv" class="btn btn-secondary">Export CSV</button>' +
      '<button id="wgMgrUssd" class="btn btn-secondary">USSD *99*68#</button>' +
      '<button id="wgMgrX" class="btn btn-secondary">Close</button>' +
      '</div></div>';
    m.querySelectorAll('[data-wg-city]').forEach(function (b) {
      b.onclick = function () { modalHide('wgMgr'); try { selectCity(b.getAttribute('data-wg-city')); } catch (e) {} };
    });
    $('wgMgrX').onclick = function () { modalHide('wgMgr'); };
    $('wgMgrPush').onclick = function () { enablePush(function (ok) { $('wgMgrMsg').textContent = ok ? 'Red push ON.' : 'Push blocked in browser settings.'; }); };
    $('wgMgrCsv').onclick = exportCsv;
    $('wgMgrUssd').onclick = function () { modalHide('wgMgr'); openUssd(); };
    $('wgMgrBc').onclick = function () {
      var reds = Object.keys(DATA).filter(function (k) { return DATA[k].level && DATA[k].level.indexOf('RED') === 0; });
      var text = reds.length ? reds.map(function (k) { return 'RED ' + DATA[k].name + ': ' + DATA[k].rule; }).join('\n') : 'No RED alerts right now.';
      tgSendText(text, function (ok, s) { $('wgMgrMsg').textContent = ok ? 'Broadcast sent ✓' : s; });
    };
  }

  /* ---------- 6. Researcher CSV ---------- */
  function exportCsv() {
    var d = DATA[curKey()];
    var rows = [['city', 'day', 'temp', 'rain_prob_pct', 'alert']];
    (d.forecast || []).forEach(function (f) { rows.push([d.name, f[0], f[1], f[2], d.level]); });
    var csv = rows.map(function (r) { return r.map(function (x) { return '"' + String(x).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = d.name + '-weathergpt-7day.csv';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------- 7. USSD *99*68# demo ---------- */
  var USSD = { s: 'home' };
  function ussdShow() {
    var el = $('wgUssdScr');
    if (!el) return;
    var d = DATA[curKey()];
    if (USSD.s === 'home') el.textContent = 'WeatherGPT\n1 Weather 2 Alert\n3 Farm 4 Help\n' + d.name + ' ' + d.level;
    else if (USSD.s === 'weather') el.textContent = d.name + ': ' + d.temp + ' R' + d.rain + ' AQI' + d.aqi + '\n0 Back';
    else if (USSD.s === 'alert') el.textContent = (d.level + ' ' + d.rule).slice(0, 155) + '\n0 Back';
    else if (USSD.s === 'farm') el.textContent = 'Spray:' + (parseFloat(d.rain) > 10 ? 'NO' : 'YES') + ' Irrigate:' + (parseFloat(d.rain) < 5 ? 'YES' : 'NO') + '\n0 Back';
    else el.textContent = 'Call 1077/112.\nSMS CITY to 56161.\n0 Back';
  }
  function openUssd() {
    var m = modalShow('wgUssd');
    m.innerHTML = '<div class="modal-card" role="dialog" aria-label="USSD demo" style="max-width:300px;background:#000;border-color:#333;">' +
      '<p class="eyebrow">*99*68# WeatherGPT (2G)</p>' +
      '<div id="wgUssdScr" style="font-family:var(--font-mono);font-size:13px;color:#4ade80;min-height:120px;white-space:pre-wrap;margin:8px 0;"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
      '<button data-u="1" class="btn btn-secondary" style="justify-content:center;">1</button>' +
      '<button data-u="2" class="btn btn-secondary" style="justify-content:center;">2</button>' +
      '<button data-u="3" class="btn btn-secondary" style="justify-content:center;">3</button>' +
      '<button data-u="0" class="btn btn-secondary" style="grid-column:span 3;justify-content:center;">0 Back / Close</button>' +
      '</div></div>';
    USSD.s = 'home'; ussdShow();
    m.querySelectorAll('[data-u]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-u');
        if (k === '0') { if (USSD.s === 'home') modalHide('wgUssd'); else USSD.s = 'home'; }
        else if (USSD.s === 'home') USSD.s = k === '1' ? 'weather' : k === '2' ? 'alert' : k === '3' ? 'farm' : 'help';
        ussdShow();
      };
    });
  }

  /* ---------- wire buttons + city-change hooks ---------- */
  function addNav() {
    var s = navBtn('wgSosBtn', 'SOS', 'SOS rescue: GPS + 1077', '#dc2626');
    if (s) s.onclick = openSos;
    var r = navBtn('wgRepBtn', '+ Report', 'Report waterlogging / flood', '#7c3aed');
    if (r) r.onclick = reportCrowd;
    var g = navBtn('wgMgrBtn', 'Manager', 'District manager dashboard', 'var(--muted)');
    if (g) g.onclick = openMgr;
  }
  // level-aware map colors for new cities (wrap inline updateMap if present)
  try {
    if (typeof updateMap === 'function' && !updateMap._wg) {
      var _um = updateMap;
      updateMap = function () {
        _um();
        try {
          var k = (typeof cur !== 'undefined') ? cur : null;
          var d = k && DATA[k];
          if (!d || typeof floodLayer === 'undefined' || !floodLayer) return;
          var col = d.level.indexOf('RED') === 0 ? '#ef4444' : d.level.indexOf('ORANGE') === 0 ? '#f59e0b' : d.level.indexOf('YELLOW') === 0 ? '#eab308' : '#16a34a';
          var c = (typeof COORDS !== 'undefined' && COORDS[k]) || null;
          if (!c || typeof L === 'undefined') return;
          floodLayer.clearLayers();
          L.circle([c[0], c[1]], { radius: 2200, color: col, weight: 2, fillColor: col, fillOpacity: 0.18 }).addTo(floodLayer)
            .bindPopup('<b>' + esc(d.name) + '</b><br>' + esc(d.rule) + '<br><span style="font-size:11px;">Open-Meteo · IMD v1.2</span>');
        } catch (e) {}
      };
      updateMap._wg = true;
    }
  } catch (e3) {}
  // refresh strip + push + crowd on every city change (invalid keys ignored)
  function hookCity() {
    try {
      if (typeof selectCity === 'function' && !selectCity._wg) {
        var _sc = selectCity;
        selectCity = function (k) { if (!k || !DATA[k]) return; _sc(k); try { updateStrip._w = false; } catch (e) {} updateStrip(); pushRed(); paintCrowd(); paintCityPins(); };
        selectCity._wg = true;
      }
    } catch (e4) {}
  }
  /* ---------- 8. All-city pins: every DATA city on the map with telemetry popup ---------- */
  function lvlHex(lvl) {
    var l = String(lvl || '');
    if (l.indexOf('RED') === 0) return '#dc2626';
    if (l.indexOf('ORANGE') === 0) return '#f97316';
    if (l.indexOf('YELLOW') === 0) return '#eab308';
    return '#16a34a';
  }
  function cityLatLon(k) {
    try {
      if (typeof COORDS !== 'undefined' && COORDS[k]) return [COORDS[k][0], COORDS[k][1]];
      if (typeof PINDB !== 'undefined') {
        for (var pin in PINDB) { if (PINDB[pin] === k && typeof pinLatLon === 'function') { try { return null; } catch (e) {} } }
      }
    } catch (e) {}
    var FALLBACK = { guwahati: [26.18, 91.75], mumbai: [19.07, 72.87], chennai: [13.08, 80.27], delhi: [28.61, 77.20], kolkata: [22.57, 88.36], bengaluru: [12.97, 77.59], patna: [25.59, 85.13], shimla: [31.10, 77.17] };
    return FALLBACK[k] || null;
  }
  function paintCityPins() {
    try {
      if (typeof L === 'undefined' || typeof map === 'undefined' || !map) return;
      if (!window.WG_cities) window.WG_cities = L.layerGroup().addTo(map);
      window.WG_cities.clearLayers();
      Object.keys(DATA).forEach(function (k) {
        var d = DATA[k];
        if (!d || !d.temp) return;
        var ll = cityLatLon(k);
        if (!ll) return;
        var col = lvlHex(d.level);
        L.circleMarker(ll, { radius: 9, color: '#fff', weight: 2, fillColor: col, fillOpacity: 0.95 })
          .bindPopup('<b>' + esc(d.name) + '</b> · ' + esc(d.level) + '<br>' +
            'Temp ' + esc(d.temp) + ' · Rain ' + esc(d.rain) + '<br>' +
            'Wind ' + esc(d.wind) + ' · AQI ' + esc(d.aqi) + ' (' + esc(d.aqiLabel || '') + ')<br>' +
            '<span style="font-size:11px;">' + esc(d.rule || '') + '</span><br>' +
            '<span style="font-size:10px;opacity:.7;">Open-Meteo · IMD v1.2</span>')
          .addTo(window.WG_cities);
      });
      try { if (!map._wgScale) { map._wgScale = true; L.control.scale({ imperial: false }).addTo(map); } } catch (e2) {}
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { bootPlus(); });
  else { bootPlus(); }
  function bootPlus() {
    addNav(); hookCity(); updateStrip(); paintCrowd(); pushRed(); paintCityPins();
    // map may init after us: keep retrying pins/crowd until the layer holds markers
    try {
      var tries = 0;
      var poll = function () {
        try {
          paintCityPins(); paintCrowd();
          var n = 0;
          try { if (window.WG_cities) window.WG_cities.eachLayer(function () { n++; }); } catch (e) {}
          if (n > 0 || ++tries >= 20) return;
        } catch (e) { if (++tries >= 20) return; }
        setTimeout(poll, 1500);
      };
      setTimeout(poll, 1500);
    } catch (e) {}
    // Live city arrives async (pincode pages): re-run place-dependent widgets
    // when the title resolves from "Locating…" to the real place.
    try {
      var t = document.getElementById('cityTitle'), last = '', n = 0;
      var recheck = function () {
        try {
          var cur = t ? t.textContent : '';
          if (cur && cur !== last && /locating/i.test(last || '') && !/locating/i.test(cur)) {
            try { updateStrip._w = false; } catch (e) {}
            updateStrip(); paintCityPins();
            try { refreshHourly(); } catch (e2) {}
          }
          last = cur;
        } catch (e) {}
        if (++n < 20) setTimeout(recheck, 1500);
      };
      if (t) { last = t.textContent; setTimeout(recheck, 1500); }
    } catch (e) {}
  }

  /* ---------- GPS person-location dot (visible on satellite too) ---------- */
  function locateMe(fly) {
    try {
      if (typeof L === 'undefined' || typeof map === 'undefined' || !map) { alert('Map not ready yet.'); return; }
      if (!navigator.geolocation) { alert('GPS not supported here.'); return; }
      navigator.geolocation.getCurrentPosition(function (p) {
        var lat = p.coords.latitude, lon = p.coords.longitude;
        if (!window.WG_me) window.WG_me = L.layerGroup().addTo(map);
        window.WG_me.clearLayers();
        L.circle([lat, lon], { radius: Math.max(60, p.coords.accuracy || 60), color: '#0e63b6', weight: 1, fillColor: '#0e63b6', fillOpacity: 0.15 }).addTo(window.WG_me);
        L.circleMarker([lat, lon], { radius: 8, color: '#fff', weight: 2, fillColor: '#0e63b6', fillOpacity: 1 }).addTo(window.WG_me)
          .bindPopup('<b>You are here</b><br><span style="font-size:11px;">GPS ±' + Math.round(p.coords.accuracy || 0) + 'm</span>').openPopup();
        try { map.setView([lat, lon], 13); } catch (e) {}
      }, function () { alert('GPS blocked — allow location in the browser to see your dot.'); }, { timeout: 9000 });
    } catch (e) {}
  }
  try {
    var mbar = document.querySelector('.mapbar');
    if (mbar && !$('wgLocateBtn')) {
      var lb = document.createElement('button');
      lb.id = 'wgLocateBtn'; lb.textContent = '◎ Locate me'; lb.title = 'Show your GPS dot';
      lb.style.cssText = 'display:inline-flex;align-items:center;font-size:12px;font-weight:700;padding:8px 12px;border-radius:9999px;border:1px solid var(--border);background:transparent;color:var(--fg);white-space:nowrap;cursor:pointer;';
      mbar.appendChild(lb);
      lb.onclick = function () { locateMe(true); };
    }
  } catch (e5) {}
})();

/* WeatherGPT — Plus pack PART 3: radar, hourly chart, GloFAS flood graph. */
(function () {
  'use strict';
  function esc3(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function curCoords2() {
    // Live place first: map center + page title (pincode pages like Pathanamthitta
    // are NOT in DATA, so defaulting to a DATA key shows the wrong city's numbers).
    try {
      var tel = document.getElementById('cityTitle');
      var nm = tel ? tel.textContent.split('—')[0].trim() : '';
      if (typeof map !== 'undefined' && map && map.getCenter) {
        var c = map.getCenter();
        if (c && isFinite(c.lat) && isFinite(c.lng)) {
          return { key: null, lat: +c.lat.toFixed(2), lon: +c.lng.toFixed(2), name: nm || 'Live location' };
        }
      }
    } catch (e) {}
    try {
      var k = (typeof cur !== 'undefined' && DATA[cur]) ? cur : 'guwahati';
      var c2 = (typeof COORDS !== 'undefined' && COORDS[k]) || [26.18, 91.75];
      return { key: k, lat: c2[0], lon: c2[1], name: (DATA[k] && DATA[k].name) || 'Live location' };
    } catch (e2) { return { key: 'guwahati', lat: 26.18, lon: 91.75, name: 'Guwahati' }; }
  }
  /* ----- 1. RainViewer radar animation (free, no key) ----- */
  var RV = { frames: [], idx: 0, timer: null, layer: null, on: false };
  function radarToggle() {
    try {
      if (typeof L === 'undefined' || typeof map === 'undefined' || !map) { alert('Map not ready yet.'); return; }
      var btn = document.getElementById('wgRadarBtn');
      if (RV.on) {
        RV.on = false;
        if (RV.timer) clearInterval(RV.timer);
        if (RV.layer) { try { map.removeLayer(RV.layer); } catch (e) {} RV.layer = null; }
        if (btn) btn.textContent = 'Radar';
        return;
      }
      if (btn) btn.textContent = 'Radar…';
      fetch('https://api.rainviewer.com/public/weather-maps.json').then(function (r) { return r.json(); }).then(function (j) {
        var host = j.host;
        var frames = ((j.radar || {}).past || []).concat(((j.radar || {}).nowcast || [])).slice(-8);
        if (!frames.length) { if (btn) btn.textContent = 'Radar'; alert('Radar feed busy — retry soon.'); return; }
        RV.frames = frames; RV.idx = 0; RV.on = true;
        if (btn) btn.textContent = 'Radar ■';
        var show = function () {
          try {
            if (RV.layer) map.removeLayer(RV.layer);
            var f = RV.frames[RV.idx % RV.frames.length];
            RV.layer = L.tileLayer(host + f.path + '/256/{z}/{x}/{y}/2/1_1.png', { opacity: 0.6, zIndex: 500 });
            RV.layer.addTo(map);
            RV.idx++;
          } catch (e2) {}
        };
        show();
        RV.timer = setInterval(show, 800);
      }).catch(function () { if (btn) btn.textContent = 'Radar'; });
    } catch (e3) {}
  }
  /* ----- 2+3. Hourly 24h chart + GloFAS 7-day discharge ----- */
  function stripHost() {
    var f = document.getElementById('fstrip');
    if (!f) return null;
    var h = document.getElementById('wgHourly');
    if (!h) {
      h = document.createElement('div');
      h.id = 'wgHourly';
      h.style.cssText = 'margin-top:10px;';
      f.parentNode.insertBefore(h, f.nextSibling);
    }
    return h;
  }
  function barRow(title, cells) {
    return '<div style="font-size:11px;font-weight:800;margin:6px 0 4px;">' + title + '</div>' +
      '<div style="display:flex;align-items:flex-end;gap:2px;height:64px;">' + cells + '</div>';
  }
  function refreshHourly() {
    var host = stripHost();
    if (!host) return;
    // live city not resolved yet: retry shortly instead of painting "Locating…"
    try {
      var tt = document.getElementById('cityTitle');
      if (tt && /locating/i.test(tt.textContent) && !refreshHourly._r) {
        refreshHourly._r = true;
        setTimeout(function () { refreshHourly._r = false; refreshHourly(); }, 4000);
        return;
      }
    } catch (e) {}
    var c = curCoords2();
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + c.lat + '&longitude=' + c.lon + '&hourly=temperature_2m,precipitation&timezone=auto&forecast_days=2')
      .then(function (r) { return r.json(); }).then(function (w) {
        var h = (w.hourly || {}), out = '';
        var temps = (h.temperature_2m || []).slice(0, 24), prec = (h.precipitation || []).slice(0, 24);
        if (!temps.length) return;
        var mn = Math.min.apply(null, temps), mx = Math.max.apply(null, temps);
        var cells = '';
        for (var i = 0; i < 24; i += 2) {
          var t = temps[i], p = prec[i] || 0;
          var hh = 12 + Math.round(((t - mn) / Math.max(1, mx - mn)) * 34);
          var col = p > 2 ? '#0e63b6' : p > 0.2 ? '#7cb3e8' : '#e5b80b';
          var hr = new Date(h.time[i]).getHours();
          cells += '<div title="' + hr + ':00 ' + t + '°C rain ' + p + 'mm" style="flex:1;background:' + col + ';height:' + hh + 'px;border-radius:3px 3px 0 0;"></div>';
        }
        out += barRow('Next 24 hours (temp curve · blue = rain) — ' + c.name, cells);
        host.innerHTML = out;
        // GloFAS discharge
        return fetch('https://flood-api.open-meteo.com/v1/flood?latitude=' + c.lat + '&longitude=' + c.lon + '&daily=river_discharge&forecast_days=7&past_days=0').then(function (r2) { return r2.json(); }).then(function (f) {
          var dd = (((f || {}).daily || {}).river_discharge) || [];
          var vals = dd.filter(function (v) { return v != null; });
          if (!vals.length) { host.innerHTML += '<div style="font-size:11px;opacity:.7;">GloFAS: no river gauge near ' + esc3(c.name) + ' (inland).</div>'; return; }
          var mx2 = Math.max.apply(null, vals);
          var cells2 = dd.map(function (v, i) {
            if (v == null) return '<div style="flex:1;"></div>';
            var hh2 = 8 + Math.round((v / mx2) * 44);
            return '<div title="Day+' + i + ': ' + Math.round(v) + ' m³/s" style="flex:1;background:#0891b2;height:' + hh2 + 'px;border-radius:3px 3px 0 0;"></div>';
          }).join('');
          host.innerHTML += barRow('GloFAS river discharge 7-day (m³/s) — ' + esc3(c.name), cells2) +
            '<div style="font-size:10px;opacity:.7;">Source: GloFAS via Open-Meteo · CWC danger levels vary by gauge</div>';
        }).catch(function () {});
      }).catch(function () {});
  }
  try {
    var mbar2 = document.querySelector('.mapbar');
    if (mbar2 && !document.getElementById('wgRadarBtn')) {
      var rb = document.createElement('button');
      rb.id = 'wgRadarBtn'; rb.textContent = 'Radar'; rb.title = 'Animate live rain radar (RainViewer)';
      rb.style.cssText = 'display:inline-flex;align-items:center;font-size:12px;font-weight:700;padding:8px 12px;border-radius:9999px;border:1px solid var(--border);background:transparent;color:var(--fg);white-space:nowrap;cursor:pointer;';
      mbar2.appendChild(rb);
      rb.onclick = radarToggle;
    }
  } catch (e4) {}
  // refresh charts on city change (wrap selectCity once)
  try {
    if (typeof selectCity === 'function' && !selectCity._wgH) {
      var _sc2 = selectCity;
      selectCity = function (k) { _sc2(k); refreshHourly(); };
      selectCity._wgH = true;
    }
  } catch (e5) {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshHourly);
  else refreshHourly();
})();

/* WeatherGPT — Plus pack PART 4: PWA register, judge tour, accessibility. */
(function () {
  'use strict';
  try { if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('service-worker.js').catch(function () {}); } catch (e) {}
  /* Focus visibility + skip link (SIH accessibility rubric). */
  try {
    var st = document.createElement('style');
    st.textContent = 'a:focus-visible,button:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:3px solid #0e63b6;outline-offset:2px;border-radius:var(--radius-md,10px);}' +
      '.wg-skip{position:absolute;left:-9999px;top:0;background:#0e63b6;color:#fff;padding:8px 12px;z-index:10000;border-radius:0 0 8px 0;}' +
      '.wg-skip:focus{left:0;}' +
      /* clip ticker + page: no horizontal page scroll ever */
      'html,body{overflow-x:hidden;}' +
      '.ticker{overflow:hidden;max-width:100%;}' +
      '#tickerText{white-space:nowrap;display:inline-block;max-width:none;}' +
      /* actions bar: NEVER wrap — single scrollable line at every width */
      'header .row{flex-wrap:nowrap;overflow-x:auto;max-width:100%;min-width:0;scrollbar-width:none;}' +
      'header .row::-webkit-scrollbar{display:none;}' +
      'header .row>*{flex-shrink:0;}' +
      '#wgStrip{word-break:break-word;}' +
      /* small screens: header row scrolls (page CSS owns .topnav nav scrolling) */
      '@media (max-width:700px){' +
      '.topnav-inner{flex-wrap:nowrap;row-gap:0;}' +
      /* one-line scrollable action bar: everything stays on the menu bar (base rule above) */
      'header .row{row-gap:0;}' +
      '.topnav .btn{padding:7px 10px;font-size:12px;min-height:36px;}' +
      '.topnav .city-chip{min-height:34px;font-size:11px;padding:5px 9px;}' +
      '.topnav .themebtn{width:34px;height:34px;}' +
      '}';
    document.head.appendChild(st);
    var sk = document.createElement('a');
    sk.href = '#dashboard'; sk.className = 'wg-skip'; sk.textContent = 'Skip to dashboard';
    document.body.insertBefore(sk, document.body.firstChild);
    ['wgSosBtn', 'wgRepBtn', 'wgMgrBtn', 'wgLocateBtn', 'wgRadarBtn'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b && !b.getAttribute('aria-label')) b.setAttribute('aria-label', b.title || b.textContent);
    });
    var pill = document.getElementById('alertPill');
    if (pill) pill.setAttribute('role', 'alert');
  } catch (e2) {}
  /* ----- Judge tour: 60-second guided demo ----- */
  var TOUR = [
    { t: 'Red alert first: Guwahati flood emergency with rule trace.', run: function () { try { selectCity('guwahati'); } catch (e) {} } },
    { t: 'Why Red? The rule shows exact numbers — rain, discharge, thresholds.', run: function () { try { if (typeof openWhy === 'function') openWhy(); } catch (e2) {} } },
    { t: 'Ask anything: type a city + question, or speak. Try the mic.', run: function () { try { var c = document.getElementById('chatInput'); if (c) { c.focus(); c.value = 'Kolkata rain today?'; } } catch (e3) {} } },
    { t: 'Map: satellite default, radar animation, shelters, your GPS dot.', run: function () { try { var m = document.getElementById('map'); if (m) m.scrollIntoView({ block: 'center' }); } catch (e4) {} } },
    { t: 'Done: print the IMD bulletin, or hit SOS / Manager. Thank you!', run: function () {} }
  ];
  var TI = 0;
  function tourBox() {
    var b = document.getElementById('wgTour');
    if (b) return b;
    b = document.createElement('div');
    b.id = 'wgTour';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Guided demo tour');
    b.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:9999;max-width:300px;background:var(--surface,#fff);border:2px solid #0e63b6;border-radius:12px;padding:12px;box-shadow:0 8px 30px rgba(0,0,0,.3);font-size:13px;';
    document.body.appendChild(b);
    return b;
  }
  function tourShow() {
    var b = tourBox();
    b.style.display = 'block';
    b.innerHTML = '<b>Tour ' + (TI + 1) + '/' + TOUR.length + '</b><p style="margin:6px 0;">' + TOUR[TI].t + '</p>' +
      '<div style="display:flex;gap:8px;"><button id="wgTourNext" style="flex:1;padding:8px;border-radius:var(--radius-md,10px);border:0;background:#0e63b6;color:#fff;font-weight:700;">' + (TI + 1 === TOUR.length ? 'Finish' : 'Next') + '</button>' +
      '<button id="wgTourX" style="padding:8px;border-radius:var(--radius-md,10px);border:1px solid var(--border);background:transparent;color:inherit;">Exit</button></div>';
    try { TOUR[TI].run(); } catch (e) {}
    document.getElementById('wgTourNext').onclick = function () { TI++; if (TI >= TOUR.length) { b.style.display = 'none'; TI = 0; } else tourShow(); };
    document.getElementById('wgTourX').onclick = function () { b.style.display = 'none'; TI = 0; };
  }
  try {
    var anchor = document.getElementById('langBtn');
    var row = anchor && anchor.parentNode;
    if (row && !document.getElementById('wgTourBtn')) {
      var tb = document.createElement('button');
      tb.id = 'wgTourBtn'; tb.title = '60-second guided demo for judges';
      tb.setAttribute('aria-label', 'Start guided demo tour');
      tb.innerHTML = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#0e63b6;flex:none;"></span>▶ Tour';
      tb.style.cssText = 'display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:8px 12px;border-radius:9999px;border:1px solid var(--border);background:transparent;color:var(--fg);white-space:nowrap;min-height:36px;align-self:center;cursor:pointer;';
      row.insertBefore(tb, anchor);
      tb.onclick = function () { TI = 0; tourShow(); };
    }
  } catch (e5) {}
})();
