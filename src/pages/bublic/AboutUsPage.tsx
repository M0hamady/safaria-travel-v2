import React from "react";
import { motion } from "framer-motion";
import images from "../../assets/index";
import SectionFeatures from "../../components/SectionFeatures";
import FeaturesSection from "../../components/FeaturesSection";
import { useTranslation } from "react-i18next";

const AboutUs: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <div className="w-full mx-auto space-y-20">
      {/* About Us Section */}
      <section
        id="about-us"
        className="flex flex-col md:flex-row md:h-[600px] items-center gap-10 justify-between bg-gradient-to-r from-primary to-blue-900 px-4 py-28 md:px-10 lg:px-28 pb-12 max-sm:flex-col-reverse max-sm:px-12 max-sm:gap-11"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col gap-4 md:w-1/2"
        >
          <h2 className="text-white text-2xl md:text-3xl font-medium font-[Cairo]">
            {t("about_Us.section_title")}
          </h2>
          <p className="text-white text-base md:text-xl font-normal font-[Cairo] leading-relaxed">
            {t("about_Us.description")}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mt-6 md:mt-0 md:w-1/2 flex justify-start items-start"
        >
          <img
            className="w-full object-cover"
            src={images.SafariaLogo}
            alt={t("about_Us.image_alt")}
          />
        </motion.div>
      </section>

      {/* Previewing App Section */}
      <section
        id="previewing-app"
        className="flex justify-center items-center gap-10 mx-auto text-center"
      >
          <div className="flex-col justify-center items-center">
            <img
              className="object-cover h-[300px] mx-auto"
              src={images.safariaMobile}
              alt={t("about_Us.preview_image_alt")}
            />
            <p className="text-black text-base max-w-[400px] md:text-xl font-normal font-[Cairo] leading-relaxed">
              {t("about_Us.preview_image_alt")}
            </p>
            <a href="/" className="text-primary">
              {t("about_Us.mobile_app_link")}
            </a>
          </div>
          <div  className="flex-col justify-center items-center">
            <img
              className="object-cover h-[300px] mx-auto"
              src={images.appImage}
              alt={t("about_Us.preview_image_alt2")}
            />
            <p className="text-black text-base max-w-[400px] md:text-xl font-normal font-[Cairo] leading-relaxed">
              {t("about_Us.preview_image_alt2")}
            </p>
            <a href="/" className="text-primary">
              {t("about_Us.mobile_app_link")}
            </a>
          </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="px-4 sm:px-6 md:px-10 lg:px-28 ">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold max-sm:px-8 text-left text-black rtl:text-right"
        >
          {t("what_we_do.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-lg max-sm:px-8 text-left text-black mt-4 mx-auto md:mx-0 rtl:text-right"
        >
          {t("what_we_do.description")}
        </motion.p>
      </section>

      {/* Our Vision Section */}
      <section id="our-vision" className="px-4 sm:px-6 md:px-10 lg:px-28 rtl:text-right">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold max-sm:px-8 text-left text-black rtl:text-right"
        >
          {t("our_vision.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-lg max-sm:px-8 text-left text-black mt-4 mx-auto md:mx-0 rtl:text-right"
        >
          {t("our_vision.description")}
        </motion.p>
      </section>

      {/* Why Safaria Section */}
      <section id="why-safaria" className="px-4 sm:px-6 md:px-10 lg:px-28 rtl:text-right">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold max-sm:px-8 text-left text-black rtl:text-right"
        >
          {t("why_safaria.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-lg max-sm:px-8 text-left text-black mt-4 mx-auto md:mx-0 rtl:text-right"
        >
          {t("why_safaria.description")}
        </motion.p>
      </section>

      {/* Features Section */}
      <section id="features" className="-mt-44 max-sm:mt-96 rtl:text-right" >
        <motion.div className="w-full">
          <FeaturesSection />
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
