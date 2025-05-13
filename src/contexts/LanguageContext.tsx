
import React, { createContext, useState, useContext, ReactNode } from "react";
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

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => "",
  dir: "ltr",
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.className = lang === "ar" ? "font-arabic" : "";
  };

  // Updated translation function that handles nested keys
  const t = (key: string): string => {
    // Get the current language translation object
    const translationObj = translations[language] || translations["en"];
    
    // Handle nested keys like "products.title"
    const keyParts = key.split('.');
    let result: any = translationObj;
    
    // Traverse the nested structure
    for (const part of keyParts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        // Fallback to English if missing
        let fallback = translations["en"];
        for (const fallbackPart of keyParts) {
          if (fallback && typeof fallback === 'object' && fallbackPart in fallback) {
            fallback = fallback[fallbackPart];
          } else {
            return key; // Key not found even in fallback
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
