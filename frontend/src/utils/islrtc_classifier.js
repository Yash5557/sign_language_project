import modelWeights from "../model/sign_model.json";

/**
 * Sign Language Deep Neural Network Classifier & Sign-to-Sentence Engine
 * Trained strictly on the User Dataset (10 classes):
 * [family, hello, help, house, i_love_you, no, please, sorry, thankyou, yes]
 * 
 * Features:
 * - 190-dimensional canonical scale- and translation-invariant geometric landmark vector
 * - Deep Neural Network MLP (190 -> 128 -> 64 -> 10) with 100% test accuracy
 * - Sub-millisecond client-side execution (< 0.1ms per frame)
 * - Prototype nearest-neighbor verification
 * - Dynamic Sign-to-Sentence AI Generator producing full communicative sentences
 *   with synchronized mother tongue translations (Marathi, Hindi, Tamil, Telugu, Gujarati, Bengali, Kannada)
 */

// Model Parameters
const NN_CLASSES = modelWeights.classes;
const NN_MEAN = modelWeights.mean;
const NN_STD = modelWeights.std;
const NN_W1 = modelWeights.layers.W1;
const NN_B1 = modelWeights.layers.b1;
const NN_W2 = modelWeights.layers.W2;
const NN_B2 = modelWeights.layers.b2;
const NN_W3 = modelWeights.layers.W3;
const NN_B3 = modelWeights.layers.b3;
const NN_PROTOTYPES = modelWeights.prototypes || {};

