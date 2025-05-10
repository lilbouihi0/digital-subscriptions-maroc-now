
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CirclePercent } from "lucide-react";
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
  const [currentWin, setCurrentWin] = useState<{ 
    prize: string; 
    code: string;
    expiryDate?: string;
  } | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [cashBack, setCashBack] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Check for any active discounts from spinner wins
  useEffect(() => {
    const winData = localStorage.getItem('currentWin');
    if (winData) {
      try {
        const parsedWin = JSON.parse(winData);
        
        // Check if the reward has expired
        if (parsedWin.expiryDate) {
          const expiryTime = new Date(parsedWin.expiryDate).getTime();
          const currentTime = new Date().getTime();
          
          if (currentTime > expiryTime) {
            setIsExpired(true);
            return;
          }
        }
        
        setCurrentWin(parsedWin);
        
        // Calculate discounted price if applicable
        if (parsedWin.prize.includes('OFF')) {
          const percentMatch = parsedWin.prize.match(/(\d+)%\s*OFF/i);
          if (percentMatch && percentMatch[1]) {
            const discountPercentage = parseInt(percentMatch[1], 10);
            const newPrice = price * (1 - discountPercentage / 100);
            setDiscountedPrice(Math.round(newPrice));
          }
        } else if (parsedWin.prize.includes('Cash Back')) {
          // Get percentage from prize text (e.g. "10% Cash Back")
          const percentMatch = parsedWin.prize.match(/(\d+)%\s*Cash Back/i);
          if (percentMatch && percentMatch[1]) {
            const cashBackPercentage = parseInt(percentMatch[1], 10);
            setCashBack(Math.round(price * cashBackPercentage / 100));
          }
        }
      } catch (e) {
        console.error('Error parsing win data:', e);
      }
    }
  }, [price]);

  const handleOpenDialog = () => {
    if (durationOptions && durationOptions.length > 0) {
      // Apply discounts to all duration options if applicable
      if (currentWin && !isExpired && currentWin.prize.includes('OFF')) {
        const percentMatch = currentWin.prize.match(/(\d+)%\s*OFF/i);
        if (percentMatch && percentMatch[1]) {
          const discountPercentage = parseInt(percentMatch[1], 10);
          
          const updatedOptions = durationOptions.map(option => ({
            ...option,
            originalPrice: option.price,
            price: Math.round(option.price * (1 - discountPercentage / 100))
          }));
        }
      }
      setIsDialogOpen(true);
    } else {
      // Default behavior for products without duration options
      let messageText = `I'm interested in the ${name} subscription`;
      
      // Add discount code if applicable
      if (currentWin && !isExpired && currentWin.prize !== 'Try Again') {
        messageText += ` with my promo code: ${currentWin.code}`;
      }
      
      window.open(
        `https://wa.me/+212614566647?text=${encodeURIComponent(messageText)}`,
        "_blank"
      );
    }
  };

  const handleSelectDuration = (option: DurationOption) => {
    setSelectedDuration(option);
    setIsDialogOpen(false);
    
    // Build WhatsApp message
    let messageText = `I'm interested in the ${name} ${option.duration} subscription for ${option.price} MAD`;
    
    // Add discount code if applicable
    if (currentWin && !isExpired && currentWin.prize !== 'Try Again') {
      messageText += ` with my promo code: ${currentWin.code}`;
      
      // Add cashback details if applicable
      if (currentWin.prize.includes('Cash Back')) {
        const percentMatch = currentWin.prize.match(/(\d+)%\s*Cash Back/i);
        if (percentMatch && percentMatch[1]) {
          const cashBackPercentage = parseInt(percentMatch[1], 10);
          const cashBackAmount = Math.round(option.price * cashBackPercentage / 100);
          messageText += ` (${cashBackAmount} MAD cashback)`;
        }
      }
    }
    
    // Open WhatsApp with the selected duration
    window.open(
      `https://wa.me/+212614566647?text=${encodeURIComponent(messageText)}`,
      "_blank"
    );
  };

  return (
    <>
      <Card 
        className="overflow-hidden card-hover border-0 shadow-card cursor-pointer" 
        dir={dir}
        onClick={handleOpenDialog}
      >
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
                {discountedPrice && !isExpired ? (
                  <>
                    <span className="text-2xl font-bold text-navy">{discountedPrice} MAD</span>
                    <span className="text-sm text-gray-500 line-through">{price} MAD</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-navy">
                    {price} MAD
                    {cashBack && !isExpired && (
                      <span className="ml-2 text-sm text-green-600 flex items-center">
                        <CirclePercent size={16} className="mr-1" />
                        +{cashBack} MAD cashback
                      </span>
                    )}
                  </span>
                )}
                {!discountedPrice && oldPrice && (
                  <span className="text-sm text-gray-500 line-through">{oldPrice} MAD</span>
                )}
              </div>
              
              {currentWin && !isExpired && currentWin.prize.includes('OFF') && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
                    {currentWin.prize} Applied
                  </Badge>
                </div>
              )}
              
              {currentWin && !isExpired && currentWin.prize.includes('Cash Back') && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {currentWin.prize} Applied
                  </Badge>
                </div>
              )}
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
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDialog();
            }}
          >
            {t("products.buyNow")}
          </Button>
        </CardFooter>
      </Card>
      
      <DurationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        productName={name}
        options={durationOptions.map(option => {
          if (currentWin && !isExpired && currentWin.prize.includes('OFF')) {
            const percentMatch = currentWin.prize.match(/(\d+)%\s*OFF/i);
            if (percentMatch && percentMatch[1]) {
              const discountPercentage = parseInt(percentMatch[1], 10);
              const discountedPrice = Math.round(option.price * (1 - discountPercentage / 100));
              return {
                ...option,
                originalPrice: option.price,
                price: discountedPrice
              };
            }
          }
          return option;
        })}
        onSelect={handleSelectDuration}
        productLogo={logo}
        winCode={currentWin && !isExpired ? currentWin.code : undefined}
      />
    </>
  );
};

export default ProductCard;
