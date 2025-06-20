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

const WelcomePage = () => {
  const { t, i18n } = useTranslation(); // Ensure useTranslation hook includes i18n

  // Detect current language to adjust layout direction dynamically
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar"; // RTL for Arabic

  return (
    <div className={`bg-boarder ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section with Search */}
      <section className="relative h-screen w-full" id="hero">
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
      {/* Features Section */}
      <section className="-mt-44 max-sm:mt-96" id="features">
        <motion.div className="w-full">
          <FeaturesSection />
        </motion.div>
      </section>

      {/* Download App Section */}
      <section className="container mx-auto my-16" id="download">
        <SectionDownloadApp />
      </section>

      {/* Steps Section */}
      <section className="text-white pt-16 bg-primary" id="steps">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center mb-8"
        >
          {t("Steps Title")} {/* Translation key for the section title */}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="w-fit mx-auto duration-700 ease-in-out"
          >
            <SectionFeatures />
          </motion.div>
          <motion.div className="w-full flex gap-5">
            <div>
              <img key={images.worldWelcome} src={images.worldWelcome} alt={t("welcome_image_alt")} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
