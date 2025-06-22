import React from "react";
import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import SearchBar from "../../components/SearchBar";
import FeaturesSection from "../../components/FeaturesSection";
import Partners from "../../components/Partners";
import SectionDownloadApp from "../../components/SectionDowloadApp";
import SectionFeatures from "../../components/SectionFeatures";
import images from "../../assets/index";
import { useTranslation } from "react-i18next";
import StepsSection from "../../components/StepsSection";
import PaymentGateways from "../../components/PaymentGateways";

const WelcomePage = () => {
  const { t, i18n } = useTranslation(); // Ensure useTranslation hook includes i18n

  // Detect current language to adjust layout direction dynamically
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar"; // RTL for Arabic

  return (
    <div className={`bg-boarder z ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section with Search */}
      <section className="relative z-40 h-screen w-full" id="hero">
        <Hero />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center flex-col w-full px-24 max-sm:px-0"
        >
          <div
            className={`${
              isRTL ? "text-right" : "text-left"
            } max-sm:-translate-y-80 -translate-y-[26rem] text-light w-full flex flex-col items-start max-sm:ml-1 max-sm:top-16`}
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-md md:text-lg font-bold mb-4"
            >
              {t("welcome_to_safaria")} {/* Translation key for the title */}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-3xl md:text-5xl font-bold w-10/12"
            >
              {t("travel_anywhere")}
              <br />
              {t("direct_routes")}
            </motion.p>
          </div>
          <SearchBar />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="-mt-44 max-sm:mt-96" id="features">
        <motion.div className="w-full">
          <FeaturesSection />
        </motion.div>
      </section>

      {/* Our Partners Section */}
      <section className="bg-white py-16" id="partners">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center mb-8"
        >
          {t("our_partners")} {/* Translation key for the section title */}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-lg text-gray-500 text-center mb-8"
        >
          {t("partners_description")} {/* Translation key for the description */}
        </motion.p>
        <Partners />
      </section>
<section className="flex flex-col justify-center items-center bg-primary ">
      {/* <h2 className="text-2xl font-semibold mb-4">Our Payment Gateways</h2> */}
      <PaymentGateways />
    </section>
      {/* Download App Section */}
      <section className="container mx-auto my-16" id="download">
        <SectionDownloadApp />
      </section>
      <StepsSection />

    </div>
  );
};

export default WelcomePage;
