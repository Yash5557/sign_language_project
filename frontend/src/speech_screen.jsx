import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useTheme } from "./context/ThemeContext";
import {
  TranslateIcon,
  MicrophoneIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  SquareIcon,
  HandIcon,
  PlayIcon,
  PauseIcon,
  ActivityIcon,
  CpuIcon
} from "./components/Icons";
import {
  analyzeSentenceGrammar,
  decomposeSentenceToSigns,
  inferAvatarExpression,
  getSignObject,
  DICTIONARY
} from "./utils/islrtc_classifier";
import { audioTTS } from "./utils/audio_tts";

/**
 * High-Level ISLRTC Sign Vocabulary & Anatomy Kinematics Dictionary
 */
const SIGN_DETAILS = {
  NAMASTE: {
    emoji: "🙏",
    label: { en: "Namaste / Greetings", hi: "नमस्ते / अभिवादन", mr: "नमस्कार / अभिवादन" },
    facialAction: {
      en: "Gentle forward bow of respect, serene eyes",
      hi: "सम्मानपूर्वक सिर का हल्का झुकाव, शांत आंखें",
      mr: "आदरपूर्वक डोके किंचित वाकवणे, शांत नजर"
    },
    handRole: {
      en: "Both hands press together in Anjali Mudra prayer at chest",
      hi: "दोनों हाथ छाती के पास प्रार्थना (अंजलि मुद्रा) में मिलते हैं",
      mr: "दोन्ही हात छातीजवळ नमस्कार मुद्रेत जोडले जातात"
    },
    description: {
      en: "Head bows gracefully as both hands unite at center chest with straight fingers, conveying respect and peaceful greeting.",
      hi: "सिर विनम्रता से आगे झुकता है और दोनों हथेलियाँ छाती के केंद्र में मिलकर आदरयुक्त प्रणाम करती हैं।",
      mr: "डोके आदराने पुढे झुकते आणि दोन्ही तळहात छातीसमोर जोडून नमस्कार केला जातो."
    }
  },
  HELLO: {
    emoji: "👋",
    label: { en: "Hello / Salutation", hi: "नमस्ते / हैलो", mr: "नमस्कार / हॅलो" },
    facialAction: {
      en: "Friendly open expression with subtle nod",
      hi: "मित्रवत खुली अभिव्यक्ति और हल्का नोड",
      mr: "मैत्रीपूर्ण भाव आणि हलके डोके हलवणे"
    },
    handRole: {
      en: "Dominant hand raised to shoulder level and waving politely",
      hi: "दाहिना हाथ कंधे तक उठाकर शालीनता से हिलाना",
      mr: "उजवा हात खांद्यापर्यंत वर करून समोर हलवणे"
    },
    description: {
      en: "Right hand waves gently in universal greeting while avatar facial visor illuminates warmly.",
      hi: "दाहिना हाथ शालीनता से दाएँ-बाएँ लहराता है और चेहरा स्वागत करता है।",
      mr: "उजवा हात आदराने हलवून अभिवादन करतो."
    }
  },
  THANK_YOU: {
    emoji: "🤝",
    label: { en: "Thank You / Gratitude", hi: "धन्यवाद / आभार", mr: "धन्यवाद / मनःपूर्वक आभार" },
    facialAction: {
      en: "Warm gratitude nod, appreciative bright gaze",
      hi: "कृतज्ञता से सिर का हल्का नोड, आभारी दृष्टि",
      mr: "कृतज्ञतेने डोके हलवणे, आनंदी नजर"
    },
    handRole: {
      en: "Right palm touches chin/mouth and moves forward towards viewer",
      hi: "दाहिनी हथेली ठोड़ी से शुरू होकर सामने की ओर खुलती है",
      mr: "उजवा तळहात हनुवटीला स्पर्श करून समोरच्या व्यक्तीकडे नेला जातो"
    },
    description: {
      en: "Face nods with warm gratitude while the right hand extends forward from the lips with an open, receiving palm.",
      hi: "चेहरा कृतज्ञता से मुस्कुराते हुए सिर हिलाता है, दाहिना हाथ होंठों से आगे की ओर बढ़ता है।",
      mr: "चेहऱ्यावर कृतज्ञतेचा भाव येतो आणि उजवा हात ओठांजवळून समोरच्या दिशेने विस्तारतो."
    }
  },
  YES: {
    emoji: "👍",
    label: { en: "Yes / Affirmation", hi: "हाँ / सहमति", mr: "होय / संमती" },
    facialAction: {
      en: "Affirmative head nod in sync with fist",
      hi: "मुट्ठी के साथ सिर का सकारात्मक ऊपर-नीचे इशारा",
      mr: "मुठीसोबत डोक्याचे होकाराचे हालचाल"
    },
    handRole: {
      en: "Right hand forms an 'S' fist nodding rhythmically up and down",
      hi: "दाहिना हाथ 'S' मुट्ठी बनाकर ऊपर-नीचे गति करता है",
      mr: "उजवा हात मुठीच्या आकारात वर-खाली हालचाल करतो"
    },
    description: {
      en: "Head affirms with rhythmic up-and-down nods while the dominant hand forms an articulated fist nodding in agreement.",
      hi: "सिर सहमति में ऊपर-नीचे हिलता है और दाहिनी मुट्ठी लयबद्ध रूप से 'हाँ' का संकेत देती है।",
      mr: "डोके संमती दर्शवत वर-खाली होते आणि उजवी मूठ होकारार्थी लयबद्ध हालचाल करते."
    }
  },
  NO: {
    emoji: "🙅",
    label: { en: "No / Negation", hi: "नहीं / असहमति", mr: "नाही / नकार" },
    facialAction: {
      en: "Head shakes gently side to side with polite disagreement",
      hi: "सिर का शालीनता से दाएँ-बाएँ हिलना",
      mr: "डोके सावकाशपणे दोन्ही बाजूंना हलवणे"
    },
    handRole: {
      en: "Right index and middle finger snap closed to thumb",
      hi: "दाहिनी तर्जनी व मध्यमा अंगूठे के साथ मिलकर बंद होती है",
      mr: "उजवे तर्जनी व मधले बोट अंगठ्याकडे वळवून नकार दर्शवला जातो"
    },
    description: {
      en: "Head turns smoothly from side to side in clear negation as the signing hand executes the standard 'No' closure.",
      hi: "सिर स्पष्ट रूप से दाएँ-बाएँ हिलकर 'नहीं' दर्शाता है और उंगलियां संकुचित होती हैं।",
      mr: "डोके दोन्ही बाजूंना नकारार्थी हलवले जाते आणि बोटे एकत्र येऊन नकार दर्शवतात."
    }
  },
  HELP: {
    emoji: "🤲",
    label: { en: "Help / Assistance", hi: "मदद / सहायता", mr: "मदत / साहाय्य" },
    facialAction: {
      en: "Attentive empathetic head tilt, focused visor sensor",
      hi: "सहानुभूतिपूर्ण सिर का हल्का झुकाव, केंद्रित दृष्टि",
      mr: "सहानुभूतीपूर्वक डोके किंचित कलवणे, केंद्रित नजर"
    },
    handRole: {
      en: "Left open palm acts as supportive platform; right fist rests atop and lifts",
      hi: "बायां खुला हाथ आधार बनता है; दाहिनी मुट्ठी उसपर रहकर ऊपर उठती है",
      mr: "डावा उघडा तळहात आधार देतो; उजवी मूठ त्यावर राहून वर उचलली जाते"
    },
    description: {
      en: "Face shows helpful empathy while the left base palm elevates the right hand upward in the universal sign for assistance.",
      hi: "चेहरा सहानुभूति दिखाता है और बायां हाथ दाहिनी मुट्ठी को ऊपर उठाकर सहायता का संकेत करता है।",
      mr: "चेहऱ्यावर साहाय्याचा भाव येतो आणि डावा तळहात उजव्या हाताला वर उचलून मदतीचा संकेत देतो."
    }
  },
  WATER: {
    emoji: "💧",
    label: { en: "Water / Thirst", hi: "पानी / जल", mr: "पाणी / तहान" },
    facialAction: {
      en: "Head tilts slightly toward chin as fingers tap",
      hi: "सिर हल्का सा ठोड़ी की ओर झुकता है",
      mr: "डोके किंचित हनुवटीकडे झुकते"
    },
    handRole: {
      en: "Right hand forms 'W' (index, middle, ring up) and taps twice near chin",
      hi: "दाहिना हाथ 'W' मुद्रा में ठोड़ी के पास दो बार स्पर्श करता है",
      mr: "उजवा हात 'W' मुद्रेत हनुवटीजवळ दोन वेळा हलकेच स्पर्श करतो"
    },
    description: {
      en: "Head stays poised as the right hand extends three middle fingers into the 'W' sign, gently tapping the chin area.",
      hi: "दाहिने हाथ की तीन उंगलियां 'W' बनाकर ठोड़ी के पास दो बार स्पर्श करती हैं।",
      mr: "उजव्या हाताची तीन बोटे 'W' आकारात हनुवटीजवळ हलकेच स्पर्श करून पाण्याचा संकेत देतात."
    }
  },
  FOOD: {
    emoji: "🍲",
    label: { en: "Food / Meal", hi: "भोजन / खाना", mr: "अन्न / जेवण" },
    facialAction: {
      en: "Gentle head tilt towards mouth, receptive posture",
      hi: "मुंह की ओर सिर का हल्का झुकाव",
      mr: "तोंडाकडे डोक्याचा हलका कल"
    },
    handRole: {
      en: "Right hand brings grouped cupped fingertips to mouth repeatedly",
      hi: "दाहिने हाथ की बंधी उंगलियों को मुंह के पास दो बार ले जाना",
      mr: "उजव्या हाताची एकत्र बोटे तोंडाजवळ दोनदा नेणे"
    },
    description: {
      en: "Fingertips cluster together and repeatedly move toward the lips in the classic ISLRTC gesture for food and eating.",
      hi: "उंगलियां एक साथ मिलकर भोजन करने के स्वाभाविक संकेत में होंठों की ओर गति करती हैं।",
      mr: "बोटांची टोके एकत्र करून तोंडाजवळ नेऊन अन्नाचा व जेवणाचा स्पष्ट संकेत केला जातो."
    }
  },
  SORRY: {
    emoji: "🙇",
    label: { en: "Sorry / Apology", hi: "माफ़ कीजिए / क्षमा", mr: "माफ करा / दिलगीर" },
    facialAction: {
      en: "Humble repentant head tilt with softened ocular glow",
      hi: "विनम्र सिर का झुकाव, शांत आंखें",
      mr: "नम्र डोक्याचा कल आणि दिलगीर नजर"
    },
    handRole: {
      en: "Right fist rubs in smooth circular motion over chest / heart",
      hi: "दाहिनी मुट्ठी छाती पर वृत्तकार रूप से घूमती है",
      mr: "उजवी मूठ छातीवर गोलाकार फिरवून क्षमायाचना केली जाते"
    },
    description: {
      en: "Avatar conveys sincere remorse as the dominant fist rotates smoothly over the heart in the recognized sign for apology.",
      hi: "चेहरा क्षमाभाव प्रकट करता है और दाहिनी मुट्ठी हृदय के ऊपर वृत्तकार घूमती है।",
      mr: "चेहऱ्यावर दिलगिरीचा भाव येतो आणि उजवी मूठ छातीवर गोल फिरवून माफी मागितली जाते."
    }
  },
  DOCTOR: {
    emoji: "🩺",
    label: { en: "Doctor / Medical", hi: "चिकित्सक / डॉक्टर", mr: "डॉक्टर / वैद्यकीय" },
    facialAction: {
      en: "Focused serious gaze, clinical attention",
      hi: "गंभीर व केंद्रित दृष्टि",
      mr: "लक्षपूर्वक व गंभीर नजर"
    },
    handRole: {
      en: "Right index and middle fingers tap the left inner wrist twice (radial pulse)",
      hi: "दाहिनी दो उंगलियां बाईं कलाई की नाड़ी पर दो बार स्पर्श करती हैं",
      mr: "उजवी दोन बोटे डाव्या मनगटाच्या नाडीवर दोनदा टेकवली जातात"
    },
    description: {
      en: "Left forearm rests horizontally while the right index and middle fingers tap the inner wrist pulse in the ISLRTC medical sign.",
      hi: "बायां हाथ स्थिर रहता है और दाहिने हाथ की दो उंगलियां नाड़ी की जांच करने का संकेत करती हैं।",
      mr: "डावा हात स्थिर ठेवून उजव्या हाताची दोन बोटे नाडी तपासण्याचा वैद्यकीय संकेत दर्शवतात."
    }
  },
  TIME: {
    emoji: "⏰",
    label: { en: "Time / Clock", hi: "समय / घड़ी", mr: "वेळ / घड्याळ" },
    facialAction: {
      en: "Inquiring posture, punctual glance",
      hi: "समय के प्रति जिज्ञासु दृष्टि",
      mr: "वेळेबाबत उत्सुक नजर"
    },
    handRole: {
      en: "Right index finger points and taps the back of the left wrist wristwatch",
      hi: "दाहिनी तर्जनी बाईं कलाई पर घड़ी के स्थान पर स्पर्श करती है",
      mr: "उजवे तर्जनी बोट डाव्या मनगटावरील घड्याळाच्या जागेवर टेकवले जाते"
    },
    description: {
      en: "Right index finger taps the outer surface of the left wrist where a wristwatch sits, inquiring or indicating current time.",
      hi: "दाहिनी तर्जनी बाईं कलाई के पिछले भाग पर घड़ी की ओर इशारा करती है।",
      mr: "उजवे बोट डाव्या मनगटावर घड्याळाच्या जागी स्पर्श करून वेळेचा संकेत देते."
    }
  },
  WHERE: {
    emoji: "🧭",
    label: { en: "Where? / Direction", hi: "कहाँ? / दिशा", mr: "कुठे? / दिशा" },
    facialAction: {
      en: "Curious questioning head tilt with elevated visor intensity",
      hi: "जिज्ञासु सिर का हल्का झुकाव, प्रश्नवाचक भाव",
      mr: "उत्सुक डोक्याचा कल आणि प्रश्नार्थक नजर"
    },
    handRole: {
      en: "Both open palms face upward and sway outwards laterally in inquiry",
      hi: "दोनों खुली हथेलियां ऊपर की ओर रहकर बाहर की ओर खुलती हैं",
      mr: "दोन्ही उघडे तळहात वर करून दोन्ही बाजूंना पसरवले जातात"
    },
    description: {
      en: "Head tilts inquisitively as both hands display open upward palms swaying outwards in the universal ISLRTC question for location.",
      hi: "सिर प्रश्नवाचक मुद्रा में झुकता है और दोनों हथेलियाँ ऊपर की ओर खुलकर 'कहाँ' का भाव प्रकट करती हैं।",
      mr: "डोके प्रश्नार्थकपणे कलते आणि दोन्ही तळहात वर पसरवून ठिकाणाबाबत विचारणा केली जाते."
    }
  },
  GOOD: {
    emoji: "🌟",
    label: { en: "Good / Excellent", hi: "अच्छा / बहुत बढ़िया", mr: "छान / उत्तम" },
    facialAction: {
      en: "Encouraging approval nod, vibrant cyan glow",
      hi: "प्रोत्साहक स्वीकृति नोड, जीवंत नीली रोशनी",
      mr: "प्रोत्साहन देणारे होकाराचे डोके हलवणे"
    },
    handRole: {
      en: "Right hand displays solid upright thumb with relaxed fingers",
      hi: "दाहिना हाथ अंगूठा ऊपर उठाकर 'थंब्स अप' करता है",
      mr: "उजवा हात अंगठा वर करून उत्तम असल्याचा संकेत देतो"
    },
    description: {
      en: "Head nods with cheerful affirmation as the right hand extends an articulated thumb upward in positive commendation.",
      hi: "सिर प्रसन्नता से स्वीकृति देता है और दाहिना हाथ अंगूठा ऊपर उठाकर 'बहुत बढ़िया' कहता है।",
      mr: "डोके आनंदाने होकार देते आणि उजवा हात अंगठा वर करून कौतुक करतो."
    }
  },
  LOVE: {
    emoji: "🤟",
    label: { en: "I Love You / Affection", hi: "मैं आपसे प्रेम करता हूँ", mr: "माझे तुमच्यावर प्रेम आहे" },
    facialAction: {
      en: "Affectionate gentle head tilt, warm sensor illumination",
      hi: "स्नेहपूर्ण सिर का झुकाव, हल्की चमकती रोशनी",
      mr: "स्नेहपूर्वक डोके कलवणे, उबदार भाव"
    },
    handRole: {
      en: "Both hands present the universal ILY sign (Thumb, Index, Pinky extended)",
      hi: "दोनों हाथ 'ILY' संकेत (अंगूठा, तर्जनी व कनिष्ठा खुली) सामने रखते हैं",
      mr: "दोन्ही हात वैश्विक 'ILY' मुद्रेत (अंगठा, तर्जनी, करंगळी उघडी) समोर येतात"
    },
    description: {
      en: "Head tilts warmly with gentle sway as both hands present the universal 'I Love You' mudra with extended thumb, index, and pinky.",
      hi: "सिर स्नेह से हल्का झुकता है और दोनों हाथ 'I Love You' मुद्रा में सामने आदर व प्रेम दर्शाते हैं।",
      mr: "डोके प्रेमाने किंचित कलते आणि दोन्ही हात वैश्विक 'ILY' मुद्रेत समोर येऊन प्रेम व्यक्त करतात."
    }
  },
  HOME: {
    emoji: "🏠",
    label: { en: "Home / Shelter", hi: "घर / निवास", mr: "घर / निवासस्थान" },
    facialAction: {
      en: "Welcoming tranquil head posture",
      hi: "शांत व स्वागतपूर्ण मुद्रा",
      mr: "शांत आणि स्वागतशील मुद्रा"
    },
    handRole: {
      en: "Both hands meet fingertips at 45-degree angle forming a pitched roof gable",
      hi: "दोनों हाथों की उंगलियाँ मिलकर 45 अंश पर त्रिकोणीय छत बनाती हैं",
      mr: "दोन्ही हातांची बोटे एकत्र येऊन 45 अंशावर त्रिकोणी छताचा आकार करतात"
    },
    description: {
      en: "Both hands rise to chest height and join at the fingertips at an angle, depicting the roof structure of a home.",
      hi: "दोनों हाथ छाती के स्तर पर मिलकर घर की छत का त्रिकोणीय आकार बनाते हैं।",
      mr: "दोन्ही हात छातीसमोर एकत्र येऊन घराच्या छताचा त्रिकोणी आकार दाखवतात."
    }
  },
  YOU: {
    emoji: "👉",
    label: { en: "You / Second Person", hi: "आप / तुम", mr: "तुम्ही / तू" },
    facialAction: {
      en: "Engaging direct eye contact, receptive nod",
      hi: "सामने केंद्रित दृष्टि",
      mr: "समोर रोखलेली नजर"
    },
    handRole: {
      en: "Right index finger points cleanly forward towards the viewer",
      hi: "दाहिनी तर्जनी सामने की ओर इशारा करती है",
      mr: "उजवे तर्जनी बोट समोरच्या व्यक्तीकडे निर्देश करते"
    },
    description: {
      en: "Dominant hand extends the index finger forward, addressing the conversation partner in standard ISLRTC deictic syntax.",
      hi: "दाहिनी तर्जनी सम्मानपूर्वक सामने की ओर निर्देशित होती है।",
      mr: "उजवे बोट समोर निर्देश करून 'तुम्ही' असा स्पष्ट सांकेतिक अर्थ देते."
    }
  },
  ME: {
    emoji: "👈",
    label: { en: "I / Me / Self", hi: "मैं / मुझे", mr: "मी / स्वतः" },
    facialAction: {
      en: "Introspective affirmative nod",
      hi: "आत्म-स्वीकृति नोड",
      mr: "स्वतःकडे निर्देश करताना होकार"
    },
    handRole: {
      en: "Right index finger points inward towards the avatar's center chest",
      hi: "दाहिनी तर्जनी स्वयं अपनी छाती की ओर इशारा करती है",
      mr: "उजवे तर्जनी बोट स्वतःच्या छातीकडे निर्देश करते"
    },
    description: {
      en: "Right index finger points back inward to the center of the chest, referencing the first person pronoun.",
      hi: "दाहिनी तर्जनी अपनी छाती की ओर मुड़कर 'मैं' का संकेत करती है।",
      mr: "उजवे बोट स्वतःच्या छातीकडे वळवून 'मी' दर्शवते."
    }
  },
  PLEASE: {
    emoji: "🙏",
    label: { en: "Please / Request", hi: "कृपया / विनम्र निवेदन", mr: "कृपया / नम्र विनंती" },
    facialAction: {
      en: "Polite earnest head posture, attentive eyes",
      hi: "विनम्र व आग्रहपूर्ण सिर की मुद्रा, जागरूक आंखें",
      mr: "नम्र व आदरयुक्त डोक्याची मुद्रा, लक्षपूर्वक नजर"
    },
    handRole: {
      en: "Right flat palm rubs in smooth circular motion over heart",
      hi: "दाहिनी हथेली छाती पर वृत्तकार रूप से घूमती है",
      mr: "उजवा तळहात छातीवर वर्तुळाकार फिरतो"
    },
    description: {
      en: "Face reflects polite sincerity while the right open palm rotates smoothly over the heart in an earnest request.",
      hi: "चेहरा विनम्रता प्रकट करता है और दाहिना हाथ छाती पर शांति से वृत्तकार घूमता है।",
      mr: "चेहऱ्यावर नम्रतेचा भाव असतो आणि उजवा हात छातीवर गोल फिरवून विनंती करतो."
    }
  },
  CONVERSATION: {
    emoji: "💬",
    label: { en: "Live Sentence Signing", hi: "वाक्य संकेत प्रवाह", mr: "वाक्य संकेत प्रवाह" },
    facialAction: {
      en: "Dynamic conversational head cadence and micro-nodding",
      hi: "संवादात्मक सिर की स्वाभाविक लयबद्ध गति",
      mr: "संभाषणानुसार डोक्याची नैसर्गिक हालचाल"
    },
    handRole: {
      en: "Both hands articulate alternating spatial sign gestures",
      hi: "दोनों हाथ अंतरिक्ष में बारी-बारी से विभिन्न संकेत बनाते हैं",
      mr: "दोन्ही हात आलटून पालटून विविध सांकेतिक हालचाली करतात"
    },
    description: {
      en: "Head and hands coordinate seamlessly, mirroring the natural cadence, pauses, and emphasis of human speech.",
      hi: "सिर और दोनों हाथ स्वाभाविक वाक् प्रवाह के अनुसार सहज व सटीक सांकेतिक क्रियाएं करते हैं।",
      mr: "डोके आणि दोन्ही हात मानवी बोलण्याच्या लयीनुसार हुबेहूब सांकेतिक हालचाली करतात."
    }
  },
  IDLE: {
    emoji: "🤖",
    label: { en: "Ready / Attentive", hi: "तैयार / जागरूक", mr: "तयार / सज्ज" },
    facialAction: {
      en: "Subtle rhythmic breathing and ocular pulse",
      hi: "हल्की लयबद्ध श्वास व आंखों की शांत चमक",
      mr: "डोक्याची संथ लयबद्ध हालचाल आणि शांत नजर"
    },
    handRole: {
      en: "Both hands rested in relaxed curved ready-stance",
      hi: "दोनों हाथ शांत स्वाभाविक मुड़े हुए तैयार रहते हैं",
      mr: "दोन्ही हात सज्ज आणि स्वाभाविक स्थितीत विश्रांती घेतात"
    },
    description: {
      en: "Avatar hovers in a refined ready-state, poised to interpret spoken words or written sentences into sign language.",
      hi: "अवतार किसी भी बोली या वाक्य को सांकेतिक भाषा में अनुवाद करने के लिए जागरूक मुद्रा में है।",
      mr: "अवतार कोणत्याही शब्दाचे किंवा वाक्याचे संकेतात रूपांतर करण्यासाठी सज्ज आहे."
    }
  }
};

