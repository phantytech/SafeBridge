import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Types - 23 total gestures
export type DetectedGesture = 
  | "HELLO" | "YES" | "SOS" | "PEACE" 
  | "NO" | "THANK YOU" | "PLEASE" | "SORRY" 
  | "HELP" | "LOVE" | "GOOD" | "BAD" 
  | "STOP" | "OK" | "CALL" | "WAIT"
  | "COME" | "GO" | "EAT" | "DRINK"
  | "SLEEP" | "HAPPY" | "SAD"
  | null;

// Helper to calculate distance between two points
const getDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Helper to check if two fingertips are touching
const areTouching = (p1: NormalizedLandmark, p2: NormalizedLandmark, threshold = 0.05) => {
  return getDistance(p1, p2) < threshold;
};

export const detectGesture = (landmarks: NormalizedLandmark[], mode: 'ASL' | 'BdSL' = 'ASL'): DetectedGesture => {
  if (!landmarks || landmarks.length < 21) return null;
  
  // Route to appropriate detection function
  if (mode === 'BdSL') {
    return detectBdSLGesture(landmarks);
  }
  return detectASLGesture(landmarks);
};

const detectASLGesture = (landmarks: NormalizedLandmark[]): DetectedGesture => {
  if (!landmarks || landmarks.length < 21) return null;

  // Landmarks indices
  // Thumb: 1-4 (4 is tip)
  // Index: 5-8 (8 is tip)
  // Middle: 9-12 (12 is tip)
  // Ring: 13-16 (16 is tip)
  // Pinky: 17-20 (20 is tip)
  // Wrist: 0

  const wrist = landmarks[0];
  
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  const thumbMCP = landmarks[2];
  
  const indexTip = landmarks[8];
  const indexDIP = landmarks[7];
  const indexPIP = landmarks[6];
  const indexMCP = landmarks[5];
  
  const middleTip = landmarks[12];
  const middleDIP = landmarks[11];
  const middlePIP = landmarks[10];
  const middleMCP = landmarks[9];
  
  const ringTip = landmarks[16];
  const ringDIP = landmarks[15];
  const ringPIP = landmarks[14];
  const ringMCP = landmarks[13];
  
  const pinkyTip = landmarks[20];
  const pinkyDIP = landmarks[19];
  const pinkyPIP = landmarks[18];
  const pinkyMCP = landmarks[17];
  
  const palmCenter = landmarks[9]; // Middle MCP as palm reference

  // Helper to check if finger is extended with stricter threshold
  const isExtended = (tip: NormalizedLandmark, pip: NormalizedLandmark) => {
    return getDistance(wrist, tip) > getDistance(wrist, pip) * 1.1;
  };

  // Check if finger is strongly curled
  const isCurled = (tip: NormalizedLandmark, pip: NormalizedLandmark) => {
    return getDistance(wrist, tip) < getDistance(wrist, pip) * 0.85;
  };

  const thumbExtended = isExtended(thumbTip, thumbIP);
  const indexExtended = isExtended(indexTip, indexPIP);
  const middleExtended = isExtended(middleTip, middlePIP);
  const ringExtended = isExtended(ringTip, ringPIP);
  const pinkyExtended = isExtended(pinkyTip, pinkyPIP);

  const indexCurled = isCurled(indexTip, indexPIP);
  const middleCurled = isCurled(middleTip, middlePIP);
  const ringCurled = isCurled(ringTip, ringPIP);
  const pinkyCurled = isCurled(pinkyTip, pinkyPIP);
  const thumbCurled = isCurled(thumbTip, thumbIP);

  // Count extended fingers
  const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  // GESTURE DETECTION RULES - Ordered by specificity (most specific first)

  // 1. SOS (Fist - All fingers folded) - EMERGENCY
  if (indexCurled && middleCurled && ringCurled && pinkyCurled && thumbCurled) {
    return "SOS";
  }

  // 2. OK (Thumb and index form circle, others extended) - CHECK EARLY
  if (areTouching(thumbTip, indexTip, 0.06) && middleExtended && ringExtended && pinkyExtended) {
    return "OK";
  }

  // 3. LOVE (I Love You sign - thumb, index, and pinky extended, middle+ring folded)
  if (thumbExtended && indexExtended && middleCurled && ringCurled && pinkyExtended) {
    return "LOVE";
  }

  // 4. PEACE (V sign - Index + Middle extended, others folded)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return "PEACE";
  }

  // 5. CALL (Thumb and pinky extended, others folded)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    // Differentiate from DRINK by position
    const thumbNotNearFace = thumbTip.y > 0.3;
    if (thumbNotNearFace) {
      return "CALL";
    }
  }

  // 6. DRINK (Thumb to mouth - thumb near face)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    const thumbNearFace = thumbTip.y < 0.3;
    if (thumbNearFace) {
      return "DRINK";
    }
  }

  // 7. EAT (Fingers bunched to mouth)
  if (areTouching(thumbTip, indexTip, 0.08) && areTouching(indexTip, middleTip, 0.08)) {
    return "EAT";
  }

  // 8. HELP (Thumb + index extended, rest folded)
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "HELP";
  }

  // 9. GO (Index + Thumb extended, middle/ring/pinky folded)
  if (indexExtended && thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "GO";
  }

  // 10. SORRY (Only thumb extended when all others folded)
  if (thumbExtended && indexCurled && middleCurled && ringCurled && pinkyCurled) {
    return "SORRY";
  }

  // 11. BAD (Thumbs down - thumb extended pointing downward)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbPointingDown = thumbTip.y > wrist.y + 0.1;
    if (thumbPointingDown) {
      return "BAD";
    }
  }

  // 12. YES/GOOD (Thumbs up - thumb extended pointing upward)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbPointingUp = thumbTip.y <= wrist.y;
    if (thumbPointingUp) {
      return "YES";
    }
  }

  // 13. NO (Only index extended pointing up)
  if (indexExtended && !thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "NO";
  }

  // 14. COME (Index finger only)
  if (indexExtended && !thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "COME";
  }

  // 15. SAD (Index only, pointing downward)
  if (indexExtended && !thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const indexPointingDown = indexTip.y > indexPIP.y + 0.1;
    if (indexPointingDown) {
      return "SAD";
    }
  }

  // 16. PLEASE (Four fingers extended, no thumb)
  if (!thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "PLEASE";
  }

  // 17. STOP (All fingers together, spread)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersClose = getDistance(indexTip, pinkyTip) < 0.12;
    if (fingersClose) {
      return "STOP";
    }
  }

  // 18. WAIT (All fingers extended, level)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersLevel = Math.abs(indexTip.y - pinkyTip.y) < 0.05;
    if (fingersLevel) {
      return "WAIT";
    }
  }

  // 19. HAPPY (All extended, spread wide)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersSpread = getDistance(indexTip, pinkyTip) > 0.2;
    if (fingersSpread) {
      return "HAPPY";
    }
  }

  // 20. SLEEP (Four fingers, no thumb, tilted)
  if (!thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const palmTilted = Math.abs(indexTip.x - pinkyTip.x) > 0.1;
    if (palmTilted) {
      return "SLEEP";
    }
  }

  // 21. THANK YOU (All extended, thumb spread away)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const thumbAwayFromPalm = getDistance(thumbTip, indexMCP) > 0.18;
    if (thumbAwayFromPalm) {
      return "THANK YOU";
    }
  }

  // 22. HELLO (All five fingers extended)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "HELLO";
  }

  return null;
};

