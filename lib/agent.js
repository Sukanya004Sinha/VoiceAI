const clinic = require("./clinic");
const { retrieve } = require("./rag");

const sessions = new Map();

const cities = [
  { id: "Bengaluru", names: ["bengaluru", "bangalore", "blr", "बेंगलुरु", "बेंगलूरु", "பெங்களூர்", "బెంగళూరు", "ಬೆಂಗಳೂರು"] },
  { id: "Mumbai", names: ["mumbai", "bombay", "मुंबई", "மும்பை", "ముంబై"] },
  { id: "Delhi", names: ["delhi", "new delhi", "दिल्ली", "नई दिल्ली", "டெல்லி", "ఢిల్లీ"] },
  { id: "Chennai", names: ["chennai", "madras", "चेन्नई", "சென்னை", "చెన్నై"] },
  { id: "Hyderabad", names: ["hyderabad", "हैदराबाद", "హైదరాబాద్", "ஹைதராபாத்"] },
  { id: "Pune", names: ["pune", "पुणे", "పూణే"] },
  { id: "Jaipur", names: ["jaipur", "जयपुर"] },
  { id: "Lucknow", names: ["lucknow", "लखनऊ"] },
  { id: "Rural", names: ["rural", "village", "gaon", "gaw", "गांव", "गाँव", "கிராமம்", "గ్రామం", "phc"] }
];

const symptoms = [
  { id: "heart", terms: ["chest pain", "heart attack", "seene mein", "सीने में दर्द", "दिल का दर्द", "நெஞ்சு வலி", "ఛాతీ నొప్పి"] },
  { id: "child", terms: ["baby", "infant", "bachcha", "baccha", "बच्चा", "बच्चे", "குழந்தை", "బిడ్డ", "ಮಗು", "বাচ্চা", "मूल"] },
  { id: "fever", terms: ["fever", "temperature", "bukhar", "bukhaar", "bukha", "बुखार", "ज्वर", "ताप", "காய்ச்சல்", "జ్వరం", "ಜ್ವರ", "জ্বর"] },
  { id: "cough", terms: ["cough", "khansi", "khasi", "खांसी", "खाँसी", "இருமல்", "దగ్గు", "ಕೆಮ್ಮು", "কাশি", "खोकला", "sardi", "सर्दी"] },
  { id: "headache", terms: ["headache", "head ache", "sir dard", "sar dard", "सिर दर्द", "सिरदर्द", "தலைவலி", "తలనొప్పి", "ತಲೆನೋವು", "মাথা ব্যথা"] },
  { id: "stomach", terms: ["stomach", "pet dard", "पेट दर्द", "पेट", "வயிற்று", "కడుపు", "ಹೊಟ್ಟೆ", "পেট", "loose motion", "ulti", "vomiting", "उल्टी"] },
  { id: "ear", terms: ["ear pain", "kaan", "कान दर्द", "காது வலி", "చెవి"] },
  { id: "bone", terms: ["fracture", "bone", "haddi", "हड्डी", "எலும்பு", "ఎముక", "joint pain"] }
];

const symptomLabel = {
  fever: { en: "fever", hi: "बुखार", hinglish: "bukhar", ta: "காய்ச்சல்", te: "జ్వరం", kn: "ಜ್ವರ", bn: "জ্বর", mr: "ताप" },
  cough: { en: "cough", hi: "खांसी", hinglish: "khansi", ta: "இருமல்", te: "దగ్గు", kn: "ಕೆಮ್ಮು", bn: "কাশি", mr: "खोकला" },
  headache: { en: "headache", hi: "सिर दर्द", hinglish: "sir dard", ta: "தலைவலி", te: "తలనొప్పి", kn: "ತಲೆನೋವು", bn: "মাথা ব্যথা", mr: "डोकेदुखी" },
  stomach: { en: "stomach pain", hi: "पेट दर्द", hinglish: "pet dard", ta: "வயிற்று வலி", te: "కడుపు నొప్పి", kn: "ಹೊಟ್ಟೆ ನೋವು", bn: "পেট ব্যথা", mr: "पोटदुखी" },
  child: { en: "a child's illness", hi: "बच्चे की तबीयत", hinglish: "bacche ki tabiyat", ta: "குழந்தையின் உடல்நலம்", te: "పిల్లల అనారోగ్యం", kn: "ಮಗುವಿನ ಅನಾರೋಗ್ಯ", bn: "শিশুর অসুস্থতা", mr: "मुलाची तब्येत" },
  heart: { en: "chest pain", hi: "सीने में दर्द", hinglish: "chest pain", ta: "நெஞ்சு வலி", te: "ఛాతీ నొప్పి", kn: "ಎದೆ ನೋವು", bn: "বুকে ব্যথা", mr: "छातीत दुखणे" },
  ear: { en: "ear pain", hi: "कान दर्द", hinglish: "kaan dard", ta: "காது வலி", te: "చెవి నొప్పి", kn: "ಕಿವಿ ನೋವು", bn: "কানে ব্যথা", mr: "कानदुखी" },
  bone: { en: "bone or joint pain", hi: "हड्डी या जोड़ दर्द", hinglish: "haddi ka dard", ta: "எலும்பு வலி", te: "ఎముక నొప్పి", kn: "ಮೂಳೆ ನೋವು", bn: "হাড়ের ব্যথা", mr: "हाडाचे दुखणे" },
  general: { en: "a health concern", hi: "सेहत की परेशानी", hinglish: "sehat ki pareshani", ta: "உடல்நலக் கவலை", te: "ఆరోగ్య సమస్య", kn: "ಆರೋಗ್ಯ ಕಾಳಜಿ", bn: "স্বাস্থ্য সমস্যা", mr: "आरोग्याची काळजी" }
};

