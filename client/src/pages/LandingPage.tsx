import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Shield, Video, Users, ArrowRight, Activity, Globe, BookOpen, Languages } from 'lucide-react';
import { Link } from 'wouter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SafeBridge Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="font-display font-bold text-xl text-slate-800 leading-tight">SafeBridge</h1>
            <p className="text-xs text-slate-500 font-medium">Bangladesh</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm">
              Launch App
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-100">
              <Globe size={16} />
              <span>Available in Bangladesh</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
              Bridging the gap for <span className="text-primary">everyone.</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-8 max-w-lg leading-relaxed">
              An accessibility platform for all persons with disabilities in Bangladesh—featuring real-time sign language translation and emergency safety system for the speech and hearing impaired.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
                  Start Translating
                </button>
              </Link>
              <Link href="/learn-more">
                <button data-testid="button-learn-more" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
               {/* Mockup UI */}
               <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                 </div>
                 <div className="text-xs font-bold text-slate-400">LIVE PREVIEW</div>
               </div>
               <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-slate-900" />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                       <HeartHandshake size={48} className="text-primary" />
                    </div>
                  </motion.div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                       <div>
                         <div className="text-white/60 text-xs font-bold mb-1">DETECTED</div>
                         <div className="text-white text-xl font-bold">HELLO</div>
                       </div>
                       <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                         98% MATCH
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: 1 }}
              className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-3">
                <Shield size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Emergency SOS</h4>
              <p className="text-xs text-slate-500 mt-1">Instant connection to 999 services.</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                <Video size={20} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AI Vision</h4>
              <p className="text-xs text-slate-500 mt-1">Advanced hand tracking without lag.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Why SafeBridge?</h2>
            <p className="text-slate-500 text-lg">Built with cutting-edge technology to ensure safety and accessibility for Bangladesh's 3.84 million persons with disabilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Real-time Translation</h3>
              <p className="text-slate-500 leading-relaxed">
                Instantly convert hand gestures into text using advanced computer vision directly in your browser.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">999 Integration</h3>
              <p className="text-slate-500 leading-relaxed">
                Emergency SOS gesture recognition that automatically connects to Bangladesh's National Emergency Service.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Accessible Design</h3>
              <p className="text-slate-500 leading-relaxed">
                A user interface designed for everyone, with high contrast modes and clear visual feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learn Sign Language Section */}
      <div className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Learn Sign Language</h2>
            <p className="text-slate-500 text-lg">Master hand gestures for communication. Choose your language guide to get started.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/sign-language-guide">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">English Signs</h3>
                    <p className="text-sm text-slate-500">23 essential gestures</p>
                  </div>
                </div>
                <p className="text-slate-500 leading-relaxed mb-4">
                  Learn universal sign language gestures including HELLO, SOS, HELP, and more basic communication signs.
                </p>
                <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
                  Start Learning <ArrowRight size={16} />
                </span>
              </motion.div>
            </Link>
            
            <Link href="/bangla-sign-guide">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <Languages size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">বাংলা ইশারা</h3>
                    <p className="text-sm text-slate-500">36 characters + 10 digits</p>
                  </div>
                </div>
                <p className="text-slate-500 leading-relaxed mb-4">
                  Learn Bangla Sign Language (BDSL) with the CDD Standard. Master Bengali vowels, consonants, and numerals.
                </p>
                <span className="inline-flex items-center gap-2 text-green-600 font-bold text-sm group-hover:gap-3 transition-all">
                  শিখতে শুরু করুন <ArrowRight size={16} />
                </span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="SafeBridge Logo" className="w-10 h-10 object-contain" />
             <span className="font-bold text-white">SafeBridge BD</span>
          </div>
          <p className="text-sm">© 2025 SafeBridge. Built for a Safer Bangladesh. 2025inc</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
