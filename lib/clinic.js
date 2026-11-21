const { randomUUID } = require("node:crypto");

const slots = [
  { id: "today-1030", label: "Today, 10:30 AM", day: "today", part: "morning" },
  { id: "today-1200", label: "Today, 12:00 PM", day: "today", part: "noon" },
  { id: "today-1600", label: "Today, 4:00 PM", day: "today", part: "evening" },
  { id: "tomorrow-0930", label: "Tomorrow, 9:30 AM", day: "tomorrow", part: "morning" },
  { id: "tomorrow-1800", label: "Tomorrow, 6:00 PM", day: "tomorrow", part: "evening" }
];

const providers = [
  doctor("ananya-rao", "Dr. Ananya Rao", "AR", "general", ["hi", "en", "kn"], "Bengaluru", "Indiranagar", 12, 4.9, 400, "#e5f1ea"),
  doctor("karthik-iyer", "Dr. Karthik Iyer", "KI", "general", ["ta", "en", "hi"], "Bengaluru", "Koramangala", 9, 4.8, 350, "#f6eadb"),
  doctor("meera-shah", "Dr. Meera Shah", "MS", "family", ["hi", "en", "gu"], "Bengaluru", "HSR Layout", 15, 4.9, 500, "#eee8f5"),
  doctor("farhan-qureshi", "Dr. Farhan Qureshi", "FQ", "general", ["hi", "en", "mr"], "Mumbai", "Andheri", 11, 4.7, 450, "#e7f0f4"),
  doctor("neha-kulkarni", "Dr. Neha Kulkarni", "NK", "pediatrics", ["hi", "mr", "en"], "Mumbai", "Dadar", 14, 4.9, 600, "#f8ecec"),
  doctor("priya-malhotra", "Dr. Priya Malhotra", "PM", "general", ["hi", "en", "pa"], "Delhi", "Karol Bagh", 13, 4.8, 500, "#e5f1ea"),
  doctor("arjun-singh", "Dr. Arjun Singh", "AS", "cardiology", ["hi", "en", "pa"], "Delhi", "Saket", 18, 4.9, 900, "#f6eadb"),
  doctor("lakshmi-narayanan", "Dr. Lakshmi Narayanan", "LN", "general", ["ta", "en"], "Chennai", "T. Nagar", 16, 4.8, 400, "#eee8f5"),
  doctor("suresh-babu", "Dr. Suresh Babu", "SB", "ent", ["ta", "en", "hi"], "Chennai", "Adyar", 10, 4.6, 450, "#e7f0f4"),
  doctor("fatima-sheikh", "Dr. Fatima Sheikh", "FS", "general", ["hi", "te", "en"], "Hyderabad", "Banjara Hills", 12, 4.8, 400, "#f8ecec"),
  doctor("ravi-teja", "Dr. Ravi Teja", "RT", "orthopedics", ["te", "hi", "en"], "Hyderabad", "Kukatpally", 9, 4.7, 550, "#e5f1ea"),
  doctor("aditi-joshi", "Dr. Aditi Joshi", "AJ", "general", ["mr", "hi", "en"], "Pune", "Kothrud", 8, 4.7, 350, "#f6eadb"),
  doctor("kavita-sharma", "Dr. Kavita Sharma", "KS", "general", ["hi", "en"], "Jaipur", "C-Scheme", 17, 4.8, 300, "#eee8f5"),
  doctor("imran-ali", "Dr. Imran Ali", "IA", "general", ["hi", "en"], "Lucknow", "Gomti Nagar", 11, 4.6, 300, "#e7f0f4"),
  doctor("sunita-devi", "Dr. Sunita Devi", "SD", "community", ["hi"], "Rural", "Primary health centre", 20, 4.9, 0, "#e5f1ea"),
  doctor("ramesh-yadav", "Dr. Ramesh Yadav", "RY", "general", ["hi", "en"], "Rural", "Block hospital", 14, 4.5, 100, "#f6eadb")
];

const bookings = [];
const feedback = [];

