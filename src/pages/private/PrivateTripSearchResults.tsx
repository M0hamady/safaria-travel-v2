import React, { useState, useMemo, useEffect, FC } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { usePrivateSearchContext } from "../../context/PrivateSearchContext";
import { TripList } from "./TripList";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { FilterSidebar } from "./FilterSidebar";
import Hero from "../../components/Hero";
import SearchBar from "../../components/SearchBar";
import { motion } from "framer-motion";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

// Mobile filter drawer component

// Single trip card component

export default function PrivateTripSearchResults() {
  const { trips, getFilteredTrips, tripFilters, setTripFilters } =
    usePrivateSearchContext();

  const companies = useMemo(
    () => Array.from(new Set(trips.map((t) => t.company))),
    [trips]
  );
  const busTypes = useMemo(
    () => Array.from(new Set(trips.map((t) => t.category))),
    [trips]
  );
  const { t } = useTranslation();
console.log('-------------------------');
console.log(busTypes);
  const [selectedCompany, setSelectedCompany] = useState<string[]>(
    tripFilters.company
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >(tripFilters.priceRange as [number, number]);
  const [selectedBusType, setSelectedBusType] = useState<string[]>(
    tripFilters.busType || []
  );
  const [showFilters, setShowFilters] = useState(false);

  // apply filters on desktop
  useEffect(() => {
    setTripFilters({
      company: selectedCompany,
      priceRange: selectedPriceRange,
      busType: selectedBusType,
    });
  }, [selectedCompany, selectedPriceRange, selectedBusType]);

  const resetFilters = () => {
    setSelectedCompany([]);
    setSelectedPriceRange([0, 10000]);
    setSelectedBusType([]);
    setTripFilters({ company: [], priceRange: [0, 10000], busType: [] });
    setShowFilters(false);
  };

  const filteredTrips = getFilteredTrips();
  const currentLanguage = i18next.language;

  const isRTL = currentLanguage === "ar"; // RTL for Arabic
  useEffect(() => {
    if (filteredTrips.length > 0) {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [trips]);
  
  return (
    <div className="  bg-gray-100 md:min-h-screen ">
      <section
        className="w-full h-fit md:max-h-[600px] mb-6 2xl:mb-20  max-sm:mb-0"
        id="hero"
      >
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
      <section className="flex flex-col md:flex-row p-4 bg-gray-100 min-h-screen "  id="results" >
        <div className="md:w-1/4">
          <div className="md:hidden mb-4 flex space-x-2">
            <button
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-md"
              onClick={() => setShowFilters(true)}
            >
              <FilterListIcon /> <span>Filters</span>
            </button>
            <button
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-md"
              onClick={resetFilters}
            >
              <RefreshIcon /> <span>Reset</span>
            </button>
          </div>
          <FilterSidebar
            companies={companies}
            busTypes={busTypes}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            selectedBusType={selectedBusType}
            setSelectedBusType={setSelectedBusType}
            resetFilters={resetFilters}
            isOpen={showFilters}
          />
        </div>
        <MobileFilterDrawer
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          companies={companies}
          busTypes={busTypes}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          selectedBusType={selectedBusType}
          setSelectedBusType={setSelectedBusType}
          resetFilters={resetFilters}
        />
        <div className="flex-1 mt-6 md:mt-0 md:ml-6">
          <TripList trips={filteredTrips} />
        </div>
      </section>
    </div>
  );
}
