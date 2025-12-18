import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Bangla Sign Language (BDSL) Character Mapping
// Based on CDD Standard for Bangladesh Sign Language

// Bangla Vowels (স্বরবর্ণ)
export const BDSL_VOWELS = [
  { id: 1, character: "অ", name: "Aw", romanized: "a" },
  { id: 2, character: "আ", name: "Aa", romanized: "aa" },
  { id: 3, character: "ই", name: "I", romanized: "i" },
  { id: 4, character: "ঈ", name: "Ii", romanized: "ii" },
  { id: 5, character: "উ", name: "U", romanized: "u" },
  { id: 6, character: "ঊ", name: "Uu", romanized: "uu" },
];

// Bangla Consonants (ব্যঞ্জনবর্ণ)
export const BDSL_CONSONANTS = [
  { id: 7, character: "ক", name: "Ko", romanized: "k" },
  { id: 8, character: "খ", name: "Kho", romanized: "kh" },
  { id: 9, character: "গ", name: "Go", romanized: "g" },
  { id: 10, character: "ঘ", name: "Gho", romanized: "gh" },
  { id: 11, character: "ঙ", name: "Ngo", romanized: "ng" },
  { id: 12, character: "চ", name: "Cho", romanized: "ch" },
  { id: 13, character: "ছ", name: "Chho", romanized: "chh" },
  { id: 14, character: "জ", name: "Jo", romanized: "j" },
  { id: 15, character: "ঝ", name: "Jho", romanized: "jh" },
  { id: 16, character: "ঞ", name: "Nio", romanized: "nio" },
  { id: 17, character: "ট", name: "To", romanized: "t" },
  { id: 18, character: "ঠ", name: "Tho", romanized: "th" },
  { id: 19, character: "ড", name: "Do", romanized: "d" },
  { id: 20, character: "ঢ", name: "Dho", romanized: "dh" },
  { id: 21, character: "ণ", name: "No", romanized: "n" },
  { id: 22, character: "ত", name: "To", romanized: "to" },
  { id: 23, character: "থ", name: "Tho", romanized: "tho" },
  { id: 24, character: "দ", name: "Do", romanized: "do" },
  { id: 25, character: "ধ", name: "Dho", romanized: "dho" },
  { id: 26, character: "ন", name: "No", romanized: "no" },
  { id: 27, character: "প", name: "Po", romanized: "p" },
  { id: 28, character: "ফ", name: "Pho", romanized: "ph" },
  { id: 29, character: "ব", name: "Bo", romanized: "b" },
  { id: 30, character: "ভ", name: "Bho", romanized: "bh" },
  { id: 31, character: "ম", name: "Mo", romanized: "m" },
  { id: 32, character: "য", name: "Zo", romanized: "z" },
  { id: 33, character: "র", name: "Ro", romanized: "r" },
  { id: 34, character: "ল", name: "Lo", romanized: "l" },
  { id: 35, character: "শ", name: "Sho", romanized: "sh" },
  { id: 36, character: "হ", name: "Ho", romanized: "h" },
];

// Bangla Digits (সংখ্যা)
export const BDSL_DIGITS = [
  { id: 0, character: "০", name: "Shunno", romanized: "0" },
  { id: 1, character: "১", name: "Ek", romanized: "1" },
  { id: 2, character: "২", name: "Dui", romanized: "2" },
  { id: 3, character: "৩", name: "Tin", romanized: "3" },
  { id: 4, character: "৪", name: "Char", romanized: "4" },
  { id: 5, character: "৫", name: "Pach", romanized: "5" },
  { id: 6, character: "৬", name: "Chhoy", romanized: "6" },
  { id: 7, character: "৭", name: "Shat", romanized: "7" },
  { id: 8, character: "৮", name: "Aat", romanized: "8" },
  { id: 9, character: "৯", name: "Noy", romanized: "9" },
];

// All characters combined
export const ALL_BDSL_CHARACTERS = [
  ...BDSL_VOWELS,
  ...BDSL_CONSONANTS,
];

