
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { sendVerificationCode, verifyCode } from '@/utils/twilioService';

interface PhoneVerificationProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  onVerified: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phoneNumber,
  setPhoneNumber,
  onVerified
}) => {
  const { t, dir } = useLanguage();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Handle phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, '+', and spaces
    const value = e.target.value.replace(/[^\d\s+]/g, '');
    setPhoneNumber(value);
  };
  
  // Send verification code via Twilio
  const handleSendCode = async () => {
    setIsLoading(true);
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 8) {
      toast({
        title: t("spinner.error"),
        description: t("spinner.invalidPhone"),
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
          title: t("spinner.codeSent"),
          description: t("spinner.checkWhatsApp"),
        });
        setIsLoading(false);
        setStep('otp');
      } else {
        toast({
          title: t("spinner.error"),
          description: t("spinner.sendError"),
          variant: "destructive"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: t("spinner.error"),
        description: t("spinner.sendError"),
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
          title: t("spinner.verified"),
          description: t("spinner.phoneVerified"),
        });
        
        // Save verification status
        localStorage.setItem('phoneVerified', 'true');
        localStorage.setItem('verifiedPhone', phoneNumber);
        
        onVerified();
      } else {
        // Invalid OTP
        setOtpError(t("spinner.invalidOtp"));
        toast({
          title: t("spinner.verificationFailed"),
          description: t("spinner.wrongCode"),
          variant: "destructive"
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: t("spinner.error"),
        description: t("spinner.verificationError"),
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Focus input on mount
  React.useEffect(() => {
    if (step === 'phone' && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [step]);
  
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
      <div className="w-full max-w-md space-y-6">
        {step === 'phone' ? (
          <>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("spinner.enterPhone")}
              </h3>
              <p className="text-gray-600">
                {t("spinner.phoneVerificationNeeded")}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  ref={phoneInputRef}
                  type="tel"
                  placeholder="+212 600000000"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="text-lg"
                  dir="ltr" // Always LTR for phone numbers
                />
              </div>
              
              <Button 
                onClick={handleSendCode}
                disabled={isLoading || !phoneNumber || phoneNumber.length < 8}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
                    {t("spinner.sending")}
                  </div>
                ) : (
                  t("spinner.sendVerificationCode")
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("spinner.enterCode")}
              </h3>
              <p className="text-gray-600">
                {t("spinner.codeSentTo")} {phoneNumber}
              </p>
              <button 
                onClick={() => setStep('phone')}
                className="text-indigo-600 text-sm mt-1 hover:underline"
              >
                {t("spinner.changePhone")}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setOtpError('');
                  }}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              
              {otpError && (
                <p className="text-red-500 text-center text-sm">{otpError}</p>
              )}
              
              <Button 
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length < 6}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
                    {t("spinner.verifying")}
                  </div>
                ) : (
                  t("spinner.verifyCode")
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
