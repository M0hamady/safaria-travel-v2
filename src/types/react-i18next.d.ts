import "react-i18next";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: {
      en: typeof en;
      ar: typeof ar;
    };
  }
}
