
import { useState } from 'react';
import { sendVerificationCode, verifyCode } from '@/utils/twilioService';
import { toast } from "@/hooks/use-toast";

interface UsePhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  translations: {
    error: string;
    invalidPhone: string;
    codeSent: string;
    checkWhatsApp: string;
    sendError: string;
    verified: string;
    phoneVerified: string;
    verificationFailed: string;
    wrongCode: string;
    verificationError: string;
  };
}

export const usePhoneVerification = ({ 
  phoneNumber, 
  onVerified,
  translations 
}: UsePhoneVerificationProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Format phone number to E.164 format for Twilio
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // If number doesn't start with +, add the country code (assume Morocco +212)
    if (!phone.startsWith('+')) {
      // If number starts with 0, remove it and add country code
      if (digits.startsWith('0')) {
        digits = digits.substring(1);
      }
      
      // Add Morocco country code
      return `+212${digits}`;
    }
    
    return phone;
  };
  
  // Send verification code via Twilio
  const handleSendCode = async () => {
    setIsLoading(true);
    
    // Validate phone number
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
      // Format phone number for Twilio
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Send verification code using Twilio
      const success = await sendVerificationCode(formattedPhone);
      
      if (success) {
        toast({
          title: translations.codeSent,
          description: translations.checkWhatsApp,
        });
        setIsLoading(false);
        setStep('otp');
      } else {
        toast({
          title: translations.error,
          description: translations.sendError,
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: translations.error,
        description: translations.sendError,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Verify OTP code with Twilio
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setOtpError('');
    
    try {
      // Format phone number for Twilio
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Verify OTP code using Twilio
      const isValid = await verifyCode(formattedPhone, otp);
      
      if (isValid) {
        // Success! Phone verified
        toast({
          title: translations.verified,
          description: translations.phoneVerified,
        });
        
        // Save verification status
        localStorage.setItem('phoneVerified', 'true');
        localStorage.setItem('verifiedPhone', phoneNumber);
        
        onVerified();
      } else {
        // Invalid OTP
        setOtpError(translations.invalidOtp);
        toast({
          title: translations.verificationFailed,
          description: translations.wrongCode,
          variant: "destructive"
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: translations.error,
        description: translations.verificationError,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Handle phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, '+', and spaces
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