const detectBdSLGesture = (landmarks: NormalizedLandmark[]): DetectedGesture => {
  if (!landmarks || landmarks.length < 21) return null;

  const wrist = landmarks[0];
  
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  const thumbMCP = landmarks[2];
  
  const indexTip = landmarks[8];
  const indexDIP = landmarks[7];
  const indexPIP = landmarks[6];
  const indexMCP = landmarks[5];
  
  const middleTip = landmarks[12];
  const middleDIP = landmarks[11];
  const middlePIP = landmarks[10];
  const middleMCP = landmarks[9];
  
  const ringTip = landmarks[16];
  const ringDIP = landmarks[15];
  const ringPIP = landmarks[14];
  const ringMCP = landmarks[13];
  
  const pinkyTip = landmarks[20];
  const pinkyDIP = landmarks[19];
  const pinkyPIP = landmarks[18];
  const pinkyMCP = landmarks[17];

  const isExtended = (tip: NormalizedLandmark, pip: NormalizedLandmark) => {
    return getDistance(wrist, tip) > getDistance(wrist, pip) * 1.1;
  };

  const isCurled = (tip: NormalizedLandmark, pip: NormalizedLandmark) => {
    return getDistance(wrist, tip) < getDistance(wrist, pip) * 0.85;
  };

  const thumbExtended = isExtended(thumbTip, thumbIP);
  const indexExtended = isExtended(indexTip, indexPIP);
  const middleExtended = isExtended(middleTip, middlePIP);
  const ringExtended = isExtended(ringTip, ringPIP);
  const pinkyExtended = isExtended(pinkyTip, pinkyPIP);

  const indexCurled = isCurled(indexTip, indexPIP);
  const middleCurled = isCurled(middleTip, middlePIP);
  const ringCurled = isCurled(ringTip, ringPIP);
  const pinkyCurled = isCurled(pinkyTip, pinkyPIP);
  const thumbCurled = isCurled(thumbTip, thumbIP);

  const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  // BdSL (Bangla Sign Language) detection - similar structure but adapted for Bangla contexts
  // 1. SOS/EMERGENCY - Same as ASL
  if (indexCurled && middleCurled && ringCurled && pinkyCurled && thumbCurled) {
    return "SOS";
  }

  // 2. HELP - thumb and index extended (common in Bengali sign language)
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "HELP";
  }

  // 3. OK - Thumb and index touching
  if (areTouching(thumbTip, indexTip, 0.06) && middleExtended && ringExtended && pinkyExtended) {
    return "OK";
  }

  // 4. YES - Thumbs up
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbPointingUp = thumbTip.y <= wrist.y;
    if (thumbPointingUp) {
      return "YES";
    }
  }

  // 5. NO - Only index extended
  if (indexExtended && !thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "NO";
  }

  // 6. THANK YOU - All fingers extended
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "THANK YOU";
  }

  // 7. LOVE - Thumb, index, and pinky extended
  if (thumbExtended && indexExtended && middleCurled && ringCurled && pinkyExtended) {
    return "LOVE";
  }

  // 8. STOP - Open palm with fingers together
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersClose = getDistance(indexTip, pinkyTip) < 0.12;
    if (fingersClose) {
      return "STOP";
    }
  }

  // 9. PEACE - Index and middle extended
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return "PEACE";
  }

  // 10. PLEASE - Four fingers extended, no thumb
  if (!thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "PLEASE";
  }

  // 11. BAD - Thumbs down
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbPointingDown = thumbTip.y > wrist.y + 0.1;
    if (thumbPointingDown) {
      return "BAD";
    }
  }

  // 12. HELLO - All fingers extended spread
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersSpread = getDistance(indexTip, pinkyTip) > 0.2;
    if (fingersSpread) {
      return "HELLO";
    }
  }

  // 13. COME - Index finger beckoning
  if (indexExtended && !thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "COME";
  }

  // 14. GO - Index extended with thumb
  if (indexExtended && thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "GO";
  }

  // 15. EAT - Fingers bunched to mouth
  if (areTouching(thumbTip, indexTip, 0.08) && areTouching(indexTip, middleTip, 0.08)) {
    return "EAT";
  }

  // 16. DRINK - Thumb and pinky extended (phone gesture or drink gesture)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    const thumbNearFace = thumbTip.y < 0.3;
    if (thumbNearFace) {
      return "DRINK";
    }
  }

  // 17. CALL - Thumb and pinky like phone
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    const thumbNotNearFace = thumbTip.y > 0.3;
    if (thumbNotNearFace) {
      return "CALL";
    }
  }

  // 18. SORRY - Thumb extended when all others folded
  if (thumbExtended && indexCurled && middleCurled && ringCurled && pinkyCurled) {
    return "SORRY";
  }

  // 19. GOOD - Similar to YES (thumbs up)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "GOOD";
  }

  // 20. WAIT - All extended, level
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersLevel = Math.abs(indexTip.y - pinkyTip.y) < 0.05;
    if (fingersLevel) {
      return "WAIT";
    }
  }

  // 21. HAPPY - Fingers spread wide
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersSpread = getDistance(indexTip, pinkyTip) > 0.2;
    if (fingersSpread) {
      return "HAPPY";
    }
  }

  // 22. SLEEP - Palm against cheek
  if (!thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const palmTilted = Math.abs(indexTip.x - pinkyTip.x) > 0.1;
    if (palmTilted) {
      return "SLEEP";
    }
  }

  // 23. SAD - Index pointing down
  if (indexExtended && !thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const indexPointingDown = indexTip.y > indexPIP.y + 0.1;
    if (indexPointingDown) {
      return "SAD";
    }
  }

  return null;
};