const copy = {
  en: {
    greet: "Namaste. I'm Suno. Tell me how you're feeling, in your language — Hindi, Hinglish, Tamil, Telugu, or English all work. I can find a doctor, book a visit, and set a reminder.",
    askCity: (symptom) => `I understand you're dealing with ${symptom}. Which city should I search — Bengaluru, Mumbai, Delhi, Chennai, or a village clinic?`,
    understood: (symptom, city, guidance) => `I understand: ${symptom} in ${city}. ${guidance} I can book a doctor who speaks your language.`,
    providers: "These doctors have open visits. Choose one and I will check the time.",
    noProviders: (city) => `I could not find an open match in ${city}. Try another city, or tell me the kind of doctor you need.`,
    slots: (name) => `${name} has these open times. Which one should I book?`,
    noSlots: "Those times are full. Please choose another doctor.",
    askName: (time) => `${time} is free. What name should I put on the appointment?`,
    booked: (booking) => `Your visit is booked, ${booking.patientName}.\n\n${booking.providerName} · ${booking.appointmentTime}\nReference ${booking.reference}\n\nI have scheduled an SMS reminder for about 20 hours before the visit, and a follow-up check 3 days later. After the visit, tell me a rating from 1 to 5.`,
    emergency: "This can be an emergency. Please contact your local emergency number or the nearest hospital now. I will not book a routine clinic slot for this.",
    fallback: "I can help you find a doctor and book a visit. Tell me the problem and your city, for example: fever in Bengaluru.",
    feedback: "Thank you. I have saved your feedback and kept the follow-up visit on the plan.",
    needBooking: "Book a visit first, then I can save feedback.",
    cancelled: (booking) => `I cancelled ${booking.reference} with ${booking.providerName}. The time is open again.`,
    suggestions: ["I have a fever", "Find a doctor in Bengaluru", "Book an appointment"]
  },
  hi: {
    greet: "नमस्ते। मैं सुनो हूँ। अपनी भाषा में बताइए कि तबीयत कैसी है। मैं डॉक्टर ढूँढूँगी, अपॉइंटमेंट बुक करूँगी, और रिमाइंडर रखूँगी।",
    askCity: (symptom) => `मैं समझ गई कि आपको ${symptom} है। किस शहर में देखूँ — बेंगलुरु, मुंबई, दिल्ली, चेन्नई, या गाँव का क्लिनिक?`,
    understood: (symptom, city, guidance) => `मैं समझ गई: ${city} में ${symptom}। ${guidance} मैं आपकी भाषा बोलने वाले डॉक्टर के साथ विज़िट बुक कर सकती हूँ।`,
    providers: "ये डॉक्टर उपलब्ध हैं। किसी एक को चुनिए, मैं समय देखती हूँ।",
    noProviders: (city) => `${city} में अभी उपयुक्त डॉक्टर नहीं मिला। दूसरा शहर बताइए।`,
    slots: (name) => `${name} के ये समय खाली हैं। कौन-सा रखूँ?`,
    noSlots: "इस डॉक्टर के समय भर गए हैं। कोई और डॉक्टर चुनिए।",
    askName: (time) => `${time} खाली है। अपॉइंटमेंट किस नाम पर बुक करूँ?`,
    booked: (booking) => `आपका अपॉइंटमेंट बुक हो गया, ${booking.patientName}।\n\n${booking.providerName} · ${booking.appointmentTime}\nसंदर्भ ${booking.reference}\n\nविज़िट से करीब 20 घंटे पहले एसएमएस रिमाइंडर तय है, और 3 दिन बाद फॉलो-अप भी। विज़िट के बाद 1 से 5 तक बताइए कि कैसा रहा।`,
    emergency: "यह इमरजेंसी हो सकती है। अभी स्थानीय आपातकालीन नंबर या नज़दीकी अस्पताल से संपर्क करें। मैं इसके लिए साधारण क्लिनिक स्लॉट नहीं बुक करूँगी।",
    fallback: "मैं डॉक्टर ढूँढने और अपॉइंटमेंट बुक करने में मदद कर सकती हूँ। परेशानी और शहर बताइए, जैसे: बेंगलुरु में बुखार।",
    feedback: "धन्यवाद। आपकी प्रतिक्रिया सहेज ली है और फॉलो-अप योजना में है।",
    needBooking: "पहले अपॉइंटमेंट बुक कीजिए, फिर मैं प्रतिक्रिया सहेजूँगी।",
    cancelled: (booking) => `मैंने ${booking.providerName} वाला संदर्भ ${booking.reference} रद्द कर दिया। समय फिर से खाली है।`,
    suggestions: ["मुझे बुखार है", "बेंगलुरु में डॉक्टर चाहिए", "अपॉइंटमेंट बुक करें"]
  },
  hinglish: {
    greet: "Namaste. Main Suno hoon. Apni language mein bolo — Hindi, Hinglish, Tamil, sab chalega. Main doctor dhundhungi, appointment book karungi, aur reminder rakhungi.",
    askCity: (symptom) => `Samajh gayi, aapko ${symptom} hai. Kaunse sheher mein dhundhun — Bengaluru, Mumbai, Delhi, Chennai, ya gaon ka clinic?`,
    understood: (symptom, city, guidance) => `Samajh gayi: ${city} mein ${symptom}. ${guidance} Main aapki bhasha bolne wale doctor ke saath visit book kar sakti hoon.`,
    providers: "Ye doctors available hain. Ek ko chuno, main time check karti hoon.",
    noProviders: (city) => `${city} mein abhi sahi doctor nahi mila. Doosra sheher bolo.`,
    slots: (name) => `${name} ke ye time khali hain. Kaunsa rakhun?`,
    noSlots: "Is doctor ke time full hain. Koi aur doctor chuno.",
    askName: (time) => `${time} khali hai. Appointment kis naam pe book karun?`,
    booked: (booking) => `Appointment book ho gayi, ${booking.patientName}.\n\n${booking.providerName} · ${booking.appointmentTime}\nReference ${booking.reference}\n\nVisit se lagbhag 20 ghante pehle SMS reminder set hai, aur 3 din baad follow-up bhi. Baad mein 1 se 5 tak bata dena kaisa raha.`,
    emergency: "Ye emergency ho sakti hai. Abhi local emergency number ya nazdeeki hospital se sampark karo. Main iske liye routine clinic slot nahi book karungi.",
    fallback: "Main doctor dhundhne aur appointment book karne mein madad kar sakti hoon. Problem aur sheher bolo, jaise: Bangalore mein bukhar.",
    feedback: "Shukriya. Feedback save ho gaya aur follow-up plan mein hai.",
    needBooking: "Pehle appointment book karo, phir main feedback save karungi.",
    cancelled: (booking) => `Maine ${booking.providerName} wala reference ${booking.reference} cancel kar diya. Time phir se khali hai.`,
    suggestions: ["mujhe bukhar hai", "Bangalore mein doctor chahiye", "appointment book karo"]
  },
  ta: {
    greet: "வணக்கம். நான் சுனோ. உங்கள் மொழியில் உடல்நிலையைச் சொல்லுங்கள். மருத்துவரைக் கண்டுபிடித்து நேரம் பதிவு செய்து நினைவூட்டல் வைப்பேன்.",
    askCity: (symptom) => `உங்களுக்கு ${symptom} என்று புரிந்துகொண்டேன். எந்த நகரத்தில் தேடட்டும் — பெங்களூர், மும்பை, டெல்லி, சென்னை, அல்லது கிராம மருத்துவமனை?`,
    understood: (symptom, city, guidance) => `புரிந்தது: ${city} இல் ${symptom}. ${guidance} உங்கள் மொழி பேசும் மருத்துவரிடம் சந்திப்பைப் பதிவு செய்யலாம்.`,
    providers: "இந்த மருத்துவர்கள் இருக்கிறார்கள். ஒருவரைத் தேர்ந்தெடுங்கள்; நேரத்தைப் பார்க்கிறேன்.",
    noProviders: (city) => `${city} இல் பொருத்தமான மருத்துவர் இப்போது இல்லை. வேறு நகரத்தைச் சொல்லுங்கள்.`,
    slots: (name) => `${name} அவர்களுக்கு இந்த நேரங்கள் காலியாக உள்ளன. எதைப் பதிவு செய்யட்டும்?`,
    noSlots: "இந்த மருத்துவரின் நேரங்கள் நிரம்பியுள்ளன. வேறு மருத்துவரைத் தேர்ந்தெடுங்கள்.",
    askName: (time) => `${time} காலி. சந்திப்பை எந்தப் பெயரில் பதிவு செய்யட்டும்?`,
    booked: (booking) => `சந்திப்பு பதிவானது, ${booking.patientName}.\n\n${booking.providerName} · ${booking.appointmentTime}\nகுறிப்பு ${booking.reference}\n\nசந்திப்புக்கு சுமார் 20 மணி நேரத்திற்கு முன் SMS நினைவூட்டல் உள்ளது, 3 நாள் கழித்து பின்தொடர்தலும் உள்ளது. பிறகு 1 முதல் 5 வரை மதிப்பீடு சொல்லுங்கள்.`,
    emergency: "இது அவசரமாக இருக்கலாம். இப்போதே உள்ளூர் அவசர எண் அல்லது அருகிலுள்ள மருத்துவமனையைத் தொடர்புகொள்ளுங்கள். இதற்கு சாதாரண நேரத்தைப் பதிவு செய்ய மாட்டேன்.",
    fallback: "மருத்துவரைக் கண்டுபிடித்து நேரம் பதிவு செய்ய உதவுவேன். பிரச்சனையும் நகரமும் சொல்லுங்கள், எடுத்துக்காட்டு: சென்னையில் காய்ச்சல்.",
    feedback: "நன்றி. உங்கள் கருத்து சேமிக்கப்பட்டது, பின்தொடர்தல் திட்டத்தில் உள்ளது.",
    needBooking: "முதலில் சந்திப்பைப் பதிவு செய்யுங்கள், பிறகு கருத்தைச் சேமிப்பேன்.",
    cancelled: (booking) => `${booking.providerName} அவர்களின் குறிப்பு ${booking.reference} ரத்து செய்யப்பட்டது. நேரம் மீண்டும் காலி.`,
    suggestions: ["எனக்கு காய்ச்சல்", "சென்னையில் மருத்துவர் வேண்டும்", "நேரம் பதிவு செய்யுங்கள்"]
  },
  te: {
    greet: "నమస్కారం. నేను సునో. మీ భాషలో ఎలా ఉన్నారో చెప్పండి. డాక్టర్‌ను వెతికి అపాయింట్‌మెంట్ బుక్ చేసి రిమైండర్ పెడతాను.",
    askCity: (symptom) => `మీకు ${symptom} అని అర్థమైంది. ఏ నగరంలో చూడాలి — బెంగళూరు, ముంబై, ఢిల్లీ, చెన్నై, లేదా గ్రామ క్లినిక్?`,
    understood: (symptom, city, guidance) => `అర్థమైంది: ${city} లో ${symptom}. ${guidance} మీ భాష మాట్లాడే డాక్టర్‌తో విజిట్ బుక్ చేయగలను.`,
    providers: "ఈ డాక్టర్లు అందుబాటులో ఉన్నారు. ఒకరిని ఎంచుకోండి, సమయం చూస్తాను.",
    noProviders: (city) => `${city} లో ఇప్పుడు సరైన డాక్టర్ దొరకలేదు. వేరే నగరం చెప్పండి.`,
    slots: (name) => `${name} కు ఈ సమయాలు ఖాళీగా ఉన్నాయి. ఏది బుక్ చేయాలి?`,
    noSlots: "ఈ డాక్టర్ సమయాలు నిండాయి. వేరే డాక్టర్‌ను ఎంచుకోండి.",
    askName: (time) => `${time} ఖాళీగా ఉంది. అపాయింట్‌మెంట్ ఏ పేరు మీద బుక్ చేయాలి?`,
    booked: (booking) => `అపాయింట్‌మెంట్ బుక్ అయింది, ${booking.patientName}.\n\n${booking.providerName} · ${booking.appointmentTime}\nరిఫరెన్స్ ${booking.reference}\n\nవిజిట్‌కు సుమారు 20 గంటల ముందు SMS రిమైండర్, 3 రోజుల తర్వాత ఫాలో-అప్ కూడా ఉంది. తర్వాత 1 నుండి 5 వరకు చెప్పండి.`,
    emergency: "ఇది అత్యవసరం కావచ్చు. ఇప్పుడే స్థానిక అత్యవసర నంబర్ లేదా దగ్గరి ఆసుపత్రిని సంప్రదించండి. దీనికి సాధారణ స్లాట్ బుక్ చేయను.",
    fallback: "డాక్టర్‌ను వెతికి అపాయింట్‌మెంట్ బుక్ చేయడంలో సహాయం చేస్తాను. సమస్య మరియు నగరం చెప్పండి, ఉదాహరణ: హైదరాబాద్‌లో జ్వరం.",
    feedback: "ధన్యవాదాలు. మీ అభిప్రాయం సేవ్ అయింది, ఫాలో-అప్ ప్లాన్‌లో ఉంది.",
    needBooking: "ముందు అపాయింట్‌మెంట్ బుక్ చేయండి, తర్వాత అభిప్రాయం సేవ్ చేస్తాను.",
    cancelled: (booking) => `${booking.providerName} రిఫరెన్స్ ${booking.reference} రద్దు చేశాను. సమయం మళ్లీ ఖాళీ.`,
    suggestions: ["నాకు జ్వరం", "హైదరాబాద్‌లో డాక్టర్ కావాలి", "అపాయింట్‌మెంట్ బుక్ చేయండి"]
  },
  kn: {
    greet: "ನಮಸ್ಕಾರ. ನಾನು ಸುನೋ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಹೇಳಿ. ವೈದ್ಯರನ್ನು ಹುಡುಕಿ ಭೇಟಿ ಬುಕ್ ಮಾಡಿ ಜ್ಞಾಪನೆ ಇಡುತ್ತೇನೆ.",
    askCity: (symptom) => `ನಿಮಗೆ ${symptom} ಎಂದು ಅರ್ಥವಾಯಿತು. ಯಾವ ನಗರದಲ್ಲಿ ಹುಡುಕಲಿ — ಬೆಂಗಳೂರು, ಮುಂಬೈ, ದೆಹಲಿ, ಚೆನ್ನೈ, ಅಥವಾ ಗ್ರಾಮ ಚಿಕಿತ್ಸಾಲಯ?`,
    understood: (symptom, city, guidance) => `ಅರ್ಥವಾಯಿತು: ${city} ನಲ್ಲಿ ${symptom}. ${guidance} ನಿಮ್ಮ ಭಾಷೆ ಮಾತನಾಡುವ ವೈದ್ಯರ ಬಳಿ ಭೇಟಿ ಬುಕ್ ಮಾಡಬಹುದು.`,
    providers: "ಈ ವೈದ್ಯರು ಲಭ್ಯವಿದ್ದಾರೆ. ಒಬ್ಬರನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಸಮಯ ನೋಡುತ್ತೇನೆ.",
    noProviders: (city) => `${city} ನಲ್ಲಿ ಈಗ ಸೂಕ್ತ ವೈದ್ಯರು ಸಿಗಲಿಲ್ಲ. ಬೇರೆ ನಗರ ಹೇಳಿ.`,
    slots: (name) => `${name} ಅವರಿಗೆ ಈ ಸಮಯಗಳು ಖಾಲಿ ಇವೆ. ಯಾವುದನ್ನು ಬುಕ್ ಮಾಡಲಿ?`,
    noSlots: "ಈ ವೈದ್ಯರ ಸಮಯ ತುಂಬಿದೆ. ಬೇರೆ ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    askName: (time) => `${time} ಖಾಲಿ ಇದೆ. ಭೇಟಿಯನ್ನು ಯಾವ ಹೆಸರಿನಲ್ಲಿ ಬುಕ್ ಮಾಡಲಿ?`,
    booked: (booking) => `ಭೇಟಿ ಬುಕ್ ಆಯಿತು, ${booking.patientName}.\n\n${booking.providerName} · ${booking.appointmentTime}\nಉಲ್ಲೇಖ ${booking.reference}\n\nಭೇಟಿಗೆ ಸುಮಾರು 20 ಗಂಟೆ ಮೊದಲು SMS ಜ್ಞಾಪನೆ, 3 ದಿನದ ನಂತರ ಫಾಲೋ-ಅಪ್ ಇದೆ. ನಂತರ 1 ರಿಂದ 5 ರವರೆಗೆ ಹೇಳಿ.`,
    emergency: "ಇದು ತುರ್ತು ಆಗಿರಬಹುದು. ಈಗಲೇ ಸ್ಥಳೀಯ ತುರ್ತು ಸಂಖ್ಯೆ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಕರೆ ಮಾಡಿ. ಇದಕ್ಕೆ ಸಾಮಾನ್ಯ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡುವುದಿಲ್ಲ.",
    fallback: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ ಭೇಟಿ ಬುಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಸಮಸ್ಯೆ ಮತ್ತು ನಗರ ಹೇಳಿ.",
    feedback: "ಧನ್ಯವಾದ. ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಉಳಿಸಲಾಗಿದೆ, ಫಾಲೋ-ಅಪ್ ಯೋಜನೆಯಲ್ಲಿದೆ.",
    needBooking: "ಮೊದಲು ಭೇಟಿ ಬುಕ್ ಮಾಡಿ, ನಂತರ ಅಭಿಪ್ರಾಯ ಉಳಿಸುತ್ತೇನೆ.",
    cancelled: (booking) => `${booking.providerName} ಉಲ್ಲೇಖ ${booking.reference} ರದ್ದು ಮಾಡಿದೆ. ಸಮಯ ಮತ್ತೆ ಖಾಲಿ.`,
    suggestions: ["ನನಗೆ ಜ್ವರ", "ಬೆಂಗಳೂರಿನಲ್ಲಿ ವೈದ್ಯರು ಬೇಕು", "ಭೇಟಿ ಬುಕ್ ಮಾಡಿ"]
  },
  bn: {
    greet: "নমস্কার। আমি সুনো। আপনার ভাষায় কী সমস্যা বলুন। ডাক্তার খুঁজে অ্যাপয়েন্টমেন্ট বুক করব এবং রিমাইন্ডার রাখব।",
    askCity: (symptom) => `বুঝেছি, আপনার ${symptom}। কোন শহরে খুঁজব — বেঙ্গালুরু, মুম্বাই, দিল্লি, চেন্নাই, না গ্রামের ক্লিনিক?`,
    understood: (symptom, city, guidance) => `বুঝেছি: ${city}-এ ${symptom}। ${guidance} আপনার ভাষায় কথা বলা ডাক্তারের সঙ্গে ভিজিট বুক করতে পারি।`,
    providers: "এই ডাক্তাররা আছেন। একজন বেছে নিন, আমি সময় দেখছি।",
    noProviders: (city) => `${city}-এ এখন উপযুক্ত ডাক্তার পাইনি। অন্য শহর বলুন।`,
    slots: (name) => `${name}-এর এই সময়গুলো খালি। কোনটি বুক করব?`,
    noSlots: "এই ডাক্তারের সময় পূর্ণ। অন্য ডাক্তার বেছে নিন।",
    askName: (time) => `${time} খালি। কার নামে অ্যাপয়েন্টমেন্ট বুক করব?`,
    booked: (booking) => `অ্যাপয়েন্টমেন্ট বুক হয়েছে, ${booking.patientName}।\n\n${booking.providerName} · ${booking.appointmentTime}\nরেফারেন্স ${booking.reference}\n\nভিজিটের প্রায় ২০ ঘণ্টা আগে SMS রিমাইন্ডার এবং ৩ দিন পর ফলো-আপ আছে। পরে ১ থেকে ৫ বলুন।`,
    emergency: "এটি জরুরি হতে পারে। এখনই স্থানীয় জরুরি নম্বর বা কাছের হাসপাতালে যোগাযোগ করুন। এর জন্য সাধারণ স্লট বুক করব না।",
    fallback: "ডাক্তার খুঁজে অ্যাপয়েন্টমেন্ট বুক করতে পারি। সমস্যা ও শহর বলুন।",
    feedback: "ধন্যবাদ। আপনার মতামত সেভ হয়েছে এবং ফলো-আপ পরিকল্পনায় আছে।",
    needBooking: "আগে অ্যাপয়েন্টমেন্ট বুক করুন, তারপর মতামত সেভ করব।",
    cancelled: (booking) => `${booking.providerName}-এর রেফারেন্স ${booking.reference} বাতিল করেছি। সময় আবার খালি।`,
    suggestions: ["আমার জ্বর", "কলকাতার কাছে ডাক্তার চাই", "অ্যাপয়েন্টমেন্ট বুক করুন"]
  },
  mr: {
    greet: "नमस्कार. मी सुनो. तुमच्या भाषेत तब्येत सांगा. डॉक्टर शोधून अपॉइंटमेंट बुक करेन आणि रिमाइंडर ठेवेन.",
    askCity: (symptom) => `समजले, तुम्हाला ${symptom} आहे. कोणत्या शहरात शोधू — बेंगळुरू, मुंबई, दिल्ली, चेन्नई, की गावाचे क्लिनिक?`,
    understood: (symptom, city, guidance) => `समजले: ${city} मध्ये ${symptom}. ${guidance} तुमची भाषा बोलणाऱ्या डॉक्टरांकडे भेट बुक करू शकते.`,
    providers: "हे डॉक्टर उपलब्ध आहेत. एक निवडा, मी वेळ पाहते.",
    noProviders: (city) => `${city} मध्ये सध्या योग्य डॉक्टर सापडला नाही. दुसरे शहर सांगा.`,
    slots: (name) => `${name} यांच्या या वेळा मोकळ्या आहेत. कोणती बुक करू?`,
    noSlots: "या डॉक्टरांच्या वेळा भरल्या आहेत. दुसरे डॉक्टर निवडा.",
    askName: (time) => `${time} मोकळी आहे. अपॉइंटमेंट कोणाच्या नावाने बुक करू?`,
    booked: (booking) => `अपॉइंटमेंट बुक झाली, ${booking.patientName}.\n\n${booking.providerName} · ${booking.appointmentTime}\nसंदर्भ ${booking.reference}\n\nभेटीच्या सुमारे २० तास आधी SMS रिमाइंडर आणि ३ दिवसांनी फॉलो-अप आहे. नंतर १ ते ५ सांगा.`,
    emergency: "हे आणीबाणी असू शकते. आत्ताच स्थानिक आपत्कालीन क्रमांक किंवा जवळच्या रुग्णालयाशी संपर्क करा. यासाठी नियमित स्लॉट बुक करणार नाही.",
    fallback: "डॉक्टर शोधून अपॉइंटमेंट बुक करण्यात मदत करते. समस्या आणि शहर सांगा, उदाहरण: पुण्यात ताप.",
    feedback: "धन्यवाद. तुमचा अभिप्राय जतन केला आहे आणि फॉलो-अप योजनेत आहे.",
    needBooking: "आधी अपॉइंटमेंट बुक करा, मग अभिप्राय जतन करेन.",
    cancelled: (booking) => `${booking.providerName} यांचा संदर्भ ${booking.reference} रद्द केला. वेळ पुन्हा मोकळी आहे.`,
    suggestions: ["मला ताप आहे", "पुण्यात डॉक्टर हवा", "अपॉइंटमेंट बुक करा"]
  }
};

