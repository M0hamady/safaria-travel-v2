import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import BusSearchFilters from "../components/BusSearchFilters";
import Hero from "../../../components/Hero";
import { motion } from "framer-motion";
import SearchBar from "../../../components/SearchBar";
import BusSearchTrips from "../components/BusSearchTrips";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const BusSearchResults: React.FC = () => {
  const { searchValues, setSearchValues, handleSearch } = useSearchContext();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("query");
    if (searchTerm) {
      setSearchValues({ ...searchValues, from: searchTerm });
      handleSearch();
    }

    setTimeout(() => {
      document.getElementById("bus-search-trips")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 800);
  }, [location.search]);
  
  const currentLanguage = i18next.language;
  const isRTL = currentLanguage === "ar"; // RTL for Arabic

  return (
    <div className="bg-boarder relative">
      <section className="w-full h-fit md:max-h-[600px] mb-6 2xl:mb-20  max-sm:mb-32" id="hero">
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



      <section id="bus-search-trips" className="grid grid-cols-4 max-sm:grid-cols-1 z-50 max-md:-translate-y-40 max-sm:min-h-screen">
        <div className="col-span-1 px-2">
          <BusSearchFilters />
        </div>
        <div className="col-span-3 px-4 max-sm:min-h-screen">
          <BusSearchTrips />
        </div>
      </section>

      <Link to={"/bus-search-return"} className="text-black z-50">
        {t("searchResults.returnTrips")}
      </Link>
    </div>
  );
};

export default BusSearchResults;
