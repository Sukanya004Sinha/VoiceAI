const translations = {
  "hi-IN": {
    input: "यहाँ लिखें या बोलें...",
    greeting: "नमस्ते! मैं सुनो हूँ, आपकी स्वास्थ्य साथी। आपको मैं किस नाम से बुलाऊँ?",
    welcome: (name) => `आपसे मिलकर खुशी हुई, ${name}! सुनो में आपका स्वागत है। 🌿\n\nआप अपनी परेशानी बता सकते हैं, डॉक्टर ढूँढ सकते हैं या अपॉइंटमेंट बुक कर सकते हैं।`,
    suggestions: ["मुझे डॉक्टर चाहिए", "मुझे बुखार है", "अपॉइंटमेंट बुक करें"],
    findDoctor: "बिल्कुल, मैं आपके लिए डॉक्टर ढूँढती हूँ। अभी बेंगलुरु में उपलब्ध जनरल फिज़िशियन देख रही हूँ।",
    findingFor: (date, time) => `${date} को ${time} का समय माँगा है। मैं उपलब्ध डॉक्टर और समय देखती हूँ।`,
    unavailableTime: (time) => `${time} उपलब्ध नहीं है। क्लिनिक में अपॉइंटमेंट सुबह 9 बजे से शाम 4 बजे तक हर घंटे मिलते हैं। 12 AM आधी रात होती है, दोपहर नहीं। नीचे दूसरा समय चुनें:`,
    providers: "ये डॉक्टर उपलब्ध हैं। किसी एक को चुनें और मैं समय देखती हूँ:",
    slots: (name) => `${name} के लिए ये समय उपलब्ध हैं। कौन-सा समय चुनना चाहेंगे?`,
    confirmBooking: (name, doctor, time) => `${name} जी, ${doctor} के साथ ${time} का अपॉइंटमेंट बुक करूँ?`,
    confirmBookingAction: "हाँ, अपॉइंटमेंट बुक करें",
    chooseAnotherTime: "दूसरा समय चुनें",
    bookingCancelled: "ठीक है, अपॉइंटमेंट बुक नहीं किया गया। आप दूसरा समय चुन सकते हैं।",
    askName: (time) => `${time} के लिए ठीक है! अपॉइंटमेंट बुक करने के लिए आपका नाम क्या लिखूँ?`,
    booked: (name, doctor, time) => `आपका अपॉइंटमेंट बुक हो गया, ${name} जी! 🌿\n\n${doctor} · ${time}\n\n24 घंटे पहले का रिमाइंडर इस डेमो में दर्ज है (सूचना नहीं भेजी जाएगी)। क्या मैं 7 दिन बाद के लिए फॉलो-अप भी दर्ज करूँ?`,
    prescriptionTitle: "डॉक्टर की पर्ची",
    noPrescription: "इस डेमो अपॉइंटमेंट के लिए अभी कोई पर्ची जारी नहीं हुई है। डॉक्टर की पर्ची जारी होने पर यहाँ दिखेगी। सुनो दवा या पर्ची नहीं देता।",
    prescriptionIssuedBy: (name, date) => `${name} द्वारा जारी · ${date}`,
    prescriptionRefresh: "पर्ची फिर से देखें",
    prescriptionRefreshError: "पर्ची लोड नहीं हो सकी। फिर कोशिश करें।",
    symptoms: "यह सुनकर दुख हुआ। मैं डॉक्टर नहीं हूँ, लेकिन आपकी परेशानी समझने में मदद कर सकती हूँ। अगर लक्षण गंभीर हों, तेज़ी से बिगड़ रहे हों या साँस लेने में दिक्कत हो, तो तुरंत नज़दीकी आपातकालीन सेवा लें। क्या मैं आपके लिए डॉक्टर ढूँढूँ?",
    fallback: "मैं आपकी मदद के लिए यहाँ हूँ। आप अपनी परेशानी बता सकते हैं या डॉक्टर ढूँढने के लिए नीचे का बटन दबा सकते हैं।",
    error: "अभी सेवा से जुड़ने में दिक्कत हो रही है। कृपया थोड़ी देर में फिर कोशिश करें।",
    emptySlots: "इस डॉक्टर के सभी समय बुक हो गए हैं। कृपया दूसरा डॉक्टर चुनें।",
    bookedAction: "आपका अपॉइंटमेंट पहले से बुक है। कोई और मदद चाहिए?",
    followUpAction: "हाँ, फॉलो-अप दर्ज करें",
    followUpSuccess: "फॉलो-अप 7 दिन बाद के लिए इस डेमो में दर्ज कर दिया है। कोई सूचना नहीं भेजी जाएगी। अपना अनुभव साझा करने के लिए हम उस समय आपसे संपर्क नहीं कर पाएँगे, लेकिन आपकी प्रतिक्रिया यहाँ दर्ज की जा सकती है।",
    followUpError: "फॉलो-अप दर्ज नहीं हो पाया। कृपया फिर कोशिश करें।",
    inputName: "नाम लिखें या बोलें...",
    inputWelcomeName: "अपना नाम बताइए...",
    voiceUnavailable: "इस डिवाइस पर हिंदी आवाज़ उपलब्ध नहीं है। सही उच्चारण के लिए हिंदी speech voice इंस्टॉल करें या English चुनें।",
    voiceReady: "हिंदी आवाज़ उपलब्ध है",
    confirm: "Appointment confirmed"
  },
  "ta-IN": {
    input: "இங்கே தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    greeting: "வணக்கம்! நான் சுனோ, உங்கள் சுகாதாரத் துணை. உங்களை எந்தப் பெயரில் அழைக்கலாம்?",
    welcome: (name) => `உங்களைச் சந்தித்ததில் மகிழ்ச்சி, ${name}! சுனோவிற்கு வரவேற்கிறோம். 🌿\n\nஉங்கள் கவலையைச் சொல்லலாம், மருத்துவரைத் தேடலாம் அல்லது சந்திப்பைப் பதிவு செய்யலாம்.`,
    suggestions: ["எனக்கு மருத்துவர் வேண்டும்", "எனக்கு காய்ச்சல்", "நேரம் பதிவு செய்யுங்கள்"],
    findDoctor: "நிச்சயமாக, உங்களுக்காக மருத்துவரைத் தேடுகிறேன். பெங்களூரில் கிடைக்கும் பொது மருத்துவர்களைப் பார்க்கிறேன்.",
    findingFor: (date, time) => `${date} அன்று ${time} நேரம் கேட்டுள்ளீர்கள். கிடைக்கும் மருத்துவர் மற்றும் நேரத்தைப் பார்க்கிறேன்.`,
    unavailableTime: (time) => `${time} கிடைக்கவில்லை. மருத்துவமனை நேரம் காலை 9 மணி முதல் மாலை 4 மணி வரை, ஒவ்வொரு மணி நேரத்திலும். 12 AM என்பது நள்ளிரவு; மதியம் அல்ல. வேறு நேரத்தைத் தேர்வுசெய்யுங்கள்:`,
    providers: "கிடைக்கும் மருத்துவர்கள் இங்கே. ஒருவரைத் தேர்ந்தெடுங்கள்; நேரங்களைப் பார்க்கிறேன்:",
    slots: (name) => `${name} அவர்களுக்கு கிடைக்கும் நேரங்கள் இவை. எந்த நேரத்தைத் தேர்வு செய்கிறீர்கள்?`,
    confirmBooking: (name, doctor, time) => `${name}, ${doctor} அவர்களுடன் ${time} சந்திப்பைப் பதிவு செய்யலாமா?`,
    confirmBookingAction: "ஆம், சந்திப்பைப் பதிவு செய்யுங்கள்",
    chooseAnotherTime: "வேறு நேரத்தைத் தேர்வுசெய்யுங்கள்",
    bookingCancelled: "சரி, சந்திப்பு பதிவு செய்யப்படவில்லை. வேறு நேரத்தைத் தேர்வுசெய்யலாம்.",
    askName: (time) => `${time} சரி! நேரத்தைப் பதிவு செய்ய உங்கள் பெயர் என்ன?`,
    booked: (name, doctor, time) => `உங்கள் சந்திப்பு பதிவு செய்யப்பட்டது, ${name}! 🌿\n\n${doctor} · ${time}\n\n24 மணி நேரத்திற்கு முந்தைய நினைவூட்டல் இந்த டெமோவில் பதிவு செய்யப்பட்டது (அறிவிப்பு அனுப்பப்படாது). 7 நாட்களுக்குப் பிறகு தொடர்ச்சியான சந்திப்பையும் பதிவு செய்யவா?`,
    prescriptionTitle: "மருத்துவர் பரிந்துரை",
    noPrescription: "இந்த டெமோ சந்திப்புக்கு இன்னும் பரிந்துரை வழங்கப்படவில்லை. மருத்துவர் வழங்கியதும் இங்கே காண்பிக்கப்படும். சுனோ மருந்து அல்லது பரிந்துரை வழங்காது.",
    prescriptionIssuedBy: (name, date) => `${name} வழங்கியது · ${date}`,
    prescriptionRefresh: "பரிந்துரையை மீண்டும் பார்க்கவும்",
    prescriptionRefreshError: "பரிந்துரையை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    symptoms: "உங்களுக்கு உடல்நிலை சரியில்லாதது வருத்தமாக இருக்கிறது. நான் மருத்துவர் அல்ல; உங்கள் கவலையைப் புரிந்துகொள்ள உதவ முடியும். அறிகுறிகள் கடுமையாகவோ மோசமடைந்தாலோ, மூச்சு விட சிரமம் இருந்தாலோ உடனே அருகிலுள்ள அவசர சிகிச்சையை அணுகவும். மருத்துவரைத் தேடவா?",
    fallback: "உதவ நான் இருக்கிறேன். உங்கள் கவலையைச் சொல்லுங்கள் அல்லது மருத்துவரைக் கண்டுபிடிக்க கீழே உள்ள பொத்தானைத் தேர்ந்தெடுங்கள்.",
    error: "சேவையைத் தொடர்புகொள்வதில் சிக்கல். சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    emptySlots: "இந்த மருத்துவருக்கு நேரங்கள் இல்லை. வேறு மருத்துவரைத் தேர்ந்தெடுக்கவும்.",
    bookedAction: "உங்கள் சந்திப்பு ஏற்கனவே பதிவு செய்யப்பட்டது. வேறு ஏதாவது உதவி வேண்டுமா?",
    followUpAction: "ஆம், தொடர்ச்சியான சந்திப்பைப் பதிவு செய்யுங்கள்",
    followUpSuccess: "7 நாட்களுக்குப் பிறகு தொடர்ச்சியான சந்திப்பு இந்த டெமோவில் பதிவு செய்யப்பட்டது. எந்த அறிவிப்பும் அனுப்பப்படாது.",
    followUpError: "தொடர்ச்சியான சந்திப்பைப் பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    inputName: "உங்கள் பெயரை எழுதவும் அல்லது சொல்லவும்...",
    inputWelcomeName: "உங்கள் பெயரைச் சொல்லுங்கள்...",
    voiceUnavailable: "இந்த சாதனத்தில் தமிழ் குரல் இல்லை. சரியான உச்சரிப்புக்கு தமிழ் speech voice-ஐ நிறுவவும் அல்லது English-ஐத் தேர்ந்தெடுக்கவும்.",
    voiceReady: "தமிழ் குரல் கிடைக்கிறது",
    confirm: "சந்திப்பு உறுதிசெய்யப்பட்டது"
  },
  "en-IN": {
    input: "Type or speak here...",
    greeting: "Hey! I’m Suno, your health companion. What should I call you?",
    welcome: (name) => `Lovely to meet you, ${name}! Welcome to Suno. 🌿\n\nTell me what's on your mind, or I can help you find a doctor and book an appointment.`,
    suggestions: ["I need a doctor", "I have a fever", "Book an appointment"],
    findDoctor: "Of course. I'm looking for available general physicians in Bengaluru for you.",
    findingFor: (date, time) => `You requested ${time} on ${date}. I’ll check which doctors and times are available.`,
    unavailableTime: (time) => `${time} isn’t available. Clinic appointments are available hourly from 9 AM to 4 PM. 12 AM means midnight, not noon. Please choose another time below:`,
    providers: "These doctors are available. Choose one and I'll find a time:",
    slots: (name) => `Here are the available times with ${name}. Which would you like?`,
    confirmBooking: (name, doctor, time) => `${name}, should I book ${time} with ${doctor}?`,
    confirmBookingAction: "Yes, book this appointment",
    chooseAnotherTime: "Choose another time",
    bookingCancelled: "Okay, I haven't booked it. You can choose another time.",
    askName: (time) => `${time} works! What name should I use for the appointment?`,
    booked: (name, doctor, time) => `Your appointment is booked, ${name}! 🌿\n\n${doctor} · ${time}\n\nA 24-hour reminder is recorded in this demo (no notification will be sent). Would you like me to record a follow-up for 7 days later too?`,
    prescriptionTitle: "Doctor's prescription",
    noPrescription: "No prescription has been issued for this demo appointment yet. A clinician-issued prescription will appear here after your consultation. Suno does not prescribe medicine.",
    prescriptionIssuedBy: (name, date) => `Issued by ${name} · ${date}`,
    prescriptionRefresh: "Refresh prescription",
    prescriptionRefreshError: "Couldn't load the prescription. Please try again.",
    symptoms: "I'm sorry you're not feeling well. I'm not a doctor, but I can help you find care. If your symptoms are severe, getting worse quickly, or you have trouble breathing, please seek emergency care now. Would you like me to find a doctor?",
    fallback: "I'm here to help. Tell me what's bothering you, or choose the button below to find a doctor.",
    error: "I'm having trouble reaching the service right now. Please try again in a moment.",
    emptySlots: "That doctor's times are fully booked. Please choose another doctor.",
    bookedAction: "Your appointment is already booked. Is there anything else I can help with?",
    followUpAction: "Yes, record a follow-up",
    followUpSuccess: "Your follow-up is recorded for 7 days after the appointment in this demo. No notification will be sent.",
    followUpError: "I couldn't record the follow-up. Please try again.",
    inputName: "Type or say your name...",
    inputWelcomeName: "What's your name?",
    voiceUnavailable: "No English voice is available in this browser. Install an English speech voice to hear replies.",
    voiceReady: "English voice ready",
    confirm: "Appointment confirmed"
  }
};

