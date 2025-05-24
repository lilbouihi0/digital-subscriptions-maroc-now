
import { useState } from 'react';
import { spinWheel } from '@/utils/twilioService';
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  recordSpin, 
  markAsTryAgain, 
  useTryAgainChance,
  hasSpunToday,
  hasTryAgainChance
} from '@/services/spinTrackingService';

export const useSpinServerLogic = (phoneNumber: string, deviceId: string = '') => {
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [gotTryAgain, setGotTryAgain] = useState(false);
  const [prize, setPrize] = useState<any>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate a random angle for a specific prize segment
  const calculatePrizeAngle = (prizeIndex: number, totalSegments: number) => {
    const segmentSize = 360 / totalSegments;
    // Calculate the center of the segment
    const segmentCenter = prizeIndex * segmentSize;
    // Add a small random offset for realism, but keep it within the segment
    const maxOffset = segmentSize * 0.2; 
    const randomOffset = (Math.random() * 2 - 1) * maxOffset; 
    
    // In CSS rotation, clockwise is positive
    // We need to add 180 degrees to align with the pointer at the top
    return 360 - (segmentCenter + randomOffset + 180);
  };

  // Simulated spin function (no server call)
  const handleSpin = async () => {
    if (isSpinning || isProcessing || !phoneNumber || !deviceId) return;
    
    setIsProcessing(true);
    
    try {
      // Check if the user has already spun today
      const hasAlreadySpun = await hasSpunToday(phoneNumber, deviceId);
      const hasTryAgain = await hasTryAgainChance(phoneNumber, deviceId);
      
      // If they've already spun today and don't have a try again chance, don't allow it
      if (hasAlreadySpun && !hasTryAgain) {
        toast({
          title: "Already Spun Today",
          description: "You've already spun the wheel today. Come back tomorrow!",
          variant: "default"
        });
        setIsProcessing(false);
        return;
      }
      
      // Record this spin in our tracking service
      await recordSpin(phoneNumber, deviceId, hasTryAgain);
      
      // Also set a cookie as an additional tracking method
      const today = new Date().toDateString();
      document.cookie = `lastSpin_${phoneNumber}=${today};path=/;max-age=2592000`; // 30 days
      
      setIsSpinning(true);
    } catch (error) {
      console.error('Error recording spin:', error);
      toast({
        title: "Error",
        description: "There was an error processing your spin. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
    
    try {
      // Define some sample prizes - IMPORTANT: These must be in the same order as they appear visually on the wheel
      const samplePrizes = [
        { name: "10% Cash Back", type: "cashback", value: "10%", code: "CASH10" },
        { name: "20% Cash Back", type: "cashback", value: "20%", code: "CASH20" },
        { name: "Free Account", type: "freeAccount", value: "1 Month", code: "FREE1M" },
        { name: "10% OFF", type: "discount", value: "10%", code: "DISC10" },
        { name: "5% OFF", type: "discount", value: "5%", code: "DISC05" },
        { name: "Try Again", type: "tryAgain", value: "", code: "" }
      ];
      
      const totalSegments = samplePrizes.length;
      
      // Randomly select a prize
      const selectedIndex = Math.floor(Math.random() * totalSegments);
      const selectedPrize = samplePrizes[selectedIndex];
      
      console.log(`Selected prize: ${selectedPrize.name} (index ${selectedIndex})`);
      
      // Calculate the angle for this prize segment
      // Each segment is 360/totalSegments degrees
      const segmentSize = 360 / totalSegments;
      
      // The center of the selected segment
      // We add 180 degrees because the pointer is at the top (0 degrees in the wheel)
      // and we need to align the center of the segment with the pointer
      const segmentCenter = (selectedIndex * segmentSize) + (segmentSize / 2);
      
      // Add multiple full rotations for effect (4-6 rotations)
      const fullRotations = 4 + Math.floor(Math.random() * 3);
      const fullRotationDegrees = fullRotations * 360;
      
      // Calculate final rotation
      // We use 360 - segmentCenter because the wheel rotates clockwise
      // but the segments are arranged counter-clockwise
      const finalRotation = fullRotationDegrees + (360 - segmentCenter);
      
      console.log(`Spinning to ${selectedPrize.name} at ${segmentCenter}° with final rotation ${finalRotation}°`);
      
      // Set the rotation
      setRotation(finalRotation);
      
      // After animation completes, set the prize
      setTimeout(async () => {
        setPrize(selectedPrize);
        setIsSpinning(false);
        
        try {
          setIsProcessing(true);
          
          // If the prize is "Try Again", allow the user to spin again
          if (selectedPrize.type === 'tryAgain') {
            // Mark this user as having a "Try Again" chance in our tracking service
            if (phoneNumber && deviceId) {
              await markAsTryAgain(phoneNumber, deviceId);
            }
            setGotTryAgain(true);
            
            // Don't set hasSpun to true for "Try Again" prize
            toast({
              title: t("spinner.tryAgain"),
              description: t("spinner.tryAgainDesc") || "Try your luck again!",
            });
          } else {
            // For all other prizes, mark as spun for the day
            setHasSpun(true);
            
            // Show success toast
            toast({
              title: t("spinner.congratulations"),
              description: `${t("spinner.youWon")} ${selectedPrize.name}!`,
            });
            
            // Clear any "Try Again" state if they had it before
            if (gotTryAgain && phoneNumber && deviceId) {
              await useTryAgainChance(phoneNumber, deviceId);
              setGotTryAgain(false);
            }
          }
        } catch (error) {
          console.error('Error processing prize:', error);
        } finally {
          setIsProcessing(false);
        }
        
        console.log(`Wheel stopped. Prize: ${selectedPrize.name}`);
      }, 5000); // Match this with the CSS transition duration
      
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

  // Function to apply discount or cashback prize
  const applyDiscount = () => {
    if (prize?.type !== 'discount' && prize?.type !== 'cashback') return;
    
    // In a real app, this would update the session state or call an API
    // Here, we'll just show a toast
    localStorage.setItem('activeDiscount', JSON.stringify({
      type: prize.type,
      value: prize.value,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }));
    
    const title = prize.type === 'cashback' 
      ? t("spinner.cashbackApplied") || "Cashback Applied!" 
      : t("spinner.discountApplied") || "Discount Applied!";
    
    const description = prize.type === 'cashback'
      ? (t("spinner.cashbackAppliedDesc") || "You'll receive {value} cashback on your next purchase!").replace('{value}', prize.value)
      : (t("spinner.discountAppliedDesc") || "You've received a {value} discount on your next purchase!").replace('{value}', prize.value);
    
    toast({
      title: title,
      description: description,
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
    gotTryAgain,
    prize,
    rotation,
    handleSpin,
    applyDiscount,
    claimFreeAccount
  };
};
