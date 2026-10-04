import React, { useState } from "react";
import {
  BookOpenIcon,
  SearchIcon,
  CheckCircleIcon,
  SparklesIcon,
  AudioIcon,
  TranslateIcon,
  TargetIcon,
  AwardIcon,
  FlameIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  HeartIcon,
  UsersIcon,
  ExternalLinkIcon,
  DownloadIcon,
  FileTextIcon,
  GraduationCapIcon
} from "./components/Icons";

export default function DictionaryScreen({ currentLang = "en", onSelectMode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSignKey, setActiveSignKey] = useState("HELLO");
  const [practiceScore, setPracticeScore] = useState(95);
  const [isPracticing, setIsPracticing] = useState(false);
  const [showEbooksModal, setShowEbooksModal] = useState(false);

  // Standardized Curriculum for learning Sign Language to communicate with deaf & mute persons
  const SIGNS = [
    {
      id: "HELLO",
      emoji: "👋",
      category: "greetings",
      difficulty: "Beginner",
      en: {
        name: "Hello / Namaste",
        motion: "Raise open flat hand near temple level, palm facing outward, and gently wave sideways toward the person.",
        tip: "Always maintain eye contact and offer a welcoming smile when greeting deaf individuals."
      },
      hi: {
        name: "नमस्ते / नमस्कार (Namaste)",
        motion: "दाहिना हाथ सिर या कंधे के स्तर पर उठाएं, हथेली सामने रखें और आत्मीयता से हिलाएं।",
        tip: "सांकेतिक भाषा में बातचीत शुरू करते समय आंखों का संपर्क और गर्मजोशी भरा चेहरा महत्वपूर्ण है।"
      },
      mr: {
        name: "नमस्कार (Namaskar)",
        motion: "उजवा हात खांद्याजवळ वर करा, तळहात समोर ठेवा आणि हळूवार बाजूला हलवा.",
        tip: "संवाद साधताना चेहऱ्यावर आदरयुक्त हास्य आणि डोळ्यांचा थेट संपर्क ठेवा."
      },
      etiquette: "Standard opening greeting across Indian Sign Language (ISL)."
    },
    {
      id: "THANK_YOU",
      emoji: "🙏",
      category: "greetings",
      difficulty: "Beginner",
      en: {
        name: "Thank You",
        motion: "Place open fingertips gently against your chin or lips, then move hand forward and downward toward the other person.",
        tip: "A slight head nod while extending the hand deepens the expression of gratitude."
      },
      hi: {
        name: "धन्यवाद / शुक्रिया (Dhanyawad)",
        motion: "उंगलियों को ठुड्डी या होंठों से स्पर्श करें, फिर हथेली को सामने वाले व्यक्ति की ओर आगे बढ़ाएं।",
        tip: "हाथ आगे बढ़ाते समय हल्का सा सिर झुकाना कृतज्ञता को और अधिक स्पष्ट करता है।"
      },
      mr: {
        name: "धन्यवाद (Dhanyawad)",
        motion: "बोटांनी हनुवटीला किंवा ओठांना स्पर्श करा आणि हात समोरच्या व्यक्तीकडे पुढे न्या.",
        tip: "हात पुढे नेताना मान किंचित लववून कृतज्ञता व्यक्त करा."
      },
      etiquette: "Expresses warm appreciation in social and daily interactions."
    },
    {
      id: "PLEASE",
      emoji: "🤲",
      category: "greetings",
      difficulty: "Beginner",
      en: {
        name: "Please",
        motion: "Place flat open palm over center of chest, make a gentle clockwise circular rubbing movement.",
        tip: "A sincere, calm facial expression shows politeness and patience."
      },
      hi: {
        name: "कृपया (Kripya)",
        motion: "खुली हथेली को छाती के बीच में रखें और दक्षिणावर्त (clockwise) दिशा में गोल घुमाएं।",
        tip: "विनम्र चेहरे के भाव के साथ यह मुद्रा अत्यंत सम्मानजनक मानी जाती है।"
      },
      mr: {
        name: "कृपया (Krupaya)",
        motion: "उघडा तळहात छातीच्या मध्यभागी ठेवा आणि हळूवार वर्तुळाकार फिरवा.",
        tip: "शांत व आदरयुक्त चेहऱ्याने विनंती दर्शवा."
      },
      etiquette: "Used when requesting assistance or cooperation politely."
    },
    {
      id: "WATER",
      emoji: "💧",
      category: "needs",
      difficulty: "Beginner",
      en: {
        name: "Water",
        motion: "Form a 'W' shape using index, middle, and ring fingers extended upward, tap index finger against lower lip twice.",
        tip: "Essential sign for drinking water; universally recognized across deaf communities."
      },
      hi: {
        name: "पानी / जल (Paani)",
        motion: "तीन अंगुलियों (तर्जनी, मध्यमा, अनामिका) से 'W' बनाएं और होंठों पर दो बार हल्के से स्पर्श करें।",
        tip: "दैनिक जीवन में प्यास या पानी की आवश्यकता व्यक्त करने के लिए अत्यंत महत्वपूर्ण संकेत।"
      },
      mr: {
        name: "पाणी (Paani)",
        motion: "तीन बोटे (तर्जनी, मधले, अनामिका) वर करून 'W' आकार करा आणि खालच्या ओठांवर दोनदा स्पर्श करा.",
        tip: "दैनंदिन संवादातील पिण्याच्या पाण्यासाठी मूलभूत आणि अत्यावश्यक संकेत."
      },
      etiquette: "Crucial daily living sign for caregivers and family members."
    },
    {
      id: "FOOD",
      emoji: "🍲",
      category: "needs",
      difficulty: "Beginner",
      en: {
        name: "Food / Hungry",
        motion: "Bring all fingertips together touching the thumb (O-shape) and tap tips gently toward lips twice.",
        tip: "Represents bringing food to the mouth; universally intuitive."
      },
      hi: {
        name: "भोजन / खाना (Khaana)",
        motion: "सभी अंगुलियों के पोरों को अंगूठे से मिलाकर मुंह के पास दो बार ले जाएं।",
        tip: "भूख लगने या भोजन की पेशकश करने के लिए सरल व स्पष्ट संकेत।"
      },
      mr: {
        name: "जेवण / अन्न (Jevan)",
        motion: "सर्व बोटांची टोके अंगठ्याला जोडून तोंडाजवळ दोनदा हळूच आणा.",
        tip: "भूक लागल्याचे किंवा जेवणाची वेळ झाल्याचे दर्शवणारा सोपा संकेत."
      },
      etiquette: "Vital for basic daily needs and mealtime communication."
    },
    {
      id: "HELP",
      emoji: "🤝",
      category: "needs",
      difficulty: "Intermediate",
      en: {
        name: "Help / Support",
        motion: "Place closed fist with thumb point up onto flat open left palm, and lift both hands upward together.",
        tip: "Symbolizes lifting and supporting another person; direction can indicate helping me or you."
      },
      hi: {
        name: "मदद / सहायता (Madad)",
        motion: "उठे हुए अंगूठे वाली मुट्ठी को बाईं खुली हथेली पर रखें और दोनों हाथों को एक साथ ऊपर उठाएं।",
        tip: "यह संकेत किसी को सहारा देने का प्रतीक है; दोनों हाथों का तालमेल सही रखें।"
      },
      mr: {
        name: "मदत / आधार (Madat)",
        motion: "अंगठा वर असलेली मूठ डाव्या उघड्या तळहातावर ठेवा आणि दोन्ही हात एकत्र वर उचला.",
        tip: "दुसऱ्याला आधार देण्याचे सुंदर प्रतीक; दिशा बदलून मदत हवी की करायची ते समजते."
      },
      etiquette: "Emergency and daily support gesture essential for community care."
    },
    {
      id: "YES",
      emoji: "👍",
      category: "conversations",
      difficulty: "Beginner",
      en: {
        name: "Yes / Agreement",
        motion: "Form a soft fist with thumb resting alongside, nod wrist up and down twice smoothly.",
        tip: "Mimics the natural affirmative nodding of a head."
      },
      hi: {
        name: "हाँ / सहमत (Haan)",
        motion: "हल्की मुट्ठी बनाएं और कलाई को सिर हिलाने की तरह दो बार ऊपर-नीचे झुकाएं।",
        tip: "स्वीकृति दर्शाने के लिए सिर के हल्के सकारात्मक संकेत के साथ दोहराएं।"
      },
      mr: {
        name: "होय / संमती (Hoy)",
        motion: "मूठ तयार करा आणि मनगट डोके हलवल्यासारखे दोनदा वर-खाली लववा.",
        tip: "संमती दर्शवण्यासाठी डोक्याच्या होकारार्थी हालचालीसह वापरा."
      },
      etiquette: "Core conversational response for confirmation."
    },
    {
      id: "NO",
      emoji: "🙅",
      category: "conversations",
      difficulty: "Beginner",
      en: {
        name: "No / Disagreement",
        motion: "Extend index and middle finger horizontally, snap them downward against thumb twice.",
        tip: "A crisp, definitive double pinch movement with a gentle head shake."
      },
      hi: {
        name: "नहीं / असहमत (Nahi)",
        motion: "तर्जनी और मध्यमा उंगली को अंगूठे के साथ मिलाकर दो बार नीचे की ओर चुटकी की तरह दबाएं।",
        tip: "अस्वीकृति या 'ना' कहने के लिए सिर को धीरे से दाएं-बाएं हिलाएं।"
      },
      mr: {
        name: "नाही (Nahi)",
        motion: "तर्जनी आणि मधले बोट अंगठ्यासह दोनदा हळूवार खाली दाबा.",
        tip: "नकार दर्शवताना मान किंचित डावी-उजवीकडे हलवा."
      },
      etiquette: "Clear negative response to clarify misunderstandings."
    },
    {
      id: "DOCTOR",
      emoji: "🩺",
      category: "emergency",
      difficulty: "Intermediate",
      en: {
        name: "Doctor / Medical",
        motion: "Tap index and middle fingertips of right hand onto inside of left wrist, like checking a pulse.",
        tip: "Universally understood sign indicating sickness, doctor, or need for medical attention."
      },
      hi: {
        name: "डॉक्टर / दवा (Doctor)",
        motion: "दाहिने हाथ की दो अंगुलियों से बाईं कलाई की नाड़ी को दो बार छुएं (पल्स जांचने की तरह)।",
        tip: "बीमारी, चोट या डॉक्टर की तत्काल आवश्यकता के लिए यह प्राथमिक संकेत है।"
      },
      mr: {
        name: "डॉक्टर / औषधोपचार (Doctor)",
        motion: "उजव्या हाताच्या दोन बोटांनी डाव्या मनगटाची नाडी दोनदा हळूच तपासा.",
        tip: "आजारी असल्यावर किंवा वैद्यकीय मदतीची गरज असताना महत्त्वाचा संकेत."
      },
      etiquette: "Critical healthcare and emergency communication sign."
    },
    {
      id: "RESTROOM",
      emoji: "🚻",
      category: "needs",
      difficulty: "Beginner",
      en: {
        name: "Toilet / Restroom",
        motion: "Form letter 'T' with thumb tucked between index and middle fingers, shake hand gently side-to-side.",
        tip: "Standard respectful sign for finding or needing a restroom."
      },
      hi: {
        name: "शौचालय / प्रसाधन (Restroom)",
        motion: "अंगूठे को तर्जनी और मध्यमा के बीच रखकर 'T' आकार बनाएं और हाथ को धीरे से दाएं-बाएं हिलाएं।",
        tip: "सार्वजनिक या घरेलू स्थानों पर प्रसाधन गृह पूछने का मानक संकेत।"
      },
      mr: {
        name: "शौचालय (Restroom)",
        motion: "अंगठा तर्जनी व मधल्या बोटाच्या मध्ये ठेवून हात किंचित बाजूला हलवा.",
        tip: "प्रसाधनगृह कुठे आहे हे आदरपूर्वक विचारण्यासाठी वापरला जाणारा संकेत."
      },
      etiquette: "High-priority basic accessibility sign."
    }
  ];

  // Official handicap sign language e-books, teaching handbooks & government digital curricula
  const EBOOKS_RESOURCES = [
    {
      id: "islrtc-portal",
      title: "ISLRTC Official Indian Sign Language Digital Handbook & Dictionary",
      titleHi: "ISLRTC आधिकारिक भारतीय सांकेतिक भाषा डिजिटल हैंडबुक व शब्दकोश",
      titleMr: "ISLRTC अधिकृत भारतीय सांकेतिक भाषा डिजिटल हँडबुक आणि शब्दकोश",
      author: "ISLRTC · Ministry of Social Justice & Empowerment, Govt. of India",
      desc: "Standardized 10,000+ sign video vocabulary & handbook spanning everyday communication, healthcare, legal terms, and education for handicap accessibility.",
      descHi: "मूक-बधिरों हेतु 10,000+ शब्दों का राष्ट्रीय डिजिटल शब्दकोश व हैंडबुक—दैनिक संवाद, स्वास्थ्य, विधिक व शैक्षणिक शब्दावली सहित।",
      descMr: "कर्णबधिरांसाठी 10,000+ शब्दांचा अधिकृत डिजिटल शब्दकोश आणि हँडबुक—दैनंदिन संवाद, आरोग्य आणि शिक्षणासाठी.",
      badge: "Govt. of India Official",
      tag: "Dictionary & Handbook",
      url: "https://www.islrtc.nic.in/"
    },
    {
      id: "ncert-diksha",
      title: "NCERT & ISLRTC Standardized ISL E-Books & Textbooks",
      titleHi: "NCERT व ISLRTC प्रमाणित सांकेतिक भाषा डिजिटल ई-बुक्स (दीक्षा पोर्टल)",
      titleMr: "NCERT आणि ISLRTC प्रमाणित सांकेतिक भाषा डिजिटल ई-पुस्तके (दीक्षा पोर्टल)",
      author: "NCERT & Ministry of Education, Govt. of India",
      desc: "Complete digital school textbooks and learning material for Classes 1–12 adapted into Indian Sign Language videos and digital e-content on DIKSHA.",
      descHi: "कक्षा 1 से 12 तक की संपूर्ण NCERT पाठ्यपुस्तकें भारतीय सांकेतिक भाषा में डिजिटल ई-बुक्स व वीडियो रूप में उपलब्ध।",
      descMr: "इयत्ता 1 ली ते 12 वी साठी NCERT ची सर्व पुस्तके भारतीय सांकेतिक भाषेत डिजिटल ई-पुस्तकांच्या स्वरूपात उपलब्ध.",
      badge: "DIKSHA Educational Portal",
      tag: "Curriculum E-Books",
      url: "https://diksha.gov.in/"
    },
    {
      id: "sugamya-pustakalaya",
      title: "Sugamya Pustakalaya: National Accessible Digital Library",
      titleHi: "सुगम्य पुस्तकालय: दिव्यांगजनों हेतु राष्ट्रीय ऑनलाइन ई-लाइब्रेरी",
      titleMr: "सुगम्य पुस्तकालय: दिव्यांग व्यक्तींसाठी राष्ट्रीय ऑनलाइन ई-ग्रंथालय",
      author: "DEPwD (Govt. of India) & Daisy Forum of India",
      desc: "India's premier online library offering accessible e-books, study materials, and handicap learning resources for persons with print and hearing disabilities.",
      descHi: "दिव्यांग व्यक्तियों हेतु भारत का सबसे बड़ा ऑनलाइन पुस्तकालय—हजारों सुगम्य ई-बुक्स और अध्ययन सामग्री उपलब्ध।",
      descMr: "दिव्यांग व्यक्तींसाठी भारतातील सर्वात मोठी ऑनलाइन लायब्ररी—हजारो सुगम्य ई-पुस्तके व शैक्षणिक साहित्य उपलब्ध.",
      badge: "Sugamya Bharat Abhiyan",
      tag: "Accessible Library",
      url: "https://sugamyapustakalaya.in/"
    },
    {
      id: "wfd-resources",
      title: "World Federation of the Deaf (WFD) Universal Learning Toolkit",
      titleHi: "विश्व बधिर संघ (WFD) वैश्विक सांकेतिक भाषा शिक्षण टूलकिट",
      titleMr: "जागतिक कर्णबधिर संघ (WFD) आंतरराष्ट्रीय सांकेतिक भाषा टूलकिट",
      author: "World Federation of the Deaf · UN CRPD Partner",
      desc: "Global open guidelines, human rights handbooks, and inclusive deaf communication standards recognizing sign languages as full natural languages.",
      descHi: "सांकेतिक भाषा को प्राकृतिक भाषा के रूप में मान्यता देने वाली अंतरराष्ट्रीय मार्गदर्शिका, मानव अधिकार हैंडबुक व शिक्षण टूलकिट।",
      descMr: "सांकेतिक भाषेला पूर्ण मान्यता देणारे आंतरराष्ट्रीय मार्गदर्शक तत्त्वे, मानवाधिकार हँडबुक आणि शिक्षण साहित्य.",
      badge: "Global Standard",
      tag: "Global Guidelines",
      url: "https://wfdeaf.org/"
    },
    {
      id: "depwd-schemes",
      title: "DEPwD Disability Empowerment Handbooks & Guidelines",
      titleHi: "दिव्यांगजन सशक्तिकरण विभाग (DEPwD) हैंडबुक व मार्गदर्शिका",
      titleMr: "दिव्यांग व्यक्ती सक्षमीकरण विभाग (DEPwD) हँडबुक व मार्गदर्शक तत्त्वे",
      author: "Department of Empowerment of Persons with Disabilities, Govt. of India",
      desc: "Official government policy documentation, accessibility frameworks, and rehabilitation literature for handicap inclusion and sign accessibility.",
      descHi: "दिव्यांगजन समावेशिता, सांकेतिक भाषा संवर्धन और पुनर्वास हेतु भारत सरकार के आधिकारिक नीतिगत दस्तावेज व मार्गदर्शिका।",
      descMr: "दिव्यांग व्यक्तींचा समावेश आणि सांकेतिक भाषा प्रसारासाठी भारत सरकारची अधिकृत मार्गदर्शक तत्त्वे.",
      badge: "National Guidelines",
      tag: "Handicap Welfare",
      url: "https://depwd.gov.in/"
    }
  ];

  const UI_TEXT = {
    en: {
      title: "Learn Sign Language",
      subtitle: "Interactive learning curriculum to understand and practice Indian Sign Language (ISL) to communicate fluently with deaf and mute persons.",
      searchPlaceholder: "Search signs (e.g. Hello, Thank You, Water, Doctor, Help)...",
      all: "All Signs",
      greetings: "Greetings",
      needs: "Essential Needs",
      conversations: "Daily Conversations",
      emergency: "Emergency & Health",
      btnPractice: "Practice Live with Camera",
      btnAvatar: "Preview in 3D Avatar",
      motionGuide: "Step-by-Step Hand & Motion Guide:",
      proTip: "Deaf Communication & Etiquette Tip:",
      statusValidated: "ISL Standard",
      testLiveScore: "Learning Pose Verification Score",
      targetPrompt: "Learn and perform this hand shape:",
      btnEbooks: "Sign E-Books & Handbooks",
      bannerEbooksTitle: "Handicap Sign Language E-Books & Resources",
      bannerEbooksDesc: "Official Government of India (ISLRTC, NCERT, DEPwD) and global digital handbooks to learn handicap sign language.",
      bannerBtnExplore: "Browse All E-Books (5 Portals)",
      ebookModalTitle: "Sign Language E-Books & Accessible Curriculum",
      ebookModalSubtitle: "Direct access to official e-books, teaching handbooks, and digital libraries for learning handicap sign language.",
      openPortal: "Open Official E-Book Portal",
      closeModal: "Close"
    },
    hi: {
      title: "सांकेतिक भाषा सीखें (Learn Sign Language)",
      subtitle: "मूक व बधिर व्यक्तियों से आत्मीयता से संवाद करने के लिए भारतीय सांकेतिक भाषा (ISL) सीखने का संवादात्मक माध्यम।",
      searchPlaceholder: "संकेत खोजें (उदा. नमस्ते, धन्यवाद, पानी, डॉक्टर, मदद)...",
      all: "सभी संकेत",
      greetings: "अभिवादन",
      needs: "दैनिक आवश्यकताएं",
      conversations: "दैनिक बातचीत",
      emergency: "आपातकाल व स्वास्थ्य",
      btnPractice: "कैमरा के साथ अभ्यास करें",
      btnAvatar: "3D अवतार में देखें",
      motionGuide: "चरण-दर-चरण हस्त मुद्रा निर्देश:",
      proTip: "मूक-बधिर संवाद सुझाव व शिष्टाचार:",
      statusValidated: "प्रमाणित ISL",
      testLiveScore: "मुद्रा मिलान स्कोर",
      targetPrompt: "यह हस्त मुद्रा सीखें और दोहराएं:",
      btnEbooks: "सांकेतिक भाषा ई-बुक्स व हैंडबुक",
      bannerEbooksTitle: "दिव्यांग सांकेतिक भाषा ई-बुक्स व आधिकारिक अध्ययन सामग्री",
      bannerEbooksDesc: "मूक-बधिर सांकेतिक भाषा सीखने हेतु भारत सरकार (ISLRTC, NCERT, DEPwD) की आधिकारिक ई-बुक्स और शिक्षण हैंडबुक्स।",
      bannerBtnExplore: "सभी ई-बुक्स व पोर्टल देखें (5 पोर्टल)",
      ebookModalTitle: "सांकेतिक भाषा ई-बुक्स व डिजिटल पाठ्यक्रम",
      ebookModalSubtitle: "दिव्यांग सांकेतिक भाषा सीखने हेतु राष्ट्रीय व अंतरराष्ट्रीय संस्थानों द्वारा प्रकाशित आधिकारिक ई-बुक्स और सुगम्य डिजिटल लाइब्रेरी।",
      openPortal: "आधिकारिक ई-बुक पोर्टल खोलें",
      closeModal: "बंद करें"
    },
    mr: {
      title: "सांकेतिक भाषा शिका (Learn Sign Language)",
      subtitle: "कर्णबधिर आणि मुक व्यक्तींशी सहज संवाद साधण्यासाठी भारतीय सांकेतिक भाषा (ISL) शिकण्याचा परस्परसंवादी मार्ग.",
      searchPlaceholder: "संकेत शोधा (उदा. नमस्कार, धन्यवाद, पाणी, डॉक्टर, मदत)...",
      all: "सर्व संकेत",
      greetings: "अभिवादन",
      needs: "गरजा व सुविधा",
      conversations: "संभाषण",
      emergency: "आरोग्य व मदत",
      btnPractice: "कॅमेरा सोबत सराव करा",
      btnAvatar: "3D अवतारात पहा",
      motionGuide: "पायरीनुसार हाताची हालचाल मार्गदर्शन:",
      proTip: "संवाद शिष्टाचार व विशेष टीप:",
      statusValidated: "प्रमाणित ISL",
      testLiveScore: "सराव अचूकता स्कोअर",
      targetPrompt: "हा संकेत शिका आणि सराव करा:",
      btnEbooks: "सांकेतिक भाषा ई-बुक्स आणि हँडबुक्स",
      bannerEbooksTitle: "दिव्यांग सांकेतिक भाषा ई-बुक्स आणि अधिकृत अभ्यासक्रम",
      bannerEbooksDesc: "कर्णबधिर सांकेतिक भाषा शिकण्यासाठी भारत सरकार (ISLRTC, NCERT, DEPwD) ची अधिकृत ई-पुस्तके आणि शिक्षण मार्गदर्शिका.",
      bannerBtnExplore: "सर्व ई-पुस्तके व पोर्टल पहा (5 पोर्टल)",
      ebookModalTitle: "सांकेतिक भाषा ई-पुस्तके आणि डिजिटल अभ्यास साहित्य",
      ebookModalSubtitle: "दिव्यांग सांकेतिक भाषा शिकण्यासाठी राष्ट्रीय आणि आंतरराष्ट्रीय संस्थांद्वारे प्रकाशित अधिकृत ई-पुस्तके आणि डिजिटल लायब्ररी.",
      openPortal: "अधिकृत ई-बुक पोर्टल उघडा",
      closeModal: "बंद करा"
    }
  };

  const langKey = currentLang in UI_TEXT ? currentLang : "en";
  const u = UI_TEXT[langKey];

  const filteredSigns = SIGNS.filter((item) => {
    const textData = item[langKey] || item.en;
    const matchesSearch =
      textData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeSign = SIGNS.find((s) => s.id === activeSignKey) || SIGNS[0];
  const activeSignData = activeSign[langKey] || activeSign.en;

  const triggerLivePracticeSimulation = () => {
    setIsPracticing(true);
    setPracticeScore(70);
    let currentScore = 70;
    const interval = setInterval(() => {
      currentScore += 5;
      if (currentScore >= 98) {
        setPracticeScore(98);
        setIsPracticing(false);
        clearInterval(interval);
      } else {
        setPracticeScore(currentScore);
      }
    }, 110);
  };

  // Speak phrase aloud for learning
  const speakSignPhrase = (text) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (currentLang === "hi") utterance.lang = "hi-IN";
      else if (currentLang === "mr") utterance.lang = "mr-IN";
      else utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="section-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "var(--accent-purple)", display: "flex", alignItems: "center" }}>
              <BookOpenIcon size={24} strokeWidth={2} />
            </span>
            <span>{u.title}</span>
          </h2>
          <p className="body-text" style={{ marginTop: "4px" }}>
            {u.subtitle}
          </p>
        </div>

        {/* Informative Learning Badges & E-Books Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowEbooksModal(true)}
            id="btn-open-ebooks-modal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.28), rgba(124, 58, 237, 0.45))",
              border: "1px solid rgba(168, 85, 247, 0.6)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "12.5px",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(139, 92, 246, 0.35)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 0 22px rgba(168, 85, 247, 0.65)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(139, 92, 246, 0.35)";
            }}
            title="Open Sign Language E-Books & Learning Handbooks"
          >
            <BookOpenIcon size={15} strokeWidth={2} color="#C4B5FD" />
            <span>{u.btnEbooks}</span>
            <ExternalLinkIcon size={12} strokeWidth={2} color="#C4B5FD" />
          </button>

          <span className="badge-pill badge-purple">
            <HeartIcon size={12} strokeWidth={2} color="var(--accent-purple)" />
            Accessibility & Inclusion
          </span>
          <span className="badge-pill badge-slate">
            <UsersIcon size={12} strokeWidth={2} />
            Deaf Communication Guide
          </span>
        </div>
      </div>

      {/* Official E-Books & Handicap Sign Language Resources Banner */}
      <div
        className="bento-card-dark"
        style={{
          padding: "16px 20px",
          background: "radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.18) 0%, rgba(16, 16, 24, 0.9) 100%)",
          border: "1px solid rgba(168, 85, 247, 0.4)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "280px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(124, 58, 237, 0.5))",
              border: "1px solid rgba(168, 85, 247, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C4B5FD",
              flexShrink: 0
            }}
          >
            <BookOpenIcon size={22} strokeWidth={2} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                {u.bannerEbooksTitle}
              </span>
              <span className="badge-pill badge-purple" style={{ fontSize: "10.5px", padding: "2px 8px" }}>
                Free Public E-Books
              </span>
            </div>
            <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              {u.bannerEbooksDesc}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <a
            href="https://www.islrtc.nic.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-pill badge-purple"
            style={{
              textDecoration: "none",
              fontSize: "12px",
              padding: "7px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer"
            }}
            title="Open ISLRTC Official Dictionary & E-Materials"
          >
            <span>ISLRTC Handbook</span>
            <ExternalLinkIcon size={12} strokeWidth={2} />
          </a>

          <a
            href="https://sugamyapustakalaya.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-pill badge-slate"
            style={{
              textDecoration: "none",
              fontSize: "12px",
              padding: "7px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer"
            }}
            title="Open Sugamya Pustakalaya (DEPwD Accessible E-Library)"
          >
            <span>Sugamya E-Library</span>
            <ExternalLinkIcon size={12} strokeWidth={2} />
          </a>

          <button
            onClick={() => setShowEbooksModal(true)}
            id="btn-banner-explore-ebooks"
            className="btn-purple-glow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px",
              borderRadius: "8px",
              background: "var(--accent-gradient)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            <span>{u.bannerBtnExplore}</span>
            <ArrowRightIcon size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div
        className="bento-card-dark"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, maxWidth: "420px", background: "rgba(11, 11, 14, 0.75)", padding: "8px 16px", borderRadius: "9999px", border: "1px solid var(--border-subtle)" }}>
          <SearchIcon size={16} strokeWidth={1.8} color="var(--accent-purple)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={u.searchPlaceholder}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-heading)",
              fontFamily: "var(--font-sans)",
              fontSize: "13.5px",
              outline: "none",
              width: "100%"
            }}
          />
        </div>

        {/* Learning Category Filter Chips */}
        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: u.all },
            { id: "greetings", label: u.greetings },
            { id: "needs", label: u.needs },
            { id: "conversations", label: u.conversations },
            { id: "emergency", label: u.emergency }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                fontSize: "12px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: selectedCategory === cat.id ? "var(--accent-gradient)" : "rgba(255, 255, 255, 0.06)",
                color: selectedCategory === cat.id ? "#FFFFFF" : "var(--text-secondary)",
                border: selectedCategory === cat.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid var(--border-subtle)",
                boxShadow: selectedCategory === cat.id ? "0 2px 10px rgba(139, 92, 246, 0.45)" : "none",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Learning Grid: Sign Lessons (Left) + Learning Arena & Practice (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 440px", gap: "20px" }}>

        {/* Left Column: Sign Lesson Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px", alignContent: "start" }}>
          {filteredSigns.map((item) => {
            const data = item[langKey] || item.en;
            const isSelected = item.id === activeSignKey;
            return (
              <div
                key={item.id}
                onClick={() => setActiveSignKey(item.id)}
                className={`bento-card-dark bento-card-interactive ${isSelected ? "active" : ""}`}
                style={{
                  padding: "18px 20px",
                  cursor: "pointer",
                  border: isSelected ? "1px solid var(--accent-purple)" : "1px solid var(--border-subtle)",
                  boxShadow: isSelected ? "var(--shadow-purple-glow)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "155px",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "22px" }}>{item.emoji}</span>
                    <span className="badge-pill badge-purple" style={{ padding: "2px 8px", fontSize: "10px" }}>
                      {item.difficulty}
                    </span>
                  </div>

                  <div style={{ fontSize: "17px", fontWeight: 800, color: isSelected ? "#FFFFFF" : "var(--text-body)" }}>
                    {data.name}
                  </div>
                  <div className="caption-text" style={{ fontSize: "12px", marginTop: "6px", lineHeight: "1.5", color: "var(--text-secondary)" }}>
                    {data.motion.slice(0, 75)}...
                  </div>
                </div>

                <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "8px" }}>
                  <span className="caption-text" style={{ fontSize: "11px", fontWeight: 700, color: isSelected ? "var(--accent-lavender)" : "var(--accent-purple)" }}>
                    {isSelected ? "✦ Active Lesson" : "Learn Sign"}
                  </span>
                  <ArrowRightIcon size={13} strokeWidth={2} color="var(--accent-purple)" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Learning Guide & Practice Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Active Lesson Guide Card */}
          <div
            className="bento-card-dark"
            style={{
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              border: "1px solid var(--border-subtle)",
              background: "linear-gradient(135deg, rgba(22, 22, 32, 0.92) 0%, rgba(14, 14, 20, 0.98) 100%)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "24px" }}>{activeSign.emoji}</span>
                <span className="caption-text" style={{ fontWeight: 700, letterSpacing: "0.06em", color: "var(--accent-purple)" }}>
                  Sign Language Lesson
                </span>
              </div>
              <span className="badge-pill badge-purple">
                <CheckCircleIcon size={12} strokeWidth={2} />
                {u.statusValidated}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#FFFFFF", lineHeight: 1.2 }}>
                {activeSignData.name}
              </div>
              <button
                type="button"
                onClick={() => speakSignPhrase(activeSignData.name)}
                className="btn-hero-ghost"
                style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                title="Listen to phrase pronunciation"
              >
                <AudioIcon size={14} strokeWidth={2} color="var(--accent-purple)" />
                <span>Listen</span>
              </button>
            </div>

            {/* Step-by-Step Motion Guide */}
            <div style={{ background: "rgba(139, 92, 246, 0.08)", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              <span className="caption-text" style={{ fontWeight: 700, color: "var(--accent-lavender)" }}>
                {u.motionGuide}
              </span>
              <p className="body-text" style={{ marginTop: "6px", fontSize: "13.5px", lineHeight: "1.7", color: "#FFFFFF" }}>
                {activeSignData.motion}
              </p>
            </div>

            {/* Handicap & Deaf Communication Tip */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(245, 158, 11, 0.08)", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(245, 158, 11, 0.22)" }}>
              <FlameIcon size={17} strokeWidth={1.8} color="#F59E0B" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#FBBF24", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {u.proTip}
                </span>
                <div style={{ fontSize: "12.5px", color: "var(--text-body)", marginTop: "3px", lineHeight: "1.6" }}>
                  {activeSignData.tip}
                </div>
              </div>
            </div>

            {/* Navigation links to practice directly */}
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                onClick={() => onSelectMode && onSelectMode("camera")}
                className="btn-violet-solid"
                style={{ flex: 1, padding: "10px 14px", fontSize: "12.5px" }}
                title="Open Camera to practice this sign live"
              >
                <TargetIcon size={15} strokeWidth={2} />
                <span>{u.btnPractice}</span>
              </button>

              <button
                onClick={() => onSelectMode && onSelectMode("speech")}
                className="btn-hero-ghost"
                style={{ flex: 1, padding: "10px 14px", fontSize: "12.5px" }}
                title="View animated sign in 3D Avatar"
              >
                <TranslateIcon size={15} strokeWidth={2} />
                <span>{u.btnAvatar}</span>
              </button>
            </div>
          </div>

          {/* Interactive Learning Practice Meter */}
          <div className="bento-card-dark" style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TargetIcon size={17} strokeWidth={1.8} color="var(--accent-purple)" />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                  Self-Practice Hand Pose Check
                </span>
              </div>
              <span className="badge-pill badge-purple">
                {practiceScore}% Accuracy
              </span>
            </div>

            <p className="caption-text" style={{ fontSize: "11.5px", color: "var(--text-secondary)", margin: 0 }}>
              {u.targetPrompt} <strong style={{ color: "#FFFFFF" }}>"{activeSignData.name}"</strong>
            </p>

            {/* Practice Accuracy Meter */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span className="caption-text" style={{ fontSize: "11px" }}>
                  {u.testLiveScore}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-purple)" }}>
                  {practiceScore}%
                </span>
              </div>
              <div className="progress-track" style={{ height: "8px" }}>
                <div
                  className="progress-fill-gradient"
                  style={{
                    width: `${practiceScore}%`,
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
            </div>

            <button
              onClick={triggerLivePracticeSimulation}
              className="btn-gradient-indigo-violet"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <SparklesIcon size={14} strokeWidth={2} />
              <span>{isPracticing ? "Verifying Hand Posture..." : "Simulate Pose Verification Test"}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Official Sign Language E-Books & Handbooks Modal */}
      {showEbooksModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowEbooksModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(5, 5, 8, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bento-card-dark"
            style={{
              maxWidth: "780px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "linear-gradient(160deg, #14141E 0%, #0E0E14 100%)",
              border: "1px solid rgba(168, 85, 247, 0.5)",
              borderRadius: "18px",
              padding: "26px 28px",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(124, 58, 237, 0.6))",
                    border: "1px solid rgba(168, 85, 247, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    flexShrink: 0
                  }}
                >
                  <BookOpenIcon size={22} strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
                    {u.ebookModalTitle}
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {u.ebookModalSubtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEbooksModal(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "var(--text-secondary)",
                  borderRadius: "9999px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 600,
                  transition: "all 0.15s ease",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
                title={u.closeModal}
              >
                ✕
              </button>
            </div>

            {/* List of E-Book & Handbook Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {EBOOKS_RESOURCES.map((item) => {
                const titleText = currentLang === "hi" ? item.titleHi : currentLang === "mr" ? item.titleMr : item.title;
                const descText = currentLang === "hi" ? item.descHi : currentLang === "mr" ? item.descMr : item.desc;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: "rgba(20, 20, 30, 0.75)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      borderRadius: "14px",
                      padding: "16px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                      flexWrap: "wrap",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.6)";
                      e.currentTarget.style.background = "rgba(28, 28, 42, 0.9)";
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.25)";
                      e.currentTarget.style.background = "rgba(20, 20, 30, 0.75)";
                      e.currentTarget.style.transform = "translateX(0px)";
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span className="badge-pill badge-purple" style={{ fontSize: "10.5px", padding: "2px 8px" }}>
                          {item.badge}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--accent-lavender)", fontWeight: 600 }}>
                          {item.tag}
                        </span>
                      </div>

                      <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                        {titleText}
                      </h4>

                      <div style={{ fontSize: "11.5px", color: "var(--accent-lavender)", marginBottom: "6px", fontWeight: 500 }}>
                        {item.author}
                      </div>

                      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.45" }}>
                        {descText}
                      </p>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-violet-solid"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "9px 16px",
                        fontSize: "12px",
                        textDecoration: "none",
                        flexShrink: 0
                      }}
                      title={`Open official portal: ${item.url}`}
                    >
                      <span>{u.openPortal}</span>
                      <ExternalLinkIcon size={13} strokeWidth={2} />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer Note */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                <ShieldCheckIcon size={14} strokeWidth={2} color="var(--accent-purple)" />
                <span>All portals are open, verified educational resources under Govt. of India & UN CRPD standards.</span>
              </div>

              <button
                onClick={() => setShowEbooksModal(false)}
                className="btn-hero-ghost"
                style={{ padding: "8px 18px", fontSize: "12px" }}
              >
                {u.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