const hinglishMarkers = ["mujhe", "mere", "mera", "hai", "hoon", "chahiye", "chahie", "karo", "kar do", "bukhar", "bukhaar", "dard", "naam", "subah", "kal", "aaj", "bhai", "yaar", "doctor", "daktar", "tabiyat", "sheher", "gaon", "kitna", "kya", "nahi", "accha", "theek"];

function sessionFor(id) {
  const key = id || "local";
  if (!sessions.has(key)) {
    sessions.set(key, {
      id: key,
      language: "hi",
      location: null,
      symptom: null,
      providerId: null,
      slotId: null,
      bookingId: null,
      stage: "initiate",
      awaiting: null
    });
  }
  return sessions.get(key);
}

function detectLanguage(text, preferred) {
  const value = String(text || "");
  if (/[\u0B80-\u0BFF]/.test(value)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(value)) return "te";
  if (/[\u0C80-\u0CFF]/.test(value)) return "kn";
  if (/[\u0980-\u09FF]/.test(value)) return "bn";
  if (/[\u0900-\u097F]/.test(value)) return "hi";
  const latin = value.toLowerCase();
  const hits = hinglishMarkers.filter((word) => latin.includes(word)).length;
  if (hits >= 2 || preferred === "hinglish") return "hinglish";
  if (preferred && copy[preferred]) return preferred;
  return "en";
}

