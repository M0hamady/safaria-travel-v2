import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/common.json";
import arTranslation from "./locales/ar/common.json";

// Helper function to set document direction and language
export const applyLanguageSettings = (lang: string): void => {
  const currentLang = localStorage.getItem("language"); // Get stored language
  if (currentLang !== lang) {
    // Only refresh if the language is different
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang); // Persist new language
    window.location.reload(); // Refresh the page to apply changes
  }
};

i18n
  .use(initReactI18next) // React integration
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    lng: localStorage.getItem("language") || "en", // Default language from local storage or fallback
    fallbackLng: "en", // Fallback to English if translation is missing
    debug: process.env.NODE_ENV === "development", // Debug in development mode
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Listen for language changes and apply settings dynamically
i18n.on("languageChanged", applyLanguageSettings);

// Apply settings for the initial language
applyLanguageSettings(i18n.language);

export default i18n;
