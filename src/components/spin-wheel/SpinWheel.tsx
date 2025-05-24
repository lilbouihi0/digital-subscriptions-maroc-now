import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";
import SpinnerWheel from './SpinnerWheel';
import PrizeDisplay from './PrizeDisplay';
import { usePrizeData } from './hooks/usePrizeData';
import { useUserSession } from './hooks/useUserSession';
import { useSpinServerLogic } from '@/hooks/useSpinServerLogic';
import { recordPhoneNumber } from '@/services/spinTrackingService';

// Country codes data with placeholders
const countryCodes = [
  { code: "212", country: "Morocco", placeholder: "612345678" },
  { code: "1", country: "United States", placeholder: "2123456789" },
  { code: "44", country: "United Kingdom", placeholder: "7123456789" },
  { code: "33", country: "France", placeholder: "612345678" },
  { code: "49", country: "Germany", placeholder: "1512345678" },
  { code: "34", country: "Spain", placeholder: "612345678" },
  { code: "39", country: "Italy", placeholder: "3123456789" },
  { code: "86", country: "China", placeholder: "1381234567" },
  { code: "91", country: "India", placeholder: "9123456789" },
  { code: "55", country: "Brazil", placeholder: "11987654321" },
  { code: "7", country: "Russia", placeholder: "9123456789" },
  { code: "81", country: "Japan", placeholder: "9012345678" },
  { code: "82", country: "South Korea", placeholder: "1012345678" },
  { code: "966", country: "Saudi Arabia", placeholder: "512345678" },
  { code: "971", country: "United Arab Emirates", placeholder: "501234567" },
];

// Country-specific validation rules
const countryValidationRules: Record<string, {
  exactLength: number;
  validPrefixes?: string[];
  regex?: RegExp;
}> = {
  '212': { // Morocco
    exactLength: 9,
    validPrefixes: ['6', '7', '5'], // Mobile prefixes in Morocco
  },
  '33': { // France
    exactLength: 9,
    validPrefixes: ['6', '7'], // Mobile prefixes in France
  },
  '1': { // US
    exactLength: 10,
    // US area codes can't start with 0 or 1
    regex: /^[2-9]\d{2}[2-9]\d{6}$/
  },
  // Add more countries as needed
};

