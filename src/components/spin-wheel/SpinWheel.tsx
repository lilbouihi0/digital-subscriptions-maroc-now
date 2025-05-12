
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import PhoneVerification from './PhoneVerification';
import SpinnerWheel from './SpinnerWheel';
import PrizeDisplay from './PrizeDisplay';
import { usePrizeData } from './hooks/usePrizeData';
import { useSpinLogic } from './hooks/useSpinLogic';
import { useAudio } from './hooks/useAudio';
import { useUserSession } from './hooks/useUserSession';

const SpinWheel: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // User session and verification state
  const { 
    isVerified, 
    setIsVerified, 
    phoneNumber, 
    setPhoneNumber 
  } = useUserSession();
  
  // Prize data
  const { prizes } = usePrizeData();
  
  // Spin wheel logic
  const { 
    rotation, 
    isSpinning, 
    prize, 
    spinWheel, 
    hasSpunToday, 
    hasExtraSpinToday,
    timeUntilNextSpin,
    spinCode,
    expiryDate,
    formatTimeRemaining,
    handleApplyReward,
    handleClaim
  } = useSpinLogic(prizes);
  
  // Audio effects
  const { playTickSound, playWinSound, playTryAgainSound } = useAudio();
  
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
  
  // Prepare spin button content
  const getSpinButtonContent = () => {
    if (isSpinning) {
      return <div className="flex flex-col items-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full mb-2" />
        <span className="text-sm">{t("spinner.spinning")}</span>
      </div>;
    } else if (hasSpunToday && hasExtraSpinToday) {
      return (
        <div className="text-sm flex flex-col items-center">
          <span>{t("spinner.comeBackTomorrow")}</span>
          <span className="text-xs mt-1 opacity-80">{timeUntilNextSpin()}</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <span className="text-xl">{language === 'ar' ? 'اضغط للدوران 🎁' : t("spinner.spin")}</span>
          <span className="text-xs mt-1 opacity-80">🎁</span>
        </div>
      );
    }
  };

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
        <DialogContent className="max-w-4xl bg-gradient-to-br from-indigo-50 to-purple-50" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
              {t("spinner.spinToWin")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-lg">
              {t("spinner.spinDescription")}
            </DialogDescription>
          </DialogHeader>
          
          {isVerified ? (
            <div className="relative flex flex-col items-center justify-center py-4">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-20 rounded-full blur-xl transform scale-90"></div>
              
              {/* Spinner Wheel Component */}
              <SpinnerWheel 
                prizes={prizes}
                rotation={rotation}
                isSpinning={isSpinning}
                onSpin={spinWheel}
                spinDisabled={isSpinning || (hasSpunToday && hasExtraSpinToday)}
                spinText={getSpinButtonContent()}
                dir={dir}
                onTickSound={playTickSound}
              />
              
              {/* Prize display */}
              {prize && prize !== "Try Again" && (
                <PrizeDisplay
                  prize={prize}
                  spinCode={spinCode}
                  formatTimeRemaining={formatTimeRemaining}
                  onApplyReward={handleApplyReward}
                  onClaimReward={() => handleClaim(() => setIsOpen(false))}
                />
              )}
            </div>
          ) : (
            <PhoneVerification 
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onVerified={() => setIsVerified(true)}
            />
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="bg-white/70 hover:bg-white"
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
