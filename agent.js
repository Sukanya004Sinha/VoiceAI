const { retrieve } = require("./rag.js");

const toolDefinitions = [
  { name: "find_doctors", description: "List available healthcare providers." },
  { name: "get_slots", description: "Get available appointment slots for a chosen provider." },
  { name: "create_booking", description: "Create an appointment using provider, slot, and patient name." },
  { name: "schedule_follow_up", description: "Record a follow-up for a confirmed appointment." }
];

function detectIntent(message) {
  const text = String(message || "").toLowerCase();
  const doctorRequest = /(doctor|appointment|book|physician|clinic|डॉक्टर|डाक्टर|अपॉइंटमेंट|नियुक्ति|चिकित्सक|बुक|மருத்துவர்|டாக்டர்|நேரம் பதிவு|சந்திப்பு|மருத்துவமனை)/i.test(text);
  const followUp = /(follow.?up|फॉलो.?अप|बाद में|தொடர்ச்சியான சந்திப்பு|தொடர் சந்திப்பு|தொடர் சிகிச்சை)/i.test(text);
  const symptom = /(fever|pain|cough|sick|headache|symptom|bukh|बुखार|दर्द|खांसी|तबीयत|बीमार|காய்ச்சல்|வலி|இருமல்|உடம்பு சரி இல்ல|சுகமில்லை)/i.test(text);
  const emergency = /(emergency|breathing|chest pain|आपातकाल|साँस|सीने में दर्द|அவசர|மூச்சு|நெஞ்சுவலி)/i.test(text);

  if (emergency) return "emergency_guidance";
  if (followUp) return "schedule_follow_up";
  if (doctorRequest) return "find_doctors";
  if (symptom) return "symptom_guidance";
  return "general_guidance";
}

function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseAppointmentRequest(message, now = new Date()) {
  const text = String(message || "").toLowerCase();
  const bookingIntent = /(book|schedule|make|set up|appointment|अपॉइंटमेंट|बुक|नियुक्ति|சந்திப்பு|பதிவு)/i.test(text);
  if (!bookingIntent) return null;

  let date = null;
  if (/\btoday\b/i.test(text) || text.includes("आज") || text.includes("இன்று")) {
    date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (/\btomorrow\b/i.test(text) || text.includes("कल") || text.includes("நாளை")) {
    date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else {
    const weekdayNames = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
    };
    const weekdayMatch = text.match(/\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
    if (weekdayMatch) {
      const targetDay = weekdayNames[weekdayMatch[1].toLowerCase()];
      const daysAhead = (targetDay - now.getDay() + 7) % 7 || 7;
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead);
    } else {
      const isoDate = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
      if (isoDate) {
        const parsed = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
        if (dateToIso(parsed) === `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`) date = parsed;
      }
    }
  }

  let requestedTime = null;
  let needsTimeClarification = false;
  if (/\bmidnight\b/.test(text)) {
    requestedTime = "00:00";
  } else if (/\bnoon\b/.test(text)) {
    requestedTime = "12:00";
  } else {
    const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/i);
    if (timeMatch) {
      let hour = Number(timeMatch[1]);
      const minute = Number(timeMatch[2] || 0);
      const meridiem = timeMatch[3].replace(/\./g, "").toLowerCase();
      if (hour >= 1 && hour <= 12 && minute < 60) {
        if (meridiem === "am" && hour === 12) hour = 0;
        if (meridiem === "pm" && hour !== 12) hour += 12;
        requestedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      }
    } else {
      const bareTime = text.match(/\b(?:at|around|by)\s+(\d{1,2})(?::(\d{2}))?\b/i);
      if (bareTime) {
        const hour = Number(bareTime[1]);
        const minute = Number(bareTime[2] || 0);
        if (hour <= 12 && minute < 60) needsTimeClarification = true;
      }
    }
  }

  if (!date && requestedTime) {
    date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  }
  if (!date && !requestedTime && !needsTimeClarification) return null;
  return {
    date: date ? dateToIso(date) : null,
    requestedTime,
    needsTimeClarification
  };
}

