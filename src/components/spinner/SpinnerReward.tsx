
import React from "react";
import { MessageCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SpinnerRewardProps {
  prize: string | null;
  spinCode: string;
  formatTimeRemaining: () => string;
  onApplyReward: () => void;
  onClaimReward: () => void;
}

const SpinnerReward: React.FC<SpinnerRewardProps> = ({
  prize,
  spinCode,
  formatTimeRemaining,
  onApplyReward,
  onClaimReward,
}) => {
  const { t } = useLanguage();

  // Only render if there's a prize and it's not "Try Again"
  if (!prize || prize === "Try Again") return null;

  return (
    <div className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 rounded-lg text-white animate-pulse shadow-lg">
      <p className="font-bold text-xl mb-2">{t("spinner.congratulations")}</p>
      <div className="flex items-center justify-center gap-2 text-lg">
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
        onClick={onApplyReward}
        className="mt-4 bg-green-500 hover:bg-green-600 flex items-center gap-2 w-full"
      >
        <Tag size={18} />
        {t("spinner.applyReward")}
      </Button>
      <Button 
        onClick={onClaimReward}
        variant="outline"
        className="mt-2 bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center gap-2 w-full"
      >
        <MessageCircle size={18} />
        {t("spinner.contactUs")}
      </Button>
    </div>
  );
};

export default SpinnerReward;
