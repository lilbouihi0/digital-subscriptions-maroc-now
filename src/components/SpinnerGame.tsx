import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import SpinnerWheel from "./spinner/SpinnerWheel";
import SpinnerReward from "./spinner/SpinnerReward";
import SpinnerStatus from "./spinner/SpinnerStatus";
import { toast } from "@/hooks/use-toast";
import { BadgeDollarSign, Gift, Tag, RotateCw } from "lucide-react";
import confetti from 'canvas-confetti';

const SpinnerGame: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Spinner state
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [spinCode, setSpinCode] = useState<string>("");
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [hasExtraSpinToday, setHasExtraSpinToday] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  
  // Audio refs
  const [winAudio, setWinAudio] = useState<HTMLAudioElement | null>(null);
  const [tryAgainAudio, setTryAgainAudio] = useState<HTMLAudioElement | null>(null);
  
  // Prize definitions with fixed probabilities
  const prizes = [
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

  // Initialize audio elements
  useEffect(() => {
    // Win sound
    const winSoundElement = new Audio('https://assets.mixkit.co/active_storage/sfx/1500/1500-preview.mp3');
    winSoundElement.volume = 0.6;
    setWinAudio(winSoundElement);

    // Try again sound
    const tryAgainSoundElement = new Audio('https://assets.mixkit.co/active_storage/sfx/938/938-preview.mp3');
    tryAgainSoundElement.volume = 0.5;
    setTryAgainAudio(tryAgainSoundElement);
    
    return () => {
      if (winAudio) {
        winAudio.pause();
        winAudio.currentTime = 0;
      }
      if (tryAgainAudio) {
        tryAgainAudio.pause();
        tryAgainAudio.currentTime = 0;
      }
    };
  }, []);
  
  // Check if user has already spun today
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
    
    // Check if there's a win and if it's expired
    const winData = localStorage.getItem('currentWin');
    if (winData) {
      try {
        const parsedWin = JSON.parse(winData);
        if (parsedWin.expiryDate) {
          const expiryTime = new Date(parsedWin.expiryDate).getTime();
          const currentTime = new Date().getTime();
          
          setPrize(parsedWin.prize);
          setSpinCode(parsedWin.code);
          setExpiryDate(parsedWin.expiryDate);
          
          // Remove expired win
          if (currentTime > expiryTime) {
            localStorage.removeItem('currentWin');
            setExpiryDate(null);
            setPrize(null);
            setSpinCode("");
          }
        }
      } catch (e) {
        console.error('Error parsing win data:', e);
      }
    }
  }, []);

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

  // Generate a random prize index based on weighted probabilities
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

  // Calculate precise angle for the wheel to land on the prize
  const calculatePrizeAngle = (prizeIndex: number) => {
    const segmentSize = 360 / prizes.length; // 60 degrees per segment
    
    // Calculate the center angle of the prize segment
    // For a wheel with 6 segments, the centers would be at 0°, 60°, 120°, 180°, 240°, 300°
    // But we need to offset so that the segment is at the TOP (pointer position)
    
    // Add small random offset within the segment for realism (-10° to +10° from center)
    const maxOffset = segmentSize * 0.3; // 30% of segment size
    const randomOffset = (Math.random() * 2 - 1) * maxOffset;
    
    // The prize should be centered at the top (0/360°)
    // We need to rotate the wheel so that the prize segment is at the top
    // For this, we rotate (360° - (prizeIndex * segmentSize + randomOffset))
    const prizeAngle = 360 - ((prizeIndex * segmentSize) + randomOffset);
    
    // Add multiple full rotations (3-5) for dramatic effect
    const fullSpins = 3 + Math.floor(Math.random() * 2); // 3 to 4 full spins
    
    return prizeAngle + (fullSpins * 360);
  };

  // Generate unique win code
  const generateWinCode = (selectedPrize: string) => {
    const timestamp = new Date().getTime().toString(36);
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prizeCode = selectedPrize.replace(/[^A-Z0-9]/gi, '').substring(0, 3).toUpperCase();
    const lang = language.toUpperCase();
    
    return `WIN-${prizeCode}-${randomChars}-${timestamp}-${lang}`;
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle the spin result
  const handleSpinResult = (prizeIndex: number) => {
    const selectedPrize = prizes[prizeIndex].value;
    setPrize(selectedPrize);
    
    // If user got "Try Again", allow them to spin one more time
    if (selectedPrize === "Try Again") {
      setHasSpunToday(false);
      setHasExtraSpinToday(true);
      localStorage.setItem('hasExtraSpin', 'true');
      
      // Play try again sound
      if (tryAgainAudio) {
        tryAgainAudio.currentTime = 0;
        tryAgainAudio.play().catch(e => console.log("Audio play error:", e));
      }
      
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
      
      // Play win sound and trigger confetti
      if (winAudio) {
        winAudio.currentTime = 0;
        winAudio.play().catch(e => console.log("Audio play error:", e));
      }
      
      triggerConfetti();
      
      toast({
        title: t("spinner.congratulations"),
        description: `${t("spinner.youWon")} ${selectedPrize}! ${t("spinner.offerValid48")}`,
      });
    }
  };

  // Main spin function
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
    
    // First, determine the winning prize index based on probability
    const prizeIndex = getRandomPrizeIndex();
    
    // Calculate exact angle needed to end on the selected prize
    const finalRotation = calculatePrizeAngle(prizeIndex);
    
    // Set final rotation value
    setRotation(finalRotation);
    
    // For testing in dev mode
    console.log(`Spin test - Prize index: ${prizeIndex}, Prize: ${prizes[prizeIndex].value}, Final angle: ${finalRotation % 360}°`);
    
    // Handle the result after animation finishes
    setTimeout(() => {
      setIsSpinning(false);
      handleSpinResult(prizeIndex);
    }, 5000); // Match this with the CSS animation duration
  };

  // Time until next spin is available
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

  // Format time remaining for prize expiry
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

  // Apply reward
  const handleApplyReward = () => {
    if (!prize || prize === "Try Again") return;
    
    toast({
      title: t("spinner.rewardApplied"),
      description: t("spinner.rewardAppliedDesc"),
    });
  };

  // Claim reward via WhatsApp
  const handleClaim = (closeDialog: () => void) => {
    if (!prize || prize === "Try Again") return;
    
    // Open WhatsApp with pre-filled message
    const text = `${t("spinner.claimMessage")} ${prize}! ${t("spinner.codeMessage")}: ${spinCode}`;
    window.open(
      `https://wa.me/+212614566647?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    
    closeDialog();
  };
  
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
