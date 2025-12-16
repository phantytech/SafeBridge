import React, { useState } from 'react';
import { Send, MessageSquare, Mic, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const TextToSign: React.FC = () => {
  const [input, setInput] = useState('');
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setActiveAnimation(input.toLowerCase());
    setInput('');
    setTimeout(() => setActiveAnimation(null), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100">
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-800">Text to Sign</h2>
            <p className="text-xs text-slate-500">Translate text into gestures</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center relative bg-slate-50/30">
        {activeAnimation ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center w-full max-w-xs"
          >
            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-50" />
               <motion.span 
                 animate={{ scale: [1, 1.05, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="font-display text-4xl text-primary font-bold z-10 capitalize"
               >
                 {activeAnimation}
               </motion.span>
               <p className="absolute bottom-4 text-xs text-slate-400 font-medium">Playing Animation...</p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-slate-400 max-w-[200px]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={24} className="text-slate-300" />
            </div>
            <p className="text-sm">Type a word below to see its sign language animation</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white">
        <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'Hello'..."
            className="flex-1 bg-transparent px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <button 
            type="button" 
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Mic size={20} />
          </button>
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-full shadow-sm transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextToSign;
