import React, { useContext, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSearchContext } from "../../../context/SearchContext";
import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import ReservationLayout from "../../../components/ReservationLayout";
import TripProgressTracker from "../../../components/TripProgressTracker";
import SummarySection from "../components/SummarySection";
import { useTranslation } from "react-i18next";

const TripDetailsPage = () => {
  const { t } = useTranslation();
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const {
    seatingStructure,
    seats,
    selectedSeats,
    loading,
    fetchTripDetails,
    generateSalonLayout,
    tripType,
    tripCycleStep,
    roundTripCycleStep,
  } = useSearchContext();
  const salonRef = useRef<HTMLDivElement | null>(null);
  const confirmRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [tripId]);

  useEffect(() => {
    if (!loading && salonRef.current) {
      setTimeout(() => {
        salonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [loading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("Loading")}
      </motion.div>
    );
  }

  if (!seatingStructure || !seats) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("Trip not found")}
      </motion.div>
    );
  }

  return (
    <ReservationLayout>
      <div className="flex  justify-around mx-auto gap-7 mt-12 w-fit align-middle items-center">
        <div className="capitalize text-gray-400 font-bold flex items-center align-middle gap-2">
          {" "}
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div> {t('available')}
        </div>
        <div className="capitalize text-red-500 font-bold flex items-center align-middle gap-2">
          {" "}
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>{t("reserved")}
        </div>
        <div className="capitalize text-primary font-bold flex items-center align-middle gap-2">
          {" "}
          <div className="w-3 h-3 bg-primary rounded-full"></div>{t("selected")}
        </div>
      </div>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* <TripProgressTracker
          tripType={tripType}
          tripCycleStep={tripCycleStep}
          roundTripCycleStep={roundTripCycleStep}
        /> */}
        <motion.div
          className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {t("Trip Details")}
          </h1>

          {/* Seat Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold">{t("Seat Selection")}</h2>
            <motion.div
              ref={salonRef}
              className="salon-layout bg-gray-100 p-4 rounded-lg transition-transform duration-500 ease-in-out transform"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {generateSalonLayout()}
            </motion.div>
          </div>

          {/* Summary Section */}
          {selectedSeats.length > 0 && (
            <SummarySection
              selectedSeats={selectedSeats}
              isAuthenticated={isAuthenticated}
              navigate={navigate}
              confirmRef={confirmRef}
              tripType={tripType}
            />
          )}
        </motion.div>
      </div>
    </ReservationLayout>
  );
};

export default TripDetailsPage;
