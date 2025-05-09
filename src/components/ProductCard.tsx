
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import DurationDialog, { DurationOption } from "./DurationDialog";

interface ProductCardProps {
  name: string;
  logo: string;
  price: number;
  oldPrice?: number;
  duration: string;
  bgColor: string;
  durationOptions?: DurationOption[];
  category: string;
}

const ProductCard = ({ 
  name, 
  logo, 
  price, 
  oldPrice, 
  duration, 
  bgColor,
  durationOptions = [],
  category
}: ProductCardProps) => {
  const { t, dir } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);

  const handleOpenDialog = () => {
    if (durationOptions && durationOptions.length > 0) {
      setIsDialogOpen(true);
    } else {
      // Default behavior for products without duration options
      window.open(
        `https://wa.me/+212000000000?text=I'm%20interested%20in%20the%20${name}%20subscription`,
        "_blank"
      );
    }
  };

  const handleSelectDuration = (option: DurationOption) => {
    setSelectedDuration(option);
    setIsDialogOpen(false);
    
    // Open WhatsApp with the selected duration
    window.open(
      `https://wa.me/+212000000000?text=I'm%20interested%20in%20the%20${name}%20${option.duration}%20subscription%20for%20${option.price}%20MAD`,
      "_blank"
    );
  };

  return (
    <>
      <Card className="overflow-hidden card-hover border-0 shadow-card" dir={dir}>
        <div className={`${bgColor} h-40 flex items-center justify-center p-6`}>
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className="max-h-20 max-w-full object-contain" 
          />
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-gray-600 text-sm">{duration}</p>
          </div>
          
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy">{price} MAD</span>
                {oldPrice && (
                  <span className="text-sm text-gray-500 line-through">{oldPrice} MAD</span>
                )}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="whatsapp-badge"
            >
              <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t("products.instantDelivery")}
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-0">
          <Button 
            className="w-full bg-teal hover:bg-teal/90"
            onClick={handleOpenDialog}
          >
            {t("products.buyNow")}
          </Button>
        </CardFooter>
      </Card>
      
      <DurationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        productName={name}
        options={durationOptions || []}
        onSelect={handleSelectDuration}
        productLogo={logo}
      />
    </>
  );
};

export default ProductCard;
