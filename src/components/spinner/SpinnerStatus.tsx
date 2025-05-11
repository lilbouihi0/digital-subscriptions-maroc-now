
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SpinnerStatusProps {
  hasSpunToday: boolean;
  hasExtraSpinToday: boolean;
  isSpinning: boolean;
  prize: string | null;
  timeUntilNextSpin: () => string;
}

const SpinnerStatus: React.FC<SpinnerStatusProps> = ({
  hasSpunToday,
  hasExtraSpinToday,
  isSpinning,
  prize,
  timeUntilNextSpin,
}) => {
  const { t } = useLanguage();

  if (isSpinning || prize) return null;

  return (
    <div className="mt-6 text-center">
      {hasSpunToday && hasExtraSpinToday && (
        <p className="text-sm bg-white/50 px-4 py-2 rounded-full shadow-inner">
          {t("spinner.nextSpin")}: <span className="font-semibold text-indigo-700">{timeUntilNextSpin()}</span>
        </p>
      )}

      {hasSpunToday && !hasExtraSpinToday && (
        <p className="text-sm bg-white/50 px-4 py-2 rounded-full shadow-inner">
          {t("spinner.youHaveExtraSpin")}
        </p>
      )}
    </div>
  );
};

export default SpinnerStatus;
