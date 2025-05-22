
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";

const HeroSection = () => {
  const { t, dir } = useLanguage();

  const serviceLogos = [
    { 
      name: 'Netflix', 
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
      bgColor: "bg-black"
    },
    {
      name: 'Spotify',
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1200px-Spotify_logo_with_text.svg.png",
      bgColor: "bg-black"
    },
    {
      name: 'Prime Video',
      logo: "https://m.media-amazon.com/images/G/01/digital/video/acquisition/logo/pv_logo_white._CB548637580_.png",
      bgColor: "bg-[#00A8E1]"
    },
    {
      name: 'Shahid VIP',
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Mbc_Shahid_logo.svg",
      bgColor: "bg-[#7C3AED]"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-navy to-navy/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">
              {t("hero.title")} <span className="text-teal">{t("hero.subtitle")}</span>
            </h1>
            <p className="text-lg text-gray-200">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="bg-teal hover:bg-teal/90 text-white font-medium py-6"
                size="lg"
                asChild
              >
                <a href="#products">{t("hero.cta")}</a>
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy py-6" 
                size="lg"
                asChild
              >
                <a href="#contact">{t("nav.contact")}</a>
              </Button>
            </div>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Secure Payment</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-teal/30 rounded-2xl rotate-6"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {serviceLogos.map((service, index) => (
                    <div 
                      key={index}
                      className={`${service.bgColor} h-24 rounded-lg flex items-center justify-center shadow-md card-hover`}
                    >
                      <img 
                        src={service.logo} 
                        alt={service.name} 
                        className="max-h-12 max-w-[80%] object-contain"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">From</div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-navy">49 MAD</div>
                    <div className="whatsapp-badge">
                      <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Via WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
