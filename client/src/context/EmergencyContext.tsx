import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface EmergencyContextType {
  isEmergency: boolean;
  triggerEmergency: () => void;
  resetEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

// Function to show toast (will be called from components that have access to toast)
export const showEmergencyToast = (message: string) => {
  const event = new CustomEvent('emergencyAlert', { detail: { message } });
  window.dispatchEvent(event);
};

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEmergency, setIsEmergency] = useState(false);
  const { user } = useAuth();

  const triggerEmergency = useCallback(async () => {
    if (!isEmergency && user) {
      setIsEmergency(true);
      console.log('🚨 EMERGENCY TRIGGERED!');
      
      // Show alert notification
      showEmergencyToast('Emergency SOS Activated - Alert sent to emergency services with your location');

      // Get user's current location with timeout
      if ('geolocation' in navigator) {
        const timeoutId = setTimeout(() => {
          console.log('⚠️ Geolocation timeout - sending alert without location');
          // Send alert without location after timeout
          sendEmergencyAlert(user, null, null);
        }, 5000);

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            clearTimeout(timeoutId);
            try {
              const { latitude, longitude } = position.coords;
              console.log(`📍 Location obtained: ${latitude}, ${longitude}`);
              await sendEmergencyAlert(user, latitude.toString(), longitude.toString());
            } catch (error) {
              console.error('Failed to process location:', error);
              await sendEmergencyAlert(user, null, null);
            }
          },
          (error) => {
            clearTimeout(timeoutId);
            console.error('Geolocation error:', error);
            // Send alert without location
            sendEmergencyAlert(user, null, null);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        console.log('⚠️ Geolocation not available - sending alert without location');
        sendEmergencyAlert(user, null, null);
      }
    }
  }, [isEmergency, user]);

  const sendEmergencyAlert = async (user: any, latitude: string | null, longitude: string | null) => {
    try {
      const body: any = {
        userId: user.id,
        userName: user.name,
        userPhone: user.phoneNumber || 'N/A',
      };

      if (latitude && longitude) {
        body.latitude = latitude;
        body.longitude = longitude;
        body.address = `Lat: ${parseFloat(latitude).toFixed(4)}, Lng: ${parseFloat(longitude).toFixed(4)}`;
      }

      const response = await fetch('/api/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        console.log('✅ EMERGENCY ALERT SUCCESSFULLY SENT TO POLICE');
      } else {
        console.error('Failed to send emergency alert - Status:', response.status);
      }
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
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
