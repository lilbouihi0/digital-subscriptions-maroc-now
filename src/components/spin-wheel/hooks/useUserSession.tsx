
import { useState, useEffect } from 'react';
import { useDeviceFingerprint } from '@/hooks/useDeviceFingerprint';
import { 
  hasSpunToday, 
  hasTryAgainChance, 
  cleanupOldRecords 
} from '@/services/spinTrackingService';
import { 
  listenForBroadcastEvents, 
  BroadcastEventType 
} from '@/services/broadcastService';

export const useUserSession = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSpun, setHasSpun] = useState(false);
  const [gotTryAgain, setGotTryAgain] = useState(false);
  const [isCheckingSpinStatus, setIsCheckingSpinStatus] = useState(false);
  const { deviceId, isLoading: isLoadingFingerprint } = useDeviceFingerprint();
  
  // Check if user is already verified and check spin status
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Clean up old records first
        await cleanupOldRecords();
        
        const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
        let savedPhone = localStorage.getItem('verifiedPhone') || '';
        
        // Ensure the phone number is properly formatted
        if (savedPhone && !savedPhone.startsWith('+')) {
          // Add the + prefix to the country code
          savedPhone = '+' + savedPhone;
          
          // Update localStorage with the formatted number
          localStorage.setItem('verifiedPhone', savedPhone);
        }
        
        if (phoneVerified && savedPhone) {
          // Validate the phone number format (should be a + followed by country code and at least 8 digits)
          const phoneRegex = /^\+\d{1,4}\d{8,}$/;
          if (phoneRegex.test(savedPhone)) {
            setIsVerified(true);
            setPhoneNumber(savedPhone);
          } else {
            // If the saved phone number is invalid, clear verification
            localStorage.removeItem('phoneVerified');
            localStorage.removeItem('verifiedPhone');
          }
        }
        
        // Only check spin status if we have both phone number and device ID
        if (savedPhone && deviceId && !isLoadingFingerprint) {
          setIsCheckingSpinStatus(true);
          
          // Check if user has already spun today
          const userHasSpun = await hasSpunToday(savedPhone, deviceId);
          setHasSpun(userHasSpun);
          
          // Check if user has a "Try Again" chance
          const userHasTryAgain = await hasTryAgainChance(savedPhone, deviceId);
          setGotTryAgain(userHasTryAgain);
          
          setIsCheckingSpinStatus(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsCheckingSpinStatus(false);
      }
    };
    
    checkUserStatus();
  }, [deviceId, isLoadingFingerprint]);
  
  // Update spin status whenever phone number changes
  useEffect(() => {
    const updateSpinStatus = async () => {
      if (phoneNumber && deviceId && !isLoadingFingerprint) {
        try {
          setIsCheckingSpinStatus(true);
          
          const userHasSpun = await hasSpunToday(phoneNumber, deviceId);
          setHasSpun(userHasSpun);
          
          const userHasTryAgain = await hasTryAgainChance(phoneNumber, deviceId);
          setGotTryAgain(userHasTryAgain);
          
          setIsCheckingSpinStatus(false);
        } catch (error) {
          console.error('Error updating spin status:', error);
          setIsCheckingSpinStatus(false);
        }
      }
    };
    
    updateSpinStatus();
  }, [phoneNumber, deviceId, isLoadingFingerprint]);
  
  // Also check for cookies as an additional verification method
  useEffect(() => {
    if (phoneNumber) {
      const cookies = document.cookie.split(';');
      const spinCookie = cookies.find(cookie => cookie.trim().startsWith(`lastSpin_${phoneNumber}=`));
      
      if (spinCookie) {
        const today = new Date().toDateString();
        const cookieValue = spinCookie.split('=')[1];
        
        if (cookieValue === today && !hasSpun) {
          setHasSpun(true);
        }
      }
    }
  }, [phoneNumber, hasSpun]);
  
  // Listen for broadcast events from other tabs
  useEffect(() => {
    const cleanup = listenForBroadcastEvents(async (event) => {
      // Only process events if we have a phone number and device ID
      if (!phoneNumber || !deviceId || isLoadingFingerprint) return;
      
      // Check if this event is relevant to this user
      const isRelevantToUser = 
        event.data.phoneNumber === phoneNumber || 
        event.data.deviceId === deviceId;
      
      if (!isRelevantToUser) return;
      
      try {
        setIsCheckingSpinStatus(true);
        
        switch (event.type) {
          case BroadcastEventType.SPIN_RECORDED:
            // Another tab recorded a spin for this user
            setHasSpun(true);
            setGotTryAgain(false);
            break;
            
          case BroadcastEventType.TRY_AGAIN_MARKED:
            // Another tab marked this user as having a try again chance
            setHasSpun(false);
            setGotTryAgain(true);
            break;
            
          case BroadcastEventType.TRY_AGAIN_USED:
            // Another tab used up this user's try again chance
            setHasSpun(true);
            setGotTryAgain(false);
            break;
        }
      } catch (error) {
        console.error('Error processing broadcast event:', error);
      } finally {
        setIsCheckingSpinStatus(false);
      }
    });
    
    return cleanup;
  }, [phoneNumber, deviceId, isLoadingFingerprint]);
  
  return {
    isVerified,
    setIsVerified,
    phoneNumber,
    setPhoneNumber,
    hasSpun,
    setHasSpun,
    gotTryAgain,
    setGotTryAgain,
    deviceId,
    isLoadingFingerprint,
    isCheckingSpinStatus
  };
};
