
import { useState } from 'react';
import { spinWheel } from '@/utils/twilioService';
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useSpinServerLogic = (phoneNumber: string) => {
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [prize, setPrize] = useState<any>(null);
  const [rotation, setRotation] = useState(0);

  // Calculate a random angle for a specific prize segment
  const calculatePrizeAngle = (prizeIndex: number, totalSegments: number) => {
    const segmentSize = 360 / totalSegments;
    const segmentCenter = prizeIndex * segmentSize;
    const maxOffset = segmentSize * 0.3; 
    const randomOffset = (Math.random() * 2 - 1) * maxOffset; 
    
    // In CSS rotation, clockwise is positive
    return 360 - (segmentCenter + randomOffset);
  };

  // Simulated spin function (no server call)
  const handleSpin = async () => {
    if (isSpinning || !phoneNumber) return;
    
    setIsSpinning(true);
    
    try {
      // Simulate a spin result without API call
      // Define some sample prizes
      const samplePrizes = [
        { name: "10% Discount", type: "discount", value: "10%", code: "DISC10", prizeIndex: 0, totalSegments: 6 },
        { name: "20% Discount", type: "discount", value: "20%", code: "DISC20", prizeIndex: 1, totalSegments: 6 },
        { name: "Free Account", type: "freeAccount", value: "1 Month", code: "FREE1M", prizeIndex: 2, totalSegments: 6 },
        { name: "5% Discount", type: "discount", value: "5%", code: "DISC05", prizeIndex: 3, totalSegments: 6 },
        { name: "15% Discount", type: "discount", value: "15%", code: "DISC15", prizeIndex: 4, totalSegments: 6 },
        { name: "Free Trial", type: "freeAccount", value: "7 Days", code: "FREE7D", prizeIndex: 5, totalSegments: 6 }
      ];
      
      // Randomly select a prize
      const randomIndex = Math.floor(Math.random() * samplePrizes.length);
      const result = samplePrizes[randomIndex];
      
      // Set spinning animation
      const prizeIndex = result.prizeIndex;
      const totalSegments = result.totalSegments;
      
      // Random spin between 5 and 8 full rotations plus the prize angle
      const spinCount = 5 + Math.random() * 3;
      const prizeAngle = calculatePrizeAngle(prizeIndex, totalSegments);
      const finalRotation = 360 * spinCount + prizeAngle;
      
      // Set final rotation value
      setRotation(finalRotation);
      
      // After animation completes, set the prize
      setTimeout(() => {
        setPrize(result);
        setIsSpinning(false);
        setHasSpun(true);
        
        // Show success toast
        toast({
          title: t("spinner.congratulations"),
          description: `${t("spinner.youWon")} ${result.name}!`,
        });
      }, 5000);
      
    } catch (error) {
      console.error('Spin failed:', error);
      setIsSpinning(false);
      
      // Show error message
      toast({
        title: t("spinner.error"),
        description: t("spinner.spinFailed"),
        variant: "destructive"
      });
    }
  };

  // Function to apply discount prize
  const applyDiscount = () => {
    if (prize?.type !== 'discount') return;
    
    // In a real app, this would update the session state or call an API
    // Here, we'll just show a toast
    localStorage.setItem('activeDiscount', JSON.stringify({
      type: 'discount',
      value: prize.value,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }));
    
    toast({
      title: t("spinner.discountApplied"),
      description: t("spinner.discountAppliedDesc").replace('{value}', prize.value),
    });
  };

  // Function to claim a free account
  const claimFreeAccount = () => {
    if (prize?.type !== 'freeAccount' || !prize.code) return;
    
    // Open WhatsApp with pre-filled message
    const text = `${t("spinner.claimMessage")} ${prize.name}! ${t("spinner.codeMessage")}: ${prize.code}`;
    window.open(
      `https://wa.me/+212614566647?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return {
    isSpinning,
    hasSpun,
    prize,
    rotation,
    handleSpin,
    applyDiscount,
    claimFreeAccount
  };
};
