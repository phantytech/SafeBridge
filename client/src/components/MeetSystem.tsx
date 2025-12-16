import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Hand, Captions } from 'lucide-react';
import { motion } from 'framer-motion';

const MeetSystem: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(true);
  const [caption, setCaption] = useState<string>("");

  // Mock caption generation
  useEffect(() => {
    const interval = setInterval(() => {
      const phrases = [
        "Hello, how are you?",
        "I can hear you clearly.",
        "The project is going well.",
        "Let's discuss the next steps."
      ];
      setCaption(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-slate-900 rounded-3xl overflow-hidden flex flex-col relative">
      {/* Main Video Area */}
      <div className="flex-1 relative p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User 1 (Me) */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
          {isCamOn ? (
            <Webcam
              className="w-full h-full object-cover"
              mirrored={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                ME
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-medium">
            You (Sign Language)
          </div>
        </div>

        {/* User 2 (Remote) */}
        <div className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
           {/* Placeholder for remote video */}
           <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                alt="Remote User" 
                className="w-full h-full object-cover opacity-80"
              />
           </div>
           <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-medium">
            Sarah (Voice)
          </div>
        </div>

        {/* Live Captions Overlay */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-10">
          <motion.div 
            key={caption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-xl text-white font-medium text-lg flex items-center gap-3"
          >
            <Captions size={20} className="text-blue-400" />
            "{caption}"
          </motion.div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-8">
        <div className="flex items-center gap-4 text-white">
          <span className="font-bold">SafeMeet</span>
          <span className="text-slate-400 text-sm">| Bridge Mode Active</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          <button 
            onClick={() => setIsCamOn(!isCamOn)}
            className={`p-4 rounded-full transition-colors ${isCamOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors">
            <Hand size={20} />
          </button>
          
          <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors">
            <MessageSquare size={20} />
          </button>

          <button className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors ml-4">
            <PhoneOff size={20} />
          </button>
        </div>
        
        <div className="w-32"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};

export default MeetSystem;
