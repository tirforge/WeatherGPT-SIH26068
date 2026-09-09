// WeatherGPT SIH26068 - Comprehensive Demo Data & Meteorological Knowledge Base

window.DEMO_DATA = {
  cities: {
    guwahati: {
      name: "Guwahati",
      hindiName: "गुवाहाटी",
      state: "Assam",
      lat: 26.1445,
      lon: 91.7362,
      pincode: "781001",
      panchayat: "Kamrup Metro • Dispur G.P.",
      alertLevel: "red",
      alertTitle: "EMERGENCY: Brahmaputra Flood Warning",
      alertTitleHi: "आपातकालीन: ब्रह्मपुत्र बाढ़ चेतावनी (रेड अलर्ट)",
      ruleTrace: "3-day cumulative rain 168mm (>150mm) + River discharge 92% (>80% bankfull) = Flood Red Alert",
      ruleTraceHi: "3-दिवसीय वर्षा 168mm (>150mm) + नदी जलस्तर 92% (>80% स्तर) = बाढ़ रेड अलर्ट",
      current: {
        temp: 29.4,
        tempTrend: "+1.2°",
        rain: 88.5,
        rainTrend: "+42%",
        wind: 38,
        windTrend: "+15%",
        aqi: 48,
        aqiStatus: "Good",
        humidity: 94,
        humidityTrend: "+8%",
        discharge: "92% (High)",
        pressure: 998
      },
      forecast7Day: [
        { day: "Today", dayHi: "आज", tempMax: 30, tempMin: 24, rain: 88, icon: "cloud-rain", code: "red" },
        { day: "Thu", dayHi: "गुरु", tempMax: 29, tempMin: 24, rain: 65, icon: "cloud-rain", code: "orange" },
        { day: "Fri", dayHi: "शुक्र", tempMax: 31, tempMin: 25, rain: 45, icon: "cloud-drizzle", code: "yellow" },
        { day: "Sat", dayHi: "शनि", tempMax: 32, tempMin: 25, rain: 20, icon: "cloud-sun", code: "green" },
        { day: "Sun", dayHi: "रवि", tempMax: 33, tempMin: 26, rain: 12, icon: "sun", code: "green" },
        { day: "Mon", dayHi: "सोम", tempMax: 33, tempMin: 26, rain: 5, icon: "sun", code: "green" },
        { day: "Tue", dayHi: "मंगल", tempMax: 34, tempMin: 27, rain: 2, icon: "sun", code: "green" }
      ],
      timeline: {
        farmer: [
          { time: "06:00 - 09:00", status: "orange", title: "Flash Runoff Risk", desc: "Keep paddy drainage gates OPEN. Halt any fertilizer/pesticide spraying.", descHi: "धान के खेतों से जल निकासी द्वार खुले रखें। कीटनाशक छिड़काव तुरंत रोकें।" },
          { time: "09:00 - 12:00", status: "red", title: "Heavy Inundation Peak", desc: "Move livestock and harvested grain to elevated platforms or flood shelters.", descHi: "पशुधन और कटी हुई फसलों को तुरंत ऊंचे सुरक्षित स्थानों पर ले जाएं।" },
          { time: "12:00 - 15:00", status: "red", title: "Intense Downpour (35mm/h)", desc: "Avoid low-lying riverbank plots completely. Secure irrigation pump sets.", descHi: "नदी तटीय खेतों से पूरी तरह दूर रहें। सिंचाई पंप और मोटरों को सुरक्षित करें।" },
          { time: "15:00 - 18:00", status: "orange", title: "Gradual Inflow", desc: "Inspect bunds for breach risks. Prepare emergency sandbags.", descHi: "मेड़ों और तटबंधों का निरीक्षण करें। आपातकालीन बालू की बोरियां तैयार रखें।" },
          { time: "18:00 - 21:00", status: "yellow", title: "Light Rain Window", desc: "Monitor official CWC flood advisory bulletin before next morning work.", descHi: "अगली सुबह के कार्य से पूर्व आधिकारिक CWC बाढ़ बुलेटिन की जांच करें।" }
        ],
        citizen: [
          { time: "06:00 - 09:00", status: "orange", title: "Waterlogging Warning", desc: "Avoid GS Road and Zoo Road corridors. Keep emergency go-bag ready.", descHi: "जीएस रोड और जू रोड क्षेत्रों में जाने से बचें। आपातकालीन बैग तैयार रखें।" },
          { time: "09:00 - 12:00", status: "red", title: "Severe Urban Inundation", desc: "Stay indoors. Power supply in low sectors may be disconnected for safety.", descHi: "घरों के भीतर रहें। सुरक्षा के लिए निचले इलाकों में बिजली आपूर्ति बंद हो सकती है।" },
          { time: "12:00 - 15:00", status: "red", title: "Peak Rainfall Spell", desc: "Emergency helpline 1077 active. Do not walk or drive through floodwater.", descHi: "आपातकालीन हेल्पलाइन 1077 सक्रिय है। बहते पानी में चलने या गाड़ी चलाने से बचें।" },
          { time: "15:00 - 18:00", status: "orange", title: "Receding High Slopes", desc: "Essential travel only via arterial flyovers. Boil drinking water.", descHi: "केवल अत्यंत आवश्यक होने पर फ्लाईओवरों का प्रयोग करें। पीने का पानी उबालें।" },
          { time: "18:00 - 21:00", status: "yellow", title: "Controlled Outflow", desc: "Charge devices and emergency power banks during supply window.", descHi: "बिजली रहने के दौरान फोन और आपातकालीन लाइटें चार्ज कर लें।" }
        ],
        fisherman: [
          { time: "06:00 - 12:00", status: "red", title: "River Navigation Banned", desc: "Strict ban on motorized and country boats on Brahmaputra (Current > 3.8 m/s).", descHi: "ब्रह्मपुत्र नदी में नाव संचालन पर पूर्ण प्रतिबंध (जल प्रवाह गति > 3.8 मी/सेकंड)।" },
          { time: "12:00 - 18:00", status: "red", title: "High Surge & Debris", desc: "Floating logs and eddy hazards at Ghats. Move anchored boats 15m inland.", descHi: "नदी में बहती लकड़ियों व भंवर का भारी खतरा। नावों को 15 मीटर ऊपर बांधें।" },
          { time: "18:00 - 21:00", status: "orange", title: "No Night Fishing", desc: "Maintain mooring lines. Next advisory release at 05:30 IST tomorrow.", descHi: "रात में मछली पकड़ने पर रोक। अगली एडवाइजरी सुबह 5:30 बजे जारी होगी।" }
        ],
        aviation: [
          { time: "06:00 - 12:00", status: "red", title: "LGBI Airport Alert (VEGT)", desc: "VIS 800m in +RA, Cloud base 400ft OVC. Multiple runway holding expected.", descHi: "गुवाहाटी हवाई अड्डा: दृश्यता 800m, बादल 400ft। उड़ानों में देरी संभावित।" },
          { time: "12:00 - 18:00", status: "orange", title: "Turbulence / Windshear", desc: "Low-level wind shear 25kt reported on approach Runway 20.", descHi: "रनवे 20 अप्रोच पर 25 समुद्री मील विंडशियर दर्ज।" },
          { time: "18:00 - 21:00", status: "yellow", title: "VIS Recovery to 2500m", desc: "VFR flights remain suspended, IFR normal subject to slot clearance.", descHi: "दृश्यता सुधरकर 2500m तक संभावित, IFR उड़ानें स्लॉट के अधीन।" }
        ]
      },
      climateDelta: {
        baseline: "1994-2024 Sep Mean: 215mm",
        trend: "+28% Intense Rain Spells",
        stat: "Rainfall intensity increased by 1.8x in Brahmaputra Basin over 3 decades."
      },
      downscaling: {
        block: "Kamrup Metropolitan (Dispur Circle)",
        elevation: "55m MSL",
        microclimateFactor: "+14mm orographic local enhancement along Khanapara ridge",
        soilSaturation: "94% (Near Liquefaction Point)"
      }
    },

    mumbai: {
      name: "Mumbai",
      hindiName: "मुंबई",
      state: "Maharashtra",
      lat: 19.0760,
      lon: 72.8777,
      pincode: "400001",
      panchayat: "BMC Zone 3 • Kurla/Bandra East",
      alertLevel: "orange",
      alertTitle: "ALERT: High Tide (4.48m) + Heavy Rain Warning",
      alertTitleHi: "सतर्कता: हाई टाइड (4.48 मी) और भारी बारिश (ऑरेंज अलर्ट)",
      ruleTrace: "High Tide 4.48m at 13:15 IST + Wind 54 km/h + Expected Rain 62mm = Orange Alert",
      ruleTraceHi: "13:15 IST पर 4.48m हाई टाइड + 54 km/h हवाएं + 62mm अनुमानित बारिश = ऑरेंज अलर्ट",
      current: {
        temp: 28.2,
        tempTrend: "-0.5°",
        rain: 58.0,
        rainTrend: "+28%",
        wind: 52,
        windTrend: "+34%",
        aqi: 62,
        aqiStatus: "Satisfactory",
        humidity: 91,
        humidityTrend: "+5%",
        discharge: "74% (Mithi River Surge)",
        pressure: 1002
      },
      forecast7Day: [
        { day: "Today", dayHi: "आज", tempMax: 29, tempMin: 25, rain: 58, icon: "cloud-rain", code: "orange" },
        { day: "Thu", dayHi: "गुरु", tempMax: 29, tempMin: 25, rain: 48, icon: "cloud-rain", code: "orange" },
        { day: "Fri", dayHi: "शुक्र", tempMax: 30, tempMin: 26, rain: 30, icon: "cloud-drizzle", code: "yellow" },
        { day: "Sat", dayHi: "शनि", tempMax: 31, tempMin: 26, rain: 15, icon: "cloud-sun", code: "green" },
        { day: "Sun", dayHi: "रवि", tempMax: 32, tempMin: 27, rain: 8, icon: "sun", code: "green" },
        { day: "Mon", dayHi: "सोम", tempMax: 32, tempMin: 27, rain: 4, icon: "sun", code: "green" },
        { day: "Tue", dayHi: "मंगल", tempMax: 33, tempMin: 27, rain: 2, icon: "sun", code: "green" }
      ],
      timeline: {
        citizen: [
          { time: "09:00 - 12:00", status: "yellow", title: "Pre-High Tide Window", desc: "Local trains running with 10-15m delay. Hindmata & Gandhi Market water build-up.", descHi: "लोकल ट्रेनें 10-15 मिनट देरी से। हिंदमाता और गांधी मार्केट में जलभराव शुरू।" },
          { time: "12:00 - 15:30", status: "orange", title: "High Tide Concurrence (4.48m)", desc: "Gates closed at Mithi outlet. Stay away from Marine Drive, Bandra Bandstand & beaches.", descHi: "मीठी नदी फ्लड गेट बंद। मरीन ड्राइव, बैंडस्टैंड व चौपाटी से पूरी तरह दूर रहें।" },
          { time: "15:30 - 19:00", status: "yellow", title: "Receding Ebb Tide", desc: "Flood gates reopen for gravity drainage. Traffic clears on WEH/EEH.", descHi: "भाटा शुरू होने पर फ्लड गेट खुलेंगे। प्रमुख राजमार्गों पर आवागमन सुधरेगा।" }
        ],
        farmer: [
          { time: "06:00 - 12:00", status: "yellow", title: "Thane/Palghar Belt", desc: "Ensure bund drainage in paddy fields. Delay urea top-dressing by 48h.", descHi: "पालघर/ठाणे धान के खेतों में पानी निकासी रखें। यूरिया छिड़काव 48 घंटे टालें।" },
          { time: "12:00 - 18:00", status: "orange", title: "Salinity Ingress Risk", desc: "Check coastal sluice valves against tidal backwater in creeks.", descHi: "तटीय खाड़ियों में खारे पानी के प्रवेश को रोकने हेतु स्लुइस वॉल्व चेक करें।" }
        ],
        fisherman: [
          { time: "06:00 - 18:00", status: "red", title: "Total Sea Ban (Squally 55km/h)", desc: "Fishermen advised not to venture into Maharashtra-Goa coast. Wave height 3.5-4.2m.", descHi: "महाराष्ट्र-गोवा तट पर समुद्र में जाने पर पूर्ण रोक। लहरें 3.5-4.2 मीटर ऊंची।" }
        ],
        aviation: [
          { time: "06:00 - 18:00", status: "orange", title: "CSMIA Alert (VABB)", desc: "Crosswind gusts 28kt on RWY 09/27. Average arrival delay 20 mins.", descHi: "मुंबई हवाई अड्डा: रनवे पर 28kt तेज हवाएं। उड़ानों में औसतन 20 मिनट की देरी।" }
        ]
      },
      climateDelta: {
        baseline: "1994-2024 Sep Mean: 340mm",
        trend: "+14% High Tide Overlaps",
        stat: "Short-duration extreme rain (>50mm/hr) frequency increased by 2.2x since 2005."
      },
      downscaling: {
        block: "Mumbai Suburban (Kurla West - Mithi Basin)",
        elevation: "6m MSL",
        microclimateFactor: "Tidal lock at Mahim Creek halts stormwater drainage between 12:45-14:30",
        soilSaturation: "88%"
      }
    },

    chennai: {
      name: "Chennai",
      hindiName: "चेन्नई",
      state: "Tamil Nadu",
      lat: 13.0827,
      lon: 80.2707,
      pincode: "600001",
      panchayat: "GCC Zone 9 • Adyar Basin",
      alertLevel: "yellow",
      alertTitle: "WATCH: Bay of Bengal Low Pressure System",
      alertTitleHi: "निगरानी: बंगाल की खाड़ी में निम्न दबाव तंत्र (येलो वॉच)",
      ruleTrace: "SW Monsoon convection + Bay of Bengal trough = Rain 32mm, Wind 36 km/h = Yellow Watch",
      ruleTraceHi: "बंगाल की खाड़ी में द्रोणी प्रभाव = 32mm वर्षा, 36 km/h हवा = येलो वॉच",
      current: {
        temp: 32.8,
        tempTrend: "+0.8°",
        rain: 28.0,
        rainTrend: "+12%",
        wind: 34,
        windTrend: "+8%",
        aqi: 55,
        aqiStatus: "Moderate",
        humidity: 78,
        humidityTrend: "+2%",
        discharge: "45% (Adyar & Chembarambakkam Normal)",
        pressure: 1006
      },
      forecast7Day: [
        { day: "Today", dayHi: "आज", tempMax: 33, tempMin: 27, rain: 28, icon: "cloud-drizzle", code: "yellow" },
        { day: "Thu", dayHi: "गुरु", tempMax: 33, tempMin: 27, rain: 35, icon: "cloud-rain", code: "yellow" },
        { day: "Fri", dayHi: "शुक्र", tempMax: 32, tempMin: 26, rain: 52, icon: "cloud-rain", code: "orange" },
        { day: "Sat", dayHi: "शनि", tempMax: 31, tempMin: 26, rain: 40, icon: "cloud-rain", code: "yellow" },
        { day: "Sun", dayHi: "रवि", tempMax: 33, tempMin: 27, rain: 15, icon: "cloud-sun", code: "green" },
        { day: "Mon", dayHi: "सोम", tempMax: 34, tempMin: 28, rain: 5, icon: "sun", code: "green" },
        { day: "Tue", dayHi: "मंगल", tempMax: 34, tempMin: 28, rain: 0, icon: "sun", code: "green" }
      ],
      timeline: {
        citizen: [
          { time: "08:00 - 14:00", status: "green", title: "Normal Conditions", desc: "Warm and partly cloudy. Metro and road traffic running normally.", descHi: "मौसम सामान्य रहेगा। मेट्रो और सड़क यातायात सुचारू रूप से जारी।" },
          { time: "14:00 - 19:00", status: "yellow", title: "Evening Thunder Showers", desc: "Spot waterlogging near Velachery and Madipakkam. Carry umbrellas.", descHi: "वेलाचेरी व मदिपक्कम के पास शाम को हल्की बारिश। छाता साथ रखें।" }
        ],
        farmer: [
          { time: "06:00 - 13:00", status: "green", title: "Safe Spraying Window", desc: "Optimal window for paddy crop foliar application and field preparation.", descHi: "धान की फसल में पोषक तत्वों के छिड़काव व जुताई के लिए अनुकूल समय।" },
          { time: "13:00 - 18:00", status: "yellow", title: "Convective Rain Expected", desc: "Pause outdoor drying of groundnuts and pulses by 13:30 IST.", descHi: "दोपहर 1:30 तक मूंगफली व दालों को खुले में सुखाना बंद करें।" }
        ],
        fisherman: [
          { time: "06:00 - 18:00", status: "yellow", title: "Coastal Warning (Wind 40km/h)", desc: "Small mechanized boats safe within 12 nautical miles. Exercise caution.", descHi: "तट से 12 नॉटिकल मील के दायरे में ही नौकाएं ले जाएं। हवा 40 km/h।" }
        ],
        aviation: [
          { time: "06:00 - 18:00", status: "green", title: "Chennai Intl (VOMM)", desc: "VIS 5000m, Clouds FEW 2500ft. Flight ops on normal schedule.", descHi: "चेन्नई एयरपोर्ट: दृश्यता 5000m, उड़ान संचालन सामान्य।" }
        ]
      },
      climateDelta: {
        baseline: "1994-2024 Sep Mean: 138mm",
        trend: "+8% Variability",
        stat: "Northeast monsoon onset shifting by +6 days on average over 20 years."
      },
      downscaling: {
        block: "Chennai Coastal Plain (Velachery - OMR Corridor)",
        elevation: "4m MSL",
        microclimateFactor: "Sea breeze front triggers afternoon convective storm cells",
        soilSaturation: "52%"
      }
    },

    delhi: {
      name: "Delhi",
      hindiName: "दिल्ली",
      state: "Delhi NCR",
      lat: 28.6139,
      lon: 77.2090,
      pincode: "110001",
      panchayat: "Central Delhi • Connaught Place/Yamuna Bank",
      alertLevel: "yellow",
      alertTitle: "WATCH: High AQI (240) + Light Monsoon Drizzle",
      alertTitleHi: "निगरानी: उच्च AQI (240) व हल्की बूंदाबांदी (येलो वॉच)",
      ruleTrace: "PM2.5 142 µg/m³ (AQI 240 - Poor) + Wind 14 km/h stagnant = Yellow Watch",
      ruleTraceHi: "PM2.5 142 µg/m³ (AQI 240) + शांत हवा 14 km/h = येलो वॉच",
      current: {
        temp: 34.6,
        tempTrend: "+1.6°",
        rain: 6.2,
        rainTrend: "-30%",
        wind: 16,
        windTrend: "-10%",
        aqi: 242,
        aqiStatus: "Poor / Unhealthy",
        humidity: 68,
        humidityTrend: "-4%",
        discharge: "38% (Yamuna Hathnikund Stable)",
        pressure: 1008
      },
      forecast7Day: [
        { day: "Today", dayHi: "आज", tempMax: 35, tempMin: 27, rain: 6, icon: "cloud-sun", code: "yellow" },
        { day: "Thu", dayHi: "गुरु", tempMax: 36, tempMin: 28, rain: 2, icon: "sun", code: "yellow" },
        { day: "Fri", dayHi: "शुक्र", tempMax: 36, tempMin: 28, rain: 0, icon: "sun", code: "yellow" },
        { day: "Sat", dayHi: "शनि", tempMax: 37, tempMin: 29, rain: 0, icon: "sun", code: "green" },
        { day: "Sun", dayHi: "रवि", tempMax: 37, tempMin: 29, rain: 0, icon: "sun", code: "green" },
        { day: "Mon", dayHi: "सोम", tempMax: 36, tempMin: 28, rain: 8, icon: "cloud-drizzle", code: "green" },
        { day: "Tue", dayHi: "मंगल", tempMax: 35, tempMin: 27, rain: 14, icon: "cloud-rain", code: "green" }
      ],
      timeline: {
        citizen: [
          { time: "06:00 - 09:00", status: "yellow", title: "Morning AQI Peak (260)", desc: "Senior citizens and asthmatic patients avoid vigorous outdoor cardio. Use N95.", descHi: "बुजुर्ग व सांस के मरीज सुबह आउटडोर व्यायाम से बचें। N95 मास्क लगाएं।" },
          { time: "09:00 - 17:00", status: "green", title: "Warm Urban Conditions", desc: "Stay hydrated. Heat index 39°C around 14:00 IST.", descHi: "गर्मी व उमस रहेगी, खूब पानी पिएं। दोपहर 2 बजे हीट इंडेक्स 39°C।" }
        ],
        farmer: [
          { time: "06:00 - 14:00", status: "green", title: "Favorable Field Work", desc: "Ideal conditions for vegetable harvest and nursery maintenance in Najafgarh belt.", descHi: "नजफगढ़ व यमुना खादर क्षेत्र में सब्जियों की तोड़ाई व नर्सरी हेतु अनुकूल।" }
        ],
        fisherman: [
          { time: "06:00 - 18:00", status: "green", title: "Yamuna Floodplain Safe", desc: "No upstream water release from Hathnikund barrage. Water level 203.8m (Safe < 205.3m).", descHi: "हथिनीकुंड से अतिरिक्त पानी नहीं छोड़ा गया। यमुना जलस्तर 203.8m (सुरक्षित)।" }
        ],
        aviation: [
          { time: "06:00 - 18:00", status: "green", title: "IGI Airport (VIDP)", desc: "VIS 3500m in haze, Nil significant convective clouds. CAT-I ops normal.", descHi: "दिल्ली एयरपोर्ट: धुंध में दृश्यता 3500m, उड़ानें सामान्य।" }
        ]
      },
      climateDelta: {
        baseline: "1994-2024 Sep Mean Temp: 33.1°C",
        trend: "+1.5°C Urban Heat Island",
        stat: "Delhi experiencing 4.5 additional warm nights per decade due to urban sprawl."
      },
      downscaling: {
        block: "Central Delhi District (Yamuna Floodplain - ITO)",
        elevation: "216m MSL",
        microclimateFactor: "Urban heat island + thermal inversion trapping vehicular particulate matter",
        soilSaturation: "41%"
      }
    }
  },

  // Map layers: Flood Polygons, Cyclone Path, Landslide Risk, Stations
  mapLayers: {
    floodPolygons: [
      {
        id: "poly-guwahati",
        name: "Guwahati Brahmaputra Flood Inundation Zone",
        city: "guwahati",
        color: "#DC2626",
        fillColor: "#DC2626",
        fillOpacity: 0.45,
        ruleTrace: "Rule SIH-FLD-01: 3-day Rain 168mm (>150mm) + GloFAS River Discharge 92% (>80%) = RED INUNDATION ALERT",
        stats: { area: "142 sq km", waterLevel: "50.12m (Danger Mark: 49.68m)", discharge: "48,200 m³/s" },
        coords: [
          [26.195, 91.680],
          [26.210, 91.740],
          [26.195, 91.820],
          [26.160, 91.860],
          [26.130, 91.810],
          [26.140, 91.730],
          [26.160, 91.685]
        ]
      },
      {
        id: "poly-mumbai",
        name: "Mumbai Mithi River & Kurla Lowlands",
        city: "mumbai",
        color: "#F97316",
        fillColor: "#F97316",
        fillOpacity: 0.4,
        ruleTrace: "Rule SIH-CST-03: Tidal Swell 4.48m + 24h Rain 58mm = ORANGE WATERLOGGING ZONE",
        stats: { area: "28 sq km", waterLevel: "3.2m above datum", discharge: "Mithi Basin Overflow" },
        coords: [
          [19.060, 72.855],
          [19.085, 72.875],
          [19.095, 72.895],
          [19.075, 72.905],
          [19.055, 72.875]
        ]
      },
      {
        id: "poly-chennai",
        name: "Chennai Adyar Basin & Velachery Floodplain",
        city: "chennai",
        color: "#EAB308",
        fillColor: "#EAB308",
        fillOpacity: 0.35,
        ruleTrace: "Rule SIH-MON-02: Chembarambakkam outflow watch at 45% capacity = YELLOW ADVISORY",
        stats: { area: "35 sq km", waterLevel: "Controlled Inflow", discharge: "1,200 cusecs" },
        coords: [
          [13.010, 80.200],
          [13.025, 80.245],
          [13.005, 80.270],
          [12.980, 80.235],
          [12.975, 80.205]
        ]
      },
      {
        id: "poly-delhi",
        name: "Delhi Yamuna Floodplain Buffer (ITO - Kashmiri Gate)",
        city: "delhi",
        color: "#16A34A",
        fillColor: "#16A34A",
        fillOpacity: 0.3,
        ruleTrace: "Rule SIH-RIV-04: Hathnikund discharge 22,000 cusecs (Safe < 100,000) = GREEN NORMAL",
        stats: { area: "45 sq km", waterLevel: "203.8m (Safe < 205.33m)", discharge: "Normal flow" },
        coords: [
          [28.670, 77.230],
          [28.685, 77.255],
          [28.645, 77.265],
          [28.615, 77.255],
          [28.610, 77.240]
        ]
      }
    ],

    cycloneTrack: {
      name: "Severe Cyclonic Storm 'TEJ-REMAL' (Track Simulation)",
      color: "#DC2626",
      points: [
        { lat: 14.5, lon: 86.2, wind: "65 km/h", time: "08 Sep 05:30", stage: "Depression", color: "#EAB308" },
        { lat: 16.8, lon: 87.5, wind: "85 km/h", time: "08 Sep 17:30", stage: "Deep Depression", color: "#F97316" },
        { lat: 19.2, lon: 88.6, wind: "115 km/h", time: "09 Sep 05:30", stage: "Severe Cyclonic Storm", color: "#DC2626" },
        { lat: 21.4, lon: 89.4, wind: "130 km/h", time: "09 Sep 17:30 (Landfall Expected)", stage: "Very Severe Cyclone", color: "#991B1B" },
        { lat: 23.5, lon: 90.5, wind: "70 km/h", time: "10 Sep 05:30", stage: "Weakening Inland", color: "#F97316" }
      ]
    },

    landslideZones: [
      { name: "Wayanad - Meppadi Sector", lat: 11.550, lon: 76.120, risk: "High (Orange)", rain3d: "192mm", desc: "Steep slopes with saturated red clay." },
      { name: "Kullu - Mandi Highway NH-21", lat: 31.950, lon: 77.110, risk: "Moderate (Yellow)", rain3d: "74mm", desc: "Debris flow hazard near Pandoh dam." },
      { name: "Sikkim Teesta Valley NH-10", lat: 27.330, lon: 88.610, risk: "High (Orange)", rain3d: "145mm", desc: "Active slide zone at 29th Mile." }
    ],

    stations: [
      { name: "Guwahati IMD Borjhar", lat: 26.106, lon: 91.585, alert: "red", temp: 29.4, rain: 88.5, status: "Active Flooding" },
      { name: "Mumbai IMD Santacruz", lat: 19.117, lon: 72.857, alert: "orange", temp: 28.2, rain: 58.0, status: "Tidal Surcharge" },
      { name: "Chennai IMD Meenambakkam", lat: 12.994, lon: 80.180, alert: "yellow", temp: 32.8, rain: 28.0, status: "Convective Shower" },
      { name: "Delhi IMD Safdarjung", lat: 28.583, lon: 77.208, alert: "yellow", temp: 34.6, rain: 6.2, status: "AQI 242 Warning" },
      { name: "Kolkata IMD Alipore", lat: 22.533, lon: 88.324, alert: "orange", temp: 30.2, rain: 52.0, status: "Cyclone Outer Band" },
      { name: "Bengaluru IMD HAL", lat: 12.950, lon: 77.668, alert: "green", temp: 26.8, rain: 4.2, status: "Normal" },
      { name: "Hyderabad IMD Begumpet", lat: 17.453, lon: 78.468, alert: "green", temp: 29.1, rain: 3.8, status: "Normal" },
      { name: "Kochi CIAL Coastal", lat: 10.152, lon: 76.392, alert: "yellow", temp: 28.0, rain: 32.0, status: "Rough Sea Watch" },
      { name: "Shimla IMD Centre", lat: 31.104, lon: 77.173, alert: "yellow", temp: 19.5, rain: 24.0, status: "Slope Watch" },
      { name: "Patna IMD Airport", lat: 25.590, lon: 85.088, alert: "yellow", temp: 31.5, rain: 18.0, status: "Ganga Swell Watch" }
    ]
  },

  // Fallback AI grounded advisory knowledge base (works 100% offline & without Groq keys)
  offlineAdvisories: {
    guwahati: {
      farmer: {
        en: `**Guwahati Agricultural Advisory (Flood RED Alert)**

• **Current Metrics**: Rain 88.5mm | Discharge 92% | Soil Saturation 94%
• **Spray & Fertilizer Action**: **STRICT HOLD**. Rain over 70mm will cause 100% fertilizer runoff and leaf burn.
• **Irrigation & Drainage**: Keep all drainage sluice gates fully open. Clear field outlet bunds immediately.
• **Crop Protection**: Harvest mature kharif vegetables and move paddy seeds/grain bags to high platforms.
• **Livestock**: Relocate cattle from riverine chars (floodplains) to designated village raised shelters (chapori highlands).

*Provenance: Open-Meteo • CWC GloFAS • IMD v1.2 • Verified Grounded*`,
        hi: `**गुवाहाटी कृषि परामर्श (बाढ़ रेड अलर्ट)**

• **वर्तमान आंकड़े**: वर्षा 88.5mm | जलस्तर 92% | मिट्टी संतृप्ति 94%
• **कीटनाशक व खाद छिड़काव**: **पूर्ण रोक**। 70mm से अधिक वर्षा में खाद बह जाएगी।
• **जल निकासी**: धान के खेतों के सभी निकास द्वार तुरंत खोलें।
• **फसल सुरक्षा**: कटी हुई और तैयार फसलों को तत्काल ऊंचे स्थानों पर सुरक्षित करें।
• **पशुधन सुरक्षा**: मवेशियों को नदी तट से हटाकर ऊंचे बाढ़ राहत आश्रयों में ले जाएं।

*स्रोत: Open-Meteo • CWC GloFAS • IMD v1.2 • प्रमाणित डेटा*`
      },
      citizen: {
        en: `**Guwahati Citizen Emergency Advisory (RED Alert)**

• **Threat**: Brahmaputra river flowing 0.44m above Danger Level with widespread urban flash flooding.
• **Do's**:
  - Keep 72-hour emergency go-bag (drinking water, medicines, torch, dry food, power bank).
  - Call District Disaster Management helpline **1077** or SDRF at **112** for rescue evacuation.
  - Boil all tap/well water before drinking to prevent waterborne infections.
• **Don'ts**:
  - Do NOT walk, swim, or drive through waterlogged roads (GS Road, Zoo Road, Anil Nagar).
  - Do NOT touch electric poles, transformers, or submerged wires.

*Provenance: Open-Meteo • Assam SDMA • IMD v1.2*`,
        hi: `**गुवाहाटी नागरिक आपातकालीन परामर्श (रेड अलर्ट)**

• **खतरा**: ब्रह्मपुत्र नदी खतरे के निशान से 0.44 मीटर ऊपर बह रही है।
• **क्या करें**:
  - 72 घंटे का इमरजेंसी बैग (पीने का पानी, दवाएं, टॉर्च, पावर बैंक) तैयार रखें।
  - आपातकालीन सहायता हेतु हेल्पलाइन **1077** या **112** पर संपर्क करें।
  - पीने का पानी अच्छी तरह उबालकर पिएं।
• **क्या न करें**:
  - जलभराव वाली सड़कों और अंडरपास में वाहन न ले जाएं।
  - बिजली के खंभों या लटकते तारों के पास बिल्कुल न जाएं।

*स्रोत: Open-Meteo • असम SDMA • IMD v1.2*`
      },
      fisherman: {
        en: `**Guwahati Inland Marine Advisory (RED Alert)**

• **River Current**: Extreme turbulence (>3.8 m/s) with heavy upstream logs & sediment flow.
• **Action**: **TOTAL PROHIBITION** on boat operations, ferry services, and net casting across Brahmaputra.
• **Mooring**: Secure all country boats at least 15 meters inland above current water line.

*Provenance: Inland Waterways Authority • IMD Maritime*`,
        hi: `**गुवाहाटी नदी/मत्स्य परामर्श (रेड अलर्ट)**

• **नदी का बहाव**: अत्यधिक तीव्र (>3.8 मी/सेकंड), भंवर और तैरती लकड़ियों का भारी खतरा।
• **निर्देश**: ब्रह्मपुत्र नदी में नौकायन, नौका सेवा और मछली पकड़ने पर **पूर्ण प्रतिबंध**।
• **नाव सुरक्षा**: सभी नावों को वर्तमान जलस्तर से कम से कम 15 मीटर ऊपर किनारे पर मजबूती से बांधें।

*स्रोत: अंतर्देशीय जलमार्ग प्राधिकरण • IMD*`
      },
      aviation: {
        en: `**Guwahati LGBI Airport (VEGT) Operational Advisory**

• **Current Conditions**: Heavy Rain (+RA), VIS 800m, Wind 210/20G32KT, OVC 400ft.
• **Runway Status**: Runway 20 surface wet/standing water. Low-Level Wind Shear advisory active.
• **Flight Operations**: Significant holding delays and possible diversions to CCU/Kolkata.

*Provenance: AAI METAR/TAF • IMD Aviation Cell*`,
        hi: `**गुवाहाटी हवाई अड्डा (VEGT) विमानन परामर्श**

• **स्थिति**: भारी बारिश, दृश्यता 800m, तेज हवाएं 32kt, घने बादल 400ft।
• **उड़ान संचालन**: कई उड़ानों में देरी और कोलकाता डायवर्जन की संभावना। रनवे पर जलभराव अलर्ट।

*स्रोत: AAI METAR/TAF • IMD Aviation*`
      }
    },

    mumbai: {
      farmer: {
        en: `**Mumbai / Konkan Agri Advisory (Orange Alert)**

• **Metrics**: Rain 58mm | Wind 52km/h | High Tide 4.48m
• **Fields**: Clear coastal creek drainage gates to avoid salt-water backup during 13:15 high tide.
• **Spraying**: Postpone all foliar sprays until wind speed drops below 25km/h.

*Provenance: Open-Meteo • Agrimet IMD*`,
        hi: `**मुंबई / कोंकण कृषि परामर्श (ऑरेंज अलर्ट)**

• **आंकड़े**: बारिश 58mm | हवा 52km/h | हाई टाइड 4.48m
• **खेत**: 13:15 बजे की हाई टाइड के दौरान खारे पानी के प्रवेश को रोकने हेतु स्लुइस गेट बंद रखें।
• **छिड़काव**: तेज हवाओं के चलते कीटनाशक छिड़काव 48 घंटे टालें।

*स्रोत: Open-Meteo • Agrimet IMD*`
      },
      citizen: {
        en: `**Mumbai Citizen Safety Advisory (High Tide + Orange Alert)**

• **Tidal Alert**: High Tide of **4.48 meters** at 13:15 IST coinciding with heavy cloudburst spell.
• **Travel Advice**: Avoid coastal promenades (Marine Drive, Worli Sea Face, Bandstand). Expect local train speed restrictions on Harbour line.
• **Helpline**: BMC Disaster Management: **1916**.

*Provenance: BMC Disaster Control • IMD Mumbai*`,
        hi: `**मुंबई नागरिक सुरक्षा परामर्श (हाई टाइड + ऑरेंज अलर्ट)**

• **हाई टाइड अलर्ट**: दोपहर **13:15 IST पर 4.48 मीटर** ऊंची समुद्री लहरें और भारी बारिश।
• **यात्रा सलाह**: मरीन ड्राइव, वर्ली सी फेस और समुद्र तटों से दूर रहें। हार्बर लाइन पर देरी संभव।
• **हेल्पलाइन**: बीएमसी आपदा प्रबंधन: **1916**।

*स्रोत: BMC डिजास्टर कंट्रोल • IMD मुंबई*`
      },
      fisherman: {
        en: `**Maharashtra Coast Fishermen Warning (Orange Alert)**

• **Sea Conditions**: Very rough with wave heights 3.5m - 4.2m. Squally winds reaching 55 km/h.
• **Advisory**: Fishermen are strictly advised **NOT** to venture into the Arabian Sea along and off Maharashtra coast.

*Provenance: INCOIS • IMD Marine Bulletin*`,
        hi: `**महाराष्ट्र तटीय मछुआरा चेतावनी (ऑरेंज अलर्ट)**

• **समुद्र की स्थिति**: 3.5 से 4.2 मीटर ऊंची खतरनाक लहरें। 55 km/h तक तेज हवाएं।
• **सलाह**: मछुआरों को सलाह दी जाती है कि वे अरब सागर में न जाएं।

*स्रोत: INCOIS • IMD समुद्री बुलेटिन*`
      },
      aviation: {
        en: `**CSMIA Mumbai (VABB) Aviation Advisory**

• **Conditions**: Rain showers, VIS 2500m, Gusting crosswinds 28kt on RWY 27.
• **Operations**: Spaced departures in effect. Average turnaround delay: 20-30 mins.

*Provenance: AAI Mumbai METAR*`,
        hi: `**मुंबई छत्रपति शिवाजी हवाई अड्डा (VABB) विमानन परामर्श**

• **स्थिति**: बारिश की बौछारें, दृश्यता 2500m, रनवे 27 पर तेज हवा के झोंके। उड़ानों में 20-30 मिनट की देरी।

*स्रोत: AAI मुंबई METAR*`
      }
    },

    chennai: {
      farmer: {
        en: `**Chennai / Kanchipuram Agro Advisory (Yellow Watch)**

• **Conditions**: Rain 28mm | Wind 34 km/h | Chembarambakkam Stable (45%)
• **Action**: Safe for soil preparation and scheduled micro-irrigation before 14:00 convective showers.

*Provenance: Open-Meteo • TNAU Agrimet*`,
        hi: `**चेन्नई / कांचीपुरम कृषि परामर्श (येलो वॉच)**

• **स्थिति**: वर्षा 28mm | हवा 34 km/h | सामान्य जलस्तर
• **सलाह**: दोपहर 2 बजे से पहले जुताई और सिंचाई कार्य सुरक्षित रूप से पूरे करें।

*स्रोत: Open-Meteo • TNAU Agrimet*`
      },
      citizen: {
        en: `**Chennai City Weather Advisory (Yellow Watch)**

• **Forecast**: Intermittent thunder showers in afternoon/evening hours.
• **Do's**: Keep raincoat handy; slight traffic buildup expected on GST road & OMR during evening peak.

*Provenance: IMD Regional Centre Chennai*`,
        hi: `**चेन्नई शहर मौसम परामर्श (येलो वॉच)**

• **पूर्वानुमान**: दोपहर और शाम के समय गरज के साथ हल्की से मध्यम बारिश।
• **सलाह**: शाम को ओएमआर और जीएसटी रोड पर हल्की देरी संभव, छाता साथ रखें।

*स्रोत: IMD चेन्नई*`
      },
      fisherman: {
        en: `**Tamil Nadu Coast Fishermen Advisory**

• **Conditions**: Moderate sea state, wind 35-40 km/h in Bay of Bengal trough. Small craft caution beyond 15 nautical miles.

*Provenance: INCOIS Chennai*`,
        hi: `**तमिलनाडु तटीय मछुआरा परामर्श**

• **स्थिति**: सामान्य से मध्यम लहरें। 15 नॉटिकल मील से दूर जाने पर सावधानी बरतें।

*स्रोत: INCOIS चेन्नई*`
      },
      aviation: {
        en: `**Chennai Airport (VOMM) Operational Status**

• **Conditions**: VIS 5000m, Cloud FEW 2500ft, Flight operations normal.

*Provenance: AAI Chennai METAR*`,
        hi: `**चेन्नई एयरपोर्ट (VOMM) परिचालन स्थिति**

• **स्थिति**: दृश्यता 5000m, उड़ानें निर्धारित समय पर संचालित।

*स्रोत: AAI चेन्नई METAR*`
      }
    },

    delhi: {
      farmer: {
        en: `**Delhi NCR Agromet Advisory (Yellow AQI Watch)**

• **Conditions**: Temp 34.6°C | Rain 6.2mm | Stagnant Air AQI 242
• **Action**: Favorable window for vegetable picking and polyhouse ventilation. Apply light irrigation to prevent root heat stress.

*Provenance: IARI Pusa • IMD Agrimet*`,
        hi: `**दिल्ली एनसीआर कृषि परामर्श (येलो AQI वॉच)**

• **स्थिति**: तापमान 34.6°C | बारिश 6.2mm | AQI 242
• **सलाह**: सब्जियों की तुड़ाई और पॉलीहाउस प्रबंधन के लिए अनुकूल। हल्की सिंचाई करें।

*स्रोत: IARI पूसा • IMD Agrimet*`
      },
      citizen: {
        en: `**Delhi NCR Air Quality & Weather Advisory**

• **AQI Alert**: Air Quality Index at **242 (Poor)** with light humidity and dust haze.
• **Health Precautions**: Asthmatics, elderly and young children should minimize prolonged outdoor morning cardio. Use N95 masks in high traffic zones.

*Provenance: CPCB • SAFAR India • IMD Delhi*`,
        hi: `**दिल्ली एनसीआर वायु गुणवत्ता व मौसम परामर्श**

• **AQI अलर्ट**: वायु गुणवत्ता सूचकांक **242 (खराब श्रेणी)** पर है।
• **स्वास्थ्य सावधानियां**: बुजुर्ग व सांस के मरीज सुबह आउटडोर व्यायाम से बचें। जरूरत पड़ने पर N95 मास्क पहनें।

*स्रोत: CPCB • सफर इंडिया • IMD दिल्ली*`
      },
      fisherman: {
        en: `**Delhi Yamuna Floodplain Advisory**

• **Water Level**: 203.80m (Warning mark: 204.50m, Danger mark: 205.33m). Flow is completely normal and regulated.

*Provenance: Delhi Irrigation & Flood Control Dept*`,
        hi: `**दिल्ली यमुना खादर परामर्श**

• **जलस्तर**: 203.80 मीटर (खतरे का निशान: 205.33 मीटर)। यमुना में प्रवाह पूरी तरह सुरक्षित और सामान्य है।

*स्रोत: दिल्ली सिंचाई व बाढ़ नियंत्रण विभाग*`
      },
      aviation: {
        en: `**Delhi IGI Airport (VIDP) Flight Status**

• **Conditions**: VIS 3500m in haze, Temp 34.6°C. Normal scheduled departures and arrivals on all 4 runways.

*Provenance: AAI Delhi METAR*`,
        hi: `**दिल्ली आईजीआई हवाई अड्डा (VIDP) उड़ान स्थिति**

• **स्थिति**: धुंध के साथ दृश्यता 3500m, तापमान 34.6°C। सभी रनवे पर उड़ानें सामान्य रूप से जारी।

*स्रोत: AAI दिल्ली METAR*`
      }
    }
  },

  // Demo emergency POIs (used when no Foursquare key; coords near city centers)
  demoShelters: {
    guwahati: [
      { name: "GMCH Emergency Hospital", kind: "hospital", lat: 26.1428, lon: 91.7702, addr: "Bhangagarh, Guwahati", phone: "0361-2134316" },
      { name: "Dispur Flood Relief Shelter", kind: "shelter", lat: 26.1438, lon: 91.7890, addr: "Dispur G.P. Hall", phone: "1077 (SDMA)" },
      { name: "Maligaon Railway Hospital Pharmacy", kind: "pharmacy", lat: 26.1610, lon: 91.6960, addr: "Maligaon Chariali", phone: "—" }
    ],
    mumbai: [
      { name: "KEM Hospital Emergency", kind: "hospital", lat: 19.0120, lon: 72.8410, addr: "Parel, Mumbai", phone: "022-24136051" },
      { name: "Kurla BMC Relief Shelter", kind: "shelter", lat: 19.0720, lon: 72.8840, addr: "Kurla West Municipal School", phone: "1916 (BMC)" },
      { name: "Bandra Bhabha Hospital", kind: "hospital", lat: 19.0600, lon: 72.8250, addr: "Bandra West", phone: "022-26422775" }
    ],
    chennai: [
      { name: "Rajiv Gandhi Govt Hospital", kind: "hospital", lat: 13.0870, lon: 80.2780, addr: "Park Town, Chennai", phone: "044-25305000" },
      { name: "Velachery Relief Centre", kind: "shelter", lat: 12.9750, lon: 80.2210, addr: "Velachery Community Hall", phone: "044-25619206" },
      { name: "Adyar Apollo Pharmacy 24x7", kind: "pharmacy", lat: 13.0060, lon: 80.2570, addr: "LB Road, Adyar", phone: "—" }
    ],
    delhi: [
      { name: "AIIMS Emergency", kind: "hospital", lat: 28.5672, lon: 77.2100, addr: "Ansari Nagar, Delhi", phone: "011-26588500" },
      { name: "ITO Yamuna Relief Shelter", kind: "shelter", lat: 28.6315, lon: 77.2500, addr: "ITO Floodplain Camp", phone: "1077 (DDMA)" },
      { name: "Safdarjung Hospital", kind: "hospital", lat: 28.5670, lon: 77.2050, addr: "Safdarjung Enclave", phone: "011-26165060" }
    ]
  },

  // Hindi voice sample query suggestions
  voiceSuggestions: [
    { text: "कल खेती करू?", textHi: "कल खेती करू?", role: "farmer", city: "guwahati" },
    { text: "Guwahati flood risk today", textHi: "गुवाहाटी में बाढ़ का क्या खतरा है?", role: "citizen", city: "guwahati" },
    { text: "Mumbai high tide timings", textHi: "मुंबई में हाई टाइड का समय क्या है?", role: "citizen", city: "mumbai" },
    { text: "Chennai sea weather for fishing", textHi: "चेन्नई में मछली पकड़ने के लिए समुद्र कैसा है?", role: "fisherman", city: "chennai" },
    { text: "Delhi flight delays and visibility", textHi: "दिल्ली में दृश्यता और उड़ानों की स्थिति क्या है?", role: "aviation", city: "delhi" }
  ]
};
