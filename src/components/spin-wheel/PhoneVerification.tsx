
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

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
  const [expectedOtp, setExpectedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  // Handle phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, '+', and spaces
    const value = e.target.value.replace(/[^\d\s+]/g, '');
    setPhoneNumber(value);
  };
  
  // Send verification code
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
      // Generate a random 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedOtp(verificationCode);
      
      // In a real application, you would send this via API
      // For now, we'll simulate it
      console.log(`Would send verification code ${verificationCode} to ${phoneNumber}`);
      
      // Simulate WhatsApp message with verification code
      setTimeout(() => {
        toast({
          title: t("spinner.codeSent"),
          description: t("spinner.checkWhatsApp"),
        });
        
        // In a real app, this would be sent via WhatsApp API
        // For demo purposes, we'll show it in a toast
        setTimeout(() => {
          toast({
            title: t("spinner.verificationCode"),
            description: `${t("spinner.yourCode")}: ${verificationCode}`,
            variant: "default"
          });
          setIsLoading(false);
          setStep('otp');
        }, 1000);
      }, 1500);
      
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
  
  // Verify OTP code
  const handleVerifyOtp = () => {
    setIsLoading(true);
    setOtpError('');
    
    setTimeout(() => {
      if (otp === expectedOtp) {
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
    }, 1000);
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
