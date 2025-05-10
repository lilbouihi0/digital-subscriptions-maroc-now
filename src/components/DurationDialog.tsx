
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export interface DurationOption {
  duration: string;
  price: number;
}

interface DurationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  options: DurationOption[];
  onSelect: (option: DurationOption) => void;
  productLogo: string;
  winCode?: string;
}

const DurationDialog = ({
  isOpen,
  onClose,
  productName,
  options,
  onSelect,
  productLogo,
  winCode
}: DurationDialogProps) => {
  const { t, dir } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<DurationOption | null>(null);
  
  const handleOptionSelect = (option: DurationOption) => {
    setSelectedOption(option);
  };

  const handleBuyNow = () => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center gap-4">
            <img src={productLogo} alt={productName} className="h-12 object-contain" />
            <span>{t("products.selectDuration")}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors
                ${selectedOption === option 
                  ? 'border-teal bg-teal/10 ring-2 ring-teal/30' 
                  : 'hover:border-teal hover:bg-teal/5'}`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="font-medium">{option.duration}</div>
              <div className="font-bold text-teal">{option.price} MAD</div>
            </div>
          ))}
        </div>

        {winCode && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-100">
            <p className="text-xs text-gray-500 mb-1">{t("spinner.uniqueCode")}:</p>
            <code className="bg-white text-indigo-700 px-2 py-1 rounded text-sm font-mono break-all block">{winCode}</code>
          </div>
        )}
        
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {t("products.cancel")}
          </Button>
          <Button 
            onClick={handleBuyNow} 
            disabled={!selectedOption} 
            className="w-full sm:w-auto bg-teal hover:bg-teal/90"
          >
            {t("products.buyNow")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DurationDialog;
