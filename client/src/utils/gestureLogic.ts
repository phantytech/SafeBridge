import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Types
export type DetectedGesture = "HELLO" | "YES" | "SOS" | "PEACE" | null;

// Helper to calculate distance between two points
const getDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
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

  // Helper to check if finger is extended (tip is higher than PIP - note Y increases downwards)
  // But strictly comparing Y might fail if hand is rotated.
  // Better approach: Distance from wrist (0) to tip vs wrist to PIP.
  const wrist = landmarks[0];
  
  const isExtended = (tip: NormalizedLandmark, pip: NormalizedLandmark) => {
    return getDistance(wrist, tip) > getDistance(wrist, pip);
  };

  const thumbExtended = isExtended(thumbTip, thumbIP); // Thumb is tricky, but let's try basic
  const indexExtended = isExtended(indexTip, indexPIP);
  const middleExtended = isExtended(middleTip, middlePIP);
  const ringExtended = isExtended(ringTip, ringPIP);
  const pinkyExtended = isExtended(pinkyTip, pinkyPIP);

  // LOGIC RULES

  // 1. SOS (Fist - All folded)
  // Note: Thumb usually tucked in for SOS, but let's check mainly fingers folded
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "SOS";
  }

  // 2. HELLO (Open Palm - All extended)
  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return "HELLO";
  }

  // 3. YES (Thumbs Up)
  // Thumb extended, others folded
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return "YES";
  }

  // 4. PEACE (Index + Middle extended, others folded)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return "PEACE";
  }

  return null;
};
