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
  
  // Format phone number to E.164 format (just for display purposes)
  const formatPhoneNumber = (phone: string): string => {
    let digits = phone.replace(/\D/g, '');
    if (!phone.startsWith('+')) {
      if (digits.startsWith('0')) {
        digits = digits.substring(1);
      }
      return `+212${digits}`; // Assuming Morocco, make this configurable if needed
    }
    return phone;
  };
  
  // Simplified function that just validates the phone number and proceeds
  const handleSendCode = () => {
    setIsLoading(true);
    
    if (!phoneNumber || phoneNumber.length < 8) {
      toast({
        title: translations.error,
        description: translations.invalidPhone,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log("Phone number entered:", formattedPhone);
      
      // Skip actual verification and consider the user verified immediately
      toast({
        title: translations.verified,
        description: translations.phoneVerified,
      });
      
      // Store phone number in localStorage
      localStorage.setItem('phoneVerified', 'true');
      localStorage.setItem('verifiedPhone', phoneNumber);
      
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
    const value = e.target.value.replace(/[^\d\s+]/g, '');
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