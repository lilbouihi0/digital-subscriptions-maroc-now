
import { useState, useEffect } from 'react';
import { hasSpunToday } from '@/utils/twilioService';

export const useUserSession = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSpun, setHasSpun] = useState(false);
  
  // Check if user is already verified
  useEffect(() => {
    const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
    const savedPhone = localStorage.getItem('verifiedPhone') || '';
    
    if (phoneVerified) {
      setIsVerified(true);
      setPhoneNumber(savedPhone);
      
      // Check if user has spun today
      if (savedPhone) {
        hasSpunToday(savedPhone)
          .then(result => setHasSpun(result))
          .catch(err => console.error('Error checking spin status:', err));
      }
    }
  }, []);
  
  return {
    isVerified,
    setIsVerified,
    phoneNumber,
    setPhoneNumber,
    hasSpun,
    setHasSpun
  };
};
