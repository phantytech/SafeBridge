import React, { useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { AlertTriangle, MapPin, Phone, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyOverlay: React.FC = () => {
  const { isEmergency, resetEmergency } = useEmergency();

  if (!isEmergency) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-red-500 p-8 text-center relative overflow-hidden">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-red-600 mix-blend-overlay"
            />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <AlertTriangle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Emergency Detected</h2>
              <p className="text-red-100 text-sm mt-1">SOS Gesture Recognized</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Sharing Location</h4>
                  <p className="text-sm text-slate-500">37.7749° N, 122.4194° W</p>
                  <p className="text-xs text-slate-400 mt-1">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Contacting Services</h4>
                  <p className="text-sm text-slate-500">Connecting to 911...</p>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                      className="h-full bg-green-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={resetEmergency}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancel Alert
            </button>
            
            <p className="text-center text-xs text-slate-400">
              False alarm? Cancel within 5 seconds to prevent dispatch.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmergencyOverlay;