function preferredLanguage(code) {
  const map = { "hi-IN": "hi", "hi-LATN": "hinglish", hinglish: "hinglish", "ta-IN": "ta", "te-IN": "te", "kn-IN": "kn", "bn-IN": "bn", "mr-IN": "mr", "en-IN": "en", hi: "hi", ta: "ta", te: "te", kn: "kn", bn: "bn", mr: "mr", en: "en" };
  return map[code] || "hi";
}

function textOf(language, key, ...args) {
  const pack = copy[language] || copy.en;
  const value = pack[key] || copy.en[key];
  return typeof value === "function" ? value(...args) : value;
}

function label(language, symptom) {
  const item = symptomLabel[symptom] || symptomLabel.general;
  return item[language] || item.en;
}

function findCity(text) {
  const value = String(text || "").toLowerCase();
  return cities.find((city) => city.names.some((name) => value.includes(name.toLowerCase()))) || null;
}

function findSymptom(text) {
  const value = String(text || "").toLowerCase();
  return symptoms.find((item) => item.terms.some((term) => value.includes(term.toLowerCase()))) || null;
}

function wantsDoctor(text) {
  return /doctor|appointment|book|clinic|physician|डाक्टर|डॉक्टर|चिकित्सक|अपॉइंटमेंट|बुक|மருத்துவர்|டாக்டர்|நேரம்|డాక్టర్|వైದ್ಯ|ಡాక్టర్|ವೈದ್ಯ|ডাক্তার|डॉक्टर हवा|chahiye|book kar/i.test(text);
}