function fallbackReply(intent, language, ragHits) {
  const ragText = ragHits.map((hit) => hit.text).join(" ");
  if (intent === "find_doctors") {
    return language === "hi-IN" ? "बिल्कुल। मैं आपके लिए उपलब्ध डॉक्टर ढूँढ़ सकती हूँ।" : language === "ta-IN" ? "நிச்சயமாக. உங்களுக்கான கிடைக்கும் மருத்துவரைத் தேடுகிறேன்." : "Of course. I can find an available doctor for you.";
  }
  if (intent === "schedule_follow_up") {
    return language === "hi-IN" ? "मैं पुष्टि किए गए अपॉइंटमेंट के लिए फॉलो-अप दर्ज करने में मदद कर सकती हूँ." : language === "ta-IN" ? "உறுதிப்படுத்தப்பட்ட சந்திப்புக்கு தொடர்ச்சியான சந்திப்பைப் பதிவு செய்ய முடியும்." : "I can record a follow-up for your confirmed appointment.";
  }
  if (intent === "emergency_guidance") {
    return language === "hi-IN" ? "यह गंभीर हो सकता है। तुरंत नज़दीकी आपातकालीन सेवा लें और किसी विश्वसनीय व्यक्ति को सूचित करें।" : language === "ta-IN" ? "இதற்கு உடனடி அவசர உதவி தேவைப்படலாம். உடனே அருகிலுள்ள அவசர சேவையைத் தொடர்புகொள்ளுங்கள்." : "This may require urgent care. Please contact local emergency services immediately.";
  }
  if (intent === "symptom_guidance") {
    return ragText || (language === "hi-IN" ? "मुझे अफ़सोस है कि आप अस्वस्थ महसूस कर रहे हैं। डॉक्टर ढूँढने में मैं आपकी मदद कर सकती हूँ।" : language === "ta-IN" ? "உடல்நிலை சரியில்லாதது வருத்தமாக இருக்கிறது. மருத்துவரைக் கண்டுபிடிக்க உதவுகிறேன்." : "I'm sorry you're not feeling well. I can help you find a doctor.");
  }
  return ragText || (language === "hi-IN" ? "मैं आपकी मदद के लिए यहाँ हूँ। अपनी परेशानी बताएं या किसी डॉक्टर को ढूँढ़ें." : language === "ta-IN" ? "உங்களுக்கு உதவ நான் இருக்கிறேன். உங்கள் கவலையைச் சொல்லுங்கள் அல்லது மருத்துவரைக் கண்டறியுங்கள்." : "I'm here to help. Tell me what you need or ask me to find a doctor.");
}

async function callConfiguredLlm(message, language, ragHits, conversation = []) {
  const configuredUrl = process.env.LLM_API_URL;
  const apiKey = process.env.LLM_API_KEY;
  const ollamaUrl = configuredUrl || "http://127.0.0.1:11434/api/chat";
  const ollamaMode = !configuredUrl;

  const ragContext = ragHits.map((hit) => `${hit.title}: ${hit.text}`).join("\n");
  const systemPrompt = `You are Suno, a careful multilingual healthcare navigation assistant.
Reply in ${language}. Use only the supplied RAG context and say this is not a diagnosis.
Return JSON only: {"intent":"...","reply":"...","toolCall":{"name":"...","arguments":{}}|null}
Valid intents: find_doctors, symptom_guidance, emergency_guidance, schedule_follow_up, general_guidance.
Available tools: ${toolDefinitions.map((tool) => tool.name).join(", ")}.
RAG context:\n${ragContext || "No relevant context."}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    let body;
    if (ollamaMode) {
      body = {
        model: process.env.LLM_MODEL || "qwen3:4b",
        format: "json",
        stream: false,
        options: { temperature: 0.2 },
        messages: [{ role: "system", content: systemPrompt }, ...conversation.slice(-8), { role: "user", content: message }]
      };
    } else {
      body = {
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "system", content: systemPrompt }, ...conversation.slice(-8), { role: "user", content: message }],
        response_format: { type: "json_object" }
      };
    }

    const response = await fetch(ollamaUrl, { method: "POST", headers, body: JSON.stringify(body), signal: controller.signal });
    if (!response.ok) return null;
    const result = await response.json();
    const content = ollamaMode ? result.message?.content : result.choices?.[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function processMessage({ message, language = "en-IN", conversation = [], tools = {} }) {
  const ragHits = retrieve(message, language);
  const appointmentRequest = parseAppointmentRequest(message);
  const detectedIntent = detectIntent(message);
  const llmResult = appointmentRequest || detectedIntent === "find_doctors"
    ? null
    : await callConfiguredLlm(message, language, ragHits, conversation);
  const intent = appointmentRequest ? "find_doctors" : llmResult?.intent || detectedIntent;
  const reply = llmResult?.reply || fallbackReply(intent, language, ragHits);
  const toolCalls = [];
  let action = null;

  if (intent === "find_doctors" || llmResult?.toolCall?.name === "find_doctors") {
    action = "find_doctors";
    if (tools.findDoctors) {
      toolCalls.push({ name: "find_doctors", result: "requested" });
      tools.findDoctors();
    }
  }
  if (intent === "schedule_follow_up") {
    if (tools.scheduleFollowUp) {
      const result = await tools.scheduleFollowUp();
      toolCalls.push({ name: "schedule_follow_up", result: result.ok ? "recorded" : "not_available" });
    }
  }

  return {
    intent,
    reply,
    action,
    appointmentRequest,
    ragSources: ragHits.map((hit) => hit.id),
    toolCalls,
    llmUsed: Boolean(llmResult),
    toolDefinitions
  };
}

module.exports = { processMessage, toolDefinitions, parseAppointmentRequest };