// Types
export type BDSLGesture = {
  id: number;
  character: string;
  name: string;
  romanized: string;
  type: "vowel" | "consonant" | "digit";
  imagePath: string;
};

// Get all BDSL gestures with image paths
export const getBDSLGestures = (): BDSLGesture[] => {
  const vowels: BDSLGesture[] = BDSL_VOWELS.map(v => ({
    ...v,
    type: "vowel" as const,
    imagePath: `/bdsl/dataset/characters/${v.id}.JPG`
  }));
  
  const consonants: BDSLGesture[] = BDSL_CONSONANTS.map(c => ({
    ...c,
    type: "consonant" as const,
    imagePath: `/bdsl/dataset/characters/${c.id}.JPG`
  }));
  
  return [...vowels, ...consonants];
};

// Get BDSL digits with image paths
export const getBDSLDigits = (): BDSLGesture[] => {
  return BDSL_DIGITS.map(d => ({
    ...d,
    type: "digit" as const,
    imagePath: `/bdsl/dataset/digits/${d.id}.JPG`
  }));
};

// Helper to calculate distance between two points
const getDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Helper to check if two fingertips are touching
const areTouching = (p1: NormalizedLandmark, p2: NormalizedLandmark, threshold = 0.05) => {
  return getDistance(p1, p2) < threshold;
};

