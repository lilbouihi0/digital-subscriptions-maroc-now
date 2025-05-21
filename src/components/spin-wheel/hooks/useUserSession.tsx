
import { useState, useEffect } from 'react';

export const useUserSession = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSpun, setHasSpun] = useState(false);
  
  // Check if user is already verified
  useEffect(() => {
    const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
    const savedPhone = localStorage.getItem('verifiedPhone') || '';
    const hasSpunToday = localStorage.getItem('hasSpunToday') === 'true';
    
    if (phoneVerified) {
      setIsVerified(true);
      setPhoneNumber(savedPhone);
    }
    
    // Check if user has spun today from local storage
    if (hasSpunToday) {
      setHasSpun(true);
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
