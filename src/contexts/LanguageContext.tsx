
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
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  // Updated translation function that handles nested keys
  const t = (key: string): string => {
    try {
      // Get the current language translation object
      const translationObj = translations[language] || translations["ar"]; // Fallback to Arabic
      
      // Handle nested keys like "products.title"
      const keyParts = key.split('.');
      let result: any = translationObj;
      
      // Traverse the nested structure
      for (const part of keyParts) {
        if (result && typeof result === 'object' && part in result) {
          result = result[part];
        } else {
          // Fallback to Arabic if missing
          let fallback = translations["ar"];
          for (const fallbackPart of keyParts) {
            if (fallback && typeof fallback === 'object' && fallbackPart in fallback) {
              fallback = fallback[fallbackPart];
            } else {
              console.log(`Translation key not found: ${key} (in ${language} and fallback ar)`);
              return key; // Key not found even in fallback
            }
          }
          return typeof fallback === 'string' ? fallback : key;
        }
      }
      
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
