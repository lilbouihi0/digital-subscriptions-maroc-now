
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  text: string;
  productBought: string;
}

const ReviewCard = ({ name, date, rating, text, productBought }: ReviewCardProps) => {
  const { t, dir } = useLanguage();
  
  return (
    <Card className="border-0 shadow-card h-full" dir={dir}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {/* Stars based on rating */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">|</span>
          <div className="text-sm text-gray-500">{date}</div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">"{text}"</p>
        
        <div className="flex justify-between items-center">
          <div className="font-medium text-navy">{name}</div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {t("products.bought")} {productBought}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