// BDSL Gesture Detection using MediaPipe Landmarks
// This uses hand landmark patterns similar to ASL but adapted for BDSL
export const detectBDSLGesture = (landmarks: NormalizedLandmark[]): BDSLGesture | null => {
  if (!landmarks || landmarks.length < 21) return null;

  const wrist = landmarks[0];
  
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  
  const indexTip = landmarks[8];
  const indexPIP = landmarks[6];
  const indexMCP = landmarks[5];
  
  const middleTip = landmarks[12];
  const middlePIP = landmarks[10];
  const middleMCP = landmarks[9];
  
  const ringTip = landmarks[16];
  const ringPIP = landmarks[14];
  
  const pinkyTip = landmarks[20];
  const pinkyPIP = landmarks[18];

  // Helper functions
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

  const thumbCurled = isCurled(thumbTip, thumbIP);
  const indexCurled = isCurled(indexTip, indexPIP);
  const middleCurled = isCurled(middleTip, middlePIP);
  const ringCurled = isCurled(ringTip, ringPIP);
  const pinkyCurled = isCurled(pinkyTip, pinkyPIP);

  // Count extended fingers
  const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  // BDSL Gesture Detection Rules based on CDD Standard
  // These patterns are derived from the BDSL dataset reference images

  // VOWELS (স্বরবর্ণ) - 6 gestures

  // অ (Aw) - Closed fist
  if (indexCurled && middleCurled && ringCurled && pinkyCurled && thumbCurled) {
    return { ...BDSL_VOWELS[0], type: "vowel", imagePath: `/bdsl/dataset/characters/1.JPG` };
  }

  // আ (Aa) - Open palm, all fingers extended
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersSpread = getDistance(indexTip, pinkyTip) > 0.15;
    if (fingersSpread) {
      return { ...BDSL_VOWELS[1], type: "vowel", imagePath: `/bdsl/dataset/characters/2.JPG` };
    }
  }

  // ই (I) - Index finger pointing up
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_VOWELS[2], type: "vowel", imagePath: `/bdsl/dataset/characters/3.JPG` };
  }

  // ঈ (Ii) - Index and middle extended (V-sign)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_VOWELS[3], type: "vowel", imagePath: `/bdsl/dataset/characters/4.JPG` };
  }

  // উ (U) - Index, middle, ring extended (3 fingers)
  if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_VOWELS[4], type: "vowel", imagePath: `/bdsl/dataset/characters/5.JPG` };
  }

  // ঊ (Uu) - All four fingers extended, thumb folded
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    return { ...BDSL_VOWELS[5], type: "vowel", imagePath: `/bdsl/dataset/characters/6.JPG` };
  }

  // CONSONANTS (ব্যঞ্জনবর্ণ) - 30 gestures
  // Using specific hand configurations for each consonant

  // ক (Ko) - Thumb up only
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbUp = thumbTip.y < wrist.y;
    if (thumbUp) {
      return { ...BDSL_CONSONANTS[0], type: "consonant", imagePath: `/bdsl/dataset/characters/7.JPG` };
    }
  }

  // খ (Kho) - Thumb and index extended (L shape)
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return { ...BDSL_CONSONANTS[1], type: "consonant", imagePath: `/bdsl/dataset/characters/8.JPG` };
  }

  // গ (Go) - Index pointing with thumb on side
  if (thumbExtended && indexExtended && middleCurled && ringCurled && pinkyCurled) {
    return { ...BDSL_CONSONANTS[2], type: "consonant", imagePath: `/bdsl/dataset/characters/9.JPG` };
  }

  // ঘ (Gho) - Thumb, index, middle extended
  if (thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return { ...BDSL_CONSONANTS[3], type: "consonant", imagePath: `/bdsl/dataset/characters/10.JPG` };
  }

  // ঙ (Ngo) - OK sign (thumb and index circle)
  if (areTouching(thumbTip, indexTip, 0.06) && middleExtended && ringExtended && pinkyExtended) {
    return { ...BDSL_CONSONANTS[4], type: "consonant", imagePath: `/bdsl/dataset/characters/11.JPG` };
  }

  // চ (Cho) - Index and pinky extended
  if (indexExtended && !middleExtended && !ringExtended && pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[5], type: "consonant", imagePath: `/bdsl/dataset/characters/12.JPG` };
  }

  // ছ (Chho) - Phone gesture (thumb and pinky)
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return { ...BDSL_CONSONANTS[6], type: "consonant", imagePath: `/bdsl/dataset/characters/13.JPG` };
  }

  // জ (Jo) - Fist with thumb on side
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbExtended) {
    const thumbSide = Math.abs(thumbTip.x - wrist.x) > 0.1;
    if (thumbSide) {
      return { ...BDSL_CONSONANTS[7], type: "consonant", imagePath: `/bdsl/dataset/characters/14.JPG` };
    }
  }

  // ঝ (Jho) - Fingers spread wide
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const fingersWide = getDistance(indexTip, pinkyTip) > 0.2;
    if (fingersWide) {
      return { ...BDSL_CONSONANTS[8], type: "consonant", imagePath: `/bdsl/dataset/characters/15.JPG` };
    }
  }

  // ঞ (Nio) - Middle finger only
  if (!indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[9], type: "consonant", imagePath: `/bdsl/dataset/characters/16.JPG` };
  }

  // ট (To) - Ring finger only
  if (!indexExtended && !middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[10], type: "consonant", imagePath: `/bdsl/dataset/characters/17.JPG` };
  }

  // ঠ (Tho) - Pinky only
  if (!indexExtended && !middleExtended && !ringExtended && pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[11], type: "consonant", imagePath: `/bdsl/dataset/characters/18.JPG` };
  }

  // ড (Do) - Middle and ring extended
  if (!indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[12], type: "consonant", imagePath: `/bdsl/dataset/characters/19.JPG` };
  }

  // ঢ (Dho) - Ring and pinky extended
  if (!indexExtended && !middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[13], type: "consonant", imagePath: `/bdsl/dataset/characters/20.JPG` };
  }

  // ণ (No) - Middle, ring, pinky extended
  if (!indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    return { ...BDSL_CONSONANTS[14], type: "consonant", imagePath: `/bdsl/dataset/characters/21.JPG` };
  }

  // ত (To) - Index touching thumb
  if (areTouching(thumbTip, indexTip, 0.07) && !middleExtended && !ringExtended && !pinkyExtended) {
    return { ...BDSL_CONSONANTS[15], type: "consonant", imagePath: `/bdsl/dataset/characters/22.JPG` };
  }

  // থ (Tho) - Index and middle touching thumb
  if (areTouching(thumbTip, indexTip, 0.07) && areTouching(thumbTip, middleTip, 0.09)) {
    return { ...BDSL_CONSONANTS[16], type: "consonant", imagePath: `/bdsl/dataset/characters/23.JPG` };
  }

  // দ (Do) - Index curved
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const indexBent = getDistance(indexTip, indexMCP) < getDistance(indexPIP, indexMCP) * 1.5;
    if (indexBent && !thumbExtended) {
      return { ...BDSL_CONSONANTS[17], type: "consonant", imagePath: `/bdsl/dataset/characters/24.JPG` };
    }
  }

  // ধ (Dho) - Thumb pointing down
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbDown = thumbTip.y > wrist.y + 0.1;
    if (thumbDown) {
      return { ...BDSL_CONSONANTS[18], type: "consonant", imagePath: `/bdsl/dataset/characters/25.JPG` };
    }
  }

  // ন (No) - I Love You sign (thumb, index, pinky)
  if (thumbExtended && indexExtended && middleCurled && ringCurled && pinkyExtended) {
    return { ...BDSL_CONSONANTS[19], type: "consonant", imagePath: `/bdsl/dataset/characters/26.JPG` };
  }

  // প (Po) - Flat hand, palm down
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    const fingersClose = getDistance(indexTip, pinkyTip) < 0.12;
    if (fingersClose) {
      return { ...BDSL_CONSONANTS[20], type: "consonant", imagePath: `/bdsl/dataset/characters/27.JPG` };
    }
  }

  // ফ (Pho) - Four fingers, no thumb
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    const fingersClose = getDistance(indexTip, pinkyTip) < 0.12;
    if (fingersClose) {
      return { ...BDSL_CONSONANTS[21], type: "consonant", imagePath: `/bdsl/dataset/characters/28.JPG` };
    }
  }

  // ব (Bo) - Index and middle together
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    const fingersTogether = getDistance(indexTip, middleTip) < 0.05;
    if (fingersTogether && !thumbExtended) {
      return { ...BDSL_CONSONANTS[22], type: "consonant", imagePath: `/bdsl/dataset/characters/29.JPG` };
    }
  }

  // ভ (Bho) - V sign with fingers apart
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    const fingersApart = getDistance(indexTip, middleTip) > 0.08;
    if (fingersApart) {
      return { ...BDSL_CONSONANTS[23], type: "consonant", imagePath: `/bdsl/dataset/characters/30.JPG` };
    }
  }

  // ম (Mo) - All fingers curled, thumb wrapped
  if (indexCurled && middleCurled && ringCurled && pinkyCurled) {
    const thumbWrapped = thumbTip.x > indexMCP.x;
    if (thumbWrapped) {
      return { ...BDSL_CONSONANTS[24], type: "consonant", imagePath: `/bdsl/dataset/characters/31.JPG` };
    }
  }

  // য (Zo) - Rock sign (index and pinky)
  if (indexExtended && !middleExtended && !ringExtended && pinkyExtended && thumbExtended) {
    return { ...BDSL_CONSONANTS[25], type: "consonant", imagePath: `/bdsl/dataset/characters/32.JPG` };
  }

  // র (Ro) - Three fingers (index, middle, ring)
  if (indexExtended && middleExtended && ringExtended && !pinkyExtended && thumbExtended) {
    return { ...BDSL_CONSONANTS[26], type: "consonant", imagePath: `/bdsl/dataset/characters/33.JPG` };
  }

  // ল (Lo) - Four fingers + thumb spread
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    const thumbAway = getDistance(thumbTip, indexMCP) > 0.15;
    if (thumbAway) {
      return { ...BDSL_CONSONANTS[27], type: "consonant", imagePath: `/bdsl/dataset/characters/34.JPG` };
    }
  }

  // শ (Sho) - Index curved with thumb
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const indexCurvedSlightly = getDistance(indexTip, indexMCP) < getDistance(indexPIP, indexMCP) * 1.8;
    if (indexCurvedSlightly) {
      return { ...BDSL_CONSONANTS[28], type: "consonant", imagePath: `/bdsl/dataset/characters/35.JPG` };
    }
  }

  // হ (Ho) - Open hand relaxed
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    const allLevel = Math.abs(indexTip.y - pinkyTip.y) < 0.08;
    if (allLevel) {
      return { ...BDSL_CONSONANTS[29], type: "consonant", imagePath: `/bdsl/dataset/characters/36.JPG` };
    }
  }

  return null;
};

