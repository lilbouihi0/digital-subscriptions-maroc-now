
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Gift, Clock, Copy } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface PrizeDisplayProps {
  prize: string;
  spinCode: string;
  formatTimeRemaining: () => string;
  onApplyReward: () => void;
  onClaimReward: () => void;
}

const PrizeDisplay: React.FC<PrizeDisplayProps> = ({
  prize,
  spinCode,
  formatTimeRemaining,
  onApplyReward,
  onClaimReward,
}) => {
  const { t } = useLanguage();
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(spinCode).then(() => {
      toast({
        title: t("spinner.codeCopied"),
        description: t("spinner.pasteInChat"),
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mt-6 overflow-hidden border-2 border-indigo-200 bg-white/90 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex items-center space-x-2">
          <BadgeCheck className="h-6 w-6" />
          <h3 className="text-xl font-bold">{t("spinner.congratulations")}</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full">
            <Gift className="h-8 w-8" />
          </div>
          
          <h4 className="text-2xl font-bold text-gray-800">{prize}</h4>
          
          <div className="w-full p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">{t("spinner.uniqueCode")}</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono bg-gray-100 p-2 rounded flex-1 overflow-x-auto">{spinCode}</code>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyCode}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-amber-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {t("spinner.offerExpires")}: {formatTimeRemaining()}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={onApplyReward}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {t("spinner.applyReward")}
            </Button>
            
            <Button 
              onClick={onClaimReward}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {t("spinner.claim")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrizeDisplay;
