import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Shield, Video, Users, ArrowRight, Activity, Globe } from 'lucide-react';
import { Link } from 'wouter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b-2 border-slate-100 h-24 px-6 md:px-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="SafeBridge Logo" className="w-16 h-16 object-contain" data-testid="img-logo" />
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-800 leading-tight">SafeBridge</h1>
            <p className="text-sm text-slate-500 font-medium">Bangladesh</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-base" data-testid="button-launch-app">
              Launch App
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 opacity-60 pointer-events-none rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-full text-base font-bold mb-8 border border-blue-100 shadow-sm">
              <Globe size={20} />
              <span>Available in Bangladesh</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-slate-900 leading-[1.05] mb-8">
              Bridging the gap for <span className="text-primary bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">everyone.</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-medium">
              Real-time sign language translation and emergency safety system powered by advanced AI. Designed for accessibility and peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/auth">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/40 w-full sm:w-auto text-center" data-testid="button-start-translating">
                  Start Translating
                </button>
              </Link>
              <button className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-12 py-6 rounded-2xl font-bold text-xl transition-all hover:-translate-y-1 hover:border-slate-300 w-full sm:w-auto text-center shadow-lg" data-testid="button-learn-more">
                Learn More
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 blur-[120px] rounded-full" />
            <div className="relative bg-white rounded-[2rem] shadow-2xl shadow-blue-900/20 border-2 border-slate-100 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
               {/* Mockup UI */}
               <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 p-6 border-b border-slate-200 flex items-center justify-between">
                 <div className="flex gap-3">
                   <div className="w-4 h-4 rounded-full bg-red-400 shadow-sm" />
                   <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm" />
                   <div className="w-4 h-4 rounded-full bg-green-400 shadow-sm" />
                 </div>
                 <div className="text-sm font-bold text-slate-400 tracking-wide">LIVE PREVIEW</div>
               </div>
               <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-transparent to-indigo-900/40" />
                  <motion.div 
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-40 h-40 rounded-full border-4 border-primary/40 flex items-center justify-center relative shadow-2xl shadow-blue-500/50"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-indigo-500/20 flex items-center justify-center backdrop-blur-sm">
                       <HeartHandshake size={64} className="text-primary drop-shadow-lg" />
                    </div>
                  </motion.div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/15 backdrop-blur-xl p-6 rounded-2xl border border-white/20 flex items-center justify-between shadow-xl">
                       <div>
                         <div className="text-white/70 text-sm font-bold mb-2 tracking-wide">DETECTED</div>
                         <div className="text-white text-3xl font-bold">HELLO</div>
                       </div>
                       <div className="bg-green-500/30 text-green-300 px-5 py-2 rounded-full text-base font-bold border border-green-400/40 shadow-lg shadow-green-500/20">
                         98% MATCH
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: 1, ease: "easeInOut" }}
              className="absolute -right-10 top-24 bg-white p-6 rounded-3xl shadow-2xl shadow-red-500/10 border-2 border-slate-100 max-w-[240px] hover:shadow-red-500/20 transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4 shadow-sm">
                <Shield size={28} />
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">Emergency SOS</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Instant connection to 999 services.</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -left-10 bottom-24 bg-white p-6 rounded-3xl shadow-2xl shadow-blue-500/10 border-2 border-slate-100 max-w-[240px] hover:shadow-blue-500/20 transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                <Video size={28} />
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">AI Vision</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Advanced hand tracking without lag.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 border-t-2 border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 mb-6 leading-tight">Why SafeBridge?</h2>
            <p className="text-slate-600 text-xl md:text-2xl leading-relaxed font-medium">Built with cutting-edge technology to ensure safety and seamless communication for everyone.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-10 rounded-[2rem] bg-white border-2 border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-2 hover:border-blue-200 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Real-time Translation</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Instantly convert hand gestures into text using advanced computer vision directly in your browser.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-10 rounded-[2rem] bg-white border-2 border-slate-100 hover:shadow-2xl hover:shadow-red-500/10 transition-all hover:-translate-y-2 hover:border-red-200 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl flex items-center justify-center text-red-600 mb-8 shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">999 Integration</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Emergency SOS gesture recognition that automatically connects to Bangladesh's National Emergency Service.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-10 rounded-[2rem] bg-white border-2 border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-2 hover:border-indigo-200 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Accessible Design</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                A user interface designed for everyone, with high contrast modes and clear visual feedback.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-400 py-20 px-6 md:px-16 border-t-2 border-slate-700">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <img src="/logo.png" alt="SafeBridge Logo" className="w-14 h-14 object-contain" data-testid="img-footer-logo" />
             <span className="font-bold text-white text-2xl">SafeBridge BD</span>
          </div>
          <p className="text-base text-slate-400">© 2025 SafeBridge. Built for a Safer Bangladesh. 2025inc</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
