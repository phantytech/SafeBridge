import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmergencyContextType {
  isEmergency: boolean;
  triggerEmergency: () => void;
  resetEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEmergency, setIsEmergency] = useState(false);

  const triggerEmergency = () => {
    if (!isEmergency) {
      setIsEmergency(true);
      // In a real app, this would trigger API calls
      console.log('🚨 EMERGENCY TRIGGERED');
    }
  };

  const resetEmergency = () => {
    setIsEmergency(false);
  };

  return (
    <EmergencyContext.Provider value={{ isEmergency, triggerEmergency, resetEmergency }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
