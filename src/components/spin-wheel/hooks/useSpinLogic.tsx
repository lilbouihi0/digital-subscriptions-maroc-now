
import { useState, useEffect } from 'react';
import { useLanguage } from "../../../contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { PrizeSegment } from './usePrizeData';
import { useAudio } from './useAudio';

export const useSpinLogic = (prizes: PrizeSegment[]) => {
  const { t, language } = useLanguage();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [spinCode, setSpinCode] = useState<string>("");
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [hasExtraSpinToday, setHasExtraSpinToday] = useState(false);
  
  const { playEndSound, playWinSound, playTryAgainSound } = useAudio();
  
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

  // Generate a random prize index based on probabilities
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
    
    // Add small random offset within the segment for realism (-10° to +10° from center)
    const maxOffset = segmentSize * 0.2; // 20% of segment size
    const randomOffset = (Math.random() * 2 - 1) * maxOffset;
    
    // For this to work correctly, we need to rotate the wheel in the opposite direction
    // so that the selected prize aligns with the pointer at the top
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
    
    // Play appropriate sound
    if (selectedPrize === "Try Again") {
      playTryAgainSound();
      
      // Allow them to spin one more time
      setHasSpunToday(false);
      setHasExtraSpinToday(true);
      localStorage.setItem('hasExtraSpin', 'true');
      
      toast({
        title: t("spinner.tryAgain"),
        description: t("spinner.oneMoreChance"),
        variant: "default"
      });
    } else {
      // Play win sound and trigger confetti for actual prizes
      playWinSound();
      triggerConfetti();
      
      // Generate code and save win
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
      playEndSound();
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

  return {
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
