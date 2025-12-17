import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  reduceMotion: boolean;
  
  // Motor
  voiceControlEnabled: boolean;
  largeTouchTargets: boolean;
  oneHandedMode: boolean;
  
  // Cognitive
  simplifiedMode: boolean;
  pictureNavigation: boolean;
  
  // Text size multiplier (1 = normal, 1.25, 1.5, 2)
  textSizeMultiplier: number;
  
  // Emergency profile
  emergencyProfile: EmergencyProfile | null;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface EmergencyProfile {
  fullName: string;
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  shareLocationEnabled: boolean;
  specialInstructions: string;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  updateEmergencyProfile: (profile: EmergencyProfile) => void;
  resetSettings: () => void;
  isToolbarVisible: boolean;
  setToolbarVisible: (visible: boolean) => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  screenReaderMode: false,
  reduceMotion: false,
  voiceControlEnabled: false,
  largeTouchTargets: false,
  oneHandedMode: false,
  simplifiedMode: false,
  pictureNavigation: false,
  textSizeMultiplier: 1,
  emergencyProfile: null,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  
  const [isToolbarVisible, setToolbarVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply CSS classes to document
    const root = document.documentElement;
    
    // High contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Large text
    root.classList.toggle('large-text', settings.largeText);
    
    // Reduce motion
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    
    // Large touch targets
    root.classList.toggle('large-touch-targets', settings.largeTouchTargets);
    
    // Simplified mode
    root.classList.toggle('simplified-mode', settings.simplifiedMode);
    
    // Text size multiplier
    root.style.setProperty('--text-size-multiplier', String(settings.textSizeMultiplier));
    
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateEmergencyProfile = (profile: EmergencyProfile) => {
    setSettings(prev => ({ ...prev, emergencyProfile: profile }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  return (
    <AccessibilityContext.Provider value={{ 
      settings, 
      updateSetting, 
      updateEmergencyProfile,
      resetSettings,
      isToolbarVisible,
      setToolbarVisible
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
