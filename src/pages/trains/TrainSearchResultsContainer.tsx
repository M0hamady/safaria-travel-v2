// File: src/pages/TrainSearchResultsContainer.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TrainSearchResults from './TrainSearchResults';
import TrainFilterComponent from './TrainFilterComponent';
import Hero from '../../components/Hero';
import { motion } from "framer-motion";
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import SearchBar from '../../components/SearchBar';

const TrainSearchResultsContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = i18next.language;
  const isRTL = currentLanguage === "ar";
  const { t } = useTranslation();

  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="w-full h-fit md:max-h-[600px] mb-6 2xl:mb-20 max-sm:mb-32" id="hero">
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
              {t("welcome_to_safaria")}
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

      {/* Filter + Results Section */}
      <section ref={searchResultsRef} className="flex flex-col md:flex-row gap-6 px-4 md:px-12">
        <div className="md:w-3/12">
          <TrainFilterComponent />
        </div>
        <div className="md:w-8/12">
          <TrainSearchResults navigate={navigate} locationKey={location.key} />
        </div>
      </section>
    </div>
  );
};

export default TrainSearchResultsContainer;
