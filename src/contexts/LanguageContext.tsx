
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { englishTranslations } from "../translations/en";
import { arabicTranslations } from "../translations/ar";
import { frenchTranslations } from "../translations/fr";

type Language = "en" | "ar" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations = {
  en: englishTranslations,
  ar: arabicTranslations,
  fr: frenchTranslations,
};

// Get stored language or use Arabic as default
const getBrowserLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'ar', 'fr'].includes(storedLanguage)) {
      return storedLanguage;
    }
  }
  return "ar"; // Arabic is the default language
};

export const LanguageContext = createContext<LanguageContextType>({
  language: "ar", // Set Arabic as default in the initial context
  setLanguage: () => {},
  t: (key: string) => "",
  dir: "rtl", // Default to RTL for Arabic
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ar"); // Initialize with Arabic
  
  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = getBrowserLanguage();
    setLanguage(savedLanguage);
    console.log("Language set to:", savedLanguage);
  }, []);

  // Apply language settings when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
    // Add appropriate font class for Arabic
    if (language === "ar") {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
    
    localStorage.setItem('language', language);
    console.log("Language changed to:", language, "with translations:", Object.keys(translations[language]));
  }, [language]);

  const changeLanguage = (lang: Language) => {
    console.log("Changing language to:", lang);
    setLanguage(lang);
  };

  // Debug function to validate translations
  const validateTranslation = (key: string, languageCode: Language): boolean => {
    const keyParts = key.split('.');
    let obj = translations[languageCode];
    
    for (const part of keyParts) {
      if (!obj || typeof obj !== 'object' || !(part in obj)) {
        return false;
      }
      obj = obj[part];
    }
    
    return typeof obj === 'string';
  };

  // Updated translation function with better error handling and debugging
  const t = (key: string): string => {
    try {
      // Skip empty keys
      if (!key || key.trim() === '') {
        console.warn("Empty key provided to translation function");
        return '';
      }
      
      // Get the current language translation object
      const translationObj = translations[language];
      if (!translationObj) {
        console.error(`No translations found for language: ${language}`);
        return key;
      }
      
      // Handle nested keys like "products.title"
      const keyParts = key.split('.');
      let result: any = translationObj;
      
      // Traverse the nested structure
      for (const part of keyParts) {
        if (result && typeof result === 'object' && part in result) {
          result = result[part];
        } else {
          // Log missing translation
          console.warn(`Translation missing for key: ${key} in ${language}`);
          
          // Try fallback to English first, then Arabic
          const fallbackLanguages: Language[] = language !== 'en' ? ['en', 'ar'] : ['ar'];
          
          for (const fallbackLang of fallbackLanguages) {
            if (validateTranslation(key, fallbackLang)) {
              let fallback = translations[fallbackLang];
              for (const fallbackPart of keyParts) {
                fallback = fallback[fallbackPart];
              }
              console.info(`Using fallback (${fallbackLang}) for: ${key}`);
              return typeof fallback === 'string' ? fallback : key;
            }
          }
          
          // If no translation found in any language, return the key
          return key;
        }
      }
      
      // Return the found translation or the key itself
      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.error(`Error in translation function for key: ${key}`, error);
      return key; // Return the key itself as fallback
    }
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
