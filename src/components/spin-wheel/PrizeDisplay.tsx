
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Gift, Clock, Copy, BadgePercent, BadgeDollarSign } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface PrizeDisplayProps {
  prize: string;
  prizeType: 'discount' | 'cashback' | 'freeAccount' | 'tryAgain';
  spinCode?: string;
  value?: string | number;
  expiresAt?: string;
  onApplyReward: () => void;
  onClaimReward: () => void;
}

const PrizeDisplay: React.FC<PrizeDisplayProps> = ({
  prize,
  prizeType,
  spinCode = '',
  value,
  expiresAt,
  onApplyReward,
  onClaimReward,
}) => {
  const { t } = useLanguage();
  
  const handleCopyCode = () => {
    if (!spinCode) return;
    
    navigator.clipboard.writeText(spinCode).then(() => {
      toast({
        title: t("spinner.codeCopied"),
        description: t("spinner.pasteInChat"),
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };
  
  // Format time remaining for prize expiry
  const formatTimeRemaining = () => {
    if (!expiresAt) return "48h 0m"; // Default 48 hours
    
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    const timeLeft = expiryTime - currentTime;
    
    if (timeLeft <= 0) return t("spinner.expired");
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Get icon based on prize type
  const getPrizeIcon = () => {
    switch (prizeType) {
      case 'discount':
        return <BadgePercent className="h-6 w-6" />;
      case 'cashback':
        return <BadgeDollarSign className="h-6 w-6" />;
      case 'freeAccount':
        return <Gift className="h-6 w-6" />;
      case 'tryAgain':
        return <Clock className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };
  
  // Get button text based on prize type
  const getActionButtonText = () => {
    switch (prizeType) {
      case 'discount':
        return t("spinner.applyDiscount") || "Apply Discount";
      case 'cashback':
        return t("spinner.applyCashback") || "Apply Cashback";
      case 'freeAccount':
        return t("spinner.claimReward") || "Claim Reward";
      case 'tryAgain':
        return t("spinner.spinAgainTomorrow") || "Spin Again Tomorrow";
      default:
        return t("spinner.applyReward") || "Apply Reward";
    }
  };
  
  // Determine if we show the code section
  const showCodeSection = prizeType === 'freeAccount' && spinCode;
  
  // Get background color based on prize type
  const getBgColor = () => {
    switch (prizeType) {
      case 'discount':
        return 'from-indigo-500 to-purple-600';
      case 'cashback':
        return 'from-emerald-500 to-teal-600';
      case 'freeAccount':
        return 'from-amber-500 to-orange-600';
      case 'tryAgain':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };
  
  return (
    <Card className="w-full max-w-sm mx-auto mt-3 overflow-hidden border-2 border-indigo-200 bg-white/90 backdrop-blur-sm">
      <div className={`bg-gradient-to-r ${getBgColor()} p-3 sm:p-4 text-white`}>
        <div className="flex items-center space-x-2">
          <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6" />
          <h3 className="text-lg sm:text-xl font-bold">{t("spinner.congratulations")}</h3>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 text-indigo-600 rounded-full">
            {getPrizeIcon()}
          </div>
          
          <h4 className="text-xl sm:text-2xl font-bold text-gray-800">{prize}</h4>
          
          {value && (
            <p className="text-base sm:text-lg font-semibold text-indigo-600">{value}</p>
          )}
          
          {showCodeSection && (
            <div className="w-full p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">{t("spinner.uniqueCode")}</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs sm:text-sm font-mono bg-gray-100 p-1 sm:p-2 rounded flex-1 overflow-x-auto">{spinCode}</code>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyCode}
                  className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-amber-600">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">
              {t("spinner.offerExpires")}: {formatTimeRemaining()}
            </span>
          </div>
          
          <div className="flex flex-col gap-2 sm:gap-3 w-full mt-2">
            {prizeType === 'freeAccount' ? (
              <Button 
                onClick={onClaimReward}
                className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
              >
                {t("spinner.claim")}
              </Button>
            ) : prizeType === 'tryAgain' ? (
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-sm sm:text-base py-2 sm:py-3"
              >
                {getActionButtonText()}
              </Button>
            ) : (
              <Button 
                onClick={onApplyReward}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base py-2 sm:py-3"
              >
                {getActionButtonText()}
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.href = '/products'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-sm sm:text-base py-2 sm:py-3"
            >
              {t("spinner.continueShopping") || "Continue Shopping"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrizeDisplay;