const messagesElement = document.querySelector("#chat-messages");
const suggestionRow = document.querySelector("#suggestion-row");
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const micButton = document.querySelector("#mic-button");
const toast = document.querySelector("#toast");
const voiceStatus = document.querySelector("#voice-status");
let language = "hi-IN";
let phase = "awaiting-welcome-name";
let selectedProvider = null;
let selectedSlot = null;
let patientName = "";
let booked = false;
let bookingId = null;
let followUpDone = false;
let pendingAppointmentRequest = null;
let recognition = null;
let toastTimer;

function copy() {
  return translations[language];
}

function findSpeechVoice(languageCode) {
  const voices = window.speechSynthesis?.getVoices() || [];
  const languagePrefix = languageCode.split("-")[0].toLowerCase();
  const matchingVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(`${languagePrefix}-`) || voice.lang.toLowerCase() === languagePrefix);
  if (languagePrefix === "en") {
    return matchingVoices.find((voice) => voice.lang.toLowerCase() === "en-in") || matchingVoices[0];
  }
  return matchingVoices[0];
}

function updateVoiceStatus() {
  const voice = findSpeechVoice(language);
  voiceStatus.textContent = voice ? copy().voiceReady : copy().voiceUnavailable;
  voiceStatus.classList.toggle("voice-unavailable", !voice);
}