// Gesture descriptions for UI display
export const gestureDescriptions: Record<Exclude<DetectedGesture, null>, string> = {
  "HELLO": "Open palm wave",
  "YES": "Thumbs up",
  "SOS": "Closed fist - Emergency signal",
  "PEACE": "V sign with two fingers",
  "NO": "Single finger point",
  "THANK YOU": "Open hand from chin",
  "PLEASE": "Flat hand on chest",
  "SORRY": "Fist on chest",
  "HELP": "Thumb and index extended",
  "LOVE": "I Love You sign",
  "GOOD": "Thumbs up gesture",
  "BAD": "Thumbs down",
  "STOP": "Palm forward, fingers together",
  "OK": "Thumb and index circle",
  "CALL": "Phone gesture",
  "WAIT": "Palm down, level fingers",
  "COME": "Beckoning finger",
  "GO": "Pointing forward",
  "EAT": "Fingers to mouth",
  "DRINK": "Drinking gesture",
  "SLEEP": "Palm against cheek",
  "HAPPY": "Spread fingers near face",
  "SAD": "Finger tracing tear"
};

// Bangla translations for BdSL (Bangla Sign Language)
export const bangladeshGestureNames: Record<Exclude<DetectedGesture, null>, string> = {
  "HELLO": "নমস্কার",
  "YES": "হ্যাঁ",
  "SOS": "জরুরি সাহায্য",
  "PEACE": "শান্তি",
  "NO": "না",
  "THANK YOU": "ধন্যবাদ",
  "PLEASE": "দয়া করে",
  "SORRY": "দুঃখিত",
  "HELP": "সাহায্য",
  "LOVE": "ভালোবাসা",
  "GOOD": "ভালো",
  "BAD": "খারাপ",
  "STOP": "থামো",
  "OK": "ঠিক আছে",
  "CALL": "কল করো",
  "WAIT": "অপেক্ষা করো",
  "COME": "আসো",
  "GO": "যাও",
  "EAT": "খাও",
  "DRINK": "পানীয়",
  "SLEEP": "ঘুম",
  "HAPPY": "খুশি",
  "SAD": "দুঃখ"
};

// Get gesture name in the specified language
export const getGestureName = (gesture: Exclude<DetectedGesture, null>, language: 'EN' | 'BN' = 'EN'): string => {
  if (language === 'BN') {
    return bangladeshGestureNames[gesture] || gesture;
  }
  return gesture;
};

// Get all available gestures
export const getAllGestures = (): Exclude<DetectedGesture, null>[] => {
  return [
    "HELLO", "YES", "SOS", "PEACE", "NO", "THANK YOU", "PLEASE", "SORRY",
    "HELP", "LOVE", "GOOD", "BAD", "STOP", "OK", "CALL", "WAIT",
    "COME", "GO", "EAT", "DRINK", "SLEEP", "HAPPY", "SAD"
  ];
};
