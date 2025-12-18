import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmergencyProvider, useEmergency } from '../context/EmergencyContext';
import { useAccessibility } from '../context/AccessibilityContext';
import SignDetector from '../components/SignDetector';
import TextToSign from '../components/TextToSign';
import EmergencyOverlay from '../components/EmergencyOverlay';
import MeetSystem from '../components/MeetSystem';
import { PoliceDashboard } from '../components/PoliceDashboard';
import { ParentDashboard } from '../components/ParentDashboard';
import AccessibilitySettings from '../components/AccessibilitySettings';
import EmergencyProfileCard from '../components/EmergencyProfileCard';
import VoiceCommandSystem from '../components/VoiceCommandSystem';
import QuickAccessibilityToolbar from '../components/QuickAccessibilityToolbar';
import CaregiverMode from '../components/CaregiverMode';
import SettingsPage from './Settings';
import { 
  Bell, User, 
  LayoutDashboard, Video, Settings, LogOut,
  Accessibility, Users
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { logout, user } = useAuth();
  const { setToolbarVisible } = useAccessibility();
  
  const menuItems = [
    { id: 'app', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meet', label: 'SafeMeet', icon: Video },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'caregiver', label: 'Caregiver Mode', icon: Users },
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
            data-testid={`nav-${item.id}`}
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

      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          data-testid="button-quick-accessibility"
          onClick={() => setToolbarVisible(true)}
          className="w-full flex items-center justify-center lg:justify-start p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          <Accessibility size={20} />
          <span className="hidden lg:block ml-3 font-medium text-sm">Quick Settings</span>
        </button>
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="font-bold text-slate-800 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button 
          data-testid="button-logout"
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

const DashboardContent = ({ onNavigateToSettings }: { onNavigateToSettings: () => void }) => {
  const { user } = useAuth();
  
  if (user?.role === 'police') {
    return <PoliceDashboard />;
  }
  
  if (user?.role === 'parent') {
    return <ParentDashboard />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <SignDetector />
      </div>
      
      <div className="lg:col-span-4 flex flex-col gap-6">
        <EmergencyProfileCard onNavigateToSettings={onNavigateToSettings} />
        <div className="flex-1">
          <TextToSign />
        </div>
      </div>
    </div>
  );
};

const getTabTitle = (tab: string) => {
  const titles: Record<string, string> = {
    app: 'Dashboard',
    meet: 'SafeMeet',
    accessibility: 'Accessibility',
    caregiver: 'Caregiver Mode',
    settings: 'Settings'
  };
  return titles[tab] || 'Dashboard';
};

const MainAppContent = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { triggerEmergency } = useEmergency();
  const { setToolbarVisible } = useAccessibility();

  return (
    <>
      <VoiceCommandSystem 
        onNavigate={setActiveTab}
        onEmergency={triggerEmergency}
      />
      
      <QuickAccessibilityToolbar />
      
      <EmergencyOverlay />
      
      {activeTab === 'app' && <DashboardContent onNavigateToSettings={() => setActiveTab('settings')} />}
      
      {activeTab === 'meet' && (
        <div className="h-[calc(100vh-12rem)]">
          <MeetSystem />
        </div>
      )}
      
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <AccessibilitySettings />
          <div className="flex justify-center">
            <button
              data-testid="button-show-toolbar"
              onClick={() => setToolbarVisible(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors"
            >
              <Accessibility size={20} />
              Show Quick Toolbar
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'caregiver' && <CaregiverMode />}
      
      {activeTab === 'settings' && <SettingsPage />}
    </>
  );
};

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('app');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          <header className="flex justify-between items-center gap-4 mb-8">
            <h1 className="text-2xl font-display font-bold text-slate-800">
              {getTabTitle(activeTab)}
            </h1>
            <div className="flex gap-4">
              <button 
                data-testid="button-notifications"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-500 relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
          </header>

          <EmergencyProvider>
            <MainAppContent activeTab={activeTab} setActiveTab={setActiveTab} />
          </EmergencyProvider>
        </div>
      </main>
    </div>
  );
};

export default MainApp;
