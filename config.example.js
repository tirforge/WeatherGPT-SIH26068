// WeatherGPT configuration TEMPLATE - copy to config.js and fill your keys.
// config.js is gitignored and never committed. This example file is safe to share.
window.WG_CONFIG = {
  // Groq chatbot (https://console.groq.com) - free tier
  groqApiKey: "", // e.g. "gsk_..."
  groqModel: "openai/gpt-oss-20b",
  groqEndpoint: "https://api.groq.com/openai/v1/chat/completions",

  // Map style - 100% FREE, no keys: "osm" | "esri-sat"
  mapStyle: "osm",

  // Telegram alerts (optional) - bot token from @BotFather + your chat ID
  telegramBotToken: "",
  telegramChatId: ""
};
