
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  phoneNumber: string;
  onPhoneChange: (value: string) => void;
  onSendCode: () => void;
  isLoading: boolean;
  translations: {
    enterPhone: string;
    phoneVerificationNeeded: string;
    sendVerificationCode: string;
    sending: string;
  };
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneNumber,
  onPhoneChange,
  onSendCode,
  isLoading,
  translations
}) => {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, '+', and spaces
    const value = e.target.value.replace(/[^\d\s+]/g, '');
    onPhoneChange(value);
  };
  
  return (
    <>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Enter Your Phone Number
        </h3>
        <p className="text-gray-600">
          Enter your phone number to spin the wheel and win prizes!
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Format: +212 XXXXXXXXX (must be a valid number)
        </p>
        <p className="text-xs text-red-500 mt-1">
          Please use your real phone number. Test numbers like 123456789 or 666666666 will be rejected.
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
          onClick={onSendCode}
          disabled={isLoading || !phoneNumber || phoneNumber.replace(/[\s+]/g, '').length < 9}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
              Processing...
            </div>
          ) : (
            "Spin the Wheel"
          )}
        </Button>
      </div>
    </>
  );
};

export default PhoneInput;

