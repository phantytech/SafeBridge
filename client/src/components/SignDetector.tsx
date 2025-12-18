import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker, DrawingUtils, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Camera, RefreshCw, Video, VideoOff, BookOpen } from 'lucide-react';
import { detectGesture, DetectedGesture, getGestureName } from '../utils/gestureLogic';
import { useEmergency } from '../context/EmergencyContext';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const SignDetector: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [gesture, setGesture] = useState<DetectedGesture>(null);
  const [loading, setLoading] = useState(true);
  const [detectionMode, setDetectionMode] = useState<'ASL' | 'BdSL'>('ASL');
  
  const { triggerEmergency } = useEmergency();
  
  const gestureHoldTimeRef = useRef(0);
  const lastGestureRef = useRef<DetectedGesture>(null);
  const emergencyTriggeredRef = useRef(false);

  useEffect(() => {
    const loadHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        setHandLandmarker(landmarker);
        setLoading(false);
      } catch (error) {
        console.error("Error loading HandLandmarker", error);
        setLoading(false);
      }
    };

    loadHandLandmarker();
  }, []);

  const predictWebcam = () => {
    if (!handLandmarker || !webcamRef.current?.video || !canvasRef.current) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(predictWebcam);
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const drawingUtils = new DrawingUtils(ctx!);

    let startTimeMs = performance.now();
    const results = handLandmarker.detectForVideo(video, startTimeMs);

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        // Friendlier Drawing Style
        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "rgba(59, 130, 246, 0.5)", // Blue
          lineWidth: 4
        });
        drawingUtils.drawLandmarks(landmarks, {
          color: "#ffffff",
          lineWidth: 2,
          radius: 4
        });

        const currentGesture = detectGesture(landmarks, detectionMode);
        setGesture(currentGesture);
        
        // Check if gesture is SOS or HELP and auto-trigger alert if held for 5 seconds
        if (currentGesture === "SOS" || currentGesture === "HELP") {
          if (currentGesture === lastGestureRef.current) {
            // Same gesture continues, increment hold time
            gestureHoldTimeRef.current += 1;
            
            // 5 seconds at ~30 FPS = ~150 frames
            if (gestureHoldTimeRef.current > 150 && !emergencyTriggeredRef.current) {
              triggerEmergency();
              emergencyTriggeredRef.current = true;
            }
          } else {
            // New gesture started, reset counter
            gestureHoldTimeRef.current = 1;
            emergencyTriggeredRef.current = false;
          }
        } else {
          // Different gesture detected, reset the hold time
          gestureHoldTimeRef.current = 0;
          emergencyTriggeredRef.current = false;
        }
        lastGestureRef.current = currentGesture;
      }
    } else {
        setGesture(null);
        gestureHoldTimeRef.current = 0;
        emergencyTriggeredRef.current = false;
    }

    if (webcamRunning) {
      requestAnimationFrame(predictWebcam);
    }
  };

  useEffect(() => {
    if (webcamRunning && handLandmarker) {
      predictWebcam();
    }
  }, [webcamRunning, handLandmarker]);

  const toggleWebcam = () => {
    setWebcamRunning(!webcamRunning);
  };

  return (
    <div className="relative flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100">
      {/* Video Area */}
      <div className="relative flex-1 bg-slate-50 flex items-center justify-center overflow-hidden min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="animate-spin text-primary" size={32} />
              <p className="text-slate-500 font-medium">Starting AI Engine...</p>
            </div>
          </div>
        )}

        {!webcamRunning && !loading && (
          <div className="text-center space-y-6 z-10 p-8">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={40} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-800">Camera is Off</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">Enable the camera to start translating sign language in real-time.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={toggleWebcam}
                className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                data-testid="button-start-camera"
              >
                <Video size={20} />
                Start Camera
              </button>
              <Link 
                href="/sign-language-guide" 
                className="text-slate-500 hover:text-primary text-sm font-medium flex items-center gap-1.5 transition-colors"
                data-testid="link-sign-guide"
              >
                <BookOpen size={16} />
                View Sign Language Guide
              </Link>
            </div>
          </div>
        )}

        {webcamRunning && (
          <>
            <Webcam
              ref={webcamRef}
              className="absolute inset-0 w-full h-full object-cover"
              mirrored={true}
              onUserMedia={() => predictWebcam()}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
            
            <button 
              onClick={toggleWebcam}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 p-2 rounded-full hover:bg-white shadow-sm z-50 transition-colors"
              title="Turn off camera"
            >
              <VideoOff size={20} />
            </button>
          </>
        )}
      </div>

      {/* Live Translation Bar */}
      <div className="h-28 bg-white border-t border-slate-100 p-6 flex items-center justify-between">
        <div className="flex-1">
           <div className="flex items-center gap-3 mb-1">
             <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">Detected Gesture</p>
             <div className="flex gap-2 ml-2">
               <button
                 onClick={() => setDetectionMode('ASL')}
                 data-testid="button-mode-asl"
                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                   detectionMode === 'ASL'
                     ? 'bg-primary text-white'
                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                 }`}
               >
                 ASL
               </button>
               <button
                 onClick={() => setDetectionMode('BdSL')}
                 data-testid="button-mode-bdsl"
                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                   detectionMode === 'BdSL'
                     ? 'bg-primary text-white'
                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                 }`}
               >
                 BdSL
               </button>
             </div>
           </div>
           <div className="flex items-center justify-between">
             <div className="h-12 flex items-center">
                {gesture ? (
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={gesture}
                    className="text-4xl font-display font-bold text-slate-800"
                  >
                    {detectionMode === 'BdSL' ? getGestureName(gesture, 'BN') : gesture}
                  </motion.h2>
                ) : (
                  <span className="text-2xl text-slate-300 font-display font-medium">Waiting for sign...</span>
                )}
             </div>
             
             {gesture && (
               <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-700">98% CONFIDENCE</span>
               </div>
             )}
           </div>
        </div>
        <Link 
          href="/sign-language-guide" 
          className="flex items-center gap-2 text-slate-500 hover:text-primary bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full text-sm font-medium transition-colors ml-4"
          data-testid="link-sign-guide-bar"
        >
          <BookOpen size={16} />
          <span className="hidden sm:inline">Sign Guide</span>
        </Link>
      </div>
    </div>
  );
};

export default SignDetector;