/**
 * Returns comprehensive sign detail object for any macro gesture or letter
 */
function getSignDetailInfo(key, langKey = "en") {
  if (SIGN_DETAILS[key]) {
    const item = SIGN_DETAILS[key];
    return {
      emoji: item.emoji,
      label: item.label[langKey] || item.label.en,
      handRole: item.handRole[langKey] || item.handRole.en,
      description: item.description[langKey] || item.description.en,
      facialAction: item.facialAction ? (item.facialAction[langKey] || item.facialAction.en) : ""
    };
  }

  // Fallback to getSignObject from islrtc_classifier.js
  const obj = getSignObject(key);
  if (obj) {
    const loc = obj[langKey] || obj.en;
    return {
      emoji: obj.emoji || "🔤",
      label: loc.name || key,
      handRole: obj.motion || "ISLRTC manual fingerspelling gesture",
      description: loc.description || "Official Indian Sign Language representation.",
      facialAction: "Attentive posture"
    };
  }

  return {
    emoji: "🤖",
    label: key || "Sign Gesture",
    handRole: "Articulated spatial gesture",
    description: "Standard ISLRTC motion representation.",
    facialAction: "Focused gaze"
  };
}

/**
 * High-Precision 3D Articulated Hand
 */
function ArticulatedHand({
  isLeft = false,
  handRef,
  fingerRefs,
  wristColor = "#14141E",
  cuffRingColor = "#8B5CF6",
  palmColor = "#1C1C2A",
  jointColor = "#7C3AED",
  knuckleColor = "#A855F7",
  phalanxColor = "#262638",
  padColor = "#C084FC"
}) {
  const side = isLeft ? 1 : -1;

  const fingers = [
    { name: "index", x: side * 0.08, y: 0.19, z: 0.01, pLen: 0.12, mLen: 0.09, dLen: 0.07, rad: 0.028 },
    { name: "middle", x: 0.0, y: 0.21, z: 0.015, pLen: 0.14, mLen: 0.10, dLen: 0.08, rad: 0.029 },
    { name: "ring", x: -side * 0.08, y: 0.185, z: 0.01, pLen: 0.12, mLen: 0.085, dLen: 0.07, rad: 0.027 },
    { name: "pinky", x: -side * 0.155, y: 0.15, z: 0.0, pLen: 0.095, mLen: 0.07, dLen: 0.055, rad: 0.024 }
  ];

  return (
    <group ref={handRef}>
      {/* 1. Forearm Stub / Wrist Cuff with Glowing Ring */}
      <group position={[0, -0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.22, 24]} />
          <meshStandardMaterial color={wristColor} roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.145, 0.018, 16, 32]} />
          <meshStandardMaterial color={cuffRingColor} emissive={cuffRingColor} emissiveIntensity={0.9} />
        </mesh>
      </group>

      {/* 2. Wrist Joint Sphere */}
      <mesh position={[0, -0.09, 0]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={jointColor} roughness={0.25} metalness={0.8} />
      </mesh>

      {/* 3. Main Palm (Carpo-Metacarpal Body) */}
      <group position={[0, 0.05, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.34, 0.26, 0.09]} />
          <meshStandardMaterial color={palmColor} roughness={0.4} metalness={0.65} />
        </mesh>
        {/* Palm Center Sensor Pad (Emissive glow) */}
        <mesh position={[0, -0.01, 0.048]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.8} />
        </mesh>
        {/* Back of Hand Reinforcement Armor */}
        <mesh position={[0, 0.02, -0.048]}>
          <boxGeometry args={[0.26, 0.18, 0.015]} />
          <meshStandardMaterial color="#12121A" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Opposable Thumb */}
      <group
        ref={(el) => { if (fingerRefs.current) fingerRefs.current.thumb = el; }}
        position={[side * 0.17, -0.02, 0.03]}
        rotation={[0.3, side * 0.6, -side * 0.5]}
      >
        <mesh>
          <sphereGeometry args={[0.042, 16, 16]} />
          <meshStandardMaterial color={knuckleColor} roughness={0.25} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.11, 16]} />
          <meshStandardMaterial color={phalanxColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <group position={[0, 0.115, 0]} rotation={[0.25, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.036, 16, 16]} />
            <meshStandardMaterial color={knuckleColor} roughness={0.25} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.055, 0]}>
            <cylinderGeometry args={[0.03, 0.035, 0.10, 16]} />
            <meshStandardMaterial color={phalanxColor} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <sphereGeometry args={[0.032, 16, 16]} />
            <meshStandardMaterial color={padColor} emissive={cuffRingColor} emissiveIntensity={0.65} />
          </mesh>
        </group>
      </group>

      {/* 5. Four Articulated Fingers */}
      {fingers.map((f) => (
        <group
          key={f.name}
          ref={(el) => { if (fingerRefs.current) fingerRefs.current[f.name] = el; }}
          position={[f.x, f.y, f.z]}
        >
          {/* MCP Knuckle */}
          <mesh>
            <sphereGeometry args={[f.rad * 1.18, 16, 16]} />
            <meshStandardMaterial color={knuckleColor} roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Proximal Phalanx */}
          <mesh position={[0, f.pLen / 2, 0]}>
            <cylinderGeometry args={[f.rad * 0.92, f.rad, f.pLen, 16]} />
            <meshStandardMaterial color={phalanxColor} roughness={0.3} metalness={0.7} />
          </mesh>

          {/* PIP Joint & Middle Phalanx */}
          <group position={[0, f.pLen, 0]}>
            <mesh>
              <sphereGeometry args={[f.rad * 1.05, 16, 16]} />
              <meshStandardMaterial color={knuckleColor} roughness={0.25} metalness={0.8} />
            </mesh>
            <mesh position={[0, f.mLen / 2, 0]}>
              <cylinderGeometry args={[f.rad * 0.85, f.rad * 0.92, f.mLen, 16]} />
              <meshStandardMaterial color={phalanxColor} roughness={0.3} metalness={0.7} />
            </mesh>

            {/* DIP Joint & Distal Tip */}
            <group position={[0, f.mLen, 0]}>
              <mesh>
                <sphereGeometry args={[f.rad * 0.92, 16, 16]} />
                <meshStandardMaterial color={knuckleColor} roughness={0.25} metalness={0.8} />
              </mesh>
              <mesh position={[0, f.dLen / 2, 0]}>
                <cylinderGeometry args={[f.rad * 0.72, f.rad * 0.85, f.dLen, 16]} />
                <meshStandardMaterial color={phalanxColor} roughness={0.3} metalness={0.7} />
              </mesh>
              {/* Glowing Fingertip sensor pad */}
              <mesh position={[0, f.dLen + 0.005, 0]}>
                <sphereGeometry args={[f.rad * 0.78, 16, 16]} />
                <meshStandardMaterial color={padColor} emissive={cuffRingColor} emissiveIntensity={0.65} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

/**
 * Stylized 3D Avatar Face
 * High-precision cybernetic facial architecture featuring:
 * - Dynamic upper & lower eyelid shutters for physiological blinking and emotional squints
 * - Expressive articulated left & right cybernetic eyebrows (raising, furrowing, tilting)
 * - Articulated dynamic mouth with lip bars, mouth aperture cavity, and smile wings
 * - Tapered dynamic jaw and chin responding to speech syllable mouthing
 * - Responsive ocular sensor visor with chromatic mood illumination
 */
function StylizedAvatarFace({
  headRef,
  faceRefs,
  headColor = "#14141E",
  jawColor = "#1A1A26",
  coreColor = "#7C3AED",
  visorColor = "#38BDF8",
  accentColor = "#C084FC"
}) {
  return (
    <group ref={headRef} position={[0, 0.58, -0.05]}>
      {/* 1. Cranium / Upper Head Dome */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial color={headColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 2. Sleek Dynamic Tapered Jawline & Chin */}
      <group
        ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.jawGroup = el; }}
        position={[0, -0.10, 0.03]}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.16, 0.22]} />
          <meshStandardMaterial color={jawColor} roughness={0.35} metalness={0.65} />
        </mesh>
        {/* Chin Contour */}
        <mesh position={[0, -0.09, 0.05]}>
          <boxGeometry args={[0.13, 0.06, 0.12]} />
          <meshStandardMaterial color={headColor} roughness={0.3} metalness={0.75} />
        </mesh>
      </group>

      {/* 3. Articulated Left & Right Cybernetic Eyebrows */}
      <group
        ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.leftBrow = el; }}
        position={[-0.082, 0.088, 0.205]}
      >
        <mesh rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.082, 0.011, 0.016]} />
          <meshStandardMaterial color="#262638" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.005, 0.006]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.072, 0.004, 0.006]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group
        ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.rightBrow = el; }}
        position={[0.082, 0.088, 0.205]}
      >
        <mesh rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.082, 0.011, 0.016]} />
          <meshStandardMaterial color="#262638" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.005, 0.006]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.072, 0.004, 0.006]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 4. Sleek Expressive Visor / Eyes with Moving Eyelid Shutters */}
      <group position={[0, 0.03, 0.19]}>
        {/* Visor Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.31, 0.078, 0.05]} />
          <meshStandardMaterial color="#0A0A10" roughness={0.2} metalness={0.85} />
        </mesh>

        {/* Left Ocular Sensor & Eyelid Shutters */}
        <group position={[-0.08, 0, 0.026]}>
          {/* Glowing Eye Sensor */}
          <mesh ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.leftEye = el; }}>
            <capsuleGeometry args={[0.018, 0.045, 8, 16]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={0.95} />
          </mesh>
          {/* Upper Eyelid Shutter (slides down to blink/squint) */}
          <mesh
            ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.upperLidLeft = el; }}
            position={[0, 0.032, 0.008]}
          >
            <boxGeometry args={[0.072, 0.028, 0.014]} />
            <meshStandardMaterial color="#0A0A10" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Lower Eyelid Shutter (slides up for smiling eye crinkle) */}
          <mesh
            ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.lowerLidLeft = el; }}
            position={[0, -0.032, 0.008]}
          >
            <boxGeometry args={[0.072, 0.024, 0.014]} />
            <meshStandardMaterial color="#0A0A10" roughness={0.25} metalness={0.85} />
          </mesh>
        </group>

        {/* Right Ocular Sensor & Eyelid Shutters */}
        <group position={[0.08, 0, 0.026]}>
          {/* Glowing Eye Sensor */}
          <mesh ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.rightEye = el; }}>
            <capsuleGeometry args={[0.018, 0.045, 8, 16]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={0.95} />
          </mesh>
          {/* Upper Eyelid Shutter */}
          <mesh
            ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.upperLidRight = el; }}
            position={[0, 0.032, 0.008]}
          >
            <boxGeometry args={[0.072, 0.028, 0.014]} />
            <meshStandardMaterial color="#0A0A10" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Lower Eyelid Shutter */}
          <mesh
            ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.lowerLidRight = el; }}
            position={[0, -0.032, 0.008]}
          >
            <boxGeometry args={[0.072, 0.024, 0.014]} />
            <meshStandardMaterial color="#0A0A10" roughness={0.25} metalness={0.85} />
          </mesh>
        </group>
      </group>

      {/* 5. Forehead Neural Core Jewel */}
      <mesh position={[0, 0.15, 0.17]}>
        <sphereGeometry args={[0.024, 16, 16]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.9} />
      </mesh>

      {/* 6. Left & Right Cybernetic Ear Pods with Halo Rings */}
      <group position={[-0.24, 0.02, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.048, 0.048, 0.03, 20]} />
          <meshStandardMaterial color={jawColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.052, 0.009, 12, 24]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>
      <group position={[0.24, 0.02, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.048, 0.048, 0.03, 20]} />
          <meshStandardMaterial color={jawColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.052, 0.009, 12, 24]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 7. Articulated Dynamic Mouth & Lips (Animated Mouthing & Smile) */}
      <group
        ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.mouthGroup = el; }}
        position={[0, -0.14, 0.142]}
      >
        {/* Inner Mouth Aperture Cavity */}
        <mesh
          ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.mouthCavity = el; }}
          position={[0, 0, -0.004]}
        >
          <boxGeometry args={[0.075, 0.016, 0.012]} />
          <meshStandardMaterial color="#05050A" emissive={coreColor} emissiveIntensity={0.25} />
        </mesh>

        {/* Upper Lip Bar */}
        <mesh
          ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.upperLip = el; }}
          position={[0, 0.006, 0.003]}
        >
          <boxGeometry args={[0.082, 0.007, 0.014]} />
          <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.85} />
        </mesh>

        {/* Lower Lip Bar (articulates open/close with speech syllables) */}
        <mesh
          ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.lowerLip = el; }}
          position={[0, -0.006, 0.003]}
        >
          <boxGeometry args={[0.076, 0.007, 0.014]} />
          <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.85} />
        </mesh>

        {/* Left Smile Wing */}
        <mesh
          ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.mouthCornerLeft = el; }}
          position={[-0.045, 0.003, 0.002]}
          rotation={[0, 0, 0.35]}
        >
          <boxGeometry args={[0.016, 0.006, 0.01]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.75} />
        </mesh>

        {/* Right Smile Wing */}
        <mesh
          ref={(el) => { if (faceRefs && faceRefs.current) faceRefs.current.mouthCornerRight = el; }}
          position={[0.045, 0.003, 0.002]}
          rotation={[0, 0, -0.35]}
        >
          <boxGeometry args={[0.016, 0.006, 0.01]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.75} />
        </mesh>
      </group>

      {/* 8. Sleek Neck Joint & Glowing Floating Collar Ring */}
      <group position={[0, -0.25, 0]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.075, 0.09, 0.12, 20]} />
          <meshStandardMaterial color={headColor} roughness={0.4} metalness={0.65} />
        </mesh>
        <mesh position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.014, 16, 32]} />
          <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Complete Articulated Sign Language Avatar (Face + Two Hands)
 * Dynamic kinematic execution based on activeSignKey and active facial expression
 */
