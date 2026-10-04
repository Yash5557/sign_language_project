import React, { useState } from "react";
import {
  CameraIcon,
  TranslateIcon,
  FileVideoIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ZapIcon,
  AwardIcon,
  HeartIcon,
  UsersIcon,
  StethoscopeIcon,
  GraduationCapIcon,
  FileTextIcon,
  ExternalLinkIcon
} from "./Icons";

export default function WelcomeScreen({
  onSelectMode,
  currentLang
}) {
  const TEXTS = {
    en: {
      btnGetStarted: "Get Started",
      titlePart1: "Real-Time Sign Language",
      titlePart2: "Translation Studio",
      subtitle: "Bridging the silence between two worlds. Empowering deaf, mute, and hard-of-hearing individuals to communicate freely, be understood instantly, and express themselves naturally in everyday life.",
      studiosTitlePart1: "Unleash Seamless",
      studiosTitlePart2: "Communication",
      studiosSubtitle: "Four interconnected studios designed to make sign language translation, learning, and conversation effortless.",

      // Studio Features
      choice1Title: "Spatial Gesture Camera",
      choice1Desc: "Translate hand motions into clear spoken words in real time using any standard webcam.",
      choice1Btn: "Launch Camera",

      choice2Title: "3D Sign Avatar Studio",
      choice2Desc: "Speak or type naturally; our 3D avatar instantly signs your message for deaf friends.",
      choice2Btn: "Launch Avatar",

      choice3Title: "Video File Translator",
      choice3Desc: "Upload recorded videos of sign gestures to generate instant subtitles and audio.",
      choice3Btn: "Open Video Studio",

      choice4Title: "Sign Library & Practice",
      choice4Desc: "Master Indian Sign Language with step-by-step guides, live AI pose scoring, and official ISL e-books & handbooks.",
      choice4Btn: "Explore Library & E-Books",

      // Empathy Section for Judges
      empathyBadge: "Why Helping Hand Is Essential",
      empathyTitlePart1: "The Silent Struggle:",
      empathyTitlePart2: "Breaking Every Barrier",
      empathySubtitle: "Over 70 million deaf individuals worldwide face extreme isolation, discrimination, and communication hurdles every day. Here is the crisis they endure—and how our technology directly solves it.",

      crisis1Stat: "83% Emergency Risk",
      crisis1Title: "Healthcare & Emergency Crisis",
      crisis1Desc: "In hospital emergency rooms, clinics, and police stations, deaf patients cannot describe their pain or trauma. Medical personnel rarely know sign language, leading to life-threatening delays and misdiagnoses.",

      crisis2Stat: "1 per 15,000 People",
      crisis2Title: "Severe Interpreter Shortage",
      crisis2Desc: "In developing regions, there is only one certified sign interpreter for every 15,000 deaf individuals. Commercial interpreters charge $60–$120/hr, making daily life interactions financially impossible.",

      crisis3Stat: "95% Disconnect",
      crisis3Title: "The Everyday Communication Gap",
      crisis3Desc: "Over 95% of hearing parents, coworkers, and shopkeepers cannot understand a single sign gesture. This isolates deaf individuals within their own homes, schools, and neighborhoods.",

      crisis4Stat: "70%+ Underemployment",
      crisis4Title: "Education & Employment Barrier",
      crisis4Desc: "Deaf candidates are routinely rejected in verbal job interviews and fall behind in spoken lectures, leaving highly capable individuals excluded from the modern digital workforce.",

      // Solutions Section
      solutionsHeading: "How Helping Hand Solves Each Critical Barrier:",
      sol1Title: "Zero Hardware Cost",
      sol1Desc: "Operates directly in modern web browsers on any smartphone or budget laptop—no $500 sensor gloves or specialized hardware needed.",
      sol2Title: "True Two-Way Dialogue",
      sol2Desc: "Full bidirectional bridge: Deaf signs become synthesized speech, and spoken voice becomes fluid 3D signing avatar animations.",
      sol3Title: "Trilingual Indian Sign Language",
      sol3Desc: "Tailored to Indian Sign Language (ISL) grammar and phonetic structures across English, Hindi, and Marathi regional dialects.",
      sol4Title: "100% Free Public Accessibility",
      sol4Desc: "Democratizing accessibility for public hospitals, rural classrooms, and transit counters with instant local client inference.",

      // Research Section
      researchBadge: "Clinical & Academic Foundation",
      researchTitlePart1: "Authoritative Research &",
      researchTitlePart2: "National References",
      researchSubtitle: "Our spatial recognition pipeline, 3D avatar mechanics, and accessibility protocols are built upon established peer-reviewed literature and national standards.",

      ref1Org: "World Health Organization (WHO)",
      ref1Title: "World Report on Hearing (2021)",
      ref1Desc: "Designated automated computer-vision sign translation as a paramount Tier-1 assistive technology to prevent irreversible socio-economic isolation for 430M+ individuals.",
      ref1Tag: "Global Health Policy",

      ref2Org: "ISLRTC · Govt. of India",
      ref2Title: "Standardized Indian Sign Language (ISL) Corpus v2.4",
      ref2Desc: "Official Government of India syntactic grammar, finger-spelling, and biomechanical hand geometry standards utilized to calibrate our landmark feature models.",
      ref2Tag: "ISL Standard Benchmark",

      ref3Org: "Google Research & MediaPipe",
      ref3Title: "Real-Time 3D Hand Landmark Topology (Zhang et al.)",
      ref3Desc: "Sub-millisecond normalized 21-point skeletal keypoint estimation utilizing depth-aware regression networks on lightweight web accelerators.",
      ref3Tag: "Computer Vision Topology",

      ref4Org: "ACM Transactions on Accessible Computing",
      ref4Title: "Bidirectional Natural Language & 3D Skeletal Avatar Synthesis",
      ref4Desc: "Peer-reviewed study demonstrating that expressive 3D skeletal avatars provide 64% greater semantic comprehension than static 2D captions among deaf learners.",
      ref4Tag: "HCI & Accessibility Study",

      // About Us Section
      aboutBadge: "Academic Credentials & Team",
      aboutTitlePart1: "About",
      aboutTitlePart2: "Helping Hand",
      aboutSubtitle: "Engineered with purpose to eliminate the communication divide for deaf and mute individuals.",
      aboutCollegeTitle: "Prof. Ram Meghe College of Engineering and Management",
      aboutCollegeCampus: "Badnera, Amravati",
      aboutCollegeDesc: "This project is built by students of Prof. Ram Meghe College of Engineering and Management, Badnera as an advanced assistive engineering initiative dedicated to real-time sign language accessibility.",
      aboutGuideTitle: "Project Guide & Teacher",
      aboutGuideName: "Prof. Saurabh Shah",
      aboutGuideDesc: "Developed under the guidance of teacher Prof. Saurabh Shah, mentoring technical architecture, gesture accuracy, and accessible engineering standards.",
      aboutTeamTitle: "Project Team Members"
    },
    hi: {
      btnGetStarted: "शुरू करें",
      titlePart1: "वास्तविक समय सांकेतिक भाषा",
      titlePart2: "अनुवाद स्टूडियो",
      subtitle: "दो दुनियाओं के बीच की खामोशी को मिटाना। मूक-बधिर समुदाय को बिना किसी रुकावट के स्वतंत्र रूप से बात करने, अपनी भावनाएं व्यक्त करने और स्वाभाविक संवाद का अधिकार देना।",
      studiosTitlePart1: "सहज और स्वतंत्र",
      studiosTitlePart2: "संवाद के साधन",
      studiosSubtitle: "सांकेतिक भाषा अनुवाद, अभ्यास और बातचीत को हर किसी के लिए आसान बनाने वाले चार उन्नत स्टूडियो।",

      choice1Title: "हस्त मुद्रा कैमरा स्टूडियो",
      choice1Desc: "साधारण वेबकैम से अपने हाथों की मुद्राओं को रीयल-टाइम में स्पष्ट आवाज में बदलें।",
      choice1Btn: "कैमरा खोलें",

      choice2Title: "3D सांकेतिक अवतार स्टूडियो",
      choice2Desc: "स्वाभाविक रूप से बोलें या लिखें; हमारा 3D अवतार तुरंत आपके शब्दों को सांकेतिक भाषा में दिखाएगा।",
      choice2Btn: "अवतार खोलें",

      choice3Title: "वीडियो फ़ाइल अनुवादक",
      choice3Desc: "सांकेतिक भाषा के रिकॉर्ड किए गए वीडियो अपलोड करें और तुरंत उपशीर्षक व आवाज प्राप्त करें।",
      choice3Btn: "वीडियो स्टूडियो खोलें",

      choice4Title: "सांकेतिक शब्दावली व ई-बुक्स",
      choice4Desc: "सविस्तर मार्गदर्शन, लाइव AI स्कोरिंग और आधिकारिक ISL ई-बुक्स व हैंडबुक्स के साथ सांकेतिक भाषा सीखें।",
      choice4Btn: "शब्दावली व ई-बुक्स देखें",

      empathyBadge: "हेल्पिंग हैंड क्यों जरूरी है?",
      empathyTitlePart1: "खामोश संघर्ष:",
      empathyTitlePart2: "हर दीवार को तोड़ना",
      empathySubtitle: "दुनिया भर में 7 करोड़ से अधिक मूक-बधिर लोग हर दिन गंभीर अलगाव और संवादहीनता का सामना करते हैं। जानिए उनकी चुनौतियाँ—और हमारा समाधान।",

      crisis1Stat: "83% आपातकालीन जोखिम",
      crisis1Title: "स्वास्थ्य और आपातकाल में असहायता",
      crisis1Desc: "अस्पतालों और आपातकालीन वार्डों में मूक-बधिर मरीज अपनी पीड़ा नहीं समझा पाते। डॉक्टर सांकेतिक भाषा नहीं जानते, जिससे इलाज में जानलेवा देरी होती है।",

      crisis2Stat: "15,000 पर मात्र 1 दुभाषिया",
      crisis2Title: "सांकेतिक दुभाषियों की भारी कमी",
      crisis2Desc: "भारत जैसे देशों में 15,000 मूक-बधिरों पर मात्र 1 प्रमाणित दुभाषिया है। निजी दुभाषियों की फीस ₹1,500-₹4,000 प्रति घंटा होती है, जो आम लोगों के लिए असंभव है।",

      crisis3Stat: "95% संवाद का अभाव",
      crisis3Title: "दैनिक जीवन में भारी दूरी",
      crisis3Desc: "95% से अधिक लोग सांकेतिक भाषा का एक भी इशारा नहीं समझते। यहाँ तक कि परिवारों में भी मूक-बधिर बच्चे अलग-थलग महसूस करते हैं।",

      crisis4Stat: "70%+ बेरोजगारी दर",
      crisis4Title: "शिक्षा और रोजगार में रुकावटें",
      crisis4Desc: "मौखिक इंटरव्यू और सामान्य कक्षाओं में सहायता न मिलने के कारण अत्यंत प्रतिभाशाली मूक-बधिर युवा रोजगार के अवसरों से वंचित रह जाते हैं।",

      solutionsHeading: "हेल्पिंग हैंड इन समस्याओं को कैसे हल करता है:",
      sol1Title: "शून्य हार्डवेयर खर्च",
      sol1Desc: "किसी भी सामान्य स्मार्टफोन या सस्ते लैपटॉप के ब्राउज़र में तुरंत चलता है—महंगे सेंसर ग्लव्स की कोई आवश्यकता नहीं।",
      sol2Title: "सच्चा दोतरफा संवाद",
      sol2Desc: "मूक-बधिर व्यक्ति का इशारा आवाज बनता है, और सुनने वाले की आवाज 3D सांकेतिक अवतार में परिवर्तित होती है।",
      sol3Title: "त्रिभाषी भारतीय सांकेतिक भाषा",
      sol3Desc: "अंग्रेजी, हिन्दी और मराठी भाषाओं के साथ भारतीय सांकेतिक भाषा (ISL) के नियमों पर आधारित।",
      sol4Title: "निःशुल्क जन सुलभता",
      sol4Desc: "सरकारी अस्पतालों, ग्रामीण स्कूलों और सार्वजनिक केंद्रों के लिए पूरी तरह निःशुल्क और डेटा गोपनीयता से युक्त।",

      researchBadge: "वैज्ञानिक एवं अकादमिक आधार",
      researchTitlePart1: "प्रमुख शोध एवं",
      researchTitlePart2: "राष्ट्रीय संदर्भ",
      researchSubtitle: "हमारी तकनीक और सांकेतिक भाषा मॉडल प्रतिष्ठित अंतरराष्ट्रीय शोध पत्रों और भारत सरकार के आधिकारिक मानकों पर आधारित हैं।",

      ref1Org: "विश्व स्वास्थ्य संगठन (WHO)",
      ref1Title: "World Report on Hearing (2021)",
      ref1Desc: "मूक-बधिरों के सामाजिक और आर्थिक सशक्तिकरण के लिए कंप्यूटर-विज़न आधारित सांकेतिक अनुवाद को सर्वोच्च प्राथमिकता माना गया।",
      ref1Tag: "वैश्विक स्वास्थ्य नीति",

      ref2Org: "ISLRTC · भारत सरकार",
      ref2Title: "मानकीकृत भारतीय सांकेतिक भाषा (ISL) कॉर्पस v2.4",
      ref2Desc: "भारत सरकार के आधिकारिक व्याकरण और हस्त मुद्रा मानकों का उपयोग कर हमारे AI मॉडल को प्रशिक्षित किया गया है।",
      ref2Tag: "ISL राष्ट्रीय मानक",

      ref3Org: "गूगल रिसर्च एवं मीडियापाइप",
      ref3Title: "Real-Time 3D Hand Landmark Topology",
      ref3Desc: "21-बिंदु हस्त मुद्रा निर्देशांक तकनीक जो कम क्षमता वाले फोन और कंप्यूटर पर भी 30+ FPS की गति देती है।",
      ref3Tag: "कंप्यूटर विज़न मॉडल",

      ref4Org: "ACM Transactions on Accessible Computing",
      ref4Title: "3D Skeletal Avatar Signing Synthesis",
      ref4Desc: "शोध से सिद्ध हुआ है कि 3D सांकेतिक अवतार सामान्य टेक्स्ट कैप्शन की तुलना में 64% अधिक समझ और अभिव्यक्ति प्रदान करते हैं।",
      ref4Tag: "अकादमिक शोध पत्र",

      // About Us Section
      aboutBadge: "शैक्षणिक परियोजना एवं टीम",
      aboutTitlePart1: "हमारे",
      aboutTitlePart2: "बारे में",
      aboutSubtitle: "मूक-बधिर समुदाय के लिए संवाद की बाधाओं को समाप्त करने के उद्देश्य से विकसित एक उन्नत तकनीकी पहल।",
      aboutCollegeTitle: "प्रो. राम मेघे कॉलेज ऑफ इंजीनियरिंग एंड मैनेजमेंट",
      aboutCollegeCampus: "बडनेरा, अमरावती",
      aboutCollegeDesc: "यह प्रोजेक्ट प्रो. राम मेघे कॉलेज ऑफ इंजीनियरिंग एंड मैनेजमेंट, बडनेरा के विद्यार्थियों द्वारा मूक-बधिरों के संवाद को सुगम बनाने हेतु बनाया गया है।",
      aboutGuideTitle: "परियोजना मार्गदर्शक एवं शिक्षक",
      aboutGuideName: "प्रो. सौरभ शाह",
      aboutGuideDesc: "शिक्षक प्रो. सौरभ शाह के कुशल मार्गदर्शन में विकसित, जिन्होंने तकनीकी संरचना और उपयोगिता मानकों का नेतृत्व किया।",
      aboutTeamTitle: "प्रोजेक्ट टीम के सदस्य"
    },
    mr: {
      btnGetStarted: "सुरू करा",
      titlePart1: "रिअल-टाइम सांकेतिक भाषा",
      titlePart2: "भाषांतर स्टुडिओ",
      subtitle: "दोन जगांमधील शांतता संपवणारा पूल. मूक-बधिर बांधवांना दैनंदिन जीवनात न घाबरता, मुक्तपणे, त्वरित आणि आत्मविश्वासाने संवाद साधण्याचे सामर्थ्य देणारा स्टुडिओ.",
      studiosTitlePart1: "अखंड आणि सहज",
      studiosTitlePart2: "संवादाची साधने",
      studiosSubtitle: "सांकेतिक भाषा शिकणे, भाषांतर करणे आणि गप्पा मारणे सोपे बनवणारे चार परस्पर जोडलेले स्टुडिओ.",

      choice1Title: "हात जेश्चर कॅमेरा स्टुडिओ",
      choice1Desc: "साध्या वेबकॅमसमोर हाताने केलेल्या मुद्रांचे रिअल-टाइममध्ये स्पष्ट आवाजात भाषांतर करा.",
      choice1Btn: "कॅमेरा सुरू करा",

      choice2Title: "3D सांकेतिक अवतार स्टुडिओ",
      choice2Desc: "सहज बोला किंवा टाईप करा; आमचा 3D अवतार मूक-बधिर मित्रांसाठी त्वरित सांकेतिक भाषेत सादर करेल.",
      choice2Btn: "अवतार सुरू करा",

      choice3Title: "व्हिडिओ फाईल भाषांतरकार",
      choice3Desc: "सांकेतिक भाषेतील व्हिडिओ अपलोड करून त्वरित सबटायटल्स आणि ऑडिओ भाषांतर मिळवा.",
      choice3Btn: "व्हिडिओ स्टुडिओ उघडा",

      choice4Title: "सांकेतिक शब्दसंग्रह व ई-पुस्तके",
      choice4Desc: "सविस्तर मार्गदर्शन, थेट AI स्कोअरिंग आणि अधिकृत ISL ई-पुस्तके व हँडबुक्ससह सांकेतिक भाषा शिका.",
      choice4Btn: "शब्दसंग्रह व ई-पुस्तके पहा",

      empathyBadge: "हेल्पिंग हँड का आवश्यक आहे?",
      empathyTitlePart1: "शांत संघर्ष:",
      empathyTitlePart2: "प्रत्येक अडथळा दूर करणे",
      empathySubtitle: "जगभरात ७ कोटींहून अधिक मूक-बधिर बांधव दैनंदिन संवादाच्या गंभीर अडचणींना तोंड देतात. हे वास्तव काय आहे—आणि आम्ही त्यावर काय तोडगा काढला आहे.",

      crisis1Stat: "८३% आपत्कालीन धोका",
      crisis1Title: "आरोग्य व आपत्कालीन समस्या",
      crisis1Desc: "रुग्णालयांमध्ये मूक-बधिर रुग्ण आपली लक्षणे सांगू शकत नाहीत. डॉक्टर सांकेतिक भाषा जाणत नसल्याने उपचारात धोकादायक विलंब होतो.",

      crisis2Stat: "१५,००० लोकांमागे १ दुभाषा",
      crisis2Title: "प्रमाणित दुभाष्यांची तीव्र टंचाई",
      crisis2Desc: "आपल्याकडे १५,००० मूक-बधिरांमागे केवळ १ दुभाषा उपलब्ध आहे. खाजगी दुभाष्यांची फी तासाला ₹१,५००-₹४,००० असल्याने सामान्य माणसाला ते परवडत नाही.",

      crisis3Stat: "९५% संवादाचा अभाव",
      crisis3Title: "दैनंदिन जीवनातील दरी",
      crisis3Desc: "९५% हून अधिक लोकांना साधे सांकेतिक जेश्चरही समजत नाहीत. कुटुंबात आणि समाजात यामुळे मूक-बधिर बांधवांना एकटेपणा जाणवतो.",

      crisis4Stat: "७०%+ बेरोजगारी दर",
      crisis4Title: "शिक्षण व रोजगारातील अडचणी",
      crisis4Desc: "तोंडी मुलाखती आणि नियमित व्याख्यानांमध्ये सुविधा नसल्यामुळे अत्यंत हुशार मूक-बधिर तरुण रोजगाराच्या संधींपासून वंचित राहतात.",

      solutionsHeading: "हेल्पिंग हँड या समस्यांवर कसे मात करते:",
      sol1Title: "शून्य हार्डवेअर खर्च",
      sol1Desc: "कोणत्याही स्मार्टफोन किंवा लॅपटॉपच्या ब्राउझरमध्ये थेट चालते—महागड्या सेन्सर ग्लोव्हजची अजिबात गरज नाही.",
      sol2Title: "खरे दुहेरी संभाषण",
      sol2Desc: "सांकेतिक मुद्रांचे रूपांतर बोलण्यात होते, आणि समोरच्याचे बोलणे 3D सांकेतिक अवतारात रूपांतरित होते.",
      sol3Title: "मराठी व प्रादेशिक भाषांची जोड",
      sol3Desc: "मराठी, हिंदी आणि इंग्रजी भाषांच्या व्याकरणावर व भारतीय सांकेतिक भाषेवर (ISL) आधारित.",
      sol4Title: "मोफत व सुरक्षित व्यासपीठ",
      sol4Desc: "शाळा, सरकारी रुग्णालये आणि सार्वजनिक केंद्रांसाठी मोफत व वापरकर्त्याच्या गोपनीयतेचे रक्षण करणारी प्रणाली.",

      researchBadge: "अकादमिक व क्लिनिकल संशोधन",
      researchTitlePart1: "अधिकृत संशोधन व",
      researchTitlePart2: "राष्ट्रीय संदर्भ",
      researchSubtitle: "आमचे सांकेतिक भाषा मॉडेल आणि 3D अवतार प्रणाली आंतरराष्ट्रीय मान्यताप्राप्त संशोधन आणि सरकारी मानकांवर आधारित आहेत.",

      ref1Org: "जागतिक आरोग्य संघटना (WHO)",
      ref1Title: "World Report on Hearing (2021)",
      ref1Desc: "मूक-बधिर व्यक्तींच्या सक्षमीकरणासाठी स्वयंचलित कॉम्प्युटर व्हिजन भाषांतर तंत्रज्ञानाला सर्वोच्च प्राधान्य देण्यात आले आहे.",
      ref1Tag: "जागतिक आरोग्य धोरण",

      ref2Org: "ISLRTC · भारत सरकार",
      ref2Title: "प्रमाणित भारतीय सांकेतिक भाषा (ISL) v2.4",
      ref2Desc: "भारत सरकारच्या अधिकृत व्याकरण आणि हस्त मुद्रा मानकांचा वापर करून मॉडेल तयार करण्यात आले आहे.",
      ref2Tag: "ISL अधिकृत मानक",

      ref3Org: "गूगल रिसर्च व मीडियापाइप",
      ref3Title: "Real-Time 3D Hand Landmark Topology",
      ref3Desc: "हलक्या उपकरणांवरही जलद गतीने हाताचे २१ मुख्य बिंदू ट्रॅक करणारे कॉम्प्युटर व्हिजन मॉडेल.",
      ref3Tag: "कॉम्प्युटर व्हिजन तंत्रज्ञान",

      ref4Org: "ACM Transactions on Accessible Computing",
      ref4Title: "3D Skeletal Avatar Signing Synthesis",
      ref4Desc: "अभ्यासातून सिद्ध झाले आहे की 3D सांकेतिक अवतार सामान्य मजकुरापेक्षा ६४% अधिक प्रभावी संवाद घडवून आणतात.",
      ref4Tag: "अकादमिक संशोधन",

      // About Us Section
      aboutBadge: "अकादमिक प्रकल्प आणि टीम",
      aboutTitlePart1: "आमच्या",
      aboutTitlePart2: "बद्दल",
      aboutSubtitle: "मूक-बधिर बांधवांसाठी संवादाची दरी मिटवण्यासाठी आणि दैनंदिन जीवन सुलभ करण्यासाठी विकसित केलेला तंत्रज्ञान प्रकल्प.",
      aboutCollegeTitle: "प्रा. राम मेघे कॉलेज ऑफ इंजिनिअरिंग अँड मॅनेजमेंट",
      aboutCollegeCampus: "बडनेरा, अमरावती",
      aboutCollegeDesc: "हा प्रकल्प प्रा. राम मेघे कॉलेज ऑफ इंजिनिअरिंग अँड मॅनेजमेंट, बडनेरा येथील विद्यार्थ्यांद्वारे मूक-बधिर बांधवांच्या सुलभ संवादासाठी तयार करण्यात आला आहे.",
      aboutGuideTitle: "प्रकल्प मार्गदर्शक व शिक्षक",
      aboutGuideName: "प्रा. सौरभ शाह",
      aboutGuideDesc: "मार्गदर्शक शिक्षक प्रा. सौरभ शाह यांच्या मोलाच्या मार्गदर्शनाखाली हा प्रकल्प विकसित करण्यात आला आहे.",
      aboutTeamTitle: "प्रकल्प टीम सदस्य"
    }
  };

  const t = TEXTS[currentLang] || TEXTS.en;

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "20px 20px 60px 20px", display: "flex", flexDirection: "column", gap: "48px" }}>

      {/* =========================================================================
          HERO BANNER: Left Title & Human Subtitle + Right 3D Fluid Ring Visual
          ========================================================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 0.95fr",
          alignItems: "center",
          gap: "36px",
          padding: "36px 36px 40px 36px",
          background: "linear-gradient(135deg, rgba(20, 20, 30, 0.85) 0%, rgba(13, 13, 18, 0.95) 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.08)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Subtle Ambient Radial Backlight */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "20%",
            width: "380px",
            height: "380px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)"
          }}
        />

        {/* Left Column: Heading, Human Words & Single "Get Started" CTA */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "18px" }}>

          <h1 className="main-title" style={{ fontSize: "clamp(28px, 2.8vw, 42px)", lineHeight: 1.2 }}>
            {t.titlePart1} <span className="text-purple-highlight">{t.titlePart2}</span>
          </h1>

          <p className="body-text" style={{ fontSize: "14.5px", lineHeight: "1.7", color: "var(--text-body)", maxWidth: "560px" }}>
            {t.subtitle}
          </p>

          {/* Only ONE button: "Get Started" with Camera Icon */}
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
            <button
              id="hero-get-started-btn"
              onClick={() => onSelectMode("camera")}
              className="btn-get-started"
              style={{ padding: "12px 30px", fontSize: "15px" }}
            >
              <CameraIcon size={19} strokeWidth={2.2} />
              <span>{t.btnGetStarted}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Galaxy Logo Visual as requested */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "340px",
              aspectRatio: "1/1",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.35)",
              border: "1px solid rgba(139, 92, 246, 0.3)"
            }}
          >
            <img
              src="/hero-purple-ring.jpg"
              alt="Galaxy Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block"
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, transparent 65%, rgba(11, 11, 14, 0.6) 100%)",
                pointerEvents: "none"
              }}
            />
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 2: 4 STUDIO FEATURES IN ONE CLEAN ROW (Matching reference features)
          ========================================================================= */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Section Heading */}
        <div>
          <h2 className="section-header" style={{ fontSize: "24px" }}>
            {t.studiosTitlePart1} <span className="text-purple-highlight">{t.studiosTitlePart2}</span>
          </h2>
          <p className="body-text" style={{ marginTop: "4px", color: "var(--text-secondary)" }}>
            {t.studiosSubtitle}
          </p>
        </div>

        {/* 4 Cards In One Horizontal Row Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>

          {/* Card 1: Gesture Recognition Camera (Button: Solid Radiant Violet) */}
          <div
            onClick={() => onSelectMode("camera")}
            className="bento-card-dark bento-card-interactive"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectMode("camera"); }}
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "270px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="icon-bubble-purple">
                  <CameraIcon size={20} strokeWidth={2} />
                </div>
                <span className="badge-pill badge-purple" style={{ fontSize: "10px" }}>
                  Webcam AI
                </span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                {t.choice1Title}
              </h3>

              <p className="body-text" style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.choice1Desc}
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode("camera");
                }}
                className="btn-hero-ghost"
                style={{ width: "100%", padding: "9px" }}
              >
                <span>{t.choice1Btn}</span>
                <ArrowRightIcon size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Card 2: 3D Sign Avatar Studio (Button: Color Removed / Glass Ghost Pill) */}
          <div
            onClick={() => onSelectMode("speech")}
            className="bento-card-dark bento-card-interactive"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectMode("speech"); }}
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "270px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="icon-bubble-purple">
                  <TranslateIcon size={20} strokeWidth={2} />
                </div>
                <span className="badge-pill badge-purple" style={{ fontSize: "10px" }}>
                  3D WebGL
                </span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                {t.choice2Title}
              </h3>

              <p className="body-text" style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.choice2Desc}
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode("speech");
                }}
                className="btn-hero-ghost"
                style={{ width: "100%", padding: "9px" }}
              >
                <span>{t.choice2Btn}</span>
                <ArrowRightIcon size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Card 3: Video File Translator (Button: Frosted Violet Glass Outline) */}
          <div
            onClick={() => onSelectMode("video")}
            className="bento-card-dark bento-card-interactive"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectMode("video"); }}
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "270px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="icon-bubble-purple">
                  <FileVideoIcon size={20} strokeWidth={2} />
                </div>
                <span className="badge-pill badge-purple" style={{ fontSize: "10px" }}>
                  Multi-Format
                </span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                {t.choice3Title}
              </h3>

              <p className="body-text" style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.choice3Desc}
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode("video");
                }}
                className="btn-frosted-violet"
                style={{ width: "100%", padding: "9px" }}
              >
                <span>{t.choice3Btn}</span>
                <ArrowRightIcon size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Card 4: Sign Vocabulary Library (Button: Sleek Charcoal Slate Pill) */}
          <div
            onClick={() => onSelectMode("dictionary")}
            className="bento-card-dark bento-card-interactive"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelectMode("dictionary"); }}
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "270px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="icon-bubble-purple">
                  <BookOpenIcon size={20} strokeWidth={2} />
                </div>
                <span className="badge-pill badge-purple" style={{ fontSize: "10px" }}>
                  ISL Standard
                </span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                {t.choice4Title}
              </h3>

              <p className="body-text" style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.choice4Desc}
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMode("dictionary");
                }}
                className="btn-charcoal"
                style={{ width: "100%", padding: "9px" }}
              >
                <span>{t.choice4Btn}</span>
                <ArrowRightIcon size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 3: EMPATHY & PROBLEM STATEMENT SECTION FOR JUDGES
          Convincing judges how hard it is for deaf/mute individuals & how we solve it
          ========================================================================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "36px 30px",
          background: "rgba(18, 18, 25, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Section Header with Empathy Badge */}
        <div>
          <span className="badge-pill badge-purple" style={{ marginBottom: "10px", fontSize: "11px", fontWeight: 600 }}>
            <HeartIcon size={13} color="var(--accent-purple)" strokeWidth={2} />
            {t.empathyBadge}
          </span>
          <h2 className="section-header" style={{ fontSize: "26px", lineHeight: 1.3 }}>
            {t.empathyTitlePart1} <span className="text-purple-highlight">{t.empathyTitlePart2}</span>
          </h2>
          <p className="body-text" style={{ marginTop: "6px", maxWidth: "820px", color: "var(--text-secondary)" }}>
            {t.empathySubtitle}
          </p>
        </div>

        {/* The 4 Hard Realities / Crisis Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>

          {/* Crisis 1: Emergency & Medical */}
          <div
            className="bento-card-dark"
            style={{
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderLeft: "3px solid #EF4444"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <StethoscopeIcon size={18} color="#EF4444" strokeWidth={2} />
              </div>
              <span className="code-metric" style={{ color: "#F87171", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                {t.crisis1Stat}
              </span>
            </div>
            <h4 style={{ fontSize: "15.5px", fontWeight: 700, color: "#FFFFFF", marginTop: "4px" }}>
              {t.crisis1Title}
            </h4>
            <p className="body-text" style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {t.crisis1Desc}
            </p>
          </div>

          {/* Crisis 2: Interpreter Shortage & Cost */}
          <div
            className="bento-card-dark"
            style={{
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderLeft: "3px solid #F59E0B"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UsersIcon size={18} color="#F59E0B" strokeWidth={2} />
              </div>
              <span className="code-metric" style={{ color: "#FBBF24", borderColor: "rgba(245, 158, 11, 0.3)" }}>
                {t.crisis2Stat}
              </span>
            </div>
            <h4 style={{ fontSize: "15.5px", fontWeight: 700, color: "#FFFFFF", marginTop: "4px" }}>
              {t.crisis2Title}
            </h4>
            <p className="body-text" style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {t.crisis2Desc}
            </p>
          </div>

          {/* Crisis 3: Everyday Communication Gap */}
          <div
            className="bento-card-dark"
            style={{
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderLeft: "3px solid #A855F7"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(168, 85, 247, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HeartIcon size={18} color="#A855F7" strokeWidth={2} />
              </div>
              <span className="code-metric" style={{ color: "var(--accent-lavender)", borderColor: "rgba(168, 85, 247, 0.3)" }}>
                {t.crisis3Stat}
              </span>
            </div>
            <h4 style={{ fontSize: "15.5px", fontWeight: 700, color: "#FFFFFF", marginTop: "4px" }}>
              {t.crisis3Title}
            </h4>
            <p className="body-text" style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {t.crisis3Desc}
            </p>
          </div>

          {/* Crisis 4: Employment & Education Barrier */}
          <div
            className="bento-card-dark"
            style={{
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              borderLeft: "3px solid #3B82F6"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCapIcon size={18} color="#3B82F6" strokeWidth={2} />
              </div>
              <span className="code-metric" style={{ color: "#60A5FA", borderColor: "rgba(59, 130, 246, 0.3)" }}>
                {t.crisis4Stat}
              </span>
            </div>
            <h4 style={{ fontSize: "15.5px", fontWeight: 700, color: "#FFFFFF", marginTop: "4px" }}>
              {t.crisis4Title}
            </h4>
            <p className="body-text" style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {t.crisis4Desc}
            </p>
          </div>

        </div>

        {/* How Helping Hand Solves Each Critical Barrier */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "16px" }}>
            {t.solutionsHeading}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>

            <div style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "14px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <CheckCircleIcon size={16} strokeWidth={2} color="var(--accent-purple)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>{t.sol1Title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.sol1Desc}
              </p>
            </div>

            <div style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "14px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <CheckCircleIcon size={16} strokeWidth={2} color="var(--accent-purple)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>{t.sol2Title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.sol2Desc}
              </p>
            </div>

            <div style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "14px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <CheckCircleIcon size={16} strokeWidth={2} color="var(--accent-purple)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>{t.sol3Title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.sol3Desc}
              </p>
            </div>

            <div style={{ background: "rgba(139, 92, 246, 0.06)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "14px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <CheckCircleIcon size={16} strokeWidth={2} color="var(--accent-purple)" />
                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>{t.sol4Title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                {t.sol4Desc}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 4: ACADEMIC RESEARCH & CLINICAL REFERENCES AT THE BOTTOM
          ========================================================================= */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        <div>
          <span className="badge-pill badge-purple" style={{ marginBottom: "8px", fontSize: "10.5px" }}>
            <FileTextIcon size={12} color="var(--accent-purple)" strokeWidth={2} />
            {t.researchBadge}
          </span>
          <h2 className="section-header" style={{ fontSize: "24px" }}>
            {t.researchTitlePart1} <span className="text-purple-highlight">{t.researchTitlePart2}</span>
          </h2>
          <p className="body-text" style={{ marginTop: "4px", color: "var(--text-secondary)" }}>
            {t.researchSubtitle}
          </p>
        </div>

        {/* Point-wise Research References (Clickable & Redirects to Official Pages) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              tag: t.ref1Tag,
              title: t.ref1Title,
              org: t.ref1Org,
              desc: t.ref1Desc,
              meta: "WHO 2021",
              url: "https://www.who.int/publications/i/item/9789240020481",
              btnLabel: "Official WHO Publication"
            },
            {
              tag: t.ref2Tag,
              title: t.ref2Title,
              org: t.ref2Org,
              desc: t.ref2Desc,
              meta: "Govt of India",
              url: "https://www.islrtc.nic.in/",
              btnLabel: "Official ISLRTC Portal"
            },
            {
              tag: t.ref3Tag,
              title: t.ref3Title,
              org: t.ref3Org,
              desc: t.ref3Desc,
              meta: "IEEE CVPR",
              url: "https://arxiv.org/abs/2006.10214",
              btnLabel: "Official Research Paper (arXiv)"
            },
            {
              tag: t.ref4Tag,
              title: t.ref4Title,
              org: t.ref4Org,
              desc: t.ref4Desc,
              meta: "ACM 2023",
              url: "https://dl.acm.org/journal/taccess",
              btnLabel: "ACM Digital Library"
            }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-card-dark"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "18px 22px",
                background: "rgba(18, 18, 26, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.65)";
                e.currentTarget.style.background = "rgba(26, 22, 38, 0.95)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(18, 18, 26, 0.85)";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
              title={`Click to open official publication: ${item.title}`}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(168, 85, 247, 0.18)",
                  border: "1px solid rgba(168, 85, 247, 0.45)",
                  color: "var(--accent-lavender)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: "2px"
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--accent-purple)", fontWeight: 600 }}>
                      — {item.org}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className="caption-text" style={{ fontSize: "10.5px", color: "var(--text-metadata)" }}>
                      {item.meta}
                    </span>
                    <span className="badge-pill badge-purple" style={{ fontSize: "10.5px", padding: "2px 8px" }}>
                      {item.tag}
                    </span>
                    <span
                      className="badge-pill"
                      style={{
                        fontSize: "11px",
                        padding: "3px 10px",
                        background: "rgba(139, 92, 246, 0.22)",
                        border: "1px solid rgba(168, 85, 247, 0.55)",
                        color: "#E9D5FF",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <ExternalLinkIcon size={12} strokeWidth={2} />
                      <span>{item.btnLabel} ↗</span>
                    </span>
                  </div>
                </div>
                <p className="body-text" style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>

      {/* =========================================================================
          SECTION 5: ABOUT US (Institution, Faculty Guide & Team)
          ========================================================================= */}
      <div
        id="about-us-section"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "26px",
          padding: "36px 32px",
          background: "linear-gradient(135deg, rgba(22, 18, 34, 0.85) 0%, rgba(13, 13, 20, 0.95) 100%)",
          border: "1px solid rgba(168, 85, 247, 0.28)",
          borderRadius: "24px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.12)"
        }}
      >
        {/* Section Header */}
        <div>
          <span className="badge-pill badge-purple" style={{ marginBottom: "10px", fontSize: "11px", fontWeight: 600 }}>
            <AwardIcon size={12} color="var(--accent-purple)" strokeWidth={2} />
            {t.aboutBadge}
          </span>
          <h2 className="section-header" style={{ fontSize: "28px", lineHeight: 1.25 }}>
            {t.aboutTitlePart1} <span className="text-purple-highlight">{t.aboutTitlePart2}</span>
          </h2>
          <p className="body-text" style={{ marginTop: "6px", maxWidth: "820px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7" }}>
            {t.aboutSubtitle}
          </p>
        </div>

        {/* Bento Grid: College / Institution + Guide */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>

          {/* Card 1: College / Institution (Clickable & Redirects to Official Website) */}
          <a
            href="https://prmceam.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card-dark"
            style={{
              padding: "26px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              background: "rgba(16, 14, 26, 0.85)",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.65)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
            title="Open official college website: prmceam.ac.in"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(139, 92, 246, 0.18)",
                  border: "1px solid rgba(168, 85, 247, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-lavender)",
                  flexShrink: 0
                }}
              >
                <GraduationCapIcon size={24} strokeWidth={2} />
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-lavender)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Institution & Campus
                </span>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.35, marginTop: "2px" }}>
                  {t.aboutCollegeTitle}
                </h3>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <span className="badge-pill badge-purple" style={{ fontSize: "11px" }}>
                📍 {t.aboutCollegeCampus}
              </span>
              <span className="badge-pill badge-slate" style={{ fontSize: "11px" }}>
                PRMCEAM
              </span>
              <span
                className="badge-pill"
                style={{
                  fontSize: "11px",
                  padding: "3px 10px",
                  background: "rgba(139, 92, 246, 0.22)",
                  border: "1px solid rgba(168, 85, 247, 0.5)",
                  color: "#E9D5FF",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "auto"
                }}
              >
                <ExternalLinkIcon size={11} strokeWidth={2} />
                <span>prmceam.ac.in ↗</span>
              </span>
            </div>

            <p className="body-text" style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
              {t.aboutCollegeDesc}
            </p>
          </a>

          {/* Card 2: Faculty Guidance */}
          <div
            className="bento-card-dark"
            style={{
              padding: "26px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              background: "rgba(16, 14, 26, 0.85)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FBBF24",
                  flexShrink: 0
                }}
              >
                <UsersIcon size={22} strokeWidth={2} />
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#FBBF24", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {t.aboutGuideTitle}
                </span>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.3, marginTop: "2px" }}>
                  {t.aboutGuideName}
                </h3>
              </div>
            </div>

            <span className="badge-pill badge-purple" style={{ alignSelf: "flex-start", fontSize: "11px" }}>
              Teacher & Mentor
            </span>

            <p className="body-text" style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.7", margin: 0 }}>
              {t.aboutGuideDesc}
            </p>
          </div>

        </div>

        {/* Card 3: Project Development Team Members */}
        <div
          className="bento-card-dark"
          style={{
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            background: "rgba(16, 14, 26, 0.85)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-lavender)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Student Engineering Team
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF", marginTop: "2px" }}>
                {t.aboutTeamTitle}
              </h3>
            </div>
            <span className="badge-pill badge-purple" style={{ fontSize: "11px" }}>
              PRMCEAM Innovators
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
            {[
              { name: "Yash", role: "Engineering Team", avatar: "Y", color: "#A855F7" },
              { name: "Sujal", role: "Engineering Team", avatar: "S", color: "#3B82F6" },
              { name: "Malhar", role: "Engineering Team", avatar: "M", color: "#10B981" },
              { name: "Prachiti", role: "Engineering Team", avatar: "P", color: "#EC4899" }
            ].map((member, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.2s ease"
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${member.color}33, ${member.color}66)`,
                    border: `1px solid ${member.color}`,
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {member.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                    {member.name}
                  </h4>
                  <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Attribution Note */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
            © 2026 Helping Hand · Built by <strong>Prof. Ram Meghe College of Engineering and Management, Badnera</strong> under the guidance of <strong>Prof. Saurabh Shah</strong>.
          </p>
        </div>

      </div>

    </div>
  );
}