// Detect BDSL digit
export const detectBDSLDigit = (landmarks: NormalizedLandmark[]): BDSLGesture | null => {
  if (!landmarks || landmarks.length < 21) return null;

  const wrist = landmarks[0];
  
  const thumbTip = landmarks[4];
  const thumbIP = landmarks[3];
  
  const indexTip = landmarks[8];
  const indexPIP = landmarks[6];
  
  const middleTip = landmarks[12];
  const middlePIP = landmarks[10];
  
  const ringTip = landmarks[16];
  const ringPIP = landmarks[14];
  
  const pinkyTip = landmarks[20];
  const pinkyPIP = landmarks[18];

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

  const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  // BDSL Digit Detection
  // ০ (0) - Closed fist
  if (extendedCount === 0) {
    return { ...BDSL_DIGITS[0], type: "digit", imagePath: `/bdsl/dataset/digits/0.JPG` };
  }

  // ১ (1) - One finger (index)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_DIGITS[1], type: "digit", imagePath: `/bdsl/dataset/digits/1.JPG` };
  }

  // ২ (2) - Two fingers (index + middle)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_DIGITS[2], type: "digit", imagePath: `/bdsl/dataset/digits/2.JPG` };
  }

  // ৩ (3) - Three fingers (index + middle + ring)
  if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
    return { ...BDSL_DIGITS[3], type: "digit", imagePath: `/bdsl/dataset/digits/3.JPG` };
  }

  // ৪ (4) - Four fingers
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
    return { ...BDSL_DIGITS[4], type: "digit", imagePath: `/bdsl/dataset/digits/4.JPG` };
  }

  // ৫ (5) - All five fingers
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    return { ...BDSL_DIGITS[5], type: "digit", imagePath: `/bdsl/dataset/digits/5.JPG` };
  }

  // ৬ (6) - Thumb + pinky
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return { ...BDSL_DIGITS[6], type: "digit", imagePath: `/bdsl/dataset/digits/6.JPG` };
  }

  // ৭ (7) - Thumb + index + pinky
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return { ...BDSL_DIGITS[7], type: "digit", imagePath: `/bdsl/dataset/digits/7.JPG` };
  }

  // ৮ (8) - Thumb + index + middle
  if (thumbExtended && indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return { ...BDSL_DIGITS[8], type: "digit", imagePath: `/bdsl/dataset/digits/8.JPG` };
  }

  // ৯ (9) - Four fingers + thumb spread
  if (thumbExtended && indexExtended && middleExtended && ringExtended && !pinkyExtended) {
    return { ...BDSL_DIGITS[9], type: "digit", imagePath: `/bdsl/dataset/digits/9.JPG` };
  }

  return null;
};

// Get character info by ID
export const getBDSLCharacterById = (id: number): BDSLGesture | null => {
  const allChars = [...getBDSLGestures(), ...getBDSLDigits()];
  return allChars.find(c => c.id === id) || null;
};

// Get character info by Bangla character
export const getBDSLCharacterByChar = (char: string): BDSLGesture | null => {
  const allChars = [...getBDSLGestures(), ...getBDSLDigits()];
  return allChars.find(c => c.character === char) || null;
};