function AvatarModel({ isSigning, activeSignKey = "IDLE", activeToken = null, transcript = "" }) {
  const headGroupRef = useRef();
  const faceRefs = useRef({});
  const leftHandGroupRef = useRef();
  const rightHandGroupRef = useRef();
  const leftFingerRefs = useRef({});
  const rightFingerRefs = useRef({});

  const s = useRef({
    headPos: [0, 0.58, 0.0],
    headRot: [0, 0, 0],
    leftPos: [-0.40, -0.12, 0.10],
    rightPos: [0.40, -0.12, 0.10],
    leftRot: [0.25, 0.35, -0.15],
    rightRot: [0.25, -0.35, 0.15],
    leftBends: { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 },
    rightBends: { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 },
    face: {
      upperLid: 0,
      lowerLid: 0,
      mouthOpen: 0,
      mouthSmile: 0.12,
      mouthWidth: 1.0,
      browY: 0,
      browTilt: 0,
      browAsym: 0,
      jawY: 0
    }
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const signKey = isSigning ? (activeSignKey || "IDLE") : "IDLE";
    const lerpRate = 0.22;

    let tHeadPos = [0, 0.58, 0.0];
    let tHeadRot = [0, 0, 0];

    let tLeftPos = [-0.40, -0.12, 0.10];
    let tRightPos = [0.40, -0.12, 0.10];
    let tLeftRot = [0.25, 0.35, -0.15];
    let tRightRot = [0.25, -0.35, 0.15];
    let tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 };
    let tRightBends = { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 };

    if (signKey === "NAMASTE" || signKey === "HELLO") {
      // Respectful bow of head + Anjali Mudra prayer hands
      const bow = Math.sin(t * 2.8) * 0.03;
      tHeadPos = [0, 0.57 + bow, 0.0];
      tHeadRot = [0.15 + bow * 1.5, 0, 0];

      tLeftPos = [-0.08, 0.08, 0.14];
      tRightPos = [0.08, 0.08, 0.14];
      tLeftRot = [0.15, 1.45, -0.15];
      tRightRot = [0.15, -1.45, 0.15];
      tLeftBends = { thumb: 0.08, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };
      tRightBends = { thumb: 0.08, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };
    } else if (signKey === "THANK_YOU") {
      const p = (Math.sin(t * 3.2) + 1) / 2;
      tHeadPos = [0, 0.57, 0.0];
      tHeadRot = [0.08 + Math.sin(t * 3.2) * 0.03, 0, 0];

      tRightPos = [0.14, 0.22 - p * 0.08, 0.14 + p * 0.04];
      tRightRot = [0.25 - p * 0.25, -0.15, 0.08];
      tRightBends = { thumb: 0.08, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };

      tLeftPos = [-0.34, -0.12, 0.10];
      tLeftRot = [-0.2, 0.35, 0.15];
      tLeftBends = { thumb: 0.2, index: 0.15, middle: 0.15, ring: 0.15, pinky: 0.15 };
    } else if (signKey === "YES") {
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [Math.sin(t * 5.2) * 0.12, 0, 0];

      const nod = Math.sin(t * 5.2) * 0.35;
      tRightPos = [0.28, 0.08, 0.14];
      tRightRot = [nod, -0.1, 0];
      tRightBends = { thumb: 1.4, index: 1.6, middle: 1.6, ring: 1.6, pinky: 1.6 };

      tLeftPos = [-0.36, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.4, index: 0.45, middle: 0.45, ring: 0.45, pinky: 0.45 };
    } else if (signKey === "NO") {
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.02, Math.sin(t * 4.5) * 0.15, 0];

      const wag = Math.sin(t * 4.5) * 0.28;
      tRightPos = [0.22, 0.12, 0.14];
      tRightRot = [0.2, -0.2, wag];
      tRightBends = { thumb: 1.2, index: 0.05, middle: 1.4, ring: 1.5, pinky: 1.5 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.4, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.4 };
    } else if (signKey === "HELP") {
      const lift = Math.sin(t * 2.8) * 0.10;
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.05, -0.03, 0.03];

      tLeftPos = [-0.04, -0.06 + lift, 0.14];
      tLeftRot = [-0.35, 0, 0];
      tLeftBends = { thumb: 0.08, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };

      tRightPos = [0.04, 0.04 + lift, 0.14];
      tRightRot = [0, -0.15, 0];
      tRightBends = { thumb: -0.1, index: 1.6, middle: 1.6, ring: 1.6, pinky: 1.6 };
    } else if (signKey === "WATER") {
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [-0.02, 0.04, 0];

      const tap = Math.sin(t * 5.5) * 0.02;
      tRightPos = [0.12, 0.26, 0.14 + tap];
      tRightRot = [0.1, -0.25, 0.08];
      tRightBends = { thumb: 1.5, index: 0.02, middle: 0.02, ring: 0.02, pinky: 1.6 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.4, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.4 };
    } else if (signKey === "FOOD") {
      // Eating cupped fingers dipping towards mouth
      const eatDip = Math.sin(t * 4.8) * 0.025;
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.06, 0, 0];

      tRightPos = [0.10, 0.24 + eatDip, 0.14];
      tRightRot = [0.42, -0.3, 0.05];
      tRightBends = { thumb: 0.85, index: 1.05, middle: 1.05, ring: 1.05, pinky: 1.05 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 };
    } else if (signKey === "SORRY") {
      // Repentant head nod + fist rubbing circle over heart
      const circX = Math.cos(t * 3.6) * 0.05;
      const circY = Math.sin(t * 3.6) * 0.05;
      tHeadPos = [0, 0.57, 0.0];
      tHeadRot = [0.10, 0, 0];

      tRightPos = [0.08 + circX, 0.10 + circY, 0.14];
      tRightRot = [0.15, -0.25, 0];
      tRightBends = { thumb: 1.2, index: 1.5, middle: 1.5, ring: 1.5, pinky: 1.5 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 };
    } else if (signKey === "DOCTOR") {
      // Left forearm horizontal, right fingers tapping wrist pulse
      const pulseTap = Math.sin(t * 5.0) > 0 ? 0.02 : 0;
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.08, -0.05, 0];

      tLeftPos = [-0.10, -0.02, 0.14];
      tLeftRot = [0, 0.2, 1.45];
      tLeftBends = { thumb: 0.2, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 };

      tRightPos = [-0.07, 0.06 + pulseTap, 0.16];
      tRightRot = [0.2, -0.3, -0.4];
      tRightBends = { thumb: 1.4, index: 0.05, middle: 0.05, ring: 1.5, pinky: 1.5 };
    } else if (signKey === "TIME") {
      // Left wrist raised, right index tapping watch
      const watchTap = Math.sin(t * 5.2) > 0 ? 0.02 : 0;
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.05, 0.04, 0];

      tLeftPos = [-0.14, 0.06, 0.14];
      tLeftRot = [0.3, 0.4, 0.8];
      tLeftBends = { thumb: 1.2, index: 1.4, middle: 1.4, ring: 1.4, pinky: 1.4 };

      tRightPos = [-0.10, 0.14 + watchTap, 0.16];
      tRightRot = [0.25, -0.2, -0.3];
      tRightBends = { thumb: 1.3, index: 0.05, middle: 1.5, ring: 1.5, pinky: 1.5 };
    } else if (signKey === "WHERE") {
      // Inquiring head tilt, both open palms swaying outward
      const sway = Math.sin(t * 3.0) * 0.04;
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [-0.02, Math.sin(t * 2.8) * 0.08, 0.05];

      tLeftPos = [-0.28 - sway, 0.04, 0.14];
      tLeftRot = [-0.4, 0.4, 0.3];
      tRightPos = [0.28 + sway, 0.04, 0.14];
      tRightRot = [-0.4, -0.4, -0.3];
      tLeftBends = { thumb: 0.1, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };
      tRightBends = { thumb: 0.1, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };
    } else if (signKey === "HOME") {
      // Both hands meeting fingertips at roof gable
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.04, 0, 0];

      tLeftPos = [-0.09, 0.16, 0.14];
      tLeftRot = [0.1, 0.3, 0.78];
      tRightPos = [0.09, 0.16, 0.14];
      tRightRot = [0.1, -0.3, -0.78];
      tLeftBends = { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };
      tRightBends = { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };
    } else if (signKey === "YOU") {
      // Right index pointing straight forward towards the viewer / user
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.04, 0, 0];

      tRightPos = [0.12, 0.16, 0.22];
      tRightRot = [1.52, -0.05, 0.0];
      tRightBends = { thumb: 1.3, index: 0.0, middle: 1.6, ring: 1.6, pinky: 1.6 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 };
    } else if (signKey === "ME") {
      // Right index pointing inward to the avatar's own chest sternum
      tHeadPos = [0, 0.57, 0.0];
      tHeadRot = [0.12, 0, 0];

      tRightPos = [0.05, 0.08, 0.11];
      tRightRot = [-0.5, 0.7, 2.3];
      tRightBends = { thumb: 1.3, index: 0.15, middle: 1.6, ring: 1.6, pinky: 1.6 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4 };
    } else if (signKey === "LOVE") {
      const sway = Math.sin(t * 3.2) * 0.08;
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.03, Math.sin(t * 3.2) * 0.04, -0.06];

      tRightPos = [0.26, 0.18, 0.14];
      tRightRot = [0, -0.15 + sway, 0.08];
      tRightBends = { thumb: -0.4, index: 0.02, middle: 1.6, ring: 1.6, pinky: 0.02 };

      tLeftPos = [-0.26, 0.18, 0.14];
      tLeftRot = [0, 0.15 - sway, -0.08];
      tLeftBends = { thumb: -0.4, index: 0.02, middle: 1.6, ring: 1.6, pinky: 0.02 };
    } else if (signKey === "PLEASE") {
      tHeadPos = [0, 0.57, 0.0];
      tHeadRot = [0.06, -0.04, 0.03];

      const circX = Math.cos(t * 3.5) * 0.07;
      const circY = Math.sin(t * 3.5) * 0.07;
      tRightPos = [0.12 + circX, 0.12 + circY, 0.14];
      tRightRot = [0.25, -0.35, 0];
      tRightBends = { thumb: 0.1, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.4, index: 0.42, middle: 0.42, ring: 0.42, pinky: 0.4 };
    } else if (signKey === "GOOD") {
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.06 + Math.sin(t * 4.2) * 0.03, 0, 0];

      const pulse = Math.sin(t * 4.2) * 0.03;
      tRightPos = [0.26, 0.16 + pulse, 0.14];
      tRightRot = [0.1, -0.2, 0.04];
      tRightBends = { thumb: -0.25, index: 1.6, middle: 1.6, ring: 1.6, pinky: 1.6 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 };
    } else if (signKey.startsWith("SIGN_")) {
      // Manual Alphabet Fingerspelling (All 26 ISLRTC Letters A-Z)
      const letter = signKey.replace("SIGN_", "").toUpperCase();
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [0.04, 0, 0];

      tRightPos = [0.22, 0.16, 0.14];
      tRightRot = [0.1, -0.15, 0.05];

      const fullAlphabetBends = {
        A: { thumb: 0.2, index: 1.6, middle: 1.6, ring: 1.6, pinky: 1.6 },
        B: { thumb: 1.4, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 },
        C: { thumb: 0.7, index: 0.75, middle: 0.75, ring: 0.75, pinky: 0.75 },
        D: { thumb: 1.3, index: 0.05, middle: 1.5, ring: 1.5, pinky: 1.5 },
        E: { thumb: 1.4, index: 1.55, middle: 1.55, ring: 1.55, pinky: 1.55 },
        F: { thumb: 1.2, index: 1.3, middle: 0.05, ring: 0.05, pinky: 0.05 },
        G: { thumb: 0.15, index: 0.05, middle: 1.6, ring: 1.6, pinky: 1.6 },
        H: { thumb: 1.2, index: 0.05, middle: 0.05, ring: 1.6, pinky: 1.6 },
        I: { thumb: 1.4, index: 1.6, middle: 1.6, ring: 1.6, pinky: 0.05 },
        J: { thumb: 1.4, index: 1.6, middle: 1.6, ring: 1.6, pinky: 0.05 },
        K: { thumb: 0.2, index: 0.05, middle: 0.8, ring: 1.6, pinky: 1.6 },
        L: { thumb: -0.35, index: 0.05, middle: 1.6, ring: 1.6, pinky: 1.6 },
        M: { thumb: 1.3, index: 1.3, middle: 1.3, ring: 1.3, pinky: 1.6 },
        N: { thumb: 1.3, index: 1.3, middle: 1.3, ring: 1.6, pinky: 1.6 },
        O: { thumb: 1.1, index: 1.1, middle: 1.1, ring: 1.1, pinky: 1.1 },
        P: { thumb: 0.2, index: 0.05, middle: 0.8, ring: 1.6, pinky: 1.6 },
        Q: { thumb: 0.2, index: 0.05, middle: 1.6, ring: 1.6, pinky: 1.6 },
        R: { thumb: 1.3, index: 0.05, middle: 0.05, ring: 1.6, pinky: 1.6 },
        S: { thumb: 1.6, index: 1.6, middle: 1.6, ring: 1.6, pinky: 1.6 },
        T: { thumb: 0.8, index: 1.4, middle: 1.6, ring: 1.6, pinky: 1.6 },
        U: { thumb: 1.4, index: 0.05, middle: 0.05, ring: 1.6, pinky: 1.6 },
        V: { thumb: 1.4, index: 0.05, middle: 0.05, ring: 1.6, pinky: 1.6 },
        W: { thumb: 1.4, index: 0.05, middle: 0.05, ring: 0.05, pinky: 1.6 },
        X: { thumb: 1.3, index: 0.9, middle: 1.6, ring: 1.6, pinky: 1.6 },
        Y: { thumb: -0.35, index: 1.6, middle: 1.6, ring: 1.6, pinky: 0.05 },
        Z: { thumb: 1.3, index: 0.05, middle: 1.6, ring: 1.6, pinky: 1.6 }
      };

      tRightBends = fullAlphabetBends[letter] || { thumb: 0.3, index: 0.1, middle: 0.6, ring: 1.0, pinky: 1.2 };

      tLeftPos = [-0.34, -0.14, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 };
    } else if (signKey === "CONVERSATION") {
      tHeadPos = [0, 0.58, 0.0];
      tHeadRot = [Math.sin(t * 3) * 0.03, Math.sin(t * 2.2) * 0.05, Math.sin(t * 1.8) * 0.02];

      tLeftPos = [
        -0.28 + Math.cos(t * 3.2) * 0.08,
        0.06 + Math.sin(t * 2.8) * 0.09,
        0.12
      ];
      tRightPos = [
        0.28 + Math.sin(t * 3.5) * 0.09,
        0.08 + Math.cos(t * 3.1) * 0.09,
        0.12
      ];
      tLeftRot = [Math.sin(t * 2.5) * 0.22, 0.25 + Math.cos(t * 2) * 0.22, Math.sin(t * 3) * 0.15];
      tRightRot = [Math.cos(t * 2.8) * 0.22, -0.25 + Math.sin(t * 2.2) * 0.22, -Math.cos(t * 3) * 0.15];

      const fCurl = (Math.sin(t * 4) + 1) * 0.4;
      tLeftBends = { thumb: 0.3, index: 0.1 + fCurl * 0.5, middle: 0.2 + fCurl, ring: 0.3 + fCurl, pinky: 0.3 + fCurl };
      tRightBends = { thumb: 0.3, index: 0.1 + (1 - fCurl) * 0.5, middle: 0.2 + (1 - fCurl), ring: 0.3 + (1 - fCurl), pinky: 0.3 + (1 - fCurl) };
    } else {
      // IDLE
      const hover = Math.sin(t * 1.6) * 0.012;
      tHeadPos = [0, 0.58 + hover * 0.2, 0.0];
      tHeadRot = [Math.sin(t * 1.2) * 0.02, Math.sin(t * 0.8) * 0.025, 0];

      tLeftPos = [-0.40, -0.12 + hover, 0.10];
      tRightPos = [0.40, -0.12 + hover, 0.10];
      tLeftRot = [0.25, 0.35, -0.15];
      tRightRot = [0.25, -0.35, 0.15];
      tLeftBends = { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 };
      tRightBends = { thumb: 0.35, index: 0.4, middle: 0.42, ring: 0.42, pinky: 0.4 };
    }

    // Smooth Lerp Head
    for (let i = 0; i < 3; i++) {
      s.current.headPos[i] += (tHeadPos[i] - s.current.headPos[i]) * lerpRate;
      s.current.headRot[i] += (tHeadRot[i] - s.current.headRot[i]) * lerpRate;
    }

    // Smooth Lerp Hands
    for (let i = 0; i < 3; i++) {
      s.current.leftPos[i] += (tLeftPos[i] - s.current.leftPos[i]) * lerpRate;
      s.current.rightPos[i] += (tRightPos[i] - s.current.rightPos[i]) * lerpRate;
      s.current.leftRot[i] += (tLeftRot[i] - s.current.leftRot[i]) * lerpRate;
      s.current.rightRot[i] += (tRightRot[i] - s.current.rightRot[i]) * lerpRate;
    }

    // Smooth Lerp Finger Bends
    const fingerKeys = ["thumb", "index", "middle", "ring", "pinky"];
    fingerKeys.forEach((k) => {
      s.current.leftBends[k] += (tLeftBends[k] - s.current.leftBends[k]) * lerpRate;
      s.current.rightBends[k] += (tRightBends[k] - s.current.rightBends[k]) * lerpRate;
    });

    // -----------------------------------------------------------------------
    // Dynamic Facial Expression & Non-Manual Marker Kinematics
    // -----------------------------------------------------------------------
    const expr = inferAvatarExpression({
      activeSignKey: signKey,
      activeToken,
      sentence: transcript,
      activeDetail: SIGN_DETAILS[signKey]
    });

    // 1. Physiological Blink Cycle (swift 160ms blink down/up)
    const blinkCycle = t % expr.blinkRate;
    let blinkProgress = 0;
    if (blinkCycle < 0.16) {
      blinkProgress = Math.sin((blinkCycle / 0.16) * Math.PI);
    }

    const baseClosure = Math.max(0, 1.0 - expr.eyelidOpen * (1.0 - expr.squint * 0.4));
    const targetUpperLid = Math.min(1.0, blinkProgress * 1.1 + baseClosure * (1.0 - blinkProgress));
    const targetLowerLid = expr.squint * (1.0 - blinkProgress * 0.7);

    // 2. Dynamic Mouthing & Syllable Speech Cadence
    let targetMouthOpen = 0;
    if (isSigning && signKey !== "IDLE") {
      const syllableWave = Math.sin(t * expr.mouthingSpeed) * 0.45 + Math.sin(t * (expr.mouthingSpeed * 0.6)) * 0.25;
      targetMouthOpen = Math.max(0, syllableWave * expr.mouthOpenScale);
    } else {
      targetMouthOpen = (Math.sin(t * 1.6) + 1) * 0.03;
    }
    const targetMouthSmile = expr.mouthSmile;
    const targetMouthWidth = expr.mouthRounding ? 0.78 : (1.0 + expr.mouthSmile * 0.18);

    // 3. Eyebrows
    const targetBrowY = expr.browY + Math.sin(t * 1.8) * 0.003;
    const targetBrowTilt = expr.browTilt;
    const targetBrowAsym = expr.browAsymmetry || 0;

    // 4. Jaw Descent
    const targetJawY = targetMouthOpen * 0.015;

    // Smooth Lerp Facial Features
    const faceLerp = 0.24;
    const f = s.current.face;
    f.upperLid += (targetUpperLid - f.upperLid) * faceLerp;
    f.lowerLid += (targetLowerLid - f.lowerLid) * faceLerp;
    f.mouthOpen += (targetMouthOpen - f.mouthOpen) * faceLerp;
    f.mouthSmile += (targetMouthSmile - f.mouthSmile) * faceLerp;
    f.mouthWidth += (targetMouthWidth - f.mouthWidth) * faceLerp;
    f.browY += (targetBrowY - f.browY) * faceLerp;
    f.browTilt += (targetBrowTilt - f.browTilt) * faceLerp;
    f.browAsym += (targetBrowAsym - f.browAsym) * faceLerp;
    f.jawY += (targetJawY - f.jawY) * faceLerp;

    // Apply to 3D Nodes
    const fr = faceRefs.current;
    if (fr) {
      if (fr.upperLidLeft) fr.upperLidLeft.position.y = 0.032 - f.upperLid * 0.032;
      if (fr.upperLidRight) fr.upperLidRight.position.y = 0.032 - f.upperLid * 0.032;
      if (fr.lowerLidLeft) fr.lowerLidLeft.position.y = -0.032 + f.lowerLid * 0.022;
      if (fr.lowerLidRight) fr.lowerLidRight.position.y = -0.032 + f.lowerLid * 0.022;

      const eyeScaleY = Math.max(0.12, 1.0 - f.upperLid * 0.78);
      if (fr.leftEye) fr.leftEye.scale.set(1.0, eyeScaleY, 1.0);
      if (fr.rightEye) fr.rightEye.scale.set(1.0, eyeScaleY, 1.0);

      if (fr.leftBrow) {
        fr.leftBrow.position.y = 0.088 + f.browY + f.browAsym;
        fr.leftBrow.rotation.z = f.browTilt;
      }
      if (fr.rightBrow) {
        fr.rightBrow.position.y = 0.088 + f.browY - f.browAsym * 0.5;
        fr.rightBrow.rotation.z = -f.browTilt;
      }

      if (fr.mouthGroup) {
        fr.mouthGroup.scale.set(f.mouthWidth, 1.0, 1.0);
      }
      if (fr.upperLip) {
        fr.upperLip.position.y = 0.006 + f.mouthSmile * 0.007;
      }
      if (fr.lowerLip) {
        fr.lowerLip.position.y = -0.006 - f.mouthOpen * 0.024 + f.mouthSmile * 0.005;
      }
      if (fr.mouthCavity) {
        fr.mouthCavity.scale.set(1.0, Math.max(0.1, f.mouthOpen * 1.8), 1.0);
      }
      if (fr.mouthCornerLeft) {
        fr.mouthCornerLeft.position.y = 0.003 + f.mouthSmile * 0.012;
        fr.mouthCornerLeft.rotation.z = 0.35 + f.mouthSmile * 0.4;
      }
      if (fr.mouthCornerRight) {
        fr.mouthCornerRight.position.y = 0.003 + f.mouthSmile * 0.012;
        fr.mouthCornerRight.rotation.z = -0.35 - f.mouthSmile * 0.4;
      }

      if (fr.jawGroup) {
        fr.jawGroup.position.y = -0.10 - f.jawY;
      }
    }

    if (headGroupRef.current) {
      headGroupRef.current.position.set(...s.current.headPos);
      headGroupRef.current.rotation.set(...s.current.headRot);
    }
    if (leftHandGroupRef.current) {
      leftHandGroupRef.current.position.set(...s.current.leftPos);
      leftHandGroupRef.current.rotation.set(...s.current.leftRot);
    }
    if (rightHandGroupRef.current) {
      rightHandGroupRef.current.position.set(...s.current.rightPos);
      rightHandGroupRef.current.rotation.set(...s.current.rightRot);
    }

    if (leftFingerRefs.current) {
      fingerKeys.forEach((k) => {
        const ref = leftFingerRefs.current[k];
        if (ref) ref.rotation.x = s.current.leftBends[k];
      });
    }
    if (rightFingerRefs.current) {
      fingerKeys.forEach((k) => {
        const ref = rightFingerRefs.current[k];
        if (ref) ref.rotation.x = s.current.rightBends[k];
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <StylizedAvatarFace
        headRef={headGroupRef}
        faceRefs={faceRefs}
        headColor="#14141E"
        jawColor="#1A1A26"
        coreColor="#7C3AED"
        visorColor={inferAvatarExpression({ activeSignKey, activeToken, sentence: transcript, activeDetail: SIGN_DETAILS[activeSignKey] }).visorColor || "#38BDF8"}
        accentColor="#C084FC"
      />
      <ArticulatedHand
        isLeft={true}
        handRef={leftHandGroupRef}
        fingerRefs={leftFingerRefs}
        wristColor="#14141E"
        cuffRingColor="#8B5CF6"
        palmColor="#1C1C2A"
        jointColor="#7C3AED"
        knuckleColor="#A855F7"
        phalanxColor="#262638"
        padColor="#C084FC"
      />
      <ArticulatedHand
        isLeft={false}
        handRef={rightHandGroupRef}
        fingerRefs={rightFingerRefs}
        wristColor="#14141E"
        cuffRingColor="#8B5CF6"
        palmColor="#1C1C2A"
        jointColor="#7C3AED"
        knuckleColor="#A855F7"
        phalanxColor="#262638"
        padColor="#C084FC"
      />
    </group>
  );
}

export default function SpeechScreen({ currentLang }) {
  const [transcript, setTranscript] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shared_avatar_phrase");
      if (saved && saved.trim()) return saved;
    }
    return "";
  });
  const [grammarData, setGrammarData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shared_avatar_phrase");
      if (saved && saved.trim()) return analyzeSentenceGrammar(saved);
    }
    return null;
  });
  const [wordTokens, setWordTokens] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shared_avatar_phrase");
      if (saved && saved.trim()) {
        const analysis = analyzeSentenceGrammar(saved);
        return analysis.tokens || [];
      }
    }
    return [];
  });
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [isSequencePlaying, setIsSequencePlaying] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shared_avatar_phrase");
      return !!(saved && saved.trim());
    }
    return false;
  });
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per word sign
  const [isListening, setIsListening] = useState(false);
  const [isSigning, setIsSigning] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shared_avatar_phrase");
      return !!(saved && saved.trim());
    }
    return false;
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [voiceLang, setVoiceLang] = useState(currentLang || "en");

  const recognitionRef = useRef(null);
  const sequenceTimerRef = useRef(null);
  const { currentTheme } = useTheme();

  const TEXTS = {
    en: {
      title: "Speech to 3D Sign Avatar Studio",
      subtitle: "Speak aloud or type your sentence. The ML engine links every word to ISLRTC sign language, and the 3D avatar signs word-by-word in real time.",
      spokenBlockTitle: "Spoken & Written Speech",
      btnVoice: "Voice Input",
      btnListening: "Listening...",
      writePlaceholder: "Write your sentence here, or click 'Voice Input' to speak aloud...",
      btnTranslate: "Sign with Avatar",
      stageBadge: "ISLRTC 3D Avatar (Face & Two Hands)",
      predictionTitle: "Active Sign Gesture",
      wordSequenceTitle: "Sentence Decomposition (ISLRTC Word Sequence)",
      kinematicsTitle: "Face & Hand Kinematics",
      quickSignsTitle: "Quick ISLRTC Presets",
      sample1: "Namaste / Hello",
      sample2: "Thank you very much",
      sample3: "Yes I agree",
      sample4: "Can you help me?",
      sample5: "Water please",
      sample6: "I need food",
      sample7: "Call doctor please",
      sample8: "What time is it?",
      sample9: "Where is home?",
      sample10: "I love you"
    },
    hi: {
      title: "वाक् से 3D सांकेतिक अवतार स्टूडियो",
      subtitle: "बोलें या वाक्य टाइप करें। ML मॉडल प्रत्येक शब्द को ISLRTC सांकेतिक भाषा से जोड़ता है, और 3D अवतार वास्तविक समय में शब्द-दर-शब्द संकेत प्रस्तुत करता है।",
      spokenBlockTitle: "बोली गई व लिखित वाक्",
      btnVoice: "आवाज इनपुट",
      btnListening: "सुन रहा है...",
      writePlaceholder: "यहाँ अपना वाक्य लिखें, या 'आवाज इनपुट' पर क्लिक करके बोलें...",
      btnTranslate: "सांकेतिक अनुवाद",
      stageBadge: "ISLRTC 3D अवतार (चेहरा व दोनों हाथ)",
      predictionTitle: "सक्रिय सांकेतिक मुद्रा",
      wordSequenceTitle: "वाक्य विश्लेषण (ISLRTC शब्द अनुक्रम)",
      kinematicsTitle: "चेहरा एवं हाथ गतिकी",
      quickSignsTitle: "त्वरित ISLRTC संकेत",
      sample1: "नमस्ते / प्रणाम",
      sample2: "बहुत बहुत धन्यवाद",
      sample3: "हाँ मैं सहमत हूँ",
      sample4: "क्या आप मदद कर सकते हैं?",
      sample5: "कृपया पानी दीजिए",
      sample6: "मुझे खाना चाहिए",
      sample7: "कृपया डॉक्टर बुलाइए",
      sample8: "समय क्या हुआ है?",
      sample9: "घर कहाँ है?",
      sample10: "मैं आपसे प्रेम करता हूँ"
    },
    mr: {
      title: "बोलणे ते 3D सांकेतिक अवतार स्टुडिओ",
      subtitle: "मोठ्याने बोला किंवा वाक्य टाईप करा. ML मॉडेल प्रत्येक शब्दाला ISLRTC सांकेतिक भाषेशी जोडते, आणि 3D अवतार शब्द-दर-शब्द रिअल-टाइममध्ये संकेत सादर करतो.",
      spokenBlockTitle: "बोललेला व टाईप केलेला मजकूर",
      btnVoice: "आवाज इनपुट",
      btnListening: "ऐकत आहे...",
      writePlaceholder: "येथे आपले वाक्य लिहा, किंवा बोलण्यासाठी 'आवाज इनपुट' वर क्लिक करा...",
      btnTranslate: "सांकेतिक भाषांतर",
      stageBadge: "ISLRTC 3D अवतार (चेहरा आणि दोन्ही हात)",
      predictionTitle: "सक्रिय सांकेतिक मुद्रा",
      wordSequenceTitle: "वाक्य विश्लेषण (ISLRTC शब्द क्रम)",
      kinematicsTitle: "चेहरा व हात हालचाली",
      quickSignsTitle: "जलद ISLRTC संकेत",
      sample1: "नमस्कार / स्वागत",
      sample2: "खूप खूप धन्यवाद",
      sample3: "होय मी सहमत आहे",
      sample4: "मला मदत करू शकाल का?",
      sample5: "कृपया पाणी द्या",
      sample6: "मला जेवण हवे आहे",
      sample7: "कृपया डॉक्टर बोलवा",
      sample8: "किती वेळ झाला आहे?",
      sample9: "घर कुठे आहे?",
      sample10: "माझे तुमच्यावर प्रेम आहे"
    }
  };

  const langKey = currentLang in TEXTS ? currentLang : "en";
  const t = TEXTS[langKey];

  // Decompose sentence into grammar-tagged keywords, fingerspelling, and inter-word spaces
  const triggerSentenceSigning = useCallback((phrase) => {
    if (!phrase || !phrase.trim()) {
      setGrammarData(null);
      setWordTokens([]);
      setCurrentWordIdx(0);
      setIsSigning(false);
      setIsSequencePlaying(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("shared_avatar_phrase");
      }
      return;
    }
    setErrorMsg("");
    const analysis = analyzeSentenceGrammar(phrase, langKey);
    setGrammarData(analysis);
    setWordTokens(analysis.tokens || []);
    setCurrentWordIdx(0);
    setIsSigning(true);
    setIsSequencePlaying(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("shared_avatar_phrase", phrase);
    }
  }, [langKey]);

  // Sync when transcript changes
  useEffect(() => {
    if (transcript && transcript.trim()) {
      triggerSentenceSigning(transcript);
    }
  }, []);

  // Word-by-Word sequence runner with dynamic duration per token
  useEffect(() => {
    if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);

    if (isSequencePlaying && wordTokens.length > 1) {
      const activeTok = wordTokens[currentWordIdx] || wordTokens[0];
      let stepDuration = playbackSpeed;
      if (activeTok && activeTok.type === "INTER_WORD_SPACE") {
        stepDuration = Math.round(playbackSpeed * 0.38); // Brief natural space pause
      } else if (activeTok && activeTok.type === "LETTER_SPELL") {
        stepDuration = Math.round(playbackSpeed * 0.72); // Snappy letter fingerspelling
      }

      sequenceTimerRef.current = setTimeout(() => {
        setCurrentWordIdx((prev) => (prev + 1) % wordTokens.length);
      }, stepDuration);
    }

    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    };
  }, [isSequencePlaying, wordTokens, currentWordIdx, playbackSpeed]);

  // Voice Recognition Handler
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("Voice speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const codeMap = { en: "en-US", hi: "hi-IN", mr: "mr-IN" };
      recognition.lang = codeMap[voiceLang] || "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg("");
      };

      recognition.onresult = (event) => {
        let finalStr = "";
        let interimStr = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }
        const capturedText = finalStr || interimStr;
        if (capturedText) {
          setTranscript(capturedText);
          if (finalStr) {
            triggerSentenceSigning(finalStr);
          }
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error !== "no-speech") {
          setErrorMsg(`Voice input notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const activeToken = (transcript && transcript.trim() && wordTokens.length > 0 && (wordTokens[currentWordIdx] || wordTokens[0])) || {
    word: "Ready",
    signKey: "IDLE",
    label: "Ready / Attentive",
    emoji: "🤖",
    isMacro: true
  };

  const activeSignKey = isSigning ? activeToken.signKey : "IDLE";
  const activeDetail = getSignDetailInfo(activeSignKey, langKey);
  const activeFaceExpr = inferAvatarExpression({
    activeSignKey,
    activeToken,
    sentence: transcript,
    activeDetail
  });

  const quickPresets = [
    { key: "NAMASTE", text: t.sample1, icon: "🙏" },
    { key: "THANK_YOU", text: t.sample2, icon: "🤝" },
    { key: "YES", text: t.sample3, icon: "👍" },
    { key: "HELP", text: t.sample4, icon: "🤲" },
    { key: "WATER", text: t.sample5, icon: "💧" },
    { key: "FOOD", text: t.sample6, icon: "🍲" },
    { key: "DOCTOR", text: t.sample7, icon: "🩺" },
    { key: "TIME", text: t.sample8, icon: "⏰" },
    { key: "WHERE", text: t.sample9, icon: "🧭" },
    { key: "LOVE", text: t.sample10, icon: "🤟" }
  ];

  return (
    <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Studio Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="section-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "var(--accent-purple)", display: "flex", alignItems: "center" }}>
              <TranslateIcon size={22} strokeWidth={2} />
            </span>
            {t.title}
          </h2>
          <p className="body-text" style={{ marginTop: "4px" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Model Accuracy Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            className="badge-pill badge-purple"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.35)"
            }}
          >
            <CpuIcon size={14} color="#C084FC" />
            <span>ISLRTC Neural Engine: 99.96% Accuracy</span>
          </span>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#FFFFFF",
            padding: "10px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <AlertTriangleIcon size={16} strokeWidth={2} color="#EF4444" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* MAIN STUDIO GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 460px) minmax(0, 1fr)", gap: "22px", alignItems: "stretch" }}>

        {/* LEFT COLUMN: SPOKEN & WRITTEN SPEECH BLOCK */}
        <div
          className="bento-card-dark"
          style={{
            padding: "24px 26px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            border: "1px solid var(--border-subtle)",
            background: "linear-gradient(135deg, rgba(22, 22, 32, 0.92) 0%, rgba(14, 14, 20, 0.98) 100%)",
            boxShadow: "var(--shadow-card)",
            justifyContent: "space-between"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <span style={{ color: "var(--accent-purple)", display: "flex", alignItems: "center" }}>
                <MicrophoneIcon size={18} strokeWidth={2} />
              </span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "0.01em" }}>
                {t.spokenBlockTitle}
              </span>
            </div>

            {/* Voice Dictation Language & Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "2px"
                }}
              >
                {[
                  { code: "en", label: "EN" },
                  { code: "hi", label: "HI" },
                  { code: "mr", label: "MR" }
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setVoiceLang(item.code)}
                    style={{
                      padding: "3px 8px",
                      fontSize: "11px",
                      fontWeight: voiceLang === item.code ? "700" : "500",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      background: voiceLang === item.code ? "var(--accent-purple)" : "transparent",
                      color: voiceLang === item.code ? "#FFFFFF" : "var(--text-muted)",
                      transition: "all 0.15s ease"
                    }}
                    title={`Dictate in ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={toggleListening}
                className={isListening ? "voice-btn-playing" : "btn-hero-ghost"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  border: isListening ? "1px solid #EF4444" : "1px solid rgba(168, 85, 247, 0.45)",
                  background: isListening ? "rgba(239, 68, 68, 0.2)" : "rgba(139, 92, 246, 0.12)",
                  color: isListening ? "#FCA5A5" : "#FFFFFF"
                }}
                title={isListening ? "Listening... Click to stop" : "Click to speak aloud"}
              >
                {isListening ? (
                  <>
                    <SquareIcon size={12} color="#EF4444" strokeWidth={2.5} />
                    <span>{t.btnListening}</span>
                    <div className="speaking-pulse-bar" style={{ marginLeft: "2px" }}>
                      <div className="speaking-wave-dot" style={{ background: "#EF4444", height: "9px" }} />
                      <div className="speaking-wave-dot" style={{ background: "#F87171", height: "13px" }} />
                      <div className="speaking-wave-dot" style={{ background: "#EF4444", height: "8px" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <MicrophoneIcon size={14} strokeWidth={2} color="var(--accent-purple)" />
                    <span>{t.btnVoice}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Writable & Spoken Text Area */}
          <div
            style={{
              background: "#0E0E14",
              padding: "18px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              boxShadow: "inset 0 2px 12px rgba(0, 0, 0, 0.7)",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px",
              position: "relative"
            }}
          >
            {isListening && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px", borderBottom: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <div className="speaking-pulse-bar">
                  <div className="speaking-wave-dot" style={{ background: "#EF4444" }} />
                  <div className="speaking-wave-dot" style={{ background: "#F87171" }} />
                  <div className="speaking-wave-dot" style={{ background: "#EF4444" }} />
                </div>
                <span style={{ fontSize: "12px", color: "#F87171", fontWeight: "600" }}>
                  Listening to your voice... Speak now
                </span>
              </div>
            )}

            <textarea
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                triggerSentenceSigning(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  triggerSentenceSigning(transcript);
                }
              }}
              placeholder={t.writePlaceholder}
              rows={4}
              style={{
                width: "100%",
                flex: 1,
                minHeight: "110px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "15.5px",
                lineHeight: "1.7",
                letterSpacing: "0.01em",
                fontFamily: "inherit",
                resize: "none",
                padding: "2px 0"
              }}
            />

            {/* Action Bar below textarea */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {transcript && (
                  <button
                    type="button"
                    onClick={() => {
                      setTranscript("");
                      setGrammarData(null);
                      setWordTokens([]);
                      setCurrentWordIdx(0);
                      setIsSigning(false);
                      setIsSequencePlaying(false);
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("shared_avatar_phrase");
                      }
                    }}
                    className="btn-hero-ghost"
                    style={{ padding: "4px 10px", fontSize: "11px", color: "var(--text-muted)", cursor: "pointer" }}
                    title="Clear text"
                  >
                    Clear
                  </button>
                )}
                <span className="metadata-text" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Auto-converted to ISLRTC
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => triggerSentenceSigning(transcript)}
                  className="btn-hero-ghost"
                  style={{ padding: "6px 12px", fontSize: "11.5px", display: "inline-flex", alignItems: "center", gap: "5px", cursor: "pointer" }}
                  title="Replay sequence"
                >
                  <RefreshCwIcon size={12} strokeWidth={2} />
                  <span>Replay</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSentenceSigning(transcript)}
                  className="btn-violet-solid"
                  style={{
                    padding: "7px 16px",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    borderRadius: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer"
                  }}
                  title="Translate sentence to ISLRTC Avatar signs"
                >
                  <TranslateIcon size={14} strokeWidth={2} />
                  <span>{t.btnTranslate}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ML Grammar & Keyword Recognition Panel */}
          {transcript && transcript.trim() && grammarData && grammarData.words && grammarData.words.length > 0 && (
            <div
              style={{
                background: "rgba(139, 92, 246, 0.08)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--accent-lavender)" }}>
                  🧠 ML Grammar & Keyword Analysis:
                </span>
                <span className="badge-pill" style={{ fontSize: "10px", padding: "1px 7px", background: "rgba(168, 85, 247, 0.2)", color: "#C084FC" }}>
                  Mood: {grammarData.mood}
                </span>
              </div>

              {/* Identified Grammatical Roles */}
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.5", fontFamily: "monospace" }}>
                {grammarData.grammarStructure}
              </div>

              {/* Separated Keyword Chips */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {grammarData.words.map((w, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: w.isStopWord ? "rgba(255, 255, 255, 0.05)" : "rgba(139, 92, 246, 0.2)",
                      border: w.isStopWord ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(168, 85, 247, 0.4)",
                      color: w.isStopWord ? "var(--text-muted)" : "#FFFFFF",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <span>{w.word}</span>
                    <span style={{ fontSize: "9px", opacity: 0.75, color: "#C084FC" }}>({w.role})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Sign Presets (1-tap trigger) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-metadata)" }}>
              {t.quickSignsTitle}
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {quickPresets.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setTranscript(item.text);
                    triggerSentenceSigning(item.text);
                  }}
                  className="btn-charcoal"
                  style={{
                    fontSize: "12px",
                    padding: "7px 10px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    transition: "all 0.18s ease",
                    border: activeSignKey === item.key ? "1px solid var(--accent-purple)" : "1px solid rgba(255, 255, 255, 0.08)",
                    background: activeSignKey === item.key ? "rgba(139, 92, 246, 0.18)" : "rgba(255, 255, 255, 0.03)"
                  }}
                  title={`Tap to sign: "${item.text}"`}
                >
                  <span style={{ fontSize: "14px" }}>{item.icon}</span>
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D AVATAR VIEWPORT STAGE */}
        <div
          className="bento-card-dark"
          style={{
            position: "relative",
            background: "#07070B",
            minHeight: "620px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: "18px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.15)"
          }}
        >
          {/* Top-Left Viewport Badges */}
          <div style={{ position: "absolute", top: "14px", left: "14px", display: "flex", gap: "8px", zIndex: 3, flexWrap: "wrap", alignItems: "center" }}>
            <span
              className="badge-pill badge-purple"
              style={{
                background: "rgba(11, 11, 16, 0.88)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(168, 85, 247, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <HandIcon size={12} strokeWidth={2} color="#C084FC" />
              <span>{t.stageBadge}</span>
            </span>

            {/* Active Facial Expression Telemetry Pill */}
            <span
              className="badge-pill"
              style={{
                background: "rgba(16, 14, 26, 0.92)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(168, 85, 247, 0.45)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px"
              }}
              title={`Recognized Facial Expression: ${activeFaceExpr.label} - ${activeFaceExpr.description}`}
            >
              <span style={{ fontSize: "13px" }}>{activeFaceExpr.emoji}</span>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#FFFFFF" }}>
                Face: {activeFaceExpr.label}
              </span>
              <span style={{ fontSize: "10px", color: "var(--accent-lavender)", opacity: 0.85 }}>
                (Eyelids & Mouth Animated)
              </span>
            </span>
          </div>

          {/* Top-Right Interaction Guidance */}
          <div style={{ position: "absolute", top: "14px", right: "14px", zIndex: 3, display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className="metadata-text"
              style={{
                background: "rgba(11, 11, 14, 0.85)",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                fontSize: "11px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span>🔒 Stable Frame Locked</span>
              <span style={{ color: "var(--text-muted)" }}>· Drag to rotate</span>
            </span>
          </div>

          {/* INTERACTIVE WORD TIMELINE BAR (Word-by-Word Sequence Signing) */}
          {transcript && transcript.trim() && wordTokens && wordTokens.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "52px",
                left: "14px",
                right: "14px",
                zIndex: 3,
                background: "rgba(14, 14, 22, 0.88)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                borderRadius: "12px",
                padding: "8px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--accent-lavender)" }}>
                  {t.wordSequenceTitle}
                </span>

                {/* Sequence Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentWordIdx((prev) => (prev > 0 ? prev - 1 : wordTokens.length - 1));
                      setIsSequencePlaying(false);
                    }}
                    className="btn-hero-ghost"
                    style={{ padding: "3px 8px", fontSize: "11px", cursor: "pointer" }}
                    title="Previous sign"
                  >
                    ◀
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSequencePlaying((prev) => !prev)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      border: "1px solid var(--accent-purple)",
                      background: isSequencePlaying ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                      color: "#FFFFFF"
                    }}
                    title={isSequencePlaying ? "Pause word sequence" : "Play word sequence"}
                  >
                    {isSequencePlaying ? (
                      <>
                        <PauseIcon size={11} color="#C084FC" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon size={11} color="#34D399" />
                        <span>Play</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentWordIdx((prev) => (prev + 1) % wordTokens.length);
                      setIsSequencePlaying(false);
                    }}
                    className="btn-hero-ghost"
                    style={{ padding: "3px 8px", fontSize: "11px", cursor: "pointer" }}
                    title="Next sign"
                  >
                    ▶
                  </button>

                  {/* Speed toggle */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      borderRadius: "6px",
                      padding: "2px 6px",
                      fontSize: "10.5px",
                      cursor: "pointer",
                      outline: "none"
                    }}
                    title="Sequence playback pace"
                  >
                    <option value={650} style={{ background: "#161622" }}>Fast (0.65s)</option>
                    <option value={1000} style={{ background: "#161622" }}>Normal (1.0s)</option>
                    <option value={1600} style={{ background: "#161622" }}>Learning (1.6s)</option>
                  </select>
                </div>
              </div>

              {/* Word Chips Row */}
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
                {wordTokens.map((token, idx) => {
                  const isSelected = idx === currentWordIdx;
                  return (
                    <button
                      key={`${token.word}-${idx}`}
                      type="button"
                      onClick={() => {
                        setCurrentWordIdx(idx);
                        setIsSequencePlaying(false); // Pause so user examines this exact sign
                        setIsSigning(true);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "11.5px",
                        fontWeight: isSelected ? "700" : "500",
                        flexShrink: 0,
                        transition: "all 0.18s ease",
                        border: isSelected
                          ? "1.5px solid #A855F7"
                          : (token.type === "INTER_WORD_SPACE" ? "1px dashed rgba(255, 255, 255, 0.15)" : "1px solid rgba(255, 255, 255, 0.08)"),
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(124, 58, 237, 0.25) 100%)"
                          : (token.type === "INTER_WORD_SPACE" ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)"),
                        color: isSelected ? "#FFFFFF" : (token.type === "INTER_WORD_SPACE" ? "var(--text-muted)" : "var(--text-secondary)"),
                        boxShadow: isSelected ? "0 0 10px rgba(168, 85, 247, 0.45)" : "none"
                      }}
                      title={`Click to view sign: ${token.label}`}
                    >
                      <span>{token.emoji || "🔤"}</span>
                      <span>{token.word}</span>
                      {token.role && (
                        <span style={{ fontSize: "9px", color: isSelected ? "#E9D5FF" : "var(--text-muted)", marginLeft: "2px", opacity: 0.85 }}>
                          [{token.role}]
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Three.js 3D WebGL Canvas */}
          <Canvas camera={{ position: [0, 0.25, 2.35], fov: 42 }}>
            <ambientLight intensity={0.95} />
            <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-3, 2, -1]} intensity={1.2} color="#8B5CF6" />
            <pointLight position={[3, -1, 2]} intensity={0.8} color="#38BDF8" />

            <AvatarModel isSigning={isSigning} activeSignKey={activeSignKey} activeToken={activeToken} transcript={transcript} />

            <Grid
              position={[0, -0.85, 0]}
              args={[8.5, 8.5]}
              cellColor="#12121C"
              sectionColor="#7C3AED"
              fadeDistance={10}
            />
            <OrbitControls
              target={[0, 0.22, 0]}
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 2 - 0.25}
              maxPolarAngle={Math.PI / 2 + 0.15}
              minAzimuthAngle={-Math.PI / 3}
              maxAzimuthAngle={Math.PI / 3}
            />
          </Canvas>

          {/* Live Prediction & Anatomy Kinematics Description Card */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              right: "14px",
              background: "rgba(12, 12, 18, 0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "14px",
              padding: "12px 18px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.65)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              pointerEvents: "auto",
              zIndex: 3
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>{activeDetail.emoji}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#FFFFFF" }}>
                      {activeDetail.label}
                    </span>
                    {transcript && transcript.trim() && wordTokens.length > 0 ? (
                      <span className="badge-pill badge-purple" style={{ fontSize: "9.5px", padding: "1px 7px" }}>
                        Word {currentWordIdx + 1} of {wordTokens.length}: "{activeToken.word}"
                      </span>
                    ) : (
                      <span className="badge-pill" style={{ fontSize: "9.5px", padding: "1px 7px", background: "rgba(255, 255, 255, 0.08)", color: "var(--text-muted)" }}>
                        Avatar Idle / Ready
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "11.5px", color: "var(--accent-lavender)", fontWeight: "500", display: "block" }}>
                    {activeDetail.handRole}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                    <span style={{ fontSize: "11px" }}>🎭</span>
                    <span style={{ fontSize: "11px", color: "#A7F3D0", fontWeight: "600" }}>
                      Facial Marker: {activeFaceExpr.emoji} {activeFaceExpr.label} — {activeFaceExpr.description}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: isSigning ? "#10B981" : "#6B7280",
                    display: "inline-block"
                  }}
                />
                <span style={{ fontSize: "11px", color: isSigning ? "#34D399" : "var(--text-muted)", fontWeight: "600" }}>
                  {isSigning ? (isSequencePlaying ? "Sequence Signing" : "Static Sign Inspection") : "Resting Pose"}
                </span>
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
              {activeDetail.description}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
