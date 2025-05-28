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
  const { searchValues, setSearchValues, handleSearch,trips } = useSearchContext();
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
  }, [location.search,trips]);
  
  const currentLanguage = i18next.language;
  const isRTL = currentLanguage === "ar"; // RTL for Arabic

  return (
    <div className="bg-boarder relative min-h-screen grid grid-cols-1 lg:grid-cols-4 gap-1 ">
      {/* Hero Section */}
      <section className="col-span-1 lg:col-span-4 h-fit  max-sm:mb-32 relative" id="hero">
        <Hero />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center flex-col w-full px-24 max-sm:px-0  md:-mb-[12rem] "
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

      {/* Filters and Trips Section */}
      <section
        id="bus-search-trips"
        className="col-span-1 lg:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-4 max-sm:min-h-screen max-md:-translate-y-40 md:mx-4"
      >
        <div className="lg:col-span-1  rounded-lg shadow-md p-4">
          <BusSearchFilters />
        </div>
        <div className="lg:col-span-3   rounded-lg shadow-md p-4">
          <BusSearchTrips />
        </div>
      </section>

      {/* Return Link Section */}
      <div className="col-span-1 lg:col-span-4 flex justify-center py-6">
        <Link
          to={"/bus-search-return"}
          className="text-black z-50 text-base font-medium hover:underline"
        >
          {t("searchResults.returnTrips")}
        </Link>
      </div>
    </div>
  );
};

export default BusSearchResults;
