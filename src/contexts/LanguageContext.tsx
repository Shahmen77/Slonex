import React, { createContext, useState, useCallback } from 'react';
import ru from '../locales/ru';
import en from '../locales/en';

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  translations: typeof ru | typeof en;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('ru');
  const translations = currentLanguage === 'en' ? en : ru;
  
  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
} 