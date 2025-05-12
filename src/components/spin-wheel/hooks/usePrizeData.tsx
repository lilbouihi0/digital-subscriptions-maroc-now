
import { useLanguage } from "../../../contexts/LanguageContext";
import { BadgeDollarSign, Gift, Tag, RotateCw } from "lucide-react";
import React from 'react';

export interface PrizeSegment {
  value: string;
  label: string;
  icon: React.ReactNode;
  probability: number;
  color: string;
}

export const usePrizeData = () => {
  const { t } = useLanguage();
  
  // Define prizes with their probabilities
  const prizes: PrizeSegment[] = [
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
  
  return { prizes };
};
