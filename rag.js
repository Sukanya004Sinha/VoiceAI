const documents = [
  {
    id: "fever-guidance",
    title: "Fever guidance",
    titleHi: "बुखार की जानकारी",
    titleTa: "காய்ச்சல் வழிகாட்டுதல்",
    keywords: ["fever", "temperature", "bukh", "बुखार", "காய்ச்சல்"],
    text: "For fever, rest and fluids may help. Seek urgent care for severe symptoms, difficulty breathing, confusion, severe dehydration, or fever that worsens quickly. This is general information, not a diagnosis.",
    textHi: "बुखार में आराम और पर्याप्त तरल पदार्थ मददगार हो सकते हैं। सांस लेने में दिक्कत, भ्रम, तेज़ कमजोरी या लक्षण तेजी से बिगड़ें तो तुरंत आपातकालीन सेवा लें। यह सामान्य जानकारी है, निदान नहीं।",
    textTa: "காய்ச்சலில் ஓய்வு மற்றும் போதுமான நீர் உதவும். மூச்சுவிட சிரமம், மயக்கம், கடும் நீரிழப்பு அல்லது அறிகுறிகள் வேகமாக மோசமடைந்தால் உடனே அவசர சிகிச்சையை நாடுங்கள். இது பொதுவான தகவல், நோயறிதல் அல்ல."
  },
  {
    id: "appointment-workflow",
    title: "Appointment booking",
    titleHi: "अपॉइंटमेंट बुकिंग",
    titleTa: "சந்திப்பு பதிவு",
    keywords: ["doctor", "appointment", "booking", "book", "डॉक्टर", "अपॉइंटमेंट", "மருத்துவர்", "சந்திப்பு", "நேரம்"],
    text: "The user can choose a doctor, choose an available time, provide a name, and confirm a demo appointment. A follow-up can then be recorded for the appointment.",
    textHi: "उपयोगकर्ता डॉक्टर चुन सकता है, उपलब्ध समय चुन सकता है और नाम देकर डेमो अपॉइंटमेंट की पुष्टि कर सकता है। बाद में फॉलो-अप दर्ज किया जा सकता है।",
    textTa: "பயனர் மருத்துவரைத் தேர்ந்தெடுத்து, கிடைக்கும் நேரத்தை எடுத்து, பெயர் கொடுத்து சந்திப்பை உறுதி செய்யலாம். பின்னர் தொடர்ச்சியான சந்திப்பை பதிவு செய்யலாம்."
  },
  {
    id: "emergency-guidance",
    title: "Emergency guidance",
    titleHi: "आपातकालीन मार्गदर्शन",
    titleTa: "அவசர வழிகாட்டுதல்",
    keywords: ["emergency", "breathing", "chest pain", "आपातकाल", "साँस", "सीने में दर्द", "மூச்சு", "நெஞ்சுவலி", "அவசர"],
    text: "For trouble breathing, chest pain, collapse, severe bleeding, confusion, or a rapidly worsening condition, seek local emergency care immediately.",
    textHi: "सांस लेने में दिक्कत, सीने में दर्द, बेहोशी, गंभीर रक्तस्राव या तेज़ी से बिगड़ती हालत में तुरंत स्थानीय आपातकालीन सेवा लें।",
    textTa: "மூச்சுவிட சிரமம், நெஞ்சுவலி, மயக்கம், கடும் இரத்தப்போக்கு அல்லது நிலை வேகமாக மோசமடைந்தால் உடனே உள்ளூர் அவசர சேவையை நாடுங்கள்."
  }
];

function normalize(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097f\u0b80-\u0bff ]+/g, " ").replace(/\s+/g, " ").trim();
}

function retrieve(query, language = "en-IN", limit = 2) {
  const normalized = normalize(query);
  const scores = documents.map((document) => {
    let score = 0;
    for (const keyword of document.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (normalized.includes(normalizedKeyword)) score += 3;
      const terms = normalizedKeyword.split(" ").filter(Boolean);
      for (const term of terms) {
        if (term.length > 2 && normalized.includes(term)) score += 1;
      }
    }
    return { document, score };
  });

  return scores
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document }) => ({
      id: document.id,
      title: language === "hi-IN" ? document.titleHi : language === "ta-IN" ? document.titleTa : document.title,
      text: language === "hi-IN" ? document.textHi : language === "ta-IN" ? document.textTa : document.text
    }));
}

module.exports = { documents, retrieve };