function isEmergency(text) {
  return /can'?t breathe|cannot breathe|short of breath|chest pain|heart attack|unconscious|fainted|bleeding heavily|suicide|साँस नहीं|सांस नहीं|बेहोश|सीने में दर्द|दिल का दौरा|நெஞ்சு வலி|மூச்சு விட முடியவில்லை|ఊపిరి ఆడట్లేదు/i.test(text);
}

function isCancel(text) {
  return /cancel|रद्द|ரத்து|రద్దు|বাতিল|रद्द करा/i.test(text);
}

function findProvider(text, city) {
  const value = String(text || "").toLowerCase().replace(/\./g, "");
  const pool = city ? clinic.providers.filter((item) => item.city === city) : clinic.providers;
  return pool.find((item) => {
    const full = item.name.toLowerCase().replace(/\./g, "");
    if (value.includes(full)) return true;
    const parts = full.replace(/^dr\s+/, "").split(/\s+/);
    const last = parts[parts.length - 1];
    return last.length >= 4 && value.includes(last) && (value.includes("dr") || value.includes("doctor") || value.includes("डॉ") || parts.some((part) => part.length >= 4 && value.includes(part) && part !== last));
  }) || pool.find((item) => {
    const last = item.name.toLowerCase().split(" ").pop();
    return last.length >= 4 && value.includes(last);
  }) || null;
}

