import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const useDeviceFingerprint = () => {
  const [deviceId, setDeviceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the agent at application startup
    const getFingerprint = async () => {
      try {
        setIsLoading(true);
        // Initialize an agent
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        
        // Get the visitor identifier
        const result = await fp.get();
        
        // This is the visitor identifier
        const visitorId = result.visitorId;
        setDeviceId(visitorId);
        
        // Store the fingerprint in localStorage for future reference
        localStorage.setItem('deviceFingerprint', visitorId);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating fingerprint:', error);
        // Fallback to a random ID if fingerprinting fails
        const fallbackId = Math.random().toString(36).substring(2, 15);
        setDeviceId(fallbackId);
        localStorage.setItem('deviceFingerprint', fallbackId);
        setIsLoading(false);
      }
    };

    // Check if we already have a fingerprint in localStorage
    const storedFingerprint = localStorage.getItem('deviceFingerprint');
    if (storedFingerprint) {
      setDeviceId(storedFingerprint);
      setIsLoading(false);
    } else {
      getFingerprint();
    }
  }, []);

  return { deviceId, isLoading };
};