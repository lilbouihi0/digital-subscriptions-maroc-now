
import { useState, useEffect } from 'react';

export const useUserSession = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Check if user is already verified
  useEffect(() => {
    const phoneVerified = localStorage.getItem('phoneVerified') === 'true';
    const savedPhone = localStorage.getItem('verifiedPhone') || '';
    
    if (phoneVerified) {
      setIsVerified(true);
      setPhoneNumber(savedPhone);
    }
  }, []);
  
  return {
    isVerified,
    setIsVerified,
    phoneNumber,
    setPhoneNumber
  };
};