function findSlot(text) {
  const value = String(text || "").toLowerCase();
  const tomorrow = /tomorrow|kal\b|कल|நாளை|రేపు|ನಾಳೆ|কাল|उद्या/.test(value);
  const today = /today|aaj\b|आज|இன்று|ఈరోజు|ಇಂದು|আজ|आज/.test(value);
  const morning = /morning|subah|सुबह|காலை|ఉదయం|ಬೆಳಿಗ್ಗೆ|সকাল|सकाळ|9:30|9\.30/.test(value);
  const noon = /noon|dopahar|दोपहर|12:00|12 ?pm|மதியம்/.test(value);
  const evening = /evening|shaam|शाम|மாலை|సాయంత్రం|4:00|4 ?pm|6:00|6 ?pm/.test(value);
  if (/10:30|10\.30/.test(value)) return "today-1030";
  if (/9:30|9\.30/.test(value) || (tomorrow && morning)) return "tomorrow-0930";
  if (/6:00|6 ?pm/.test(value) || (tomorrow && evening)) return "tomorrow-1800";
  if (/12:00|12 ?pm/.test(value) || noon) return "today-1200";
  if (/4:00|4 ?pm/.test(value) || (evening && !tomorrow)) return "today-1600";
  if (tomorrow) return "tomorrow-0930";
  if (morning) return "tomorrow-0930";
  if (today) return "today-1030";
  return null;
}

function findName(text) {
  const value = String(text || "").trim();
  const labelled = value.match(/(?:my name is|i am|naam|नाम|பெயர்|పేరు|ಹೆಸರು|নাম|नाव)\s*[:\-]?\s*(.+)$/i);
  if (labelled) return cleanName(labelled[1]);
  if (value.split(/\s+/).length <= 4 && value.length >= 2 && value.length <= 40 && !findSymptom(value) && !findCity(value) && !wantsDoctor(value)) {
    return cleanName(value);
  }
  return null;
}

function cleanName(value) {
  const name = String(value || "").replace(/[0-9.!?।]/g, "").trim();
  if (name.length < 2 || name.length > 40) return null;
  return name;
}