function updateInputLanguage() {
  input.placeholder = phase === "awaiting-name"
    ? copy().inputName
    : phase === "awaiting-welcome-name" ? copy().inputWelcomeName : copy().input;
}

function addMessage(text, sender = "assistant", options = {}) {
  const row = document.createElement("div");
  row.className = `message ${sender}${options.typing ? " typing" : ""}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = sender === "assistant" ? "S" : "Y";
  avatar.setAttribute("aria-hidden", "true");
  const content = document.createElement("div");
  content.className = "message-content";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;
  content.appendChild(bubble);
  if (sender !== "typing") {
    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.textContent = sender === "assistant" ? "Suno · " + new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()) : "You";
    content.appendChild(meta);
  }
  row.append(avatar, content);
  messagesElement.appendChild(row);
  messagesElement.scrollTop = messagesElement.scrollHeight;
  return row;
}

function addSuggestions(items) {
  suggestionRow.replaceChildren();
  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "suggestion";
    button.type = "button";
    button.textContent = item;
    button.addEventListener("click", () => sendMessage(item));
    suggestionRow.appendChild(button);
  });
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const voice = findSpeechVoice(language);
  updateVoiceStatus();
  if (!voice) {
    showToast(copy().voiceUnavailable);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/🌿/g, ""));
  utterance.lang = language;
  utterance.voice = voice;
  utterance.rate = 0.94;
  window.speechSynthesis.speak(utterance);
}

function respond(text, options = {}) {
  addMessage(text);
  if (options.speak !== false) speak(text);
  if (options.suggestions) addSuggestions(options.suggestions);
  if (options.providers) addProviderCards(options.providers);
  if (options.slots) addSlotButtons(options.slots);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

async function api(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options && options.headers) }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function addProviderCards(providers) {
  const list = document.createElement("div");
  list.className = "provider-list";
  providers.forEach((provider) => {
    const card = document.createElement("div");
    card.className = "provider-card";
    const avatar = document.createElement("div");
    avatar.className = "provider-avatar";
    avatar.style.backgroundColor = provider.color;
    avatar.textContent = provider.initials;
    const info = document.createElement("div");
    info.className = "provider-info";
    const name = document.createElement("strong");
    name.textContent = provider.name;
    const details = document.createElement("span");
    const specialty = language === "ta-IN" ? provider.specialtyTa : language === "hi-IN" ? provider.specialtyHi : provider.specialty;
    details.textContent = `${specialty} · ★ ${provider.rating} · ₹${provider.fee}`;
    const location = document.createElement("span");
    location.textContent = `${provider.experience} · ${provider.location}`;
    info.append(name, details, location);
    const button = document.createElement("button");
    button.className = "provider-cta";
    button.type = "button";
    button.textContent = language === "ta-IN" ? "தேர்வு" : language === "hi-IN" ? "चुनें" : "Choose";
    button.addEventListener("click", () => chooseProvider(provider));
    card.append(avatar, info, button);
    list.appendChild(card);
  });
  messagesElement.lastElementChild.querySelector(".message-content").appendChild(list);
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

function addSlotButtons(slots) {
  const list = document.createElement("div");
  list.className = "slot-list";
  slots.forEach((slot) => {
    const button = document.createElement("button");
    button.className = "slot-button";
    button.type = "button";
    button.textContent = slot.label;
    button.addEventListener("click", () => chooseSlot(slot));
    list.appendChild(button);
  });
  messagesElement.lastElementChild.querySelector(".message-content").appendChild(list);
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

function formatRequestedTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(value);
}

function formatRequestedDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(language, {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date(year, month - 1, day));
}

async function findDoctors(appointmentRequest = null) {
  if (booked) {
    respond(copy().bookedAction, { suggestions: copy().suggestions });
    return;
  }
  pendingAppointmentRequest = appointmentRequest;
  phase = "choosing-provider";
  selectedProvider = null;
  selectedSlot = null;
  updateInputLanguage();
  try {
    const { providers } = await api("/api/providers");
    const opening = appointmentRequest?.requestedTime
      ? copy().findingFor(formatRequestedDate(appointmentRequest.date), formatRequestedTime(appointmentRequest.requestedTime))
      : copy().findDoctor;
    respond(opening);
    respond(copy().providers, { providers });
  } catch (error) {
    respond(copy().error);
    showToast(error.message);
  }
}

async function chooseProvider(provider) {
  selectedProvider = provider;
  phase = "choosing-slot";
  try {
    const query = new URLSearchParams({ providerId: provider.id });
    if (pendingAppointmentRequest?.date) query.set("date", pendingAppointmentRequest.date);
    if (pendingAppointmentRequest?.requestedTime) query.set("time", pendingAppointmentRequest.requestedTime);
    const result = await api(`/api/slots?${query}`);
    if (result.slots.length === 0) {
      phase = "conversation";
      respond(copy().emptySlots, { suggestions: copy().suggestions });
      return;
    }
    if (pendingAppointmentRequest?.requestedTime && !result.requestedTimeAvailable) {
      respond(copy().unavailableTime(formatRequestedTime(pendingAppointmentRequest.requestedTime)), { slots: result.slots });
      return;
    }
    respond(copy().slots(provider.name), { slots: result.slots });
  } catch (error) {
    phase = "conversation";
    respond(copy().error);
    showToast(error.message);
  }
}

function requestBookingConfirmation() {
  phase = "awaiting-booking-confirmation";
  updateInputLanguage();
  respond(copy().confirmBooking(patientName, selectedProvider.name, selectedSlot.label), {
    suggestions: [copy().confirmBookingAction, copy().chooseAnotherTime]
  });
}

function chooseSlot(slot) {
  selectedSlot = slot;
  updateInputLanguage();
  input.focus();
  if (!patientName) {
    phase = "awaiting-name";
    respond(copy().askName(slot.label), { suggestions: [] });
    return;
  }
  requestBookingConfirmation();
}

async function finishBooking() {
  if (!selectedProvider || !selectedSlot) {
    phase = "conversation";
    respond(copy().fallback);
    return;
  }
  if (!patientName.trim()) {
    phase = "awaiting-name";
    respond(copy().inputName);
    return;
  }
  try {
    const { booking } = await api("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        patientName,
        providerId: selectedProvider.id,
        slotId: selectedSlot.id,
        language
      })
    });
    booked = true;
    bookingId = booking.id;
    phase = "booked";
    const confirmation = copy().booked(booking.patientName, booking.providerName, booking.appointmentTime);
    respond(confirmation, { suggestions: [copy().followUpAction] });
    await loadPrescription(booking.id);
    showToast(copy().confirm);
  } catch (error) {
    phase = "conversation";
    respond(copy().error, { suggestions: copy().suggestions });
    showToast(error.message);
  }
  updateInputLanguage();
}

function addPrescriptionCard(prescription, appointmentId) {
  const card = document.createElement("section");
  card.className = "prescription-card";
  const heading = document.createElement("h3");
  heading.textContent = copy().prescriptionTitle;
  card.appendChild(heading);

  if (!prescription) {
    const empty = document.createElement("p");
    empty.textContent = copy().noPrescription;
    card.appendChild(empty);
  } else {
    const issuer = document.createElement("p");
    issuer.className = "prescription-issuer";
    issuer.textContent = copy().prescriptionIssuedBy(
      prescription.clinicianName,
      new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(new Date(prescription.issuedAt))
    );
    card.appendChild(issuer);
    if (prescription.clinicalNotes) {
      const notes = document.createElement("p");
      notes.textContent = prescription.clinicalNotes;
      card.appendChild(notes);
    }

    const list = document.createElement("ul");
    list.className = "prescription-items";
    prescription.items.forEach((item) => {
      const listItem = document.createElement("li");
      const medicine = document.createElement("strong");
      medicine.textContent = [item.medicationName, item.strength].filter(Boolean).join(" · ");
      listItem.appendChild(medicine);
      const details = [
        item.dosage,
        item.route,
        item.frequency,
        item.duration,
        item.instructions
      ].filter(Boolean);
      if (details.length) {
        const detailText = document.createElement("span");
        detailText.textContent = details.join(" · ");
        listItem.appendChild(detailText);
      }
      list.appendChild(listItem);
    });
    card.appendChild(list);
  }

  const refresh = document.createElement("button");
  refresh.className = "prescription-refresh";
  refresh.type = "button";
  refresh.textContent = copy().prescriptionRefresh;
  refresh.addEventListener("click", () => loadPrescription(appointmentId));
  card.appendChild(refresh);
  messagesElement.lastElementChild.querySelector(".message-content").appendChild(card);
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

async function loadPrescription(appointmentId) {
  try {
    const result = await api(`/api/appointments/${encodeURIComponent(appointmentId)}/prescription`);
    addPrescriptionCard(result.prescription, appointmentId);
  } catch (error) {
    showToast(copy().prescriptionRefreshError);
  }
}

async function chooseAnotherTime() {
  if (!selectedProvider) {
    phase = "conversation";
    respond(copy().fallback);
    return;
  }
  phase = "choosing-slot";
  const query = new URLSearchParams({ providerId: selectedProvider.id });
  if (pendingAppointmentRequest?.date) query.set("date", pendingAppointmentRequest.date);
  try {
    const result = await api(`/api/slots?${query}`);
    if (!result.slots.length) {
      phase = "conversation";
      respond(copy().emptySlots, { suggestions: copy().suggestions });
      return;
    }
    respond(copy().slots(selectedProvider.name), { slots: result.slots });
  } catch (error) {
    phase = "conversation";
    respond(copy().error);
    showToast(error.message);
  }
}

async function scheduleFollowUp() {
  if (!bookingId || followUpDone) {
    respond(copy().bookedAction, { suggestions: [] });
    return;
  }
  try {
    await api("/api/follow-ups", {
      method: "POST",
      body: JSON.stringify({ bookingId })
    });
    followUpDone = true;
    respond(copy().followUpSuccess);
  } catch (error) {
    respond(copy().followUpError);
    showToast(error.message);
  }
}

function isSymptomMessage(message) {
  return /fever|pain|cough|sick|headache|symptom|बुखार|दर्द|खांसी|तबीयत|बीमार|காய்ச்சல்|வலி|இருமல்|உடம்பு சரி இல்ல|சுகமில்லை/i.test(message);
}

function isDoctorRequest(message) {
  return /doctor|appointment|book|physician|clinic|find care|डॉक्टर|डाक्टर|अपॉइंटमेंट|नियुक्ति|चिकित्सक|बुक|डाक्टर|மருத்துவர்|டாக்டர்|நேரம் பதிவு|சந்திப்பு|மருத்துவமனை/i.test(message);
}

async function handleMessage(message) {
  if (phase === "awaiting-welcome-name") {
    patientName = message.trim();
    phase = "conversation";
    respond(copy().welcome(patientName), { suggestions: copy().suggestions });
    updateInputLanguage();
    return;
  }
  if (phase === "awaiting-name") {
    patientName = message.trim();
    requestBookingConfirmation();
    return;
  }
  if (phase === "awaiting-booking-confirmation") {
    const normalizedMessage = message.trim().toLowerCase();
    if (normalizedMessage === copy().confirmBookingAction.toLowerCase()
      || /^(yes|yeah|yep|confirm|book it|हाँ|हां|जी हाँ|ஆம்|ஆமாம்)$/i.test(normalizedMessage)) {
      finishBooking();
      return;
    }
    if (normalizedMessage === copy().chooseAnotherTime.toLowerCase()
      || /^(no|nope|another time|different time|नहीं|दूसरा समय|வேண்டாம்|வேறு நேரம்)$/i.test(normalizedMessage)) {
      respond(copy().bookingCancelled);
      chooseAnotherTime();
      return;
    }
    respond(copy().confirmBooking(patientName, selectedProvider.name, selectedSlot.label), {
      suggestions: [copy().confirmBookingAction, copy().chooseAnotherTime]
    });
    return;
  }
  if (booked && /follow.?up|फॉलो.?अप|बाद में|தொடர்ச்சியான சந்திப்|தொடர் சந்திப்|தொடர் சிகிச்சை/i.test(message)) {
    scheduleFollowUp();
    return;
  }
  try {
    const result = await api("/api/agent/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        language,
        pendingBookingId: bookingId,
        userName: patientName || undefined,
        conversation: [{ role: "user", content: message }]
      })
    });

    if (result.action === "find_doctors") {
      findDoctors(result.appointmentRequest);
      return;
    }

    if (result.intent === "schedule_follow_up" && result.toolCalls.some((tool) => tool.name === "schedule_follow_up" && tool.result === "recorded")) {
      followUpDone = true;
      respond(copy().followUpSuccess);
      return;
    }

    respond(result.reply, { suggestions: copy().suggestions });
  } catch (error) {
    if (isSymptomMessage(message)) {
      respond(copy().symptoms, { suggestions: copy().suggestions });
      return;
    }
    if (isDoctorRequest(message)) {
      findDoctors();
      return;
    }
    respond(copy().fallback, { suggestions: copy().suggestions });
  }
}

function sendMessage(rawMessage) {
  const message = rawMessage.trim();
  if (!message) return;
  addMessage(message, "user");
  addSuggestions([]);
  input.value = "";
  sendButton.disabled = true;
  handleMessage(message);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", () => {
  sendButton.disabled = !input.value.trim();
});

document.querySelector("#find-doctor-button").addEventListener("click", () => findDoctors());

document.querySelectorAll(".language-chip").forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.language;
    document.documentElement.lang = language.split("-")[0];
    document.querySelectorAll(".language-chip").forEach((chip) => {
      const active = chip === button;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    updateInputLanguage();
    addSuggestions(copy().suggestions);
    if (recognition) recognition.lang = language;
    updateVoiceStatus();
  });
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language;
  recognition.addEventListener("start", () => micButton.classList.add("listening"));
  recognition.addEventListener("end", () => micButton.classList.remove("listening"));
  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    sendButton.disabled = false;
    sendMessage(transcript);
  });
  recognition.addEventListener("error", (event) => {
    micButton.classList.remove("listening");
    showToast(event.error === "not-allowed" ? "Please allow microphone access to speak." : "Voice input was unavailable. You can type instead.");
  });
  micButton.addEventListener("click", () => {
    recognition.lang = language;
    recognition.start();
  });
} else {
  micButton.title = "Voice input is not supported in this browser. You can type instead.";
  micButton.addEventListener("click", () => showToast("Voice input is not supported in this browser. You can type instead."));
}

updateInputLanguage();
updateVoiceStatus();
if ("speechSynthesis" in window) {
  window.speechSynthesis.addEventListener("voiceschanged", updateVoiceStatus);
}
addMessage(copy().greeting);
addSuggestions([]);
