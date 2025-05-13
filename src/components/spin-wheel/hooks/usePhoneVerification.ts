
import { useState, useEffect } from 'react';
import { auth, RecaptchaVerifier as FirebaseRecaptchaVerifier } from '@/lib/firebase-config'; // Updated import
import { signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'; // Firebase specific imports
import { toast } from "@/hooks/use-toast";

// Declare global recaptchaVerifier on window
declare global {
  interface Window {
    recaptchaVerifier?: FirebaseRecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}
interface UsePhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  translations: {
    error: string;
    invalidPhone: string;
    codeSent: string;
    // Removed checkWhatsApp as Firebase SMS might not be WhatsApp specific
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
  
  // Effect to setup RecaptchaVerifier
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
        // Ensure the container element exists before initializing
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
          window.recaptchaVerifier = new FirebaseRecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible', // or 'normal'
            'callback': (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // If you're using 'invisible', this callback is triggered automatically.
              console.log("reCAPTCHA solved:", response);
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              toast({
                title: translations.error,
                description: "reCAPTCHA expired. Please try again.",
                variant: "destructive"
              });
              // Optionally, reset reCAPTCHA here if needed
              if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then((widgetId) => {
                  // @ts-ignore // grecaptcha is globally available after render
                  if (window.grecaptcha && widgetId !== undefined) {
                     // @ts-ignore
                    window.grecaptcha.reset(widgetId);
                  }
                });
              }
            }
          });
          window.recaptchaVerifier.render().catch(err => {
            console.error("Error rendering reCAPTCHA:", err);
            toast({
                title: translations.error,
                description: "Failed to initialize reCAPTCHA. Check console.",
                variant: "destructive"
            });
          });
        } else {
          console.warn("reCAPTCHA container not found. Verification might fail.");
        }
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
        toast({
          title: translations.error,
          description: "Failed to initialize phone verification. Check console.",
          variant: "destructive"
        });
      }
    }
    // Cleanup function to clear reCAPTCHA when component unmounts or auth changes
    return () => {
      if (window.recaptchaVerifier) {
        // window.recaptchaVerifier.clear(); // This method might not exist on all versions or setups
        // Instead, try to remove the reCAPTCHA widget from DOM if necessary
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
          recaptchaContainer.innerHTML = ''; 
        }
        window.recaptchaVerifier = undefined; // Clear instance
      }
    };
  }, [translations.error]); // Dependency on auth, can also be empty if auth is stable

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

    if (!window.recaptchaVerifier) {
      toast({
        title: translations.error,
        description: "reCAPTCHA not initialized. Please wait or refresh.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult; // Store confirmationResult globally or in state
      
      toast({
        title: translations.codeSent,
        // description: translations.checkWhatsApp, // Firebase sends SMS, not necessarily WhatsApp
        description: `A code has been sent to ${formattedPhone}.`,
      });
      setIsLoading(false);
      setStep('otp');
    } catch (error: any) {
      console.error('Error sending verification code with Firebase:', error);
      // Check for specific Firebase error codes if needed
      // e.g., error.code === 'auth/too-many-requests'
      toast({
        title: translations.error,
        description: error.message || translations.sendError,
        variant: "destructive"
      });
       // Reset reCAPTCHA on error if it exists
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
           // @ts-ignore
          if (window.grecaptcha && widgetId !== undefined) {
             // @ts-ignore
            window.grecaptcha.reset(widgetId);
          }
        });
      }
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setOtpError('');

    if (!window.confirmationResult) {
      toast({
        title: translations.error,
        description: "Verification session expired or not found. Please try sending the code again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      await window.confirmationResult.confirm(otp);
      // User signed in successfully.
      toast({
        title: translations.verified,
        description: translations.phoneVerified,
      });
      
      localStorage.setItem('phoneVerified', 'true');
      localStorage.setItem('verifiedPhone', phoneNumber); // Store original non-formatted number if preferred
      
      onVerified();
      // No need to setIsLoading(false) here if onVerified navigates away or unmounts
    } catch (error: any) {
      console.error('Error verifying OTP with Firebase:', error);
      setOtpError(translations.wrongCode); // Or a more specific error from Firebase if available
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
    // This function in the hook now just returns the value, 
    // setPhoneNumber is called directly in PhoneVerification component.
    // Or, if setPhoneNumber is passed to the hook:
    // setPhoneNumber(value); 
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
    handlePhoneChange // Keep this if PhoneVerification still uses it, otherwise it can be simplified.
  };
};

