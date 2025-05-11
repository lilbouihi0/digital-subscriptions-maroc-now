
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { MessageCircle, CirclePercent, Gift, BadgeDollarSign, Tag, RotateCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

// Define the segments with their probabilities
interface PrizeSegment {
  value: string;
  label: string; 
  icon: React.ReactNode;
  probability: number;
  color: string;
}

const SpinnerWheel: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [spinCode, setSpinCode] = useState<string>("");
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [tickSound, setTickSound] = useState<HTMLAudioElement | null>(null);
  const [hasExtraSpinToday, setHasExtraSpinToday] = useState(false); // New state for tracking extra spin
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Define prizes based on the current language
  const getPrizes = () => [
    { 
      value: "10% Cash Back", 
      label: t("spinner.cashback10"), 
      icon: <BadgeDollarSign className="text-yellow-300" />,
      probability: 20, 
      color: "#6366F1" // Indigo
    },
    { 
      value: "20% Cash Back", 
      label: t("spinner.cashback20"), 
      icon: <BadgeDollarSign className="text-yellow-300" />,
      probability: 20, 
      color: "#4338CA" // Darker indigo
    },
    { 
      value: "Free Account", 
      label: t("spinner.freeAccount"), 
      icon: <Gift className="text-yellow-300" />,
      probability: 10, 
      color: "#8B5CF6" // Purple
    },
    { 
      value: "10% OFF", 
      label: t("spinner.discount10"), 
      icon: <Tag className="text-yellow-300" />,
      probability: 5, 
      color: "#EC4899" // Pink
    },
    { 
      value: "5% OFF", 
      label: t("spinner.discount5"), 
      icon: <Tag className="text-yellow-300" />,
      probability: 5, 
      color: "#3B82F6" // Blue
    },
    { 
      value: "Try Again", 
      label: t("spinner.tryAgainFiller"), 
      icon: <RotateCw className="text-gray-300" />,
      probability: 40, 
      color: "#9CA3AF" // Gray
    },
  ];
  
  const prizes = getPrizes();
  
  // Initialize tick sound
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
    audio.volume = 0.3;
    setTickSound(audio);
    
    return () => {
      if (tickSound) {
        tickSound.pause();
        tickSound.currentTime = 0;
      }
    };
  }, []);
  
  // Check if user has already spun today and check for win expiry
  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    const hasExtraSpin = localStorage.getItem('hasExtraSpin') === 'true';
    
    if (lastSpinDate === today) {
      setHasSpunToday(true);
      setHasExtraSpinToday(hasExtraSpin);
    } else {
      // Reset extra spin state for a new day
      localStorage.removeItem('hasExtraSpin');
      setHasExtraSpinToday(false);
    }
    
    // Show popup for first-time visitors
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
    }
    
    // Check if there's a win and if it's expired
    const winData = localStorage.getItem('currentWin');
    if (winData) {
      try {
        const parsedWin = JSON.parse(winData);
        if (parsedWin.expiryDate) {
          const expiryTime = new Date(parsedWin.expiryDate).getTime();
          const currentTime = new Date().getTime();
          
          setExpiryDate(parsedWin.expiryDate);
          
          // Remove expired win
          if (currentTime > expiryTime) {
            localStorage.removeItem('currentWin');
            setExpiryDate(null);
          }
        }
      } catch (e) {
        console.error('Error parsing win data:', e);
      }
    }
  }, []);

  // Generate a random spin based on probabilities
  const getRandomPrizeIndex = () => {
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (let i = 0; i < prizes.length; i++) {
      if (random < prizes[i].probability) {
        return i;
      }
      random -= prizes[i].probability;
    }
    
    return 0; // Default to first prize if something goes wrong
  };

  // Generate unique win code
  const generateWinCode = (selectedPrize: string) => {
    const timestamp = new Date().getTime().toString(36);
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prizeCode = selectedPrize.replace(/[^A-Z0-9]/gi, '').substring(0, 3).toUpperCase();
    const lang = language.toUpperCase();
    
    return `WIN-${prizeCode}-${randomChars}-${timestamp}-${lang}`;
  };

  // Play tick sound during wheel spin
  const playTickSound = () => {
    if (tickSound) {
      tickSound.currentTime = 0;
      tickSound.play().catch(e => console.log("Audio play error:", e));
    }
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Function to handle the spin result
  const handleSpinResult = (prizeIndex: number) => {
    const selectedPrize = prizes[prizeIndex].value;
    setPrize(selectedPrize);
    
    // If user got "Try Again", allow them to spin one more time
    if (selectedPrize === "Try Again") {
      setHasSpunToday(false);
      setHasExtraSpinToday(true);
      localStorage.setItem('hasExtraSpin', 'true');
      
      toast({
        title: t("spinner.tryAgain"),
        description: t("spinner.oneMoreChance"),
        variant: "default"
      });
    } else {
      // For other prizes, generate code and save win
      const code = generateWinCode(selectedPrize);
      setSpinCode(code);
      
      // Set expiry date (48 hours from now)
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 48);
      const expiryDateString = expiryDate.toISOString();
      setExpiryDate(expiryDateString);
      
      // Store the win in localStorage
      localStorage.setItem('currentWin', JSON.stringify({
        prize: selectedPrize,
        code: code,
        date: new Date().toISOString(),
        expiryDate: expiryDateString
      }));
      
      // Trigger confetti animation for winning
      triggerConfetti();
      
      toast({
        title: t("spinner.congratulations"),
        description: `${t("spinner.youWon")} ${selectedPrize}! ${t("spinner.offerValid48")}`,
      });
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    // Only check for hasSpunToday if user hasn't already used their extra spin
    if (hasSpunToday && hasExtraSpinToday) return;
    
    setPrize(null);
    setIsSpinning(true);
    
    // Save today's date as last spin date
    const today = new Date().toDateString();
    localStorage.setItem('lastSpinDate', today);
    setHasSpunToday(true);
    
    // Random spin between 5 and 10 full rotations
    const spinCount = 5 + Math.random() * 5;
    const baseRotation = 360 * spinCount;
    
    // Get prize index based on probability
    const prizeIndex = getRandomPrizeIndex();
    const prizeOffset = prizeIndex * (360 / prizes.length);
    
    // Set final rotation (add to current to always increase)
    const newRotation = rotation + baseRotation + prizeOffset;
    setRotation(newRotation);
    
    // Play tick sound during spinning
    const tickInterval = setInterval(playTickSound, 100);
    
    // Determine prize after spin
    setTimeout(() => {
      setIsSpinning(false);
      clearInterval(tickInterval);
      
      handleSpinResult(prizeIndex);
    }, 5000); // Match this with the CSS animation duration
  };

  const handleApplyReward = () => {
    if (!prize || prize === "Try Again") return;
    
    toast({
      title: t("spinner.rewardApplied"),
      description: t("spinner.rewardAppliedDesc"),
    });
    
    setIsOpen(false);
  };

  const handleClaim = () => {
    if (!prize || prize === "Try Again") return;
    
    // Open WhatsApp with pre-filled message including the win code
    const text = `${t("spinner.claimMessage")} ${prize}! ${t("spinner.codeMessage")}: ${spinCode}`;
    window.open(
      `https://wa.me/+212614566647?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    
    setIsOpen(false);
  };

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

  const formatTimeRemaining = () => {
    if (!expiryDate) return "";
    
    const expiryTime = new Date(expiryDate).getTime();
    const currentTime = new Date().getTime();
    const timeLeft = expiryTime - currentTime;
    
    if (timeLeft <= 0) return t("spinner.expired");
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
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
        <DialogContent className="max-w-md bg-gradient-to-br from-indigo-50 to-purple-50" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("spinner.spinToWin")}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {t("spinner.spinDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative flex flex-col items-center justify-center py-6">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-20 rounded-full blur-xl transform scale-90"></div>
            
            {/* Spinner Wheel Container */}
            <div className="relative w-72 h-72 mx-auto">
              {/* Pointer Triangle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 
                border-l-[16px] border-l-transparent 
                border-b-[30px] border-b-red-500 
                border-r-[16px] border-r-transparent z-10 drop-shadow-lg" />
                
              {/* Wheel */}
              <div 
                ref={wheelRef} 
                className="w-full h-full rounded-full border-4 border-indigo-800 overflow-hidden transition-transform duration-5000 ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? '5s' : '0s',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
                }}
              >
                {prizes.map((prize, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${i * (360 / prizes.length)}deg)`,
                      transformOrigin: 'center',
                      clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)',
                      backgroundColor: prize.color
                    }}
                  >
                    <div 
                      className="absolute top-[15%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-white font-bold flex flex-col items-center justify-center transition-opacity"
                      style={{ 
                        fontSize: prize.label.length > 9 ? '0.7rem' : prize.label.length > 6 ? '0.8rem' : '1rem',
                        transform: `rotate(${90 - (360 / prizes.length) / 2}deg)`,
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {prize.icon}
                      <span className="text-center whitespace-nowrap">{prize.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Center button - enlarged and enhanced */}
              <Button 
                onClick={spinWheel} 
                disabled={isSpinning || (hasSpunToday && hasExtraSpinToday)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700
                  text-white font-bold rounded-full shadow-lg z-20 w-24 h-24
                  flex flex-col items-center justify-center border-4 border-white/30
                  transition-transform hover:scale-105"
              >
                {isSpinning ? 
                  <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full"/> : 
                  hasSpunToday && hasExtraSpinToday ? 
                  <div className="text-xs flex flex-col items-center">
                    <span>{t("spinner.comeBackTomorrow")}</span>
                    <span className="text-xs mt-1 opacity-80">{timeUntilNextSpin()}</span>
                  </div> : 
                  <div className="flex flex-col items-center">
                    <span>{t("spinner.spin")}</span>
                    <span className="text-xs mt-1 opacity-80">🎁</span>
                  </div>
                }
              </Button>
              
              {/* Decorative dots around the center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-dashed border-white/30 animate-spin-slow" style={{ animationDuration: '120s' }}></div>
            </div>
            
            {hasSpunToday && hasExtraSpinToday && !prize && (
              <div className="mt-6 text-center">
                <p className="text-sm bg-white/50 px-4 py-2 rounded-full shadow-inner">
                  {t("spinner.nextSpin")}: <span className="font-semibold text-indigo-700">{timeUntilNextSpin()}</span>
                </p>
              </div>
            )}

            {hasSpunToday && !hasExtraSpinToday && !isSpinning && !prize && (
              <div className="mt-6 text-center">
                <p className="text-sm bg-white/50 px-4 py-2 rounded-full shadow-inner">
                  {t("spinner.youHaveExtraSpin")}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4 mt-2">
            {prize && prize !== "Try Again" && (
              <div className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 rounded-lg text-white animate-pulse shadow-lg">
                <p className="font-bold text-xl mb-2">{t("spinner.congratulations")}</p>
                <div className="flex items-center justify-center gap-2 text-lg">
                  {prize.includes("Cash Back") && <CirclePercent className="text-yellow-300" />}
                  {prize.includes("Free") && <Gift className="text-yellow-300" />}
                  <p>{t("spinner.youWon")} <span className="font-bold text-xl">{prize}</span>!</p>
                </div>
                <div className="mt-3 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <p className="text-xs mb-1">{t("spinner.uniqueCode")}:</p>
                  <code className="bg-white/30 text-white px-2 py-1 rounded font-mono text-sm break-all">{spinCode}</code>
                </div>
                <p className="text-xs mt-2">
                  {t("spinner.offerExpires")}: <span className="font-bold">{formatTimeRemaining()}</span>
                </p>
                <Button 
                  onClick={handleApplyReward}
                  className="mt-4 bg-green-500 hover:bg-green-600 flex items-center gap-2 w-full"
                >
                  <Tag size={18} />
                  {t("spinner.applyReward")}
                </Button>
                <Button 
                  onClick={handleClaim}
                  variant="outline"
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2 w-full"
                >
                  <MessageCircle size={18} />
                  {t("spinner.contactUs")}
                </Button>
              </div>
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

export default SpinnerWheel;
