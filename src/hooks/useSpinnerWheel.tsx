import React, { useState, useEffect } from 'react';
import { useLanguage } from "../contexts/LanguageContext";
import { BadgeDollarSign, Gift, Tag, RotateCw } from "lucide-react";
import confetti from 'canvas-confetti';
import { toast } from "@/hooks/use-toast";

// Define the segments with their probabilities
export interface PrizeSegment {
  value: string;
  label: string;
  icon: React.ReactNode;
  probability: number;
  color: string;
}

export const useSpinnerWheel = () => {
  const { t, language } = useLanguage();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [spinCode, setSpinCode] = useState<string>("");
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [tickSound, setTickSound] = useState<HTMLAudioElement | null>(null);
  const [hasExtraSpinToday, setHasExtraSpinToday] = useState(false);

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

  const handleApplyReward = () => {
    if (!prize || prize === "Try Again") return;
    
    toast({
      title: t("spinner.rewardApplied"),
      description: t("spinner.rewardAppliedDesc"),
    });
  };

  const handleClaim = (closeDialog: () => void) => {
    if (!prize || prize === "Try Again") return;
    
    // Open WhatsApp with pre-filled message including the win code
    const text = `${t("spinner.claimMessage")} ${prize}! ${t("spinner.codeMessage")}: ${spinCode}`;
    window.open(
      `https://wa.me/+212614566647?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    
    closeDialog();
  };

  return {
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
    handleClaim,
  };
};
