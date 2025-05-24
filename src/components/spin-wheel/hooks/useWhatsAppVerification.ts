import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

interface UseWhatsAppVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  translations: {
    error: string;
    invalidPhone: string;
    codeSent: string;
    sendError: string;
    verified: string;
    phoneVerified: string;
    verificationFailed: string;
    wrongCode: string;
    verificationError: string;
  };
}

export const useWhatsAppVerification = ({ 
  phoneNumber, 
  onVerified,
  translations 
}: UseWhatsAppVerificationProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Format phone number to E.164 format and validate
  const formatPhoneNumber = (phone: string): string | null => {
    // Remove all non-digit characters except the plus sign
    let digits = phone.replace(/[^\d+]/g, '');
    
    // If the number doesn't start with +, assume it's a Moroccan number
    if (!digits.startsWith('+')) {
      // If it starts with 0, remove it (local format)
      if (digits.startsWith('0')) {
        digits = digits.substring(1);
      }
      
      // Add Moroccan country code
      digits = `+212${digits}`;
    }
    
    // Remove the plus sign for length validation
    const digitsOnly = digits.replace(/\+/g, '');
    
    // Validate the phone number (should be 11-12 digits for international format)
    // Most international numbers are between 10 and 15 digits including country code
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      return null; // Invalid phone number
    }
    
    // Check for sequential patterns (like 123456789)
    const isSequential = (num: string): boolean => {
      for (let i = 0; i < num.length - 2; i++) {
        const digit1 = parseInt(num[i]);
        const digit2 = parseInt(num[i + 1]);
        const digit3 = parseInt(num[i + 2]);
        
        // Check for ascending sequence (e.g., 123)
        if (digit2 === digit1 + 1 && digit3 === digit2 + 1) {
          return true;
        }
        
        // Check for descending sequence (e.g., 321)
        if (digit2 === digit1 - 1 && digit3 === digit2 - 1) {
          return true;
        }
      }
      return false;
    };
    
    // Check for repeated digits (like 666666)
    const hasRepeatedPattern = (num: string): boolean => {
      // Check for 4 or more of the same digit in a row
      for (let i = 0; i < num.length - 3; i++) {
        if (num[i] === num[i + 1] && num[i] === num[i + 2] && num[i] === num[i + 3]) {
          return true;
        }
      }
      
      // Check for repeating pairs (like 121212)
      if (num.length >= 6) {
        for (let i = 0; i < num.length - 5; i++) {
          if (num[i] === num[i + 2] && num[i] === num[i + 4] && 
              num[i + 1] === num[i + 3] && num[i + 1] === num[i + 5]) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    // Get the significant part of the number (excluding country code)
    const significantPart = digitsOnly.slice(-9);
    
    // Reject if the number has obvious patterns
    if (isSequential(significantPart) || hasRepeatedPattern(significantPart)) {
      return null;
    }
    
    // Explicitly check for known test patterns
    const knownTestPatterns = [
      '123456789', '987654321', '666666666', '000000000', 
      '111111111', '222222222', '333333333', '444444444',
      '555555555', '777777777', '888888888', '999999999',
      '123123123', '456456456', '789789789', '012345678'
    ];
    
    if (knownTestPatterns.some(pattern => significantPart.includes(pattern))) {
      return null;
    }
    
    return digits;
  };
  
  // Validates the phone number and proceeds
  const handleSendCode = () => {
    setIsLoading(true);
    
    // Basic validation for empty input
    if (!phoneNumber) {
      toast({
        title: translations.error,
        description: translations.invalidPhone,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Format and validate the phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // If the phone number is invalid
      if (!formattedPhone) {
        // Check for specific patterns to provide more helpful error messages
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        
        // Check for sequential patterns like 123456789
        const hasSequentialPattern = /123456|234567|345678|456789|987654|876543|765432|654321/.test(digitsOnly);
        
        // Check for repeated digits like 666666
        const hasRepeatedDigits = /(\d)\1{5,}/.test(digitsOnly); // 6 or more of the same digit
        
        if (hasSequentialPattern) {
          toast({
            title: translations.error,
            description: "Please enter a real phone number, not a sequential pattern",
            variant: "destructive"
          });
        } else if (hasRepeatedDigits) {
          toast({
            title: translations.error,
            description: "Please enter a real phone number, not repeated digits",
            variant: "destructive"
          });
        } else {
          toast({
            title: translations.error,
            description: "Please enter a valid phone number",
            variant: "destructive"
          });
        }
        
        setIsLoading(false);
        return;
      }
      
      console.log("Phone number entered:", formattedPhone);
      
      // Skip actual verification and consider the user verified immediately
      toast({
        title: translations.verified,
        description: translations.phoneVerified,
      });
      
      // Store phone number in localStorage
      localStorage.setItem('phoneVerified', 'true');
      localStorage.setItem('verifiedPhone', formattedPhone);
      
      // Call onVerified to proceed to spin wheel
      setTimeout(() => {
        setIsLoading(false);
        onVerified();
      }, 500); // Small delay for better UX
      
    } catch (error: any) {
      console.error('Error processing phone number:', error);
      toast({
        title: translations.error,
        description: "An error occurred while processing your request",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // This function is kept for compatibility but won't be used
  const handleVerifyOtp = () => {
    // This is a no-op function since we're skipping verification
    console.log("OTP verification bypassed");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, '+', and spaces
    const value = e.target.value.replace(/[^\d\s+]/g, '');
    
    // Limit the length to a reasonable size for phone numbers (prevent abuse)
    if (value.replace(/\D/g, '').length > 15) {
      return e.target.value; // Don't update if too long
    }
    
    return value; 
  };
  
  return {
    step,
    setStep,
    isLoading,
    otp,
    setOtp,
    otpError,
    handleSendCode,
    handleVerifyOtp,
    handlePhoneChange
  };
};