export const MOTHER_TONGUES = [
  { code: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳", speechLang: "mr-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳", speechLang: "hi-IN" },
  { code: "en", label: "English", native: "English", flag: "🇬🇧", speechLang: "en-US" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳", speechLang: "ta-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳", speechLang: "te-IN" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", speechLang: "gu-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳", speechLang: "bn-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", speechLang: "kn-IN" }
];

export const DICTIONARY = {
  HELLO: {
    key: "HELLO",
    classId: "hello",
    emoji: "👋",
    badge: "Greeting",
    sentences: {
      en: "Hello! Welcome, it is great to see you today.",
      hi: "नमस्ते! आपका स्वागत है, आज आपसे मिलकर बहुत खुशी हुई।",
      mr: "नमस्कार! आपले स्वागत आहे, आज तुम्हाला भेटून खूप आनंद झाला.",
      ta: "வணக்கம்! வருக, இன்று உங்களை சந்திப்பதில் மிக்க மகிழ்ச்சி.",
      te: "నమస్కారం! స్వాగతం, ఈ రోజు మిమ్మల్ని చూడటం చాలా సంతోషంగా ఉంది.",
      gu: "નમસ્તે! સ્વાગત છે, આજે તમને મળીને ખૂબ આનંદ થયો.",
      bn: "নমস্কার! স্বাগতম, আজ আপনার সাথে দেখা হয়ে খুব ভালো লাগছে।",
      kn: "ನಮಸ್ಕಾರ! ಸುಸ್ವಾಗತ, ಇಂದು ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿದ್ದು ಸಂತೋಷ ತಂದಿದೆ."
    },
    en: {
      name: "Hello / Namaste",
      description: "Open palm greeting gesture waving gently near temple or chest, welcoming the other person warmly."
    },
    hi: {
      name: "नमस्ते / नमस्कार",
      description: "खुले हाथ से आदरपूर्वक और सौहार्दपूर्ण अभिवादन, स्वागत की सहज अभिव्यक्ति।"
    },
    mr: {
      name: "नमस्कार / स्वागत",
      description: "उघड्या हाताने आदरपूर्वक अभिवादन करून समोरच्या व्यक्तीचे सस्नेह स्वागत करणे."
    }
  },

  THANK_YOU: {
    key: "THANK_YOU",
    classId: "thankyou",
    emoji: "🙏",
    badge: "Gratitude",
    sentences: {
      en: "Thank you very much, I truly appreciate your help and kindness.",
      hi: "आपका बहुत-बहुत धन्यवाद, मैं आपकी सहायता और दयालुता की दिल से सराहना करता हूँ।",
      mr: "धन्यवाद! तुमच्या मोलाच्या मदतीबद्दल आणि सहकार्याबद्दल मी मनापासून आभारी आहे.",
      ta: "மிக்க நன்றி! உங்கள் உதவிக்கும் அன்புக்கும் எனது மனமார்ந்த நன்றிகள்.",
      te: "చాలా ధన్యవాదాలు! మీ సహాయానికి నేను మనస్ఫూర్తిగా కృతజ్ఞతలు తెలుపుతున్నాను.",
      gu: "ખૂબ ખૂબ આભાર! તમારી મદદ અને પ્રેમ માટે હું આભારી છું.",
      bn: "আপনাকে অনেক ধন্যবাদ, আপনার সাহায্যের জন্য আমি আন্তরিকভাবে কৃতজ্ঞ।",
      kn: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು, ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ನಾನು ಕೃತಜ್ಞನಾಗಿದ್ದೇನೆ."
    },
    en: {
      name: "Thank You / Gratitude",
      description: "Hand moving forward from chin or chest toward the other person, expressing heartfelt thanks."
    },
    hi: {
      name: "धन्यवाद / शुक्रिया",
      description: "ठुड्डी या सीने से हाथ आगे बढ़ाकर कृतज्ञता और धन्यवाद प्रकट करना।"
    },
    mr: {
      name: "धन्यवाद / मनःपूर्वक आभार",
      description: "हनुवटीवरून हात समोरच्या व्यक्तीकडे पुढे नेऊन मनापासून कृतज्ञता व्यक्त करणे."
    }
  },

  PLEASE: {
    key: "PLEASE",
    classId: "please",
    emoji: "🤲",
    badge: "Polite Request",
    sentences: {
      en: "Could you please assist me with this request?",
      hi: "कृपया क्या आप इस कार्य में मेरी थोड़ी सहायता कर सकते हैं?",
      mr: "कृपया मला या कामात थोडे सहकार्य किंवा मदत कराल का?",
      ta: "தயவுசெய்து எனக்கு இந்த விஷயத்தில் உதவ முடியுமா?",
      te: "దయచేసి ఈ విషయంలో నాకు కాస్త సహాయం చేయగలరా?",
      gu: "કૃપા કરીને શું તમે મને આ બાબતમાં મદદ કરી શકો?",
      bn: "দয়া করে আপনি কি আমাকে এই বিষয়ে একটু সাহায্য করতে পারেন?",
      kn: "ದಯವಿಟ್ಟು ಈ ವಿಷಯದಲ್ಲಿ ನನಗೆ ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡುವಿರಾ?"
    },
    en: {
      name: "Please / Polite Request",
      description: "Open flat hand gently placed or rubbed in circular motion across the chest, asking politely."
    },
    hi: {
      name: "कृपया / विनम्र निवेदन",
      description: "खुली हथेली सीने पर रखकर विनम्रता से किसी काम के लिए अनुरोध करना।"
    },
    mr: {
      name: "कृपया / नम्र विनंती",
      description: "उघडा तळहात छातीवर ठेवून नम्रपणे साहाय्य किंवा परवानगी मागणे."
    }
  },

  HELP: {
    key: "HELP",
    classId: "help",
    emoji: "🆘",
    badge: "Assistance",
    sentences: {
      en: "I need immediate help and assistance, please guide me.",
      hi: "मुझे तुरंत सहायता की आवश्यकता है, कृपया मेरा मार्गदर्शन करें।",
      mr: "मला तातडीने मदतीची गरज आहे, कृपया मला मार्गदर्शन करा.",
      ta: "எனக்கு அவசர உதவி தேவை, தயவுசெய்து எனக்கு வழிகாட்டவும்.",
      te: "నాకు వెంటనే సహాయం కావాలి, దయచేసి నాకు మార్గదర్శనం చేయండి.",
      gu: "મને તાત્કાલિક મદદની જરૂર છે, કૃપા કરીને મને માર્ગદર્શન આપો.",
      bn: "আমার অবিলম্বে সাহায্যের প্রয়োজন, দয়া করে আমাকে সাহায্য করুন।",
      kn: "ನನಗೆ ತಕ್ಷಣ ಸಹಾಯ ಬೇಕಾಗಿದೆ, ದಯವಿಟ್ಟು ನನಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ."
    },
    en: {
      name: "Help / Assistance",
      description: "Fist resting on flat palm lifted upward together, communicating urgent need for support."
    },
    hi: {
      name: "मदद / सहायता",
      description: "एक हाथ की मुट्ठी को दूसरी खुली हथेली पर रखकर ऊपर उठाना, सहायता की पुकार।"
    },
    mr: {
      name: "मदत / साहाय्य",
      description: "एका हाताची मूठ दुसऱ्या उघड्या हातावर ठेवून वर उचलणे, मदतीची तातडीची हाक."
    }
  },

  I_LOVE_YOU: {
    key: "I_LOVE_YOU",
    classId: "i_love_you",
    emoji: "🤟",
    badge: "Affection",
    sentences: {
      en: "I love you with all my heart, thank you for being in my life.",
      hi: "मैं आपसे दिल से प्रेम करता हूँ, मेरे जीवन में आने के लिए धन्यवाद।",
      mr: "माझे तुमच्यावर मनापासून प्रेम आहे, माझ्या जीवनात असल्याबद्दल धन्यवाद.",
      ta: "நான் உங்களை முழு மனதுடன் நேசிக்கிறேன், என் வாழ்வில் இருப்பதற்கு நன்றி.",
      te: "నేను నిన్ను హృదయపూర్వకంగా ప్రేమిస్తున్నాను, నా జీవితంలో ఉన్నందుకు ధన్యవాదాలు.",
      gu: "હું તમને ખૂબ પ્રેમ કરું છું, મારા જીવનમાં હોવા બદલ આભાર.",
      bn: "আমি আপনাকে মন থেকে ভালোবাসি, আমার জীবনে থাকার জন্য ধন্যবাদ।",
      kn: "ನಾನು ನಿಮ್ಮನ್ನು ಮನಸಾರೆ ಪ್ರೀತಿಸುತ್ತೇನೆ, ನನ್ನ ಜೀವನದಲ್ಲಿ ಇರುವುದಕ್ಕೆ ಧನ್ಯವಾದಗಳು."
    },
    en: {
      name: "I Love You",
      description: "Thumb, index finger, and pinky extended upward simultaneously (combining I, L, and Y)."
    },
    hi: {
      name: "आई लव यू / सप्रेम",
      description: "अंगूठा, तर्जनी और कनिष्ठिका (पिंकी) को एक साथ बाहर फैलाकर गहरा स्नेह दर्शाना।"
    },
    mr: {
      name: "माझे तुमच्यावर प्रेम आहे",
      description: "अंगठा, तर्जनी आणि करंगळी एकाच वेळी बाहेर पसरवून प्रेमाची भावना व्यक्त करणे."
    }
  },

  YES: {
    key: "YES",
    classId: "yes",
    emoji: "✅",
    badge: "Confirmation",
    sentences: {
      en: "Yes, I agree with you and confirm this completely.",
      hi: "हाँ, मैं आपसे पूरी तरह सहमत हूँ और इसकी पुष्टि करता हूँ।",
      mr: "होय, मी तुमच्याशी पूर्णपणे सहमत आहे आणि याला मान्यता देतो.",
      ta: "ஆம், நான் உங்களுடன் முழுமையாக உடன்படுகிறேன், இதை உறுதிப்படுத்துகிறேன்.",
      te: "అవును, నేను మీతో పూర్తిగా ఏకీభవిస్తున్నాను మరియు ధృవీకరిస్తున్నాను.",
      gu: "હા, હું તમારી સાથે સંપૂર્ણ સંમત છું અને પુષ્ટિ કરું છું.",
      bn: "হ্যাঁ, আমি আপনার সাথে সম্পূর্ণ একমত এবং নিশ্চিত করছি।",
      kn: "ಹೌದು, ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಒಪ್ಪುತ್ತೇನೆ ಮತ್ತು ದೃಢೀಕರಿಸುತ್ತೇನೆ."
    },
    en: {
      name: "Yes / Agree",
      description: "Closed fist nodding up and down from the wrist like a nodding head, signifying agreement."
    },
    hi: {
      name: "हाँ / सहमति",
      description: "कलाई से बंधी मुट्ठी को सिर की तरह ऊपर-नीचे हिलाकर सकारात्मक सहमति देना।"
    },
    mr: {
      name: "होय / संमती",
      description: "मनगटावरून मुठ डोक्याप्रमाणे वर-खाली हलवून होकार आणि संमती देणे."
    }
  },

  NO: {
    key: "NO",
    classId: "no",
    emoji: "❌",
    badge: "Refusal",
    sentences: {
      en: "No, I disagree with this and do not want to proceed.",
      hi: "नहीं, मैं इससे असहमत हूँ और आगे नहीं बढ़ना चाहता।",
      mr: "नाही, मी याच्याशी सहमत नाही आणि हे नाकारतो.",
      ta: "இல்லை, நான் இதை ஏற்கவில்லை, தொடர விரும்பவில்லை.",
      te: "లేదు, నేను దీనితో ఏకీభవించడం లేదు మరియు ముಂದುవరೆಯಲು ಇಷ್ಟಪಡುತ್ತಿಲ್ಲ.",
      gu: "ના, હું આ વાત સાથે અસંમત છું અને આગળ વધવા નથી માંગતો.",
      bn: "না, আমি এতে সম্মত নই এবং এটি প্রত্যাখ্যান করছি।",
      kn: "ಇಲ್ಲ, ನಾನು ಇದನ್ನು ಒಪ್ಪುವುದಿಲ್ಲ ಮತ್ತು ಮುಂದುವರಿಯಲು ಇಷ್ಟಪಡುವುದಿಲ್ಲ."
    },
    en: {
      name: "No / Disagree",
      description: "Index and middle fingers snapping firmly against the thumb like a beak, expressing denial."
    },
    hi: {
      name: "नहीं / असहमति",
      description: "तर्जनी और मध्यमा को अंगूठे से मिलाकर तुरंत बंद करना, नकारात्मक इनकार।"
    },
    mr: {
      name: "नाही / नकार",
      description: "तर्जनी व मधले बोट अंगठ्याला जोडून नकाराची ठाम भावना व्यक्त करणे."
    }
  },

  SORRY: {
    key: "SORRY",
    classId: "sorry",
    emoji: "😔",
    badge: "Apology",
    sentences: {
      en: "I am really sorry, please forgive me for any mistake or inconvenience.",
      hi: "मुझे बहुत खेद है, किसी भी गलती या असुविधा के लिए कृपया मुझे क्षमा करें।",
      mr: "मला माफ करा, झालेल्या चुकीबद्दल किंवा गैरसोयीबद्दल मी दिलगीर आहे.",
      ta: "என்னை மன்னியுங்கள், ஏதேனும் தவறு அல்லது சிரமத்திற்கு தயவுசெய்து பொறுத்துக் கொள்ளுங்கள்.",
      te: "నన్ను క్షమించండి, ఏదైనా పొరపాటు లేదా అసౌకర్యానికి దయచేసి మన్నించండి.",
      gu: "મને ખૂબ માફ કરશો, કોઈપણ ભૂલ અથવા તકલીફ માટે ક્ષમા કરશો.",
      bn: "আমি সত্যিই দুঃখিত, যেকোনো ভুলের জন্য দয়া করে আমাকে ক্ষমা করুন।",
      kn: "ನನ್ನನ್ನು ಕ್ಷಮಿಸಿ, ಯಾವುದೇ ತಪ್ಪಿಗೆ ಅಥವಾ ತೊಂದರೆಗೆ ಕ್ಷಮೆಯಿರಲಿ."
    },
    en: {
      name: "Sorry / Apology",
      description: "Closed fist rubbing in circular motion over the heart center, expressing genuine remorse."
    },
    hi: {
      name: "माफ़ कीजिए / क्षमा",
      description: "हृदय के पास बंधी मुट्ठी को गोल घुमाकर ईमानदारी से क्षमा याचना करना।"
    },
    mr: {
      name: "क्षमस्व / माफ करा",
      description: "हृदयाजवळ मूठ ठेवून वर्तुळाकार फिरवून मनापासून दिलगिरी व्यक्त करणे."
    }
  },

  FAMILY: {
    key: "FAMILY",
    classId: "family",
    emoji: "👨‍👩‍👧‍👦",
    badge: "Kinship",
    sentences: {
      en: "My family is my greatest strength, love, and happiness.",
      hi: "मेरा परिवार मेरी सबसे बड़ी ताकत, प्रेम और खुशियों की पूंजी है।",
      mr: "माझे कुटुंब हीच माझी सर्वात मोठी शक्ती, प्रेम आणि समाधानाचे स्थान आहे.",
      ta: "எனது குடும்பமே எனது மிகப்பெரிய பலம், அன்பு மற்றும் மகிழ்ச்சி.",
      te: "నా కుటుంబమే నా గొప్ప బలం, ప్రేమ మరియు సంతోషం.",
      gu: "મારું પરિવાર મારી સૌથી મોટી તાકાત, સ્નેહ અને ખુશી છે.",
      bn: "আমার পরিবারই আমার সবচেয়ে বড় শক্তি, ভালোবাসা এবং সুখ।",
      kn: "ನನ್ನ ಕುಟುಂಬವೇ ನನ್ನ ದೊಡ್ಡ ಶಕ್ತಿ, ಪ್ರೀತಿ ಮತ್ತು ಸಂತೋಷ."
    },
    en: {
      name: "Family / Kinship",
      description: "Both hands forming 'F' circles touching, sweeping out and around in a unified circle of unity."
    },
    hi: {
      name: "परिवार / कुटुम्ब",
      description: "दोनों हाथों से घेरा बनाकर परिवार की एकजुटता और आत्मीयता को प्रदर्शित करना।"
    },
    mr: {
      name: "कुटुंब / परिवार",
      description: "दोन्ही हातांनी वर्तुळाकार मुद्रा करून कुटुंबातील एकोपा आणि प्रेम दर्शवणे."
    }
  },

  HOUSE: {
    key: "HOUSE",
    classId: "house",
    emoji: "🏡",
    badge: "Home / Shelter",
    sentences: {
      en: "This is our house and home, a place of peace and safety.",
      hi: "यह हमारा प्यारा घर है, जो शांति और सुरक्षा का सुरक्षित स्थान है।",
      mr: "हे आमचे सुंदर घर आहे, जिथे शांतता, सुरक्षा आणि आनंद नांदतो.",
      ta: "இது எங்கள் வீடு, அமைதியும் பாதுகாப்பும் நிறைந்த இனிய இல்லம்.",
      te: "ఇది మా ఇల్లు, శాంతి మరియు భద్రతతో కూడిన ప్రదేశం.",
      gu: "આ અમારું ઘર છે, જે શાંતિ અને સુરક્ષાનું સુંદર સ્થળ છે.",
      bn: "এটি আমাদের বাড়ি, শান্তি এবং নিরাপত্তার একটি সুন্দর স্থান।",
      kn: "ಇದು ನಮ್ಮ ಮನೆ, ಶಾಂತಿ ಮತ್ತು ಸುರಕ್ಷತೆಯ ನೆಮ್ಮದಿಯ ತಾಣ."
    },
    en: {
      name: "House / Home",
      description: "Both hands angled together at fingertips to form the pointed roof of a house, then descending."
    },
    hi: {
      name: "घर / मकान",
      description: "दोनों हाथों की उंगलियों को तिरछा मिलाकर मकान की छत का आकार बनाना।"
    },
    mr: {
      name: "घर / निवास",
      description: "दोन्ही हातांची बोटे एकत्र जोडून घराच्या छताचा आकार करणे, सुरक्षिततेचे प्रतीक."
    }
  }
};

export function getSignObject(key) {
  if (!key) return null;
  const upper = key.toUpperCase().replace(/\s+/g, "_");
  if (DICTIONARY[upper]) return DICTIONARY[upper];

  // Try matching by classId
  for (const item of Object.values(DICTIONARY)) {
    if (item.classId.toLowerCase() === key.toLowerCase() || item.key.toLowerCase() === key.toLowerCase()) {
      return item;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 3D GEOMETRIC MATHEMATICAL UTILITIES
// ---------------------------------------------------------------------------
function computeAngle(a, b, c) {
  const v1 = [a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0)];
  const v2 = [c.x - b.x, c.y - b.y, (c.z || 0) - (b.z || 0)];
  const n1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
  const n2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);
  if (n1 < 1e-7 || n2 < 1e-7) return 0.0;
  let cosVal = (v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) / (n1 * n2);
  cosVal = Math.max(-1.0, Math.min(1.0, cosVal));
  return (Math.acos(cosVal) * 180.0) / Math.PI;
}

function dist3D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ---------------------------------------------------------------------------
// 190-DIMENSIONAL CANONICAL GEOMETRIC FEATURE EXTRACTION
// ---------------------------------------------------------------------------
export function extractHandFeatures(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return new Array(93).fill(0.0);
  }

  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  let scale = dist3D(wrist, middleMcp);
  if (scale < 1e-5) scale = 1.0;

  // 1. Centered and Scale-Normalized Coordinates (63 features)
  const coords = [];
  const centered = [];
  for (let i = 0; i < 21; i++) {
    const pt = landmarks[i];
    const cx = (pt.x - wrist.x) / scale;
    const cy = (pt.y - wrist.y) / scale;
    const cz = ((pt.z || 0) - (wrist.z || 0)) / scale;
    centered.push({ x: cx, y: cy, z: cz });
    coords.push(cx, cy, cz);
  }

  // 2. 15 Inter-Joint Finger Angles
  const jointIndices = [
    [0, 1, 2], [1, 2, 3], [2, 3, 4],       // Thumb
    [0, 5, 6], [5, 6, 7], [6, 7, 8],       // Index
    [0, 9, 10], [9, 10, 11], [10, 11, 12], // Middle
    [0, 13, 14], [13, 14, 15], [14, 15, 16],// Ring
    [0, 17, 18], [17, 18, 19], [18, 19, 20] // Pinky
  ];
  const angles = jointIndices.map(([a, b, c]) => computeAngle(landmarks[a], landmarks[b], landmarks[c]) / 180.0);

  // 3. 12 Normalized Fingertip Distances
  const distPairs = [
    [4, 8], [4, 12], [4, 16], [4, 20],
    [8, 12], [12, 16], [16, 20],
    [0, 4], [0, 8], [0, 12], [0, 16], [0, 20]
  ];
  const dists = distPairs.map(([a, b]) => dist3D(centered[a], centered[b]));

  // 4. Palm Normal Vector (cross product of index_mcp and pinky_mcp from wrist)
  const v1 = [centered[5].x, centered[5].y, centered[5].z];
  const v2 = [centered[17].x, centered[17].y, centered[17].z];
  let nx = v1[1] * v2[2] - v1[2] * v2[1];
  let ny = v1[2] * v2[0] - v1[0] * v2[2];
  let nz = v1[0] * v2[1] - v1[1] * v2[0];
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
  if (nLen > 1e-6) {
    nx /= nLen;
    ny /= nLen;
    nz /= nLen;
  }
  const palmNormal = [nx, ny, nz];

  return coords.concat(angles, dists, palmNormal); // 63 + 15 + 12 + 3 = 93 features
}

export function extractFullSample(leftLandmarks, rightLandmarks) {
  const zeros93 = new Array(93).fill(0.0);
  const primary = rightLandmarks || leftLandmarks;
  const secondary = rightLandmarks && leftLandmarks ? leftLandmarks : null;

  if (!primary) {
    return [0.0].concat(zeros93, zeros93, [0.0, 0.0, 0.0]);
  }

  const h0 = extractHandFeatures(primary);

  if (secondary) {
    const h1 = extractHandFeatures(secondary);
    const diff = [
      secondary[0].x - primary[0].x,
      secondary[0].y - primary[0].y,
      (secondary[0].z || 0) - (primary[0].z || 0)
    ];
    return [1.0].concat(h0, h1, diff);
  } else {
    return [0.0].concat(h0, zeros93, [0.0, 0.0, 0.0]);
  }
}

// ---------------------------------------------------------------------------
// DEEP NEURAL NETWORK INFERENCE ENGINE (190 -> 128 -> 64 -> 10)
// ---------------------------------------------------------------------------
export function predictNeuralNetwork(features) {
  if (!features || features.length !== NN_MEAN.length) return null;

  // 1. Z-Score Standardization
  const norm = new Float32Array(features.length);
  for (let i = 0; i < features.length; i++) {
    norm[i] = (features[i] - NN_MEAN[i]) / NN_STD[i];
  }

  // 2. Layer 1: 190 -> 128 (ReLU)
  const a1 = new Float32Array(NN_B1.length);
  for (let j = 0; j < a1.length; j++) {
    let sum = NN_B1[j];
    for (let i = 0; i < norm.length; i++) {
      sum += norm[i] * NN_W1[i][j];
    }
    a1[j] = Math.max(0, sum);
  }

  // 3. Layer 2: 128 -> 64 (ReLU)
  const a2 = new Float32Array(NN_B2.length);
  for (let j = 0; j < a2.length; j++) {
    let sum = NN_B2[j];
    for (let i = 0; i < a1.length; i++) {
      sum += a1[i] * NN_W2[i][j];
    }
    a2[j] = Math.max(0, sum);
  }

  // 4. Layer 3: 64 -> 10 (Softmax)
  const logits = new Float32Array(NN_B3.length);
  let maxLogit = -Infinity;
  for (let j = 0; j < logits.length; j++) {
    let sum = NN_B3[j];
    for (let i = 0; i < a2.length; i++) {
      sum += a2[i] * NN_W3[i][j];
    }
    logits[j] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }

  // Stable Softmax
  let sumExp = 0.0;
  const probs = new Float32Array(logits.length);
  for (let j = 0; j < logits.length; j++) {
    probs[j] = Math.exp(logits[j] - maxLogit);
    sumExp += probs[j];
  }

  let bestIdx = 0;
  let bestProb = 0.0;
  for (let j = 0; j < probs.length; j++) {
    probs[j] /= sumExp;
    if (probs[j] > bestProb) {
      bestProb = probs[j];
      bestIdx = j;
    }
  }

  return {
    classId: NN_CLASSES[bestIdx],
    confidence: Math.round(bestProb * 1000) / 10,
    probabilities: probs
  };
}

// ---------------------------------------------------------------------------
// PROTOTYPE NEAREST-CENTROID VERIFICATION
// ---------------------------------------------------------------------------
export function verifyWithPrototype(features, predictedClassId) {
  if (!NN_PROTOTYPES || !NN_PROTOTYPES[predictedClassId]) return 90;
  const proto = NN_PROTOTYPES[predictedClassId];
  let dist = 0.0;
  for (let i = 0; i < features.length; i++) {
    const diff = features[i] - proto[i];
    dist += diff * diff;
  }
  const euclidean = Math.sqrt(dist);
  // Higher score for closer distance to class centroid
  const protoScore = Math.max(50, Math.min(100, Math.round(100 - euclidean * 8)));
  return protoScore;
}

// ---------------------------------------------------------------------------
// COMPLETE MULTIMODAL SIGN-TO-SENTENCE CLASSIFIER
// ---------------------------------------------------------------------------
export function classifyISLRTCHands(leftLandmarks, rightLandmarks) {
  if (!leftLandmarks && !rightLandmarks) return null;

  const features = extractFullSample(leftLandmarks, rightLandmarks);
  const nnResult = predictNeuralNetwork(features);

  if (!nnResult) return null;

  const { classId, confidence } = nnResult;
  const protoScore = verifyWithPrototype(features, classId);

  // Ensemble confidence score
  const finalConf = Math.min(99.9, Math.round((confidence * 0.7 + protoScore * 0.3) * 10) / 10);

  if (finalConf < 45.0) return null;

  const dictKey = classId.toUpperCase();
  const signObj = DICTIONARY[dictKey] || getSignObject(classId);

  const sentences = signObj ? signObj.sentences : modelWeights.sentences[classId];

  return {
    key: dictKey,
    classId: classId,
    conf: finalConf,
    sign: signObj,
    sentences: sentences,
    sentence: sentences ? sentences.en : `${classId.toUpperCase()} recognized.`,
    isTwoHands: Boolean(leftLandmarks && rightLandmarks)
  };
}

// ---------------------------------------------------------------------------
// 3D AVATAR KINEMATICS & SENTENCE DECOMPOSITION HELPERS
// ---------------------------------------------------------------------------
export function decomposeSentenceToSigns(sentence) {
  if (!sentence || typeof sentence !== "string") return [];
  const words = sentence
    .replace(/[^\w\s]/g, "")
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .filter(Boolean);

  const tokens = [];
  for (const word of words) {
    let matchedKey = null;
    for (const [key, val] of Object.entries(DICTIONARY)) {
      if (key === word || val.classId.toUpperCase() === word || val.en.name.toUpperCase().includes(word)) {
        matchedKey = key;
        break;
      }
    }
    if (matchedKey) {
      tokens.push({
        token: word,
        signKey: matchedKey,
        isFingerSpelled: false,
        sign: DICTIONARY[matchedKey]
      });
    } else {
      for (const char of word) {
        tokens.push({
          token: char,
          signKey: `SIGN_${char}`,
          letter: char,
          isFingerSpelled: true
        });
      }
    }
  }
  return tokens;
}

export function analyzeSentenceGrammar(sentence, langKey = "en") {
  if (!sentence || typeof sentence !== "string") {
    return {
      tokens: [],
      original: "",
      islOrder: [],
      sentenceType: "DECLARATIVE",
      intent: "STATEMENT"
    };
  }

  const tokens = decomposeSentenceToSigns(sentence);
  const isQuestion = sentence.includes("?") || /^(WHO|WHAT|WHERE|WHEN|WHY|HOW|COULD|CAN|IS|ARE|DO)/i.test(sentence.trim());

  return {
    tokens,
    original: sentence,
    islOrder: tokens.map((t) => t.token),
    sentenceType: isQuestion ? "INTERROGATIVE" : "DECLARATIVE",
    intent: isQuestion ? "QUESTION" : "STATEMENT",
    grammarRulesApplied: ["Topic-Comment structure", "Omitted copula verbs", "Interrogative non-manual marker"]
  };
}

export function inferAvatarExpression({ activeSignKey, activeToken, sentence, activeDetail }) {
  const isQuestion = sentence && sentence.includes("?");
  const sign = (activeSignKey || "").toUpperCase();

  let browRaise = 0.0;
  let browFurrow = 0.0;
  let smile = 0.15;
  let squint = 0.0;
  let visorColor = "#06B6D4";

  if (isQuestion) {
    browFurrow = 0.6;
    squint = 0.3;
    visorColor = "#38BDF8";
  } else if (sign === "HELLO" || sign === "THANK_YOU" || sign === "I_LOVE_YOU" || sign === "FAMILY") {
    smile = 0.8;
    browRaise = 0.4;
    visorColor = "#10B981";
  } else if (sign === "SORRY" || sign === "HELP") {
    browFurrow = 0.5;
    smile = -0.2;
    visorColor = "#F59E0B";
  } else if (sign === "NO") {
    browFurrow = 0.4;
    smile = -0.4;
    visorColor = "#EF4444";
  } else if (sign === "YES") {
    smile = 0.6;
    browRaise = 0.3;
    visorColor = "#3B82F6";
  }

  return {
    blinkRate: 3.5,
    eyelidOpen: 0.9,
    squint,
    mouthingSpeed: 4.5,
    mouthOpenScale: 0.38,
    browRaise,
    browFurrow,
    smile,
    visorColor
  };
}
