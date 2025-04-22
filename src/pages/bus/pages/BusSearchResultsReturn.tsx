import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import BusSearchFilters from "../components/BusSearchFilters";
import Hero from "../../../components/Hero";
import { motion } from "framer-motion";
import SearchBar from "../../../components/SearchBar";
import TripProgressTracker from "../../../components/TripProgressTracker";
import BusSearchTrips from "../components/BusSearchTrips";
import BusSearchTripsReturn from "../components/BusSearchTripsReturn";
import BusSearchFiltersReturn from "../components/BusSearchFiltersReturn";

const BusSearchResultsReturn: React.FC = () => {
  const { searchValues, setSearchValues, handleSearch,tripType,tripCycleStep,roundTripCycleStep } = useSearchContext();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("query");
    if (searchTerm) {
      setSearchValues({ ...searchValues, from: searchTerm });
      handleSearch();
    }

    // Smooth scroll to results after search
    setTimeout(() => {
      document.getElementById("bus-search-trips")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 800);
  }, [location.search]);

  return (
    <div className="bg-boarder relative">
      <section className="w-full h-fit md:max-h-[600px] mb-96 max-sm:mb-72" id="hero">
        <Hero />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center flex-col w-full px-24 max-sm:px-0"
        >
          <div
            className="max-sm:-translate-y-80 -translate-y-[26rem] text-light w-full flex max-sm:left-1 flex-col text-left items-start
            max-sm:ml-1 max-sm:top-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-md md:text-lg font-bold mb-4"
            >
              Welcome to Safaria
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-3xl md:text-5xl font-bold w-10/12"
            >
              Travel anywhere a click away
              <br />
              Direct routes inside and outside Egypt
            </motion.p>
          </div>
          <SearchBar />
          
        </motion.div>
      </section>
<section className=" -translate-y-80 mx-auto max-sm:mx-0  px-16 max-2xl:-translate-y-[65vh] max-sm:-translate-y-[28rem] shadow max-sm:px-2 max-sm:bg-white py-4 rounded-b-2xl md:shadow-none " id="steps">

</section>
      {/* Bus Search Trips Section */}
      <section id="bus-search-trips" className="grid grid-cols-4 max-sm:grid-cols-1 z-50 max-md:-translate-y-80 max-2xl:-translate-y-80 xl:-translate-y-96 lg:-translate-y-80 max-lg:-translate-y-0 md:-translate-y-44">
        <div className="col-span-1 px-2">
          <BusSearchFiltersReturn />
        </div>
        <div className="col-span-3 px-4">
          <BusSearchTripsReturn />
        </div>
      </section>
    </div>
  );
};

export default BusSearchResultsReturn;
