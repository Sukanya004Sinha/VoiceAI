const documents = [
  {
    id: "fever",
    symptom: "fever",
    terms: ["fever", "temperature", "bukhar", "bukhaar", "bukha", "बुखार", "बुखार", "ज्वर", "காய்ச்சல்", "జ్వరం", "ಜ್ವರ", "জ্বর", "ताप", "ज्वर", "viral"],
    summary: {
      en: "Rest, fluids, and paracetamol only as advised on the pack or by a clinician. See a doctor if fever lasts over 3 days, is very high, or comes with rash, confusion, or stiff neck.",
      hi: "आराम करें और पानी पीते रहें। पैरासिटामोल केवल सलाह के अनुसार लें। बुखार 3 दिन से ज्यादा रहे, बहुत तेज हो, या दाने, उलझन या गर्दन अकड़न हो तो डॉक्टर को दिखाएँ।",
      hinglish: "Rest karo aur paani pite raho. Paracetamol sirf advice ke hisaab se lo. Fever 3 din se zyada rahe, bahut high ho, ya rash ya confusion ho to doctor ko dikhao.",
      ta: "ஓய்வு எடுத்து திரவங்கள் குடியுங்கள். பாராசிட்டமால் மருத்துவர் அல்லது அறிவுறுத்தலின்படி மட்டும். காய்ச்சல் 3 நாளுக்கு மேல் இருந்தாலோ மிக அதிகமாக இருந்தாலோ மருத்துவரை அணுகுங்கள்.",
      te: "విశ్రాంతి తీసుకోండి, ద్రవాలు తాగండి. పారాసిటమాల్ సలహా ప్రకారం మాత్రమే. జ్వరం 3 రోజులకు మించితే లేదా చాలా ఎక్కువైతే వైద్యుడిని చూడండి.",
      kn: "ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ, ದ್ರವಗಳನ್ನು ಕುಡಿಯಿರಿ. ಜ್ವರ 3 ದಿನಕ್ಕಿಂತ ಹೆಚ್ಚಿದರೆ ವೈದ್ಯರನ್ನು ನೋಡಿ.",
      bn: "বিশ্রাম নিন ও পানি পান করুন। জ্বর ৩ দিনের বেশি থাকলে ডাক্তারকে দেখান।",
      mr: "आराम करा आणि पाणी प्या. ताप ३ दिवसांपेक्षा जास्त राहिल्यास डॉक्टरकडे जा."
    }
  },
  {
    id: "cough",
    symptom: "cough",
    terms: ["cough", "khansi", "khasi", "खांसी", "खाँसी", "இருமல்", "దగ్గు", "ಕೆಮ್ಮು", "কাশি", "खोकला", "cold", "sardi", "सर्दी"],
    summary: {
      en: "A simple cough often settles with rest, warm fluids, and avoiding smoke. See a doctor if you are short of breath, coughing blood, or the cough lasts more than a week.",
      hi: "साधारण खांसी आराम और गुनगुने तरल से हल्की हो सकती है। साँस फूलना, खून आना, या एक हफ्ते से ज्यादा खांसी हो तो डॉक्टर को दिखाएँ।",
      hinglish: "Normal khansi rest aur garam fluids se kam ho sakti hai. Saans phoolna, blood, ya ek hafte se zyada khansi ho to doctor dikhao.",
      ta: "சாதாரண இருமல் ஓய்வும் வெதுவெதுப்பான திரவமும் கொண்டு குறையலாம். மூச்சு திணறல் அல்லது ஒரு வாரத்திற்கு மேல் இருந்தால் மருத்துவரை அணுகுங்கள்.",
      te: "సాధారణ దగ్గు విశ్రాంతి మరియు వెచ్చని ద్రవాలతో తగ్గవచ్చు. ఊపిరి ఆడకపోతే వైద్యుడిని చూడండి.",
      kn: "ಸಾಮಾನ್ಯ ಕೆಮ್ಮು ವಿಶ್ರಾಂತಿಯಿಂದ ಕಡಿಮೆಯಾಗಬಹುದು. ಉಸಿರಾಟ ಕಷ್ಟವಾದರೆ ವೈದ್ಯರನ್ನು ನೋಡಿ.",
      bn: "সাধারণ কাশি বিশ্রামে কমতে পারে। শ্বাসকষ্ট হলে ডাক্তারকে দেখান।",
      mr: "साधी खोकला विश्रांतीने कमी होऊ शकते. श्वास लागत नसेल तर डॉक्टरकडे जा."
    }
  },
  {
    id: "headache",
    symptom: "headache",
    terms: ["headache", "head ache", "sir dard", "sar dard", "सिर दर्द", "सिरदर्द", "தலைவலி", "తలనొప్పి", "ತಲೆನೋವು", "মাথা ব্যথা", "डोकं दुख", "migraine"],
    summary: {
      en: "Rest in a quiet room and drink water. Seek urgent care for a sudden severe headache, weakness, confusion, fainting, or a headache after a head injury.",
      hi: "शांत जगह आराम करें और पानी पिएँ। अचानक बहुत तेज दर्द, कमजोरी, उलझन, बेहोशी, या चोट के बाद दर्द हो तो तुरंत इलाज लें।",
      hinglish: "Shant jagah rest karo aur paani piyo. Achanak bahut tez dard, weakness, confusion, ya chot ke baad ho to turant care lo.",
      ta: "அமைதியான இடத்தில் ஓய்வெடுங்கள். திடீர் கடும் தலைவலி, மயக்கம் அல்லது காயத்திற்குப் பின் இருந்தால் உடனே சிகிச்சை பெறுங்கள்.",
      te: "నిశ్శబ్దంగా విశ్రాంతి తీసుకోండి. అకస్మాత్తుగా తీవ్రమైన తలనొప్పి లేదా స్పృహ తప్పితే వెంటనే వైద్యం తీసుకోండి.",
      kn: "ಶಾಂತ ಸ್ಥಳದಲ್ಲಿ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ. ಇದ್ದಕ್ಕಿದ್ದಂತೆ ತೀವ್ರ ನೋವಾದರೆ ತುರ್ತು ಚಿಕಿತ್ಸೆ ಪಡೆಯಿರಿ.",
      bn: "শান্ত জায়গায় বিশ্রাম নিন। হঠাৎ প্রচণ্ড ব্যথা হলে জরুরি চিকিৎসা নিন।",
      mr: "शांत जागी आराम करा. अचानक खूप दुखत असेल तर तातडीने उपचार घ्या."
    }
  },
  {
    id: "stomach",
    symptom: "stomach",
    terms: ["stomach", "pet dard", "pett", "पेट दर्द", "पेट", "வயிற்று", "కడుపు", "ಹೊಟ್ಟೆ", "পেট", "पोट", "loose motion", "ulti", "vomiting", "उल्टी", "dast"],
    summary: {
      en: "Take small sips of oral rehydration. See a doctor if there is blood, severe pain, repeated vomiting, or signs of dehydration.",
      hi: "ओआरएस की छोटी घूँट लें। खून, तेज दर्द, बार-बार उल्टी, या पानी की कमी हो तो डॉक्टर को दिखाएँ।",
      hinglish: "ORS ki chhoti sips lo. Blood, tez dard, baar baar ulti, ya dehydration ho to doctor dikhao.",
      ta: "ORS சிறிது சிறிதாக குடியுங்கள். இரத்தம், கடும் வலி அல்லது மீண்டும் மீண்டும் வாந்தி இருந்தால் மருத்துவரை அணுகுங்கள்.",
      te: "ORS చిన్న సిప్స్ తీసుకోండి. రక్తం లేదా తీవ్రమైన నొప్పి ఉంటే వైద్యుడిని చూడండి.",
      kn: "ORS ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಕುಡಿಯಿರಿ. ರಕ್ತ ಅಥವಾ ತೀವ್ರ ನೋವಿದ್ದರೆ ವೈದ್ಯರನ್ನು ನೋಡಿ.",
      bn: "ORS অল্প অল্প খান। রক্তপাত বা তীব্র ব্যথা হলে ডাক্তারকে দেখান।",
      mr: "ORS छोटे घोट घ्या. रक्त किंवा तीव्र वेदना असल्यास डॉक्टरकडे जा."
    }
  },
  {
    id: "child",
    symptom: "child",
    terms: ["child", "baby", "bachcha", "baccha", "बच्चा", "बच्चे", "குழந்தை", "బిడ్డ", "ಮಗು", "বাচ্চা", "मूल", "infant"],
    summary: {
      en: "For a baby or child, do not give adult doses. A pediatrician should see fever in infants, poor feeding, unusual sleepiness, or fast breathing.",
      hi: "बच्चों को बड़ों की खुराक न दें। शिशु में बुखार, दूध न पीना, असामान्य नींद, या तेज साँस हो तो बाल रोग विशेषज्ञ को दिखाएँ।",
      hinglish: "Bacche ko adult dose mat do. Baby mein fever, doodh na peena, ya tez saans ho to child specialist dikhao.",
      ta: "குழந்தைகளுக்கு பெரியவர் அளவு மருந்து வேண்டாம். குழந்தை காய்ச்சல் அல்லது மூச்சு வேகமாக இருந்தால் குழந்தை மருத்துவரை அணுகுங்கள்.",
      te: "పిల్లలకు పెద్దవారి మోతాదు ఇవ్వకండి. శిశువు జ్వరం లేదా వేగంగా శ్వాస ఉంటే పిల్లల వైద్యుడిని చూడండి.",
      kn: "ಮಕ್ಕಳಿಗೆ ದೊಡ್ಡವರ ಡೋಸ್ ಕೊಡಬೇಡಿ. ಶಿಶುವಿಗೆ ಜ್ವರವಿದ್ದರೆ ಮಕ್ಕಳ ವೈದ್ಯರನ್ನು ನೋಡಿ.",
      bn: "বাচ্চাকে বড়দের ডোজ দেবেন না। শিশুর জ্বর হলে শিশু চিকিৎসককে দেখান।",
      mr: "मुलांना मोठ्यांचा डोस देऊ नका. ताप असल्यास बालरोगतज्ञांकडे जा."
    }
  },
  {
    id: "heart",
    symptom: "heart",
    terms: ["chest pain", "heart", "seene", "सीने में दर्द", "दिल", "நெஞ்சு", "ఛాతీ", "ಎದೆ", "বুকে ব্যথা", "छाती"],
    summary: {
      en: "Chest pain, pressure spreading to the arm or jaw, sweating, or collapse can be an emergency. Call local emergency services now rather than waiting for a clinic slot.",
      hi: "सीने में दर्द, बाँह या जबड़े तक दबाव, पसीना, या गिर पड़ना इमरजेंसी हो सकता है। क्लिनिक स्लॉट का इंतजार न करें, अभी आपातकालीन सेवा को कॉल करें।",
      hinglish: "Chest pain, arm ya jaw tak pressure, sweating, ya collapse emergency ho sakta hai. Clinic ka wait mat karo, abhi emergency call karo.",
      ta: "நெஞ்சு வலி, கை அல்லது தாடைக்கு பரவும் அழுத்தம் அவசரமாக இருக்கலாம். இப்போதே அவசர சேவையை அழைக்கவும்.",
      te: "ఛాతీ నొప్పి అత్యవసరం కావచ్చు. ఇప్పుడే అత్యవసర సేవకు కాల్ చేయండి.",
      kn: "ಎದೆ ನೋವು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಾಗಿರಬಹುದು. ಈಗಲೇ ತುರ್ತು ಸೇವೆಗೆ ಕರೆ ಮಾಡಿ.",
      bn: "বুকে ব্যথা জরুরি হতে পারে। এখনই জরুরি পরিষেবায় ফোন করুন।",
      mr: "छातीत दुखणे आणीबाणी असू शकते. आत्ताच आपत्कालीन सेवेला कॉल करा."
    }
  },
  {
    id: "booking",
    symptom: null,
    terms: ["appointment", "book", "doctor", "अपॉइंटमेंट", "डॉक्टर", "डाक्टर", "மருத்துவர்", "డాక్టర్", "slot", "reminder", "follow"],
    summary: {
      en: "I can check a doctor's open times, book the visit, send a reminder before the appointment, and collect feedback afterwards.",
      hi: "मैं डॉक्टर का खाली समय देख सकती हूँ, विज़िट बुक कर सकती हूँ, अपॉइंटमेंट से पहले रिमाइंडर भेज सकती हूँ, और बाद में प्रतिक्रिया ले सकती हूँ।",
      hinglish: "Main doctor ka khali time check kar sakti hoon, visit book kar sakti hoon, pehle reminder bhej sakti hoon, aur baad mein feedback le sakti hoon.",
      ta: "மருத்துவர் நேரத்தைப் பார்த்து பதிவு செய்து, நினைவூட்டல் அனுப்பி, பிறகு கருத்தையும் பெற முடியும்.",
      te: "నేను డాక్టర్ సమయం చూసి బుక్ చేసి, రిమైండర్ పంపి, తర్వాత అభిప్రాయం తీసుకోగలను.",
      kn: "ವೈದ್ಯರ ಸಮಯ ನೋಡಿ ಬುಕ್ ಮಾಡಿ, ಜ್ಞಾಪನೆ ಕಳುಹಿಸಿ, ನಂತರ ಅಭಿಪ್ರಾಯ ಪಡೆಯಬಹುದು.",
      bn: "আমি ডাক্তারের সময় দেখে বুক করতে পারি, রিমাইন্ডার পাঠাতে পারি, পরে মতামত নিতে পারি।",
      mr: "मी डॉक्टरांची वेळ पाहून बुकिंग करू शकते, रिमाइंडर पाठवू शकते आणि नंतर अभिप्राय घेऊ शकते."
    }
  }
];

function retrieve(text, language, limit = 2) {
  const haystack = String(text || "").toLowerCase();
  const ranked = documents
    .map((document) => {
      const score = document.terms.reduce((total, term) => total + (haystack.includes(term.toLowerCase()) ? term.length : 0), 0);
      return { document, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document, score }) => ({
      id: document.id,
      symptom: document.symptom,
      score,
      text: document.summary[language] || document.summary.en
    }));
  return ranked;
}

module.exports = { documents, retrieve };
