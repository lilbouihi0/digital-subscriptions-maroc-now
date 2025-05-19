
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
          {translations.enterPhone}
        </h3>
        <p className="text-gray-600">
          {translations.phoneVerificationNeeded}
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
          disabled={isLoading || !phoneNumber || phoneNumber.length < 8}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
              {translations.sending}
            </div>
          ) : (
            translations.sendVerificationCode
          )}
        </Button>
      </div>
    </>
  );
};

export default PhoneInput;

