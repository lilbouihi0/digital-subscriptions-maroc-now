
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const prizes = [
  "10% OFF",
  "15% OFF",
  "20% OFF",
  "Free Month",
  "5% OFF",
  "Try Again",
  "25% OFF",
  "50% OFF",
];

const SpinnerWheel: React.FC = () => {
  const { t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setPrize(null);
    setIsSpinning(true);
    
    // Random spin between 5 and 10 full rotations
    const spinCount = 5 + Math.random() * 5;
    const baseRotation = 360 * spinCount;
    
    // Add random offset for prize position (0-7 prizes, each 45 degrees)
    const prizeIndex = Math.floor(Math.random() * 8);
    const prizeOffset = prizeIndex * 45;
    
    // Set final rotation (add to current to always increase)
    const newRotation = rotation + baseRotation + prizeOffset;
    setRotation(newRotation);
    
    // Determine prize after spin
    setTimeout(() => {
      setIsSpinning(false);
      const selectedPrize = prizes[prizeIndex];
      setPrize(selectedPrize);
      
      if (selectedPrize !== "Try Again") {
        toast({
          title: t("spinner.congratulations"),
          description: `${t("spinner.youWon")} ${selectedPrize}! ${t("spinner.contactUs")}`,
        });
      } else {
        toast({
          title: t("spinner.tryAgain"),
          description: t("spinner.betterLuck"),
          variant: "destructive"
        });
      }
    }, 5000); // Match this with the CSS animation duration
  };

  const handleClaim = () => {
    if (!prize || prize === "Try Again") return;
    
    // Open WhatsApp with pre-filled message
    const text = `${t("spinner.claimMessage")} ${prize}!`;
    window.open(
      `https://wa.me/+212614566647?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        className="fixed bottom-24 right-6 bg-teal hover:bg-teal/90 text-white shadow-lg z-40 rounded-full flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("spinner.tryYourLuck")}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {t("spinner.spinToWin")}
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative flex justify-center py-6">
            {/* Spinner Wheel */}
            <div className="relative w-64 h-64">
              {/* Pointer Triangle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-0 h-0 
                border-l-[12px] border-l-transparent 
                border-b-[24px] border-b-red-500 
                border-r-[12px] border-r-transparent z-10" />
                
              {/* Wheel */}
              <div 
                ref={wheelRef} 
                className="w-full h-full rounded-full border-4 border-navy overflow-hidden transition-transform duration-5000 ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? '5s' : '0s'
                }}
              >
                {prizes.map((prize, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      transformOrigin: 'center',
                      clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)',
                      backgroundColor: i % 2 === 0 ? '#4338CA' : '#1E40AF'
                    }}
                  >
                    <div 
                      className="absolute top-[15%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-white font-bold transform -rotate-[67.5deg]"
                      style={{ fontSize: prize.length > 6 ? '0.8rem' : '1rem' }}
                    >
                      {prize}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={spinWheel} 
              className="bg-teal hover:bg-teal/90 text-white font-bold py-2 px-8"
              disabled={isSpinning}
            >
              {isSpinning ? t("spinner.spinning") : t("spinner.spin")}
            </Button>
            
            {prize && prize !== "Try Again" && (
              <div className="text-center">
                <p className="font-bold mb-2">{t("spinner.congratulations")}</p>
                <p>{t("spinner.youWon")} <span className="text-teal font-bold">{prize}</span>!</p>
                <Button 
                  onClick={handleClaim}
                  className="mt-4 bg-green-500 hover:bg-green-600 flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  {t("spinner.claim")}
                </Button>
              </div>
            )}
            
            {prize === "Try Again" && (
              <p className="text-center text-gray-600">{t("spinner.betterLuck")}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("products.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpinnerWheel;
