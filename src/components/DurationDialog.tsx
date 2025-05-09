
import React from "react";
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
}

const DurationDialog = ({
  isOpen,
  onClose,
  productName,
  options,
  onSelect,
  productLogo
}: DurationDialogProps) => {
  const { t, dir } = useLanguage();
  
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
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-teal hover:bg-teal/5 transition-colors"
              onClick={() => onSelect(option)}
            >
              <div className="font-medium">{option.duration}</div>
              <div className="font-bold text-teal">{option.price} MAD</div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {t("products.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DurationDialog;
