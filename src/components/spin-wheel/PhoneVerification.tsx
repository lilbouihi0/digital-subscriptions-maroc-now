
import React from 'react';
import { useLanguage } from "../../contexts/LanguageContext";
import { useWhatsAppVerification } from './hooks/useWhatsAppVerification';
import PhoneInput from './PhoneInput';
import OtpInput from './OtpInput';

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
  
  // Get translations for the phone verification component
  const translations = {
    error: t("spinner.error"),
    invalidPhone: t("spinner.invalidPhone"),
    codeSent: t("spinner.codeSent"),
    checkWhatsApp: t("spinner.checkWhatsApp"),
    sendError: t("spinner.sendError"),
    verified: t("spinner.verified"),
    phoneVerified: t("spinner.phoneVerified"),
    verificationFailed: t("spinner.verificationFailed"),
    wrongCode: t("spinner.wrongCode"),
    verificationError: t("spinner.verificationError"),
    // Add the missing translations required by PhoneInput component
    enterPhone: t("spinner.enterPhone"),
    phoneVerificationNeeded: t("spinner.phoneVerificationNeeded"),
    sendVerificationCode: t("spinner.sendVerificationCode"),
    sending: t("spinner.sending"),
    // Add the missing translations required by OtpInput component
    enterCode: t("spinner.enterCode"),
    codeSentTo: t("spinner.codeSentTo"),
    changePhone: t("spinner.changePhone"),
    verifyCode: t("spinner.verifyCode"),
    verifying: t("spinner.verifying"),
  };
  
  const {
    step,
    setStep,
    isLoading,
    otp,
    setOtp,
    otpError,
    handleSendCode,
    handleVerifyOtp,
    handlePhoneChange
  } = useWhatsAppVerification({ 
    phoneNumber, 
    onVerified,
    translations 
  });
  
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
      <div className="w-full max-w-md space-y-6">
        <PhoneInput
          phoneNumber={phoneNumber}
          onPhoneChange={(value) => setPhoneNumber(handlePhoneChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>))}
          onSendCode={handleSendCode}
          isLoading={isLoading}
          translations={translations}
        />
      </div>
    </div>
  );
};

export default PhoneVerification;
