
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t, dir } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "en" | "ar" | "fr");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-navy font-heading font-bold text-2xl">DigiSubs</span>
            </a>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link font-medium">{t("nav.home")}</a>
            <a href="#products" className="nav-link font-medium">{t("nav.products")}</a>
            <a href="#faq" className="nav-link font-medium">{t("nav.faq")}</a>
            <a href="#contact" className="nav-link font-medium">{t("nav.contact")}</a>
            
            {/* Language switcher */}
            <div className="relative ml-4">
              <select 
                className="appearance-none bg-transparent border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4 pt-2 pb-3">
            <a 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.home")}
            </a>
            <a 
              href="#products" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.products")}
            </a>
            <a 
              href="#faq" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.faq")}
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.contact")}
            </a>
            <div className="px-3 py-2">
              <label htmlFor="mobile-language" className="block text-sm font-medium text-gray-700">{t("products.selectDuration")}</label>
              <select 
                id="mobile-language"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal focus:outline-none focus:ring-teal border"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
