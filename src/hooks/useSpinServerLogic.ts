
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

  // Server-side spin function
  const handleSpin = async () => {
    if (isSpinning || !phoneNumber) return;
    
    setIsSpinning(true);
    
    try {
      // Make API call to server for spin result
      const result = await spinWheel(phoneNumber);
      
      // Set spinning animation
      const prizeIndex = result.prizeIndex;
      const totalSegments = result.totalSegments || 6;
      
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
