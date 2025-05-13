
import React from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OtpInputProps {
  phoneNumber: string;
  otp: string;
  setOtp: (value: string) => void;
  otpError: string;
  onVerify: () => void;
  onChangePhone: () => void;
  isLoading: boolean;
  translations: {
    enterCode: string;
    codeSentTo: string;
    changePhone: string;
    verifyCode: string;
    verifying: string;
  };
}

const OtpInput: React.FC<OtpInputProps> = ({
  phoneNumber,
  otp,
  setOtp,
  otpError,
  onVerify,
  onChangePhone,
  isLoading,
  translations
}) => {
  return (
    <>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {translations.enterCode}
        </h3>
        <p className="text-gray-600">
          {translations.codeSentTo} {phoneNumber}
        </p>
        <button 
          onClick={onChangePhone}
          className="text-indigo-600 text-sm mt-1 hover:underline"
        >
          {translations.changePhone}
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
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
          onClick={onVerify}
          disabled={isLoading || otp.length < 6}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
              {translations.verifying}
            </div>
          ) : (
            translations.verifyCode
          )}
        </Button>
      </div>
    </>
  );
};

export default OtpInput;