function findRating(text) {
  const match = String(text || "").match(/(?:^|\s)([1-5])(?:\s|$|\/5| star)/);
  if (match) return Number(match[1]);
  if (/bahut accha|बहुत अच्छा|excellent|நன்று|బాగుంది|ಚೆನ್ನಾಗಿದೆ|ভালো|छान/.test(text)) return 5;
  if (/theek|ठीक|ok\b|average|சரி/.test(text) && /feedback|rating|कैसा|kaisa|எப்படி/.test(text)) return 3;
  return null;
}

function tool(name, input, output) {
  return { name, input, output: output && output.error ? { error: output.error } : output };
}

function publicProvider(provider, language) {
  return {
    id: provider.id,
    name: provider.name,
    initials: provider.initials,
    specialty: clinic.specialtyLabel(provider.specialty, language),
    specialtyKey: provider.specialty,
    languages: provider.languages,
    location: provider.location,
    city: provider.city,
    experience: `${provider.experience} years`,
    rating: String(provider.rating),
    fee: provider.fee,
    color: provider.color
  };
}

function respond(session, language, stage, reply, extra = {}) {
  session.language = language;
  session.stage = stage;
  return {
    reply,
    language,
    stage,
    suggestions: extra.suggestions || [],
    providers: extra.providers || [],
    slots: extra.slots || [],
    booking: extra.booking || null,
    tools: extra.tools || [],
    rag: extra.rag || [],
    session: {
      location: session.location,
      symptom: session.symptom,
      providerId: session.providerId,
      bookingId: session.bookingId
    }
  };
}

function searchGuidance(text, language) {
  const hits = retrieve(text, language);
  return { hits };
}

function chooseProviders(session, language) {
  const specialty = clinic.symptomSpecialty[session.symptom] || null;
  let matches = clinic.listProviders({ city: session.location, specialty, language: language === "en" || language === "hinglish" ? null : language });
  if (matches.length === 0) matches = clinic.listProviders({ city: session.location, specialty });
  if (matches.length === 0) matches = clinic.listProviders({ city: session.location });
  return matches.slice(0, 3).map((item) => publicProvider(item, language));
}

function presentSlots(session, language, provider) {
  const open = clinic.availableSlots(provider.id);
  session.providerId = provider.id;
  session.awaiting = open.length ? "slot" : null;
  if (!open.length) return respond(session, language, "execute", textOf(language, "noSlots"), { tools: [tool("check_availability", { providerId: provider.id }, { slots: [] })] });
  return respond(session, language, "execute", textOf(language, "slots", provider.name), {
    slots: open,
    tools: [tool("check_availability", { providerId: provider.id }, { count: open.length })]
  });
}

function finishBooking(session, language, name) {
  const result = clinic.bookAppointment({
    providerId: session.providerId,
    slotId: session.slotId,
    patientName: name,
    language,
    location: session.location,
    symptom: session.symptom
  });
  if (result.error) return respond(session, language, "execute", result.error, { tools: [tool("book_appointment", { providerId: session.providerId, slotId: session.slotId }, result)] });
  session.bookingId = result.booking.id;
  session.awaiting = "feedback";
  return respond(session, language, "confirm", textOf(language, "booked", result.booking), {
    booking: result.booking,
    tools: [
      tool("book_appointment", { providerId: session.providerId, slotId: session.slotId, patientName: name }, { reference: result.booking.reference }),
      tool("schedule_reminder", { bookingId: result.booking.id }, result.booking.reminder),
      tool("schedule_follow_up", { bookingId: result.booking.id }, result.booking.followUp)
    ]
  });
}

