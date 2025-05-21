
import React, { useState, useEffect } from 'react';
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

const SpinWheel: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // User session and verification state
  const { 
    isVerified, 
    setIsVerified, 
    phoneNumber, 
    setPhoneNumber,
    hasSpun,
    setHasSpun
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
    claimFreeAccount
  } = useSpinServerLogic(phoneNumber);
  
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
        <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full mb-2" />
        <span className="text-sm">SPINNING...</span>
      </div>;
    } else if (hasSpun) {
      return (
        <div className="text-sm flex flex-col items-center">
          <span>COME BACK TOMORROW</span>
          <span className="text-xs mt-1 opacity-80">{timeUntilNextSpin()}</span>
        </div>
      );
    } else if (!isVerified) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-xl">ENTER PHONE</span>
          <span className="text-xs mt-1 opacity-80">👆 Above 👆</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <span className="text-xl">CLICK TO SPIN</span>
          <span className="text-xs mt-1 opacity-80">🎁 Good Luck! 🎁</span>
        </div>
      );
    }
  };

  // Handle wheel spin
  const onSpin = () => {
    // If user is not verified, prompt them to enter phone number
    if (!isVerified) {
      toast({
        title: "Enter Your Phone Number",
        description: "Please enter your phone number first to spin the wheel",
        variant: "destructive"
      });
      return;
    }
    
    // Check if already spinning
    if (isSpinning) {
      return;
    }
    
    // Check if already spun today
    if (hasSpun) {
      toast({
        title: "Already Spun Today",
        description: "You've already spun the wheel today. Come back tomorrow!",
        variant: "default"
      });
      return;
    }
    
    // All checks passed, spin the wheel
    handleSpin();
    localStorage.setItem('hasSpunToday', 'true');
  };

  // Determine dialog background based on theme
  const dialogBackground = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 to-navy-900 text-white' 
    : 'bg-gradient-to-br from-indigo-50 to-purple-50';

  return (
    <>
      <Button 
        className="fixed bottom-24 right-6 bg-rose-500 hover:bg-rose-600 text-white shadow-lg z-40 rounded-full flex items-center gap-2 animate-pulse"
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("spinner.tryYourLuck")}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-2xl h-auto overflow-y-auto ${dialogBackground}`} dir={dir}>
          <DialogHeader>
            <DialogTitle className={`text-center text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 bg-clip-text text-transparent'}`}>
              {t("spinner.spinToWin")}
            </DialogTitle>
            <DialogDescription className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
              {t("spinner.spinDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            {/* Phone input form */}
            {!isVerified && (
              <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-rose-500 animate-pulse">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Enter Your Phone Number
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter your phone number to spin the wheel and win prizes!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="tel"
                    placeholder="+212 600000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s+]/g, ''))}
                    className="text-lg p-6 text-center text-xl border-2 border-indigo-300 focus:border-indigo-500"
                    dir="ltr"
                  />
                  <Button 
                    onClick={() => {
                      if (phoneNumber && phoneNumber.length >= 1) { // Allow any input for testing
                        localStorage.setItem('phoneVerified', 'true');
                        localStorage.setItem('verifiedPhone', phoneNumber);
                        setIsVerified(true);
                        
                        toast({
                          title: "Success!",
                          description: "Now click the wheel to spin and win!",
                        });
                      } else {
                        toast({
                          title: "Error",
                          description: "Please enter a valid phone number",
                          variant: "destructive"
                        });
                      }
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-700 p-6 text-xl font-bold"
                  >
                    SPIN THE WHEEL
                  </Button>
                </div>
              </div>
            )}
            
            {/* Spinner Wheel Component */}
            <div className="relative mt-4">
              <SpinnerWheel 
                prizes={prizes}
                rotation={rotation}
                isSpinning={isSpinning}
                onSpin={onSpin}
                spinDisabled={isSpinning || hasSpun}
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
                    if (prize.type === 'discount') {
                      applyDiscount();
                    }
                  }}
                  onClaimReward={claimFreeAccount}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className={theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white/70 hover:bg-white'}
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
