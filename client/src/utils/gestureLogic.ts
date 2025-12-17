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

export const detectGesture = (landmarks: NormalizedLandmark[]): DetectedGesture => {
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

  // Helper to check if finger is extended
  const isExtended = (tip: NormalizedLandmark, pip: NormalizedLandmark) => {
    return getDistance(wrist, tip) > getDistance(wrist, pip);
  };

  // Check if finger is curled (tip closer to palm than PIP)
  const isCurled = (tip: NormalizedLandmark, pip: NormalizedLandmark, mcp: NormalizedLandmark) => {
    return getDistance(wrist, tip) < getDistance(wrist, pip) * 0.9;
  };

  const thumbExtended = isExtended(thumbTip, thumbIP);
  const indexExtended = isExtended(indexTip, indexPIP);
  const middleExtended = isExtended(middleTip, middlePIP);
  const ringExtended = isExtended(ringTip, ringPIP);
  const pinkyExtended = isExtended(pinkyTip, pinkyPIP);

  const indexCurled = isCurled(indexTip, indexPIP, indexMCP);
  const middleCurled = isCurled(middleTip, middlePIP, middleMCP);
  const ringCurled = isCurled(ringTip, ringPIP, ringMCP);
  const pinkyCurled = isCurled(pinkyTip, pinkyPIP, pinkyMCP);

  // Count extended fingers
  const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  // GESTURE DETECTION RULES (23 gestures total)

  // 1. SOS (Fist - All fingers folded) - EMERGENCY
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return "SOS";
  }

  // 2. HELLO (Open Palm - All extended)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "HELLO";
  }

  // 3. YES (Thumbs Up - thumb extended, others folded)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "YES";
  }

  // 4. PEACE (V sign - Index + Middle extended, others folded)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return "PEACE";
  }

  // 5. NO (Index finger pointing up, wagging motion simulated by single finger)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return "NO";
  }

  // 6. THANK YOU (Flat hand moving from chin - open palm with thumb extended)
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    // This is same as HELLO but we can detect hand position later
    // For now, differentiate by thumb position relative to palm
    const thumbAwayFromPalm = getDistance(thumbTip, middleMCP) > 0.15;
    if (thumbAwayFromPalm) {
      return "THANK YOU";
    }
  }

  // 7. PLEASE (Circular motion on chest - flat hand)
  // Detected as palm flat with fingers together
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    return "PLEASE";
  }

  // 8. SORRY (Fist on chest - closed fist with thumb visible)
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbExtended) {
    // Same as YES but checking if thumb is across palm
    const thumbAcrossPalm = thumbTip.x > indexMCP.x;
    if (thumbAcrossPalm) {
      return "SORRY";
    }
  }

  // 9. HELP (Thumbs up on flat palm - one hand gesture)
  // Detected as thumb up with index slightly extended
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "HELP";
  }

  // 10. LOVE (I Love You sign - thumb, index, and pinky extended)
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return "LOVE";
  }

  // 11. GOOD (Thumbs up - same as YES but checking hand orientation)
  // Already handled by YES

  // 12. BAD (Thumbs down - thumb extended pointing down)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    // Check if thumb is pointing down (thumb tip below wrist)
    if (thumbTip.y > wrist.y) {
      return "BAD";
    }
  }

  // 13. STOP (Palm facing forward, all fingers extended and together)
  // Same as HELLO but fingers closer together
  if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersClose = getDistance(indexTip, pinkyTip) < 0.15;
    if (fingersClose && thumbExtended) {
      return "STOP";
    }
  }

  // 14. OK (Thumb and index form circle, others extended)
  if (areTouching(thumbTip, indexTip, 0.06) && middleExtended && ringExtended && pinkyExtended) {
    return "OK";
  }

  // 15. CALL (Thumb and pinky extended, simulating phone)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return "CALL";
  }

  // 16. WAIT (Open palm facing down or sideways)
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    // Detect palm orientation by checking if fingertips are at similar Y
    const fingersLevel = Math.abs(indexTip.y - pinkyTip.y) < 0.05;
    if (fingersLevel) {
      return "WAIT";
    }
  }

  // 17. COME (Index finger curled in beckoning motion)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const indexBent = getDistance(indexTip, indexMCP) < getDistance(indexPIP, indexMCP) * 1.5;
    if (indexBent) {
      return "COME";
    }
  }

  // 18. GO (Pointing gesture - index extended forward)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbExtended) {
    return "GO";
  }

  // 19. EAT (Fingers to mouth gesture - fingers bunched together)
  if (areTouching(thumbTip, indexTip, 0.08) && areTouching(thumbTip, middleTip, 0.1)) {
    return "EAT";
  }

  // 20. DRINK (Thumb to mouth, simulating drinking)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    // Similar to CALL but with different hand position
    const thumbNearFace = thumbTip.y < 0.3;
    if (thumbNearFace) {
      return "DRINK";
    }
  }

  // 21. SLEEP (Palm against cheek, tilted head simulation)
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    const palmTilted = Math.abs(indexTip.x - pinkyTip.x) > 0.1;
    if (palmTilted) {
      return "SLEEP";
    }
  }

  // 22. HAPPY (Two hands near face with spread fingers - simplified to spread fingers)
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    const fingersSpread = getDistance(indexTip, pinkyTip) > 0.2;
    if (fingersSpread) {
      return "HAPPY";
    }
  }

  // 23. SAD (Index finger tracing tear down cheek - single finger pointing down)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    const indexPointingDown = indexTip.y > indexPIP.y;
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

// Get all available gestures
export const getAllGestures = (): Exclude<DetectedGesture, null>[] => {
  return [
    "HELLO", "YES", "SOS", "PEACE", "NO", "THANK YOU", "PLEASE", "SORRY",
    "HELP", "LOVE", "GOOD", "BAD", "STOP", "OK", "CALL", "WAIT",
    "COME", "GO", "EAT", "DRINK", "SLEEP", "HAPPY", "SAD"
  ];
};