const SpinWheel: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("212"); // Default to Morocco
  const [isInvalidPhoneNumber, setIsInvalidPhoneNumber] = useState(false);
  
  // Function to get placeholder based on selected country code
  const getPlaceholder = () => {
    const country = countryCodes.find(c => c.code === selectedCountryCode);
    return country?.placeholder || "612345678";
  };
  
  // User session and verification state
  const { 
    isVerified, 
    setIsVerified, 
    phoneNumber, 
    setPhoneNumber,
    hasSpun,
    setHasSpun,
    gotTryAgain,
    setGotTryAgain,
    deviceId,
    isLoadingFingerprint,
    isCheckingSpinStatus
  } = useUserSession();
  
  // Prize data
  const { prizes } = usePrizeData();
  
  // Server-side spin logic
  const { 
    isSpinning, 
    prize, 
    rotation, 
    handleSpin,
    applyDiscount,
    claimFreeAccount,
    gotTryAgain: serverGotTryAgain
  } = useSpinServerLogic(phoneNumber, deviceId);
  
  // Show popup for first-time visitors
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
    }
  }, []);
  
  // Sync the gotTryAgain state from the server
  useEffect(() => {
    if (serverGotTryAgain && !gotTryAgain) {
      setGotTryAgain(true);
    }
  }, [serverGotTryAgain, gotTryAgain, setGotTryAgain]);
  
  // Focus the phone input when the dialog opens
  useEffect(() => {
    if (isOpen && !isVerified && phoneInputRef.current) {
      setTimeout(() => {
        if (phoneInputRef.current) {
          phoneInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, isVerified]);
  
  // Format time remaining until next day
  const timeUntilNextSpin = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Prepare spin button content
  const getSpinButtonContent = () => {
    if (isSpinning) {
      return <div className="flex flex-col items-center">
        <div className="animate-spin h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 border-t-2 border-white rounded-full mb-0.5 sm:mb-1" />
        <span className="text-[9px] sm:text-xs md:text-sm font-bold">SPINNING...</span>
      </div>;
    } else if (prize && prize.type !== 'tryAgain') {
      // If a prize is won and it's not "Try Again", show the prize
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold line-clamp-2">{prize.name}</span>
          <span className="text-[8px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 opacity-80">🎁 Congratulations! 🎁</span>
        </div>
      );
    } else if (hasSpun && !gotTryAgain) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-xs md:text-sm font-bold">COME BACK TOMORROW</span>
          <span className="text-[8px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 opacity-80">{timeUntilNextSpin()}</span>
        </div>
      );
    } else if (gotTryAgain) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold">TRY AGAIN!</span>
          <span className="text-[8px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 opacity-80">🎁 One More Chance! 🎁</span>
        </div>
      );
    } else if (!isVerified) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold">ENTER PHONE</span>
          <span className="text-[8px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 opacity-80">👆 Above 👆</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-sm md:text-base lg:text-lg font-bold">CLICK TO SPIN</span>
          <span className="text-[8px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 opacity-80">🎁 Good Luck! 🎁</span>
        </div>
      );
    }
  };

  // Handle wheel spin
  const onSpin = () => {
    // If user is not verified, just highlight the phone input section
    if (!isVerified) {
      // Focus on the phone input to draw attention to it
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
      return;
    }
    
    // Check if fingerprinting is still loading
    if (isLoadingFingerprint || isCheckingSpinStatus) {
      // Just return without showing a toast
      return;
    }
    
    // Check if already spinning
    if (isSpinning) {
      return;
    }
    
    // Check if already spun today, but allow another spin if they got "Try Again"
    if (hasSpun && !gotTryAgain) {
      // No toast, the UI already shows "COME BACK TOMORROW" on the button
      return;
    }
    
    // All checks passed, spin the wheel
    // The useTryAgainChance is now handled in the useSpinServerLogic hook
    handleSpin();
  };

  // Determine dialog background based on theme
  const dialogBackground = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 to-navy-900 text-white' 
    : 'bg-gradient-to-br from-indigo-50 to-purple-50';

  return (
    <>
      <Button 
        className="fixed bottom-16 sm:bottom-24 right-4 sm:right-6 bg-rose-500 hover:bg-rose-600 text-white shadow-lg z-40 rounded-full flex items-center gap-2 animate-pulse"
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">{t("spinner.tryYourLuck")}</span>
        <span className="sm:hidden">Spin</span>
      </Button>
      
      <Dialog 
        open={isOpen} 
        onOpenChange={setIsOpen}
        defaultOpen={false}
      >
        <DialogContent className={`max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto ${dialogBackground} p-4 sm:p-6`} dir={dir}>
          <DialogHeader className="space-y-1 pb-2">
            <DialogTitle className={`text-center text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 bg-clip-text text-transparent'}`}>
              {t("spinner.spinToWin")}
            </DialogTitle>
            <DialogDescription className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm sm:text-base`}>
              {t("spinner.spinDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-2 space-y-4">
            {/* Loading indicator while fingerprinting or checking spin status */}
            {(isLoadingFingerprint || isCheckingSpinStatus) && (
              <div className="w-full max-w-md p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-indigo-500 text-center">
                <div className="animate-spin h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-indigo-500 rounded-full mb-3 sm:mb-4 mx-auto" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                  {isLoadingFingerprint ? "Preparing Spin Wheel" : "Checking Spin Status"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                  {isLoadingFingerprint 
                    ? "Please wait while we set up your unique experience..." 
                    : "Verifying if you've already spun today..."}
                </p>
              </div>
            )}
            
            {/* Phone input form */}
            {!isVerified && !isLoadingFingerprint && !isCheckingSpinStatus && (
              <div className="w-full max-w-md p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-rose-500 animate-pulse">
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                    Enter Your Phone Number
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Enter your phone number to spin the wheel and win prizes!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="w-full sm:w-1/3">
                        <select
                          className="flex h-12 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedCountryCode}
                          onChange={(e) => {
                            console.log("Country code changed to:", e.target.value);
                            setSelectedCountryCode(e.target.value);
                          }}
                          disabled={isVerified}
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              +{country.code} ({country.country})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full sm:w-2/3">
                        <Input
                          ref={phoneInputRef}
                          type="tel"
                          placeholder={getPlaceholder()}
                          value={phoneNumber.replace(/^\+\d+\s*/, '')} // Remove any existing country code
                          onChange={(e) => {
                            // Get cursor position before update
                            const cursorPosition = e.target.selectionStart || 0;
                            
                            // Only allow digits and spaces
                            const input = e.target.value.replace(/[^\d\s]/g, '');
                            
                            // Update state - don't include country code in the input
                            setPhoneNumber(input);
                            
                            // Reset invalid phone number state when user types
                            if (isInvalidPhoneNumber) {
                              setIsInvalidPhoneNumber(false);
                            }
                            
                            // Use setTimeout to restore cursor position after render
                            setTimeout(() => {
                              if (phoneInputRef.current) {
                                phoneInputRef.current.focus();
                                phoneInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
                              }
                            }, 0);
                          }}
                          className={`text-base sm:text-lg p-4 sm:p-6 text-center border-2 ${
                            isInvalidPhoneNumber 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-indigo-300 focus:border-indigo-500'
                          }`}
                          dir="ltr"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>

                  {isInvalidPhoneNumber && (
                    <div className="animate-pulse">
                      <p id="phone-error-message" className="text-xs text-red-500 dark:text-red-400 -mt-2 mb-2 font-semibold">
                        {(() => {
                          const rules = countryValidationRules[selectedCountryCode];
                          if (!rules) {
                            return `Please enter a valid phone number with country code +${selectedCountryCode}`;
                          }
                          
                          let message = `Please enter a valid ${rules.exactLength}-digit number`;
                          
                          if (rules.validPrefixes && rules.validPrefixes.length > 0) {
                            message += ` starting with ${rules.validPrefixes.join(', ')}`;
                          }
                          
                          // Add country-specific examples using the placeholder
                          const country = countryCodes.find(c => c.code === selectedCountryCode);
                          if (country) {
                            message += ` (e.g., ${country.placeholder} for ${country.country})`;
                          }
                          
                          return message;
                        })()}
                      </p>
                    </div>
                  )}
                  <Button 
                    onClick={() => {
                      // Normalize the phone number to ensure consistent format
                      let normalizedPhone = phoneNumber.trim().replace(/\s+/g, '');
                      
                      // Remove leading zero if present
                      if (normalizedPhone.startsWith('0')) {
                        normalizedPhone = normalizedPhone.substring(1);
                      }
                      
                      // Add the selected country code
                      normalizedPhone = `+${selectedCountryCode}${normalizedPhone}`;
                      
                      // Get validation rules for the selected country
                      const countryRules = countryValidationRules[selectedCountryCode] || { exactLength: 9 };
                      
                      // Check for fake/test phone numbers
                      const isValidPhoneNumber = (phone: string): boolean => {
                        // Extract digits only (without the + and country code)
                        const digitsOnly = phone.replace(/\D/g, '');
                        const countryCodeDigits = selectedCountryCode.length;
                        const nationalNumber = digitsOnly.substring(countryCodeDigits);
                        
                        // Check if the length matches the country-specific requirement
                        if (nationalNumber.length !== countryRules.exactLength) {
                          return false;
                        }
                        
                        // Check country-specific prefixes if defined
                        if (countryRules.validPrefixes && 
                            !countryRules.validPrefixes.some(prefix => nationalNumber.startsWith(prefix))) {
                          return false;
                        }
                        
                        // Check against country-specific regex if defined
                        if (countryRules.regex && !countryRules.regex.test(nationalNumber)) {
                          return false;
                        }
                        
                        // For all validation, use the national number
                        const significantPart = nationalNumber;
                        
                        // Check for sequential patterns (like 123456789)
                        const isSequential = (num: string): boolean => {
                          for (let i = 0; i < num.length - 2; i++) {
                            const digit1 = parseInt(num[i]);
                            const digit2 = parseInt(num[i + 1]);
                            const digit3 = parseInt(num[i + 2]);
                            
                            // Check for ascending sequence (e.g., 123)
                            if (digit2 === digit1 + 1 && digit3 === digit2 + 1) {
                              return true;
                            }
                            
                            // Check for descending sequence (e.g., 321)
                            if (digit2 === digit1 - 1 && digit3 === digit2 - 1) {
                              return true;
                            }
                          }
                          return false;
                        };
                        
                        // Check for repeated digits (like 666666)
                        const hasRepeatedPattern = (num: string): boolean => {
                          // Check for 4 or more of the same digit in a row
                          for (let i = 0; i < num.length - 3; i++) {
                            if (num[i] === num[i + 1] && num[i] === num[i + 2] && num[i] === num[i + 3]) {
                              return true;
                            }
                          }
                          
                          // Check for repeating pairs (like 121212)
                          if (num.length >= 6) {
                            for (let i = 0; i < num.length - 5; i++) {
                              if (num[i] === num[i + 2] && num[i] === num[i + 4] && 
                                  num[i + 1] === num[i + 3] && num[i + 1] === num[i + 5]) {
                                return true;
                              }
                            }
                          }
                          
                          return false;
                        };
                        
                        // List of known test patterns
                        const knownTestPatterns = [
                          '123456789', '987654321', '666666666', '000000000', 
                          '111111111', '222222222', '333333333', '444444444',
                          '555555555', '777777777', '888888888', '999999999',
                          '123123123', '456456456', '789789789', '012345678',
                          '112233', '445566', '778899', '112233445566',
                          '1234567890', '9876543210', '1212121212', '3434343434',
                          '0101010101', '9090909090', '1122334455', '5566778899'
                        ];
                        
                        // Check if the number contains any known test patterns
                        if (knownTestPatterns.some(pattern => significantPart.includes(pattern))) {
                          return false;
                        }
                        
                        // Check if all digits are the same (e.g., 555555555)
                        if (new Set(significantPart.split('')).size === 1) {
                          return false;
                        }
                        
                        // Check if the number has too few unique digits (e.g., 121212121)
                        if (new Set(significantPart.split('')).size <= 2 && significantPart.length >= 6) {
                          return false;
                        }
                        
                        // Check for sequential or repeated patterns
                        if (isSequential(significantPart) || hasRepeatedPattern(significantPart)) {
                          return false;
                        }
                        
                        return true;
                      };
                      
                      // Get country-specific error message
                      const getCountrySpecificErrorMessage = () => {
                        const rules = countryValidationRules[selectedCountryCode];
                        if (!rules) {
                          return `Please enter a valid phone number with country code +${selectedCountryCode}`;
                        }
                        
                        let message = `Please enter a valid ${rules.exactLength}-digit number`;
                        
                        if (rules.validPrefixes && rules.validPrefixes.length > 0) {
                          message += ` starting with ${rules.validPrefixes.join(', ')}`;
                        }
                        
                        // Add country-specific examples
                        if (selectedCountryCode === '212') {
                          message += " (e.g., 612345678 for Morocco)";
                        } else if (selectedCountryCode === '33') {
                          message += " (e.g., 612345678 for France)";
                        } else if (selectedCountryCode === '1') {
                          message += " (e.g., 2123456789 for US)";
                        }
                        
                        return message;
                      };

                      if (isValidPhoneNumber(normalizedPhone)) {
                        // Save to localStorage
                        localStorage.setItem('phoneVerified', 'true');
                        localStorage.setItem('verifiedPhone', normalizedPhone);
                        setPhoneNumber(normalizedPhone);
                        setIsVerified(true);
                        
                        // Record the phone number for future reference
                        recordPhoneNumber(normalizedPhone);
                        
                        // Reset invalid state
                        setIsInvalidPhoneNumber(false);
                      } else {
                        // Set invalid state to show the warning message
                        setIsInvalidPhoneNumber(true);
                      }
                    }}
                    className={`w-full p-4 sm:p-6 text-lg sm:text-xl font-bold ${
                      isInvalidPhoneNumber 
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                        : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    SPIN THE WHEEL
                  </Button>
                </div>
              </div>
            )}
            
            {/* Spinner Wheel Component */}
            <div className="relative mt-2">
              <SpinnerWheel 
                prizes={prizes}
                rotation={rotation}
                isSpinning={isSpinning}
                onSpin={onSpin}
                spinDisabled={isSpinning || (hasSpun && !gotTryAgain) || (prize && prize.type !== 'tryAgain')}
                spinText={getSpinButtonContent()}
                dir={dir}
              />
            </div>
            
            {/* Prize display */}
            {prize && (
              <div className="mt-6">
                <PrizeDisplay
                  prize={prize.name}
                  prizeType={prize.type}
                  spinCode={prize.code || ''}
                  value={prize.value}
                  expiresAt={prize.expiresAt}
                  onApplyReward={() => {
                    if (prize.type === 'discount' || prize.type === 'cashback') {
                      applyDiscount();
                    }
                  }}
                  onClaimReward={claimFreeAccount}
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className={`w-full sm:w-auto ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white/70 hover:bg-white'}`}
            >
              {t("products.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpinWheel;