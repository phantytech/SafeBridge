import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface EmergencyContextType {
  isEmergency: boolean;
  triggerEmergency: () => void;
  resetEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEmergency, setIsEmergency] = useState(false);
  const { user } = useAuth();

  const triggerEmergency = useCallback(async () => {
    if (!isEmergency && user) {
      setIsEmergency(true);
      
      // Get user's current location
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              
              // Send emergency alert to server
              const response = await fetch('/api/emergency/alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  userName: user.name,
                  userPhone: (user as any).phoneNumber,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                })
              });

              if (response.ok) {
                console.log('🚨 EMERGENCY ALERT SENT WITH LOCATION');
              }
            } catch (error) {
              console.error('Failed to send emergency alert:', error);
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            // Still send alert even without location
            fetch('/api/emergency/alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                userName: user.name,
                userPhone: (user as any).phoneNumber,
              })
            }).catch(e => console.error('Failed to send emergency alert:', e));
          }
        );
      }
    }
  }, [isEmergency, user]);

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
