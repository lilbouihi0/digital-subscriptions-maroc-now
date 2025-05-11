
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { useSpinnerWheel } from "@/hooks/useSpinnerWheel";
import SpinnerWheel from "./spinner/SpinnerWheel";
import SpinnerReward from "./spinner/SpinnerReward";
import SpinnerStatus from "./spinner/SpinnerStatus";

const SpinnerGame: React.FC = () => {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const {
    prizes,
    rotation,
    isSpinning,
    prize,
    spinCode,
    hasSpunToday,
    hasExtraSpinToday,
    expiryDate,
    spinWheel,
    timeUntilNextSpin,
    formatTimeRemaining,
    handleApplyReward,
    handleClaim
  } = useSpinnerWheel();

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
      return <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full" />;
    } else if (hasSpunToday && hasExtraSpinToday) {
      return (
        <div className="text-xs flex flex-col items-center">
          <span>{t("spinner.comeBackTomorrow")}</span>
          <span className="text-xs mt-1 opacity-80">{timeUntilNextSpin()}</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center">
          <span>{t("spinner.spin")}</span>
          <span className="text-xs mt-1 opacity-80">🎁</span>
        </div>
      );
    }
  };

  return (
    <>
      <Button 
        className="fixed bottom-24 right-6 bg-teal hover:bg-teal/90 text-white shadow-lg z-40 rounded-full flex items-center gap-2 animate-pulse"
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("spinner.tryYourLuck")}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl bg-gradient-to-br from-indigo-50 to-purple-50" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("spinner.spinToWin")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {t("spinner.spinDescription")}
            </DialogDescription>
          </DialogHeader>
          
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
            />
            
            {/* Status messages */}
            <SpinnerStatus 
              hasSpunToday={hasSpunToday}
              hasExtraSpinToday={hasExtraSpinToday}
              isSpinning={isSpinning}
              prize={prize}
              timeUntilNextSpin={timeUntilNextSpin}
            />
          </div>
          
          <div className="flex flex-col items-center gap-4 mt-2">
            {/* Prize display */}
            {prize && prize !== "Try Again" && (
              <SpinnerReward
                prize={prize}
                spinCode={spinCode}
                formatTimeRemaining={formatTimeRemaining}
                onApplyReward={handleApplyReward}
                onClaimReward={() => handleClaim(() => setIsOpen(false))}
              />
            )}
          </div>
          
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

export default SpinnerGame;
