import React from 'react';
import { Switch, Route } from "wouter";
import SignDetector from './components/SignDetector';
import TextToSign from './components/TextToSign';
import EmergencyOverlay from './components/EmergencyOverlay';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { HeartHandshake, Bell, Menu, User } from 'lucide-react';
import LandingPage from './pages/LandingPage';

const Header = () => (
  <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-40 px-6 md:px-12 flex items-center justify-between border-b border-slate-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
        <HeartHandshake size={24} />
      </div>
      <div>
        <h1 className="font-display font-bold text-xl text-slate-800 leading-tight">SafeBridge</h1>
        <p className="text-xs text-slate-500 font-medium">Bangladesh</p>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-200 relative">
        <Bell size={20} />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
      <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-200 md:hidden">
        <Menu size={20} />
      </button>
      <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-100">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">Guest User</p>
          <p className="text-xs text-slate-500">Demo Mode</p>
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
          <User className="w-full h-full p-2 text-slate-400" />
        </div>
      </div>
    </div>
  </header>
);

const PanicButton = () => {
  const { triggerEmergency } = useEmergency();
  return (
    <button
      onClick={triggerEmergency}
      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 px-6 rounded-2xl border border-red-100 transition-all hover:scale-[1.02] active:scale-95 w-full flex items-center justify-center gap-2 group"
    >
      <span className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping"></span>
      Emergency SOS (999)
    </button>
  );
}

const Dashboard = () => {
  return (
    <div className="pt-28 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      <EmergencyOverlay />
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Main Content - 8 Cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-slate-800">Live Translator</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
           </div>
           <div className="flex-1 min-h-[500px]">
             <SignDetector />
           </div>
        </div>

        {/* Sidebar - 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Guide */}
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
            <h3 className="font-display font-bold text-slate-800 text-lg mb-4">Quick Gestures</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center hover:bg-slate-100 transition-colors cursor-help">
                <span className="text-2xl block mb-1">✋</span>
                <span className="text-xs font-bold text-slate-600">Hello</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center hover:bg-slate-100 transition-colors cursor-help">
                <span className="text-2xl block mb-1">👍</span>
                <span className="text-xs font-bold text-slate-600">Yes</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center hover:bg-slate-100 transition-colors cursor-help">
                <span className="text-2xl block mb-1">✌️</span>
                <span className="text-xs font-bold text-slate-600">Peace</span>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center hover:bg-red-100 transition-colors cursor-help">
                <span className="text-2xl block mb-1">✊</span>
                <span className="text-xs font-bold text-red-600">SOS</span>
              </div>
            </div>
          </div>

          {/* Text to Sign */}
          <div className="flex-1">
            <TextToSign />
          </div>

          {/* Panic Button */}
          <div>
            <PanicButton />
          </div>
          
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <EmergencyProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/app" component={Dashboard} />
        </Switch>
      </div>
    </EmergencyProvider>
  );
}

export default App;
