import { classifyISLRTCHands, DICTIONARY, MOTHER_TONGUES } from "../frontend/src/utils/islrtc_classifier.js";

console.log("Mother tongues supported:", MOTHER_TONGUES.map(m => m.code).join(", "));
console.log("Dictionary classes:", Object.keys(DICTIONARY));

// Dummy 21 hand landmarks
const dummyLandmarks = [];
for (let i = 0; i < 21; i++) {
  dummyLandmarks.push({ x: 0.5 + i * 0.01, y: 0.5 + i * 0.01, z: 0.0 });
}

const result = classifyISLRTCHands(null, dummyLandmarks);
console.log("Inference test result:", result);
if (result) {
  console.log("Key:", result.key);
  console.log("Confidence:", result.conf + "%");
  console.log("Sentence (EN):", result.sentences.en);
  console.log("Sentence (MR):", result.sentences.mr);
  console.log("Sentence (HI):", result.sentences.hi);
}