async function maybeLlm(session, message, language) {
  const key = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  if (!key || process.env.SUNO_FORCE_LOCAL === "1") return null;
  const base = (process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || process.env.LLM_MODEL || "gpt-4o-mini";
  const tools = [
    { type: "function", function: { name: "search_guidance", description: "Retrieve care guidance for the user's symptoms.", parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } } },
    { type: "function", function: { name: "find_providers", description: "Find doctors for a city and symptom.", parameters: { type: "object", properties: { city: { type: "string" }, symptom: { type: "string" } }, required: ["city"] } } },
    { type: "function", function: { name: "check_availability", description: "List open appointment slots for a doctor id.", parameters: { type: "object", properties: { providerId: { type: "string" } }, required: ["providerId"] } } },
    { type: "function", function: { name: "book_appointment", description: "Book a slot for a patient.", parameters: { type: "object", properties: { providerId: { type: "string" }, slotId: { type: "string" }, patientName: { type: "string" } }, required: ["providerId", "slotId", "patientName"] } } },
    { type: "function", function: { name: "record_feedback", description: "Save a 1-5 rating for the latest booking.", parameters: { type: "object", properties: { rating: { type: "number" }, comment: { type: "string" } }, required: ["rating"] } } }
  ];
  const messages = [
    { role: "system", content: "You are Suno, a multilingual Indian healthcare booking assistant. Reply in the user's language. You are not a doctor and must not diagnose. For emergencies, tell the user to get emergency care and do not book. Use tools to retrieve guidance, find doctors, check slots, book, and save feedback. Keep replies short enough to speak aloud." },
    { role: "user", content: JSON.stringify({ language, message, session: { location: session.location, symptom: session.symptom, providerId: session.providerId, slotId: session.slotId, bookingId: session.bookingId } }) }
  ];
  try {
    for (let step = 0; step < 4; step += 1) {
      const response = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, tools, temperature: 0.2 })
      });
      if (!response.ok) return null;
      const data = await response.json();
      const choice = data.choices && data.choices[0] && data.choices[0].message;
      if (!choice) return null;
      if (!choice.tool_calls || choice.tool_calls.length === 0) return choice.content || null;
      messages.push(choice);
      for (const call of choice.tool_calls) {
        const args = JSON.parse(call.function.arguments || "{}");
        let output = { error: "Unknown tool." };
        if (call.function.name === "search_guidance") output = searchGuidance(args.query || message, language);
        if (call.function.name === "find_providers") output = { providers: chooseProviders({ ...session, location: args.city || session.location, symptom: args.symptom || session.symptom }, language) };
        if (call.function.name === "check_availability") output = { slots: clinic.availableSlots(args.providerId) };
        if (call.function.name === "book_appointment") output = clinic.bookAppointment({ ...args, language, location: session.location, symptom: session.symptom });
        if (call.function.name === "record_feedback") output = clinic.recordFeedback({ bookingId: session.bookingId, rating: args.rating, comment: args.comment });
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(output) });
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function handleTurn({ sessionId, message = "", language: languageCode, action, providerId, slotId }) {
  const session = sessionFor(sessionId);
  const preferred = preferredLanguage(languageCode || session.language);
  const language = message ? detectLanguage(message, preferred) : preferred;
  session.language = language;

  if (action === "greet" || !message) {
    return respond(session, language, "initiate", textOf(language, "greet"), { suggestions: textOf(language, "suggestions") });
  }

  if (action === "select_provider" && providerId) {
    const provider = clinic.getProvider(providerId);
    if (!provider) return respond(session, language, "assist", textOf(language, "noProviders", session.location || "that city"));
    return presentSlots(session, language, provider);
  }

  if (action === "select_slot" && slotId) {
    const slot = clinic.slots.find((item) => item.id === slotId);
    if (!slot || !session.providerId) return respond(session, language, "execute", textOf(language, "fallback"));
    session.slotId = slot.id;
    session.awaiting = "name";
    return respond(session, language, "execute", textOf(language, "askName", slot.label), { tools: [tool("check_availability", { providerId: session.providerId, slotId }, { available: true })] });
  }

  if (isEmergency(message) || findSymptom(message)?.id === "heart") {
    const rag = searchGuidance(message, language);
    return respond(session, language, "understand", textOf(language, "emergency"), {
      rag: rag.hits,
      tools: [tool("search_guidance", { query: message }, { ids: rag.hits.map((hit) => hit.id) })]
    });
  }

  if (isCancel(message) && session.bookingId) {
    const result = clinic.cancelBooking(session.bookingId);
    session.awaiting = null;
    return respond(session, language, "confirm", textOf(language, "cancelled", result.booking), { booking: result.booking, tools: [tool("cancel_appointment", { bookingId: session.bookingId }, { status: "cancelled" })] });
  }

  const rating = session.awaiting === "feedback" ? findRating(message) : null;
  if (rating) {
    if (!session.bookingId) return respond(session, language, "confirm", textOf(language, "needBooking"));
    const result = clinic.recordFeedback({ bookingId: session.bookingId, rating, comment: message });
    return respond(session, language, "confirm", textOf(language, "feedback"), { booking: result.booking, tools: [tool("record_feedback", { rating }, { id: result.feedback.id })] });
  }

  const city = findCity(message);
  const symptom = findSymptom(message);
  if (city) session.location = city.id;
  if (symptom) session.symptom = symptom.id;

  if (session.awaiting === "name") {
    const name = findName(message);
    if (name && session.providerId && session.slotId) return finishBooking(session, language, name);
  }

  const named = findProvider(message, session.location);
  const slotWanted = findSlot(message);
  const explicitName = message.match(/(?:my name is|naam|नाम है|பெயர்)\s+(.{2,40})$/i);

  if (named) session.providerId = named.id;
  if (slotWanted && session.providerId) session.slotId = slotWanted;

  const rag = searchGuidance(`${message} ${session.symptom || ""}`, language);
  const tools = [];
  if (rag.hits.length) tools.push(tool("search_guidance", { query: message }, { ids: rag.hits.map((hit) => hit.id) }));

  const llmReply = await maybeLlm(session, message, language);

  if (explicitName && session.providerId && session.slotId) {
    return finishBooking(session, language, cleanName(explicitName[1]));
  }

  if (named && !slotWanted) return presentSlots(session, language, named);

  if (named && slotWanted && !explicitName) {
    session.providerId = named.id;
    session.slotId = slotWanted;
    session.awaiting = "name";
    const slot = clinic.slots.find((item) => item.id === slotWanted);
    const open = clinic.availableSlots(named.id).some((item) => item.id === slotWanted);
    if (!open) return respond(session, language, "execute", textOf(language, "noSlots"), { tools: [...tools, tool("check_availability", { providerId: named.id }, { available: false })] });
    return respond(session, language, "execute", textOf(language, "askName", slot.label), { tools: [...tools, tool("check_availability", { providerId: named.id, slotId: slotWanted }, { available: true })] });
  }

  if (!session.location && (symptom || wantsDoctor(message))) {
    return respond(session, language, "understand", textOf(language, "askCity", label(language, session.symptom || "general")), {
      suggestions: ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Rural"],
      rag: rag.hits,
      tools
    });
  }

  if (session.location && (symptom || wantsDoctor(message) || city)) {
    const providers = chooseProviders(session, language);
    tools.push(tool("find_providers", { city: session.location, symptom: session.symptom }, { count: providers.length }));
    if (!providers.length) return respond(session, language, "assist", textOf(language, "noProviders", session.location), { rag: rag.hits, tools });
    const guidance = rag.hits[0] ? rag.hits[0].text : "";
    const reply = textOf(language, "understood", label(language, session.symptom || "general"), session.location, guidance);
    session.awaiting = "provider";
    return respond(session, language, "assist", `${reply}\n\n${textOf(language, "providers")}`, { providers, rag: rag.hits, tools, suggestions: [] });
  }

  if (llmReply) return respond(session, language, session.stage || "understand", llmReply, { rag: rag.hits, tools });
  return respond(session, language, session.stage === "initiate" ? "understand" : session.stage, textOf(language, "fallback"), { suggestions: textOf(language, "suggestions"), rag: rag.hits, tools });
}

module.exports = { handleTurn, sessionFor, sessions, preferredLanguage, detectLanguage };
