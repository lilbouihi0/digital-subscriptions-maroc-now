
import React, { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "en" | "ar" | "fr";
    if (newLang && ['en', 'ar', 'fr'].includes(newLang)) {
      setLanguage(newLang);
      console.log("Language changed in Navbar to:", newLang);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <span className="text-navy dark:text-white font-heading font-bold text-2xl">DigiSubs</span>
            </a>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <div className={`flex ${language === 'ar' ? 'space-x-0 gap-8 flex-row-reverse' : 'space-x-8'}`}>
              <a href="/" className="nav-link font-medium dark:text-gray-300 dark:hover:text-white">{t("nav.home")}</a>
              <a href="#products" className="nav-link font-medium dark:text-gray-300 dark:hover:text-white">{t("nav.products")}</a>
              <a href="#faq" className="nav-link font-medium dark:text-gray-300 dark:hover:text-white">{t("nav.faq")}</a>
              <a href="#contact" className="nav-link font-medium dark:text-gray-300 dark:hover:text-white">{t("nav.contact")}</a>
              <a href="/phone-verification" className="nav-link font-medium dark:text-gray-300 dark:hover:text-white">Verify Phone</a>
            </div>
            
            {/* Language switcher */}
            <div className={`relative ${language === 'ar' ? 'mr-8' : 'ml-8'}`}>
              <select 
                className="appearance-none bg-transparent dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal dark:text-gray-300"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-4 text-gray-700 dark:text-gray-300" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme toggle for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          
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
        <div className="md:hidden bg-white dark:bg-gray-900 pb-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4 pt-2 pb-3">
            <a 
              href="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.home")}
            </a>
            <a 
              href="#products" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.products")}
            </a>
            <a 
              href="#faq" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.faq")}
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              {t("nav.contact")}
            </a>
            <a 
              href="/phone-verification" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-teal rounded-md"
              onClick={toggleMenu}
            >
              Verify Phone
            </a>
            <div className="px-3 py-2">
              <label htmlFor="mobile-language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language / اللغة / Langue</label>
              <select 
                id="mobile-language"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 py-2 pl-3 pr-10 text-base focus:border-teal focus:outline-none focus:ring-teal border dark:text-gray-300"
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
