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
  const [verificationCode, setVerificationCode] = useState<number | null>(null);
  
  // Format phone number to E.164 format
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
  
  const handleSendCode = async () => {
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
      onVerified();
      
    } catch (error: any) {
      console.error('Error processing phone number:', error);
      toast({
        title: translations.error,
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setOtpError('');

    if (!verificationCode) {
      toast({
        title: translations.error,
        description: "Verification session expired or not found. Please try sending the code again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Verify the OTP locally by comparing with the stored code
      if (parseInt(otp) === verificationCode) {
        // Verification successful
        toast({
          title: translations.verified,
          description: translations.phoneVerified,
        });
        
        localStorage.setItem('phoneVerified', 'true');
        localStorage.setItem('verifiedPhone', phoneNumber);
        
        onVerified();
      } else {
        throw new Error(translations.wrongCode);
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setOtpError(translations.wrongCode);
      toast({
        title: translations.verificationFailed,
        description: error.message || translations.wrongCode,
        variant: "destructive"
      });
      setIsLoading(false);
    }
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