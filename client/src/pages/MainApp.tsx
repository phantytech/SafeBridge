import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmergencyProvider } from '../context/EmergencyContext';
import SignDetector from '../components/SignDetector';
import TextToSign from '../components/TextToSign';
import EmergencyOverlay from '../components/EmergencyOverlay';
import MeetSystem from '../components/MeetSystem';
import { PoliceDashboard } from '../components/PoliceDashboard';
import { ParentDashboard } from '../components/ParentDashboard';
import { 
  HeartHandshake, Bell, Menu, User, 
  LayoutDashboard, Video, Settings, LogOut 
} from 'lucide-react';
import { Link } from 'wouter';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { logout, user } = useAuth();
  
  const menuItems = [
    { id: 'app', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meet', label: 'SafeMeet', icon: Video },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-20 lg:w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
        <img src="/logo.png" alt="SafeBridge" className="w-10 h-10 object-contain" />
        <span className="hidden lg:block ml-3 font-display font-bold text-xl text-slate-800">SafeBridge</span>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <item.icon size={24} />
            <span className="hidden lg:block ml-3 font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="font-bold text-slate-800 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center lg:justify-start p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden lg:block ml-3 font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const { user } = useAuth();
  
  if (user?.role === 'police') {
    return <PoliceDashboard />;
  }
  
  if (user?.role === 'parent') {
    return <ParentDashboard />;
  }

  // Default User Dashboard
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-8 flex flex-col gap-6">
         <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="font-display font-bold text-xl text-slate-800">Live Translator</h2>
               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
            </div>
            <div className="flex-1 p-1">
               <SignDetector />
            </div>
         </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex-1">
          <TextToSign />
        </div>
      </div>
    </div>
  );
};

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('app');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-display font-bold text-slate-800 capitalize">
              {activeTab === 'app' ? 'Dashboard' : activeTab === 'meet' ? 'SafeMeet' : 'Settings'}
            </h1>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-500 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
          </header>

          <EmergencyProvider>
            <EmergencyOverlay />
            
            {activeTab === 'app' && <DashboardContent />}
            
            {activeTab === 'meet' && (
              <div className="h-[calc(100vh-12rem)]">
                <MeetSystem />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-slate-500">
                <Settings size={48} className="mx-auto mb-4 opacity-20" />
                <p>Settings panel under construction</p>
              </div>
            )}
          </EmergencyProvider>
        </div>
      </main>
    </div>
  );
};

export default MainApp;