const specialties = {
  general: { en: "General physician", hi: "सामान्य चिकित्सक", hinglish: "general physician", ta: "பொது மருத்துவர்", te: "జనరల్ ఫిజిషియన్", kn: "ಸಾಮಾನ್ಯ ವೈದ್ಯ", bn: "সাধারণ চিকিৎসক", mr: "सर्वसामान्य चिकित्सक" },
  family: { en: "Family medicine", hi: "पारिवारिक चिकित्सक", hinglish: "family doctor", ta: "குடும்ப மருத்துவர்", te: "కుటుంబ వైద్యం", kn: "ಕುಟುಂಬ ವೈದ್ಯ", bn: "পারিবারিক চিকিৎসক", mr: "कौटुंबिक चिकित्सक" },
  pediatrics: { en: "Pediatrician", hi: "बाल रोग विशेषज्ञ", hinglish: "child specialist", ta: "குழந்தை மருத்துவர்", te: "పిల్లల వైద్యుడు", kn: "ಮಕ್ಕಳ ವೈದ್ಯ", bn: "শিশু চিকিৎসক", mr: "बालरोगतज्ञ" },
  cardiology: { en: "Cardiologist", hi: "हृदय रोग विशेषज्ञ", hinglish: "heart specialist", ta: "இதய மருத்துவர்", te: "హృదయ వైద్యుడు", kn: "ಹೃದಯ ವೈದ್ಯ", bn: "হৃদরোগ বিশেষজ্ঞ", mr: "हृदयविकारतज्ञ" },
  ent: { en: "ENT specialist", hi: "कान-नाक-गला विशेषज्ञ", hinglish: "ENT specialist", ta: "காது மூக்கு தொண்டை மருத்துவர்", te: "ఇఎన్టీ నిపుణుడు", kn: "ಇಎನ್ಟಿ ತಜ್ಞ", bn: "নাক কান গলা বিশেষজ্ঞ", mr: "कान-नाक-घसा तज्ञ" },
  orthopedics: { en: "Orthopedic doctor", hi: "हड्डी रोग विशेषज्ञ", hinglish: "bone specialist", ta: "எலும்பு மருத்துவர்", te: "ఎముకల వైద్యుడు", kn: "ಮೂಳೆ ತಜ್ಞ", bn: "অস্থি চিকিৎসক", mr: "अस्थिरोगतज्ञ" },
  community: { en: "Community doctor", hi: "सामुदायिक चिकित्सक", hinglish: "community doctor", ta: "சமூக மருத்துவர்", te: "కమ్యూనిటీ డాక్టర్", kn: "ಸಮುದಾಯ ವೈದ್ಯ", bn: "কমিউনিটি চিকিৎসক", mr: "सामुदायिक चिकित्सक" }
};

const symptomSpecialty = {
  fever: "general",
  cough: "general",
  headache: "general",
  stomach: "general",
  child: "pediatrics",
  heart: "cardiology",
  ear: "ent",
  bone: "orthopedics"
};

function doctor(id, name, initials, specialty, languages, city, area, experience, rating, fee, color) {
  return { id, name, initials, specialty, languages, city, area, experience, rating, fee, color, location: `${area}, ${city}` };
}

function listProviders({ city, specialty, language } = {}) {
  return providers.filter((item) => {
    if (city && item.city.toLowerCase() !== city.toLowerCase()) return false;
    if (specialty && item.specialty !== specialty) return false;
    if (language && language !== "en" && language !== "hinglish" && !item.languages.includes(language)) return false;
    return true;
  });
}

function getProvider(id) {
  return providers.find((item) => item.id === id) || null;
}

function availableSlots(providerId) {
  return slots.filter((slot) => !bookings.some((booking) => booking.providerId === providerId && booking.slotId === slot.id && booking.status !== "cancelled"));
}

function bookAppointment({ providerId, slotId, patientName, language, location, symptom }) {
  const provider = getProvider(providerId);
  const slot = slots.find((item) => item.id === slotId);
  const name = typeof patientName === "string" ? patientName.trim() : "";
  if (!provider || !slot) return { error: "A valid doctor and time are required.", status: 400 };
  if (name.length < 2 || name.length > 80) return { error: "A patient name is required.", status: 400 };
  if (bookings.some((booking) => booking.providerId === provider.id && booking.slotId === slot.id && booking.status !== "cancelled")) {
    return { error: "That time was just booked. Please choose another.", status: 409 };
  }
  const when = new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString();
  const booking = {
    id: randomUUID(),
    reference: `SN${Date.now().toString().slice(-6)}`,
    patientName: name,
    providerId: provider.id,
    providerName: provider.name,
    slotId: slot.id,
    appointmentTime: slot.label,
    language: language || "hi",
    location: location || provider.city,
    symptom: symptom || "general",
    status: "confirmed",
    reminder: {
      id: randomUUID(),
      channel: "sms",
      sendAt: when,
      message: `Reminder: ${provider.name} on ${slot.label}. Reach 15 minutes early.`
    },
    followUp: {
      id: randomUUID(),
      when: "3 days after the visit",
      status: "scheduled"
    },
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  return { booking };
}

function recordFeedback({ bookingId, rating, comment }) {
  const booking = bookings.find((item) => item.id === bookingId || item.reference === bookingId);
  if (!booking) return { error: "Booking not found.", status: 404 };
  const score = Number(rating);
  if (!Number.isInteger(score) || score < 1 || score > 5) return { error: "Rating must be from 1 to 5.", status: 400 };
  const entry = { id: randomUUID(), bookingId: booking.id, rating: score, comment: String(comment || "").slice(0, 280), createdAt: new Date().toISOString() };
  feedback.push(entry);
  booking.feedback = entry;
  return { feedback: entry, booking };
}

function cancelBooking(bookingId) {
  const booking = bookings.find((item) => item.id === bookingId || item.reference === bookingId);
  if (!booking) return { error: "Booking not found.", status: 404 };
  booking.status = "cancelled";
  return { booking };
}

function specialtyLabel(key, language) {
  const item = specialties[key] || specialties.general;
  return item[language] || item.en;
}

module.exports = {
  slots,
  providers,
  bookings,
  feedback,
  symptomSpecialty,
  listProviders,
  getProvider,
  availableSlots,
  bookAppointment,
  recordFeedback,
  cancelBooking,
  specialtyLabel
};